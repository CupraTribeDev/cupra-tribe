<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Event;
use App\Models\Comment;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class PostController extends Controller
{
    /*
    #################################################################################
    Utility functions
    #################################################################################
    */

    /**
    * Add to response information about images, comments, tags, likes, etc...
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    function sanitize($post, $showhidden=false){
	if($showhidden && ($post->isdeleted || $post->isbanned)){
	    $post = null;
	    return $post;
	}

	//images
        $fileImages = Storage::disk('public')->files("post/$post->_id/");
        $images = [];
        foreach ($fileImages as $fileImage) {
            array_push($images, Storage::url("$fileImage"));
        } 
        $post->images = $images;

	//tags
        $tags = [];
	$removedTags = [];
        if(!is_null($post->tags)){
            foreach($post->tags as $tagId){
		$tag = Tag::where('_id', $tagId)->first();
		if($tag != null){
		    array_push($tags, $tag->name);
		}else{
		    array_push($removedTags, $tagId);
		}
            }
	    if(count($removedTags) != 0){
		    $newtags = array_diff($post->tags, $removedTags);
		    $post->tags = $newtags;
		    $post->save();
	    }
        }
        $post->tags = $tags;
	
	//comments	
	if($showhidden)
	    $post->comments = Comment::where('parent_post', $post->_id)->count();
	else
	    $post->comments = Comment::where('parent_post', $post->_id)->where('isdeleted', false)->where('isbanned', false)->count();
	
	//likes/dislikes (dislikes no longer available)
        $post->likes = Like::where('post_id', $post->_id)->where('islike', true)->where('removed', false)->count();
        //$post->dislikes = Like::where('post_id', $post->_id)->where('islike', false)->where('removed', false)->count();

        return $post;
    }

    /*
    #################################################################################
    CRUD POSTS
    #################################################################################
    */

    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function store(Request $request){
	Gate::authorize('notBanned');
	$user = Auth::user();

	$this->middleware('auth');

	$request->validate([
            'title' => 'required|max:50',
            'text' => 'required|max:5000',
            'tags' => 'array|max:3',
            'files' => 'array|max:3'
        ]);

        Log::info(Auth::user()->username . 'just created a post');
        Log::info('Title: ' . $request->title);

        $post = new Post([
            'title' => $request->title,
            'text' => $request->text,
            'posted_by_username' => $user->username,
            'posted_by_id' => $user->_id,
            'isbanned' => false,
            'tags' => $request->tags,
            'event_id' => $request->event,
            'isofficial' => $user->role == 'admin' ? true : false,
            'official_event_id' => null,
        ]);
        $post->save();

        if($request->exists('files')){
            foreach ((array)$request->file('files') as $file) {
                $file->store("public/post/{$post->_id}/");
            } 
        }
	$user->addPoints(10);
	$user->save();
        return redirect()->back()->with(['success' => true]);
    }

    public function edit($id){
	    Gate::authorize('notBanned');
	    Gate::authorize('owns', Post::where('_id', $id)->firstOrFail()->posted_by_id);

        $post = Post::where('_id', $id)->firstOrFail();
        return Inertia::render('PostEdit', ['post' => $post, 'user' => Auth::user()]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
	    Gate::authorize('notBanned');
	    Gate::authorize('owns', Post::where('_id', $id)->firstOrFail()->posted_by_id);

        $request->validate([
            'title' => 'required|max:50',
            'text' => 'required|max:5000',
            'tags' => 'array|max:3'
        ]);
        Post::where('_id', $id)->firstOrFail()->fill($request->all())->save();
        return redirect()->back()->with(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
	    Gate::authorize('notBanned');
	    Gate::authorize('owns', Post::where('_id', $id)->firstOrFail()->posted_by_id);

        $event = Event::where("post", $id)->first();
        if($event == null){
            Post::destroy($id);
            Comment::where('parent_post', $id)->delete();
            return;
        }

        $session = DB::getMongoClient()->startSession();
        $session->startTransaction();

        try {
            Event::destroy("post", $event->id, ['session' => $session]);
            Post::where('event_id', $event->id)->delete(['session' => $session]);
            Comment::where('parent_post', $id)->delete(['session' => $session]);
            Post::destroy($id, ['session' => $session]);
            $session->commitTransaction();
        } catch(Exception $e){
            $session->abortTransaction();
        }

        return;
    }

    /*
    #################################################################################
    GET POSTS
    #################################################################################
    */

    /**
     * Display a listing of the resource.
     * Ritorna tutti i record del database
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
	$posts = Post::where('isbanned', false)
		    ->where('isdeleted', false)
                    ->orderBy('created_at', 'DESC')
                    ->paginate(50);

        foreach($posts as $post){
            $this->sanitize($post);
        }
        return $posts;
    }

    /**
     * Return a JSON with post details
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        //utilizzando findorfail con un id per applicare le condizioni where 
        //è necesasrio aggiungere il first poichè altrimenti restituisce un oggetto Eloquent
        Post::findOrFail($id);
        $post = Post::where('_id', $id)->where('isbanned', false)->firstOrFail();
        return $this->sanitize($post);
    }

    /**
    * Return view to users
    */
    public function viewPost($id){
        $post = Post::where('_id', $id)->where('isbanned', false)->firstOrFail();
        $comments = Comment::where('parent_post', $post->_id)->where('isdeleted', false)->where('isbanned', false)->get();
        return Inertia::render('PostPage', ['post' => $this->sanitize($post), 'comments' => $comments]);
    }

    public function getPosts(Request $params){
	//TODO: AGGIUNGI VALIDAZIONE
        $query = Post::where('isbanned', false);
    
        if ($params->offset != null && $params->offset != ""){
            $query = $query->limit(10)->offset($params->offset);
        }

        if ($params->searchString != null && $params->searchString != ""){
            $query=$query->where('title', 'like', "%{$params->searchString}%");
        }

        if ($params->tags != null && $params->tags != ""){
            //Considera il prendere il nome e fare una query per l'id
            foreach ($params->tags as $tag){
            $query=$query->where('tags', 'like', "%{$tag}%");
            }
        }
        
        if ($params->order != null && $params->order != ""){
            $query = $query->orderBy('created_at', $params->order);
        }else{
            $query = $query->orderBy('created_at', 'DESC');
        }

        $posts = $query->get();
        
	foreach($posts as $post){
	    $this->sanitize($post);
	}

        return $posts;
    }

    /**
    * Metodo per visualizzare i post dell'utente nella sua pagina profilo (UserPage)
    */
    public function getUserPosts(Request $params){
        
        //TODO: AGGIUNGI VALIDAZIONE

        $conditions = ['isbanned' => false, 'posted_by_username' => $params->username];

        // $query = Post::where($conditions)->orderBy('created_at', 'DESC')->offset($params->offset)->limit($params->numElements);
        
        $query = Post::where($conditions)->orderBy('created_at', 'DESC');

        if ($params->offset != null && $params->offset != ""){
            $query = $query->offset($params->offset);
        }

        if ($params->numElements != null && $params->numElements != ""){
            $query = $query->limit($params->numElements);
        }

        $posts = $query->get();

        foreach($posts as $post){
            $this->sanitize($post);
        }

        return $posts;

    }



    public function reportPost($id){
        $post = Post::where('_id', $id)->firstOrFail();
        $user = [];
        if($post->report == null){
            $user[] = Auth::user()->_id;
            $post->report = $user;
            $post->save();
            return ['success' => true];
        } 
        if(in_array(Auth::user()->_id, $post->report)){
            return ['success' => false, 'msg' => 'Segnalazione già inviata'];
        }
        $user = $post->report;
        array_push($user, Auth::user()->_id);
        $post->report = $user;
        $post->save();
        return ['success' => true];
    }


    /*
    ################################################################
    # Comments
    ################################################################
    */

    function recursiveCheckDepth($comment, $count=0){
	$count++;
	Log::info($count);
	if($comment->isreply_to != "nan"){
	    $count = $this->recursiveCheckDepth(Comment::where('_id', $comment->isreply_to)->first(), $count);
	}
	return $count;
    }

    public function newComment(Request $request){
	Gate::authorize('notBanned');
	$user = Auth::user(); 
        try{
            $comment = new Comment();

            if($request->reply_to != "nan"){
		if($this->recursiveCheckDepth(Comment::where('_id', $request->reply_to)->first()) > 2)
		    return; // should tell user that comment was not created
                Comment::where('_id', $request->reply_to)
                        ->where('isdeleted', false)
                        ->where('isbanned', false)
                        ->firstOrFail();
                $comment->isreply_to = $request->reply_to;
            }else{
                $comment->isreply_to = "nan";
            }

            $comment->text = $request->text;
            $comment->commented_by_id = $user->_id;
            $comment->commented_by_username = $user->username;
            $comment->parent_post = $request->id;
            $comment->isdeleted = false;
            $comment->isbanned = false;
	    
	    $parent = User::where('_id',
		Post::where("_id", $comment->parent_post)->first()->posted_by_id
	    )->first();

	    if($user->_id != $parent->_id)
	    {
		$parent->addPoints(2);
		$parent->save();

		$user->addPoints(4);
		$user->save();
	    }

            $comment->save();

        }catch(Exception $ex){
            Log::error($ex->getMessage());
        }
    }

    function recursiveCommentDelete($comment_id){
	$comments = Comment::where('isreply_to', $comment_id)->get();
	foreach ($comments as $comment) {
	    $comment->isdeleted = true;	
	    $comment->text = null;
	    $comment->save;
	    $this->recursiveCommentDelete($comment->_id);
	}
    }

    public function deleteComment($comment_id){
        $comment = Comment::where("_id", $comment_id)
                    ->where('commented_by_id', Auth::user()->_id )->firstOrFail();
	Gate::authorize('owns', $comment->commented_by_id);

        $comment->isdeleted = true;
        $comment->text = null;
	$this->recursiveCommentDelete($comment_id);
        $comment->save();
    }

    public function reportComment($id){
	Log::info("New report");
        $comment = Comment::where('_id', $id)->firstOrFail();
        $user = [];
        if($comment->report == null){
            $user[] = Auth::user()->_id;
            $comment->report = $user;
            $comment->save();
            return ['success' => true];
        } 
        if(in_array(Auth::user()->_id, $comment->report)){
            return ['success' => false, 'msg' => 'Segnalazione già inviata'];
        }
        $user = $comment->report;
        array_push($user, Auth::user()->_id);
        $comment->report = $user;
        $comment->save();
        return ['success' => true];
    }

    /*
    ################################################################
    # Likes
    ################################################################
    */
    public function like($id, $islike){
	Gate::authorize('notBanned');
        $post = Post::where('_id', $id)->where('isbanned', false)->firstOrFail();
        $prevlike = Like::where('user_id', Auth::user()->_id)
                        ->where('post_id', $id)
                        ->first();
        $islike = filter_var($islike, FILTER_VALIDATE_BOOLEAN);
        if($prevlike==null){
            $like = new Like();

            $like->removed = false;
            $like->user_id = Auth::user()->_id;
            $like->post_id = $post->_id;
            $like->islike = $islike;

            $like->save();

	    $user = User::where('_id', $post->posted_by_id)->first();
	    $user->addPoints(10);
	    $user->save();

            return ['success' => true];
        }
        elseif($prevlike->islike == $islike and $prevlike->removed == false){
            $prevlike->removed = true;
            $prevlike->save();
            return ['success' => false];
        }
        else{
            $prevlike->islike = $islike;
            $prevlike->removed = false;
            $prevlike->save();
            return ['success' => true];
        }
    }

    public function destroyLike($like_id){
        $like = Like::destroy($like_id);
    }


    /*
    ################################################################
    # Tags
    ################################################################
    */
    
    public function getTagId(Request $params){
	if($params->name != null && $params->name != ""){
	    return Tag::where('name', $params->name)->where('type', 'post')->first()->_id;
	}
    }
}
