<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use App\Models\Event;
use App\Models\EventPartecipations;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;



class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::where('_id', $id)->where('isbanned', false)->firstOrFail();
        return $user;
    }

    public function getUserByUsername(Request $request)
    {
        $user = User::where('username', $request->username)->where('isbanned', false)->firstOrFail();
        return $user;
    }

    public function getUsers(Request $params)
    {
        $query = User::where('isbanned', false);
        if ($params->offset != null && $params->offset != ""){
            $query = $query->limit(10)->offset($params->offset);
        }

        if ($params->searchString != null && $params->searchString != ""){
            $query=$query->where('username', 'like', "%{$params->searchString}%");
        }

        $users = $query->get();
	return $users;
    }

    public function viewUser($username)
    {
	$user = User::where('username', $username)
		    ->where('isbanned', false)
		    ->firstOrFail();
        return Inertia::render('UserPage', ['user' => $user]);
    }

    public function getActivities(Request $params){

        $postController= new PostController;
        // array con i post commentati dall'user
        $commented_posts= [];
        // array con i post consigliati dall'utente
        $liked_posts= [];
        // array con i post pubblicati dall'utente
        $published_posts= [];
        // array composto da elementi degli array precedenti risalenti a non più di una settimana fa ($oneWeekBefore)
        $activities=[];

        // $data_test= date("2022-09-20")."T".date("01:02:30")."Z";
        // $today= date("Y-m-d") . "T" . date ("H:i:s") . "Z";
        // data odierna
        $today= date("Y-m-d");
        $date_today= date_create($today);
        // una settimana fa da oggi
        $oneWeekBefore= date_add($date_today, date_interval_create_from_date_string("-7 days"));

        // Popolo il vettore liked_posts
        $query= Like::where('user_id', $params->user_id);
        $likes= $query->get();
        foreach($likes as $like){
            // alcuni post sono bannati, se chiamassi show() di PostController mi darebbe errore
            $post = Post::where('_id', "$like->post_id")->firstOrFail();
            $postController->sanitize($post);
            // scarto i post bannati
            if(!$post->isbanned){
                $post->sortParam = $like->created_at;
                array_push($liked_posts, $post);
                if($post->sortParam > $oneWeekBefore){
                    // aggiungo il campo info che serve a visualizzato "Consigliato da .." o "Commentato da ..." sopra al post
                    $post->info= "like";
                    $post->profile= $params->username;
                    array_push($activities, $post);
                }
            }
        }

        // Popolo Commented_posts
        $conditions= ['isdeleted' => false, 'commented_by_username' => $params->username];
        $query= Comment::where($conditions)->orderBy('created_at', 'DESC');
        $comments= $query->get();
        foreach($comments as $comment){
            $post = Post::where('_id', "$comment->parent_post")->firstOrFail();
            $postController->sanitize($post);
            if(!$post->isbanned){
                $post->sortParam= $comment->created_at;
                array_push($commented_posts, $post);
                if($comment->created_at > $oneWeekBefore){
                    $post->info= "comment";
                    $post->profile= $params->username;
                    array_push($activities, $post);
                }
            }
        }

        // popolo 
        $params2= new Request;
        $params2->username = $params->username;
        $published_posts= $postController->getUserPosts($params2);
        foreach($published_posts as $post){
            $post->sortParam = $post->created_at;
            if($post->sortParam > $oneWeekBefore){
                $post->info= "publication";
                $post->profile= $params->username;
                array_push($activities, $post);
            }
        }

        // ordino le attività sulla base del parametro sortParam
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

        $sortedActivities= key_sort($activities, 'sortParam');

        // applico l'offset e prendo il numero di elementi desiderato
        $sortedActivities = array_slice($sortedActivities, $params->offset, $params->numElements); 

        return $sortedActivities;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
	Gate::authorize('owns', $id);
        $user= $this->show($id);
        // dd($user->genere);
        return Inertia::render('EditUserProfile', ['user' => $user]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
	Gate::authorize('owns', $id);
        $user= User::where('_id', $id)->firstOrFail();
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'biografia' => 'nullable|string|max:280',
            'birthday' => 'date|before:today',
            'auto' => 'nullable|string|max:50',
        ]);

        if($request->password != ''){
            $request->validate([
                'password' => 'required|confirmed|regex:/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/',
                'password_confirmation' => 'required',
            ]);
        }
        if($request->email != $user->email){
            $request->validate([
                'email' => 'required|email|max:319|unique:users',
            ]);
        }

        if($request->biografia){
            $user->bio = $request->biografia;
        }
        else{
            $user->bio= null;
        }

        if($request->genere){
            $user->genere = $request->genere;
        }
        else{
            $user->genere = "ND";
        }

        if($request->auto){
            $user->auto = $request->auto;
        }
        else{
            $user->auto = null;
        }
        
        if($request->exists('files1')){
            foreach ((array)$request->file('files1') as $file) {
                $file->storeAs("public/user/{$user->username}", "{$user->username}.jpg");
                $user->image = "../../../../storage/app/public/user/{$user->username}/{$user->username}.jpg";

            } 
        }
        if($request->exists('files2')){
            foreach ((array)$request->file('files2') as $file) {
                $file->storeAs("public/user/{$user->username}", "{$user->username}-C.jpg");
                $user->image = "../../../../storage/app/public/user/{$user->username}/{$user->username}-C.jpg";
            } 
        }
        
        $user->fill($request->all());
        if($request->auto){
            $user->forceFill(['genere' => $request->genere])->save();
        }
        if($request->auto){
            $user->forceFill(['auto' => $request->auto])->save();
        }
        if($request->email){
            $user->forceFill(['email' => $request->email])->save();
        }

        if($request->password){
            $user->forceFill([
                'password' => Hash::make($request->password),
            ])->save();
        }

        return Inertia::render('UserPage', ['user' => $user]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $username)
    {
        // dd($username);

        $postC= new PostController;

        //prendo l'utente dall'id
        $user = User::where('username', $username)->firstOrFail();
	    Gate::authorize('owns', $user->_id);

        // dd($user);

        //prendo tutti i suoi post, anche quelli bannati
        $posts= Post::where('posted_by_username', $username)->get();

        //per ogni post chiamo il destroy, sarà li che verranno eliminate le cose associate etc.
        if($posts){
            foreach($posts as $post){
                $postC->destroy($post->_id);
            }
        }

        // //prendo tutti i suoi commenti, anche quelli bannati
        $comments= Comment::where('commented_by_username', $username)->get();

        //per ogni commento chiamo il delete, sarà li che verranno fatti i controlli sui figli etc.
        if($comments){
            foreach($comments as $comment){
                $postC->deleteComment($comment->_id);
            }
        }

        // //prendo tutti i suoi like
        $likes= Like::where('user_id', $user->_id)->get();

        //per ogni like chiamo il destroy
        if($likes){

            foreach($likes as $like){
                $postC->destroyLike($like->_id);
            }
        }

        
        // creo un nuovo utente
        // $newUser= new User;
        
        // //gli assegno solo l'username dell'utente da eliminare, 
        // //così non potrà più registrarsi nessuno con lo stesso username
        // $newUser->username= $username;
        // $newUser->email= $user->email;
        // $newUser->api_token= $user->api_token;
        
        // $user->delete();
        User::destroy($user->id);

        // $newUser->save();

        //infine distruggo l'utente
       

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

}
