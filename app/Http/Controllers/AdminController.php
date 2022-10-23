<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Rules;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
	$this->middleware('can:isAdmin');
    }

    public function getReports(){
        $reports = [];

        $posts= Post::where('report', '!=', null)->where('report', '!=', [])->where('isbanned', false)->get();

        if($posts){
            foreach($posts as $post){
                $post->info= 'post';
                $num= sizeof($post->report);
                $post->size= $num;
                array_push($reports, $post);
            }
        }

        $comments= Comment::where('report', '!=', null)->where('report', '!=', [])->where('isbanned', false)->get();

        if($comments){
            foreach($comments as $comment){
                $comment->info= 'comment';
                $num= sizeof($comment->report);
                $comment->size= $num;
                array_push($reports, $comment);
            }

        }

        function key_sort($array, $key){
            foreach($array as $k=>$v){
                $b[] = strtolower($v[$key]);
            }
            arsort($b);
            foreach($b as $k=>$v){
                $c[]= $array[$k];
            }
            return $c;
        }

        foreach($reports as $item){
            if($item->size>0){
                $sortedReports = key_sort($reports, 'size');
                return $sortedReports;
            }
            else{
                return $reports;
            }
        }

    }

    public function getBans(){
	
        // dd($params->offset);

        $bans = [];

        $posts= Post::where('isbanned', true)->get();

        // dd($posts);

        foreach($posts as $post){
            $post->info= 'post';
            array_push($bans, $post);
        }

        $comments= Comment::where('isbanned', true)->take(150)->get();

        foreach($comments as $comment){
            $comment->info= 'comment';
            array_push($bans, $comment);
        }

        $users= User::where('isbanned', true)->get();

        foreach($users as $user){
            $user->info= 'user';
            array_push($bans, $user);
        }

        function key_sort_bans($array, $key){
            foreach($array as $k=>$v){
                $b[] = strtolower($v[$key]);
            }
            arsort($b);
            foreach($b as $k=>$v){
                $c[]= $array[$k];
            }
            return $c;
        }

        $sortedBans = key_sort_bans($bans, 'updated_at');

        // $sortedBans = array_slice($sortedBans, $params->offset, $params->numElements); 


        return $sortedBans;

    }

    public function banPost(Request $request){
	 
        $post= Post::findOrfail($request->id);
        $post->update(['isbanned' => true]);
        $comments= Comment::where('parent_post', $request->id)->get();
        foreach($comments as $comment){
            $comment->update(['isbanned' => true]);
        }
        // dd($post);
        return ["ban post effettuato", $post->isbanned];
    }

    public function banComment(Request $request){
        $comment= Comment::findOrfail($request->id);
        $comment->update(['isbanned' => true]);
        return ["ban comm effettuato", $comment->isbanned];
    }

    public function banUser(Request $request){
	 
        $user= User::findOrfail($request->id);
        $user->update(['isbanned' => true]);
        $comments= Comment::where('commented_by_id', $request->id)->get();
        foreach($comments as $comment){
            $comment->update(['isbanned' => true]);
        }
        $posts= Post::where('posted_by_id', $request->id)->get();
        foreach($posts as $post){
            $post->update(['isbanned' => true]);
        }
        return Inertia::render('Home');
    }
    public function unbanPost(Request $request){
	Gate::authorize('viewAny', Auth::user());

        $post= Post::findOrfail($request->id);
        $post->update(['isbanned' => false]);
        $comments= Comment::where('parent_post', $request->id)->get();
        foreach($comments as $comment){
            $comment->update(['isbanned' => false]);
        }
        return ["ban annullato", $post->isbanned];
    }

    public function unbanComment(Request $request){
	 
        $comment= Comment::findOrfail($request->id);
        $comment->update(['isbanned' => false]);
        return ["ban annullato", $comment->isbanned];
    }

    public function unbanUser(Request $request){
	Gate::authorize('viewAny', Auth::user());

        $user= User::findOrfail($request->id);
        $user->update(['isbanned' => false]);
        $comments= Comment::where('commented_by_id', $request->id)->get();
        foreach($comments as $comment){
            $comment->update(['isbanned' => false]);
        }
        $posts= Post::where('posted_by_id', $request->id)->get();
        foreach($posts as $post){
            $post->update(['isbanned' => false]);
        }
        return ["ban annullato", $user->isbanned];
    }

    public function ignorePostReports(Request $request){
	 
        $post= Post::findOrfail($request->id);
        $post->update(['report' => []]);
        $post->save();
        return ["segnalazioni azzerate", $post->report];
    }

    public function ignoreCommentReports(Request $request){
	 
        $comment= Comment::findOrfail($request->id);
        $comment->update(['report' => []]);
        return ["segnalazioni azzerate", $comment->report];
    }

    public function rulesEdit(){
	 
        $rules= Rules::first();
        // $user = User::where('username', $username)->where('isbanned', false)->first();
        return Inertia::render('EditRules',['rules' => $rules] );
    }

    public function editTag(Request $params){
	if($params->id != null && $params->id != "" && $params->name != null && $params->name != ""){
	    $tag = Tag::where('_id', $params->id)->firstOrFail();
	    $tag->name=$params->name;
	    $tag->save();
	}
    }

    public function deleteTag(Request $params){
	if($params->id != null && $params->id != ""){
	    Tag::findOrfail($params->id)->delete();
	}
    }

    public function createTag(Request $params){
	if($params->name != null && $params->name != "" && $params->type != null && ($params->type == "post" || $params->type == "event")){
	    $tag = new Tag([
		"name" => $params->name,
		"type" => $params->type
	    ]);
	    $tag->save(); 
	} 
    } 

    public function updateRules(Request $request){
	 
        $request->validate([
            'text' => 'max:5000',
        ]);

        $var= $request->all();

        $string= $var['text'];

        $rules= Rules::first();
        $rules->forceFill(['text' => $string])->save();
        $rules->save();

        // $user = User::where('username', $username)->where('isbanned', false)->first();

        return Inertia::render('Rules', ['rules' => $rules]);
        // return Inertia::render('Rules', ['user' => $user, 'rules' => $rules]);

    }

    public function index(){
	 
	// Gate::authorize('viewAny');
	return Inertia::render('Moderation');
    }
    
    //STATISTICS (WORK IN PROGRESS)
    public function getPostStatistics(Request $params){
	
	$statistics = [];

	//POST NON BANNATI(NEL PERIODO)
        $query = Post::where('isbanned', false);
        if ($params->startdate != null && $params->startdate != ""){
	    $date = new Datetime($params->startdate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        if ($params->enddate != null && $params->enddate != ""){
	    $date = new Datetime($params->enddate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        $count = $query->count();

	//POST BANNATI(NEL PERIODO)
        $query = Post::where('isbanned', true);
        if ($params->startdate != null && $params->startdate != ""){
	    $date = new Datetime($params->startdate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        if ($params->enddate != null && $params->enddate != ""){
	    $date = new Datetime($params->enddate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        $count = $query->count();

	//POST NON BANNATI CORRELATI AD EVENTO(NEL PERIODO)
        $query = Post::where('isbanned', false)->whereNotNull('event_id');

        if ($params->startdate != null && $params->startdate != ""){
	    $date = new Datetime($params->startdate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        if ($params->enddate != null && $params->enddate != ""){
	    $date = new Datetime($params->enddate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        $count = $query->count();

	//EVENTI CON PIU PARTECIPAZIONI(NEL PERIODO)
        $query = Event::where('isbanned', false);
        if ($params->startdate != null && $params->startdate != ""){
	    $date = new Datetime($params->startdate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        if ($params->enddate != null && $params->enddate != ""){
	    $date = new Datetime($params->enddate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
	$query = $query->limit(5)->orderBy("partecipation", "size", "DESC");
        $events = $query->get();
	
	//ISCRITTI TOTALI NON BANNATI(NEL PERIODO)
        $query = User::where('isbanned', false);
        if ($params->startdate != null && $params->startdate != ""){
	    $date = new Datetime($params->startdate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        if ($params->enddate != null && $params->enddate != ""){
	    $date = new Datetime($params->enddate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        $count = $query->count();

	$utenti = $query->get();

	//ISCRITTI TOTALI BANNATI(NEL PERIODO)
        $query = User::where('isbanned', true);
        if ($params->startdate != null && $params->startdate != ""){
	    $date = new Datetime($params->startdate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        if ($params->enddate != null && $params->enddate != ""){
	    $date = new Datetime($params->enddate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        $count = $query->count();

	//MEDIA ETA'
        $query = User::where('isbanned', false);
        if ($params->startdate != null && $params->startdate != ""){
	    $date = new Datetime($params->startdate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        if ($params->enddate != null && $params->enddate != ""){
	    $date = new Datetime($params->enddate);
            $query = $query->where('created_at', '>=', "{$date}");
        }
        $count = $query->avg();

        return $count;
    }
}
