<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventPartecipations;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{
    function addPartecipation($id){
        $event = Event::where('_id', $id)->first();
        $part = [];
        if($event->partecipation == null){
            $part[] = Auth::user()->_id;
            $event->partecipation = $part;
            $event->save();
            return ['success' => true];
        }
        if(in_array(Auth::user()->_id, $event->partecipation)){
            return ['success' => false];
        }
        $part = $event->partecipation;
        array_push($part, Auth::user()->_id);
        $event->partecipation = $part;
        $event->save();
        return ['success' => true];
    }

    function removePartecipation($id){
        $event = Event::where('_id', $id)->first();
        $part=[];
        if(in_array(Auth::user()->_id, $event->partecipation)){
            $part = array_diff($event->partecipation, array(Auth::user()->_id));
            $event->partecipation = $part;
            $event->save();
            return ['success' => true];
        }
    }

    function cancelEvent($id){
        Gate::authorize('notBanned');
        Gate::authorize('owns', Post::where('_id', $id)->firstOrFail()->posted_by_id);
        $event = Event::where('_id', $id)->firstOrFail();
        $event->iscanceled = true;
        $event->save();
        return true;

    }

    // return the list of partecipant in the event and the total number
    function listPartecipant($id){
        $event = Event::where('_id', $id)->firstOrFail();
        $users = [];

        if($event->partecipation == null) return ['success' => false];

        foreach($event->partecipation as $userid){
            $user = User::where('_id', $userid)->first();
            array_push($users,$user->username);
        }
        $response = [
            "count" => count($event->partecipation),
            "list" => $users
        ];
        return response()->json($response);


    }

    function getEventPosts($id){
        $posts = Post::where('event_id', $id)->get();
        $postc = new PostController();
        foreach($posts as $post){
            $postc->sanitize($post);
        }
        return $posts;

    }

    function newEvent(Request $request){
        Gate::authorize('notBanned');
        $user = Auth::user();
        $this->middleware('auth');

        // [] aggiungere controllo sulla data
        // [] aggiungre il controllo su ufficiale anche al post 
        
        $request->validate([
            /* event */
            'event_title' => 'required|string|max:55',
            'event_description' => 'required|string|max:400', 
            'event_type' => 'required',
            'event_place' => 'max:50',
            'event_date' => 'required',
            'event_time' => 'nullable',
            'event_files' => 'array|max:1',
            /* post */
            'post_title' => 'required|string|max:55',
            'post_text' => 'required|string|max:400',
            'post_tags' => 'array|max:3',
            'post_files' => 'array|max:3',
        ]);

        // Start Transaction
        $session = DB::getMongoClient()->startSession();
        $session->startTransaction();
        
        $post = new Post([
            'posted_by_id' => $user->_id,
            'posted_by_username' => $user->username,
            'title' => $request->post_title,
            'text' => $request->post_text,
            'tags' => $request->post_tags,
            'isbanned' => false,
            'iscanceled' => false,
        ]);

        $partecipations = [];
        array_push($partecipations, $user->_id);

        $event = new Event([
            'title' => $request->event_title,
            'description' => $request->event_description,
            'from_date' => date_format(date_create($request->event_date),'Y-m-d'),
            'to_date' => date_format( date_create($request->event_date), 'Y-m-d'),
            'user' =>  $user->_id,
            'isbanned' => false,
            'type' => $request->event_type, //dovrò fare una query per recuperare la descrizione della tipologia dell'evento 
            'isofficial' => $user->role == 'admin' ? true : false,
            'partecipation'  => $partecipations,
            'time' => $request->event_time,
            'place' => $request->event_place
        ]);
        
        try {
            //creo l'evento
            $event->save(['session' => $session]);
            //creo il post e gli aggancio l'evento 
            $post->fill(['official_event_id' => $event->_id]);
            $post->save(['session' => $session]);
            $event->fill(['post'=> $post->_id]);
            $event->save(['session' => $session]);
            $session->commitTransaction();
            //una volta create le entità nel database salvo le immagini
            if($request->exists('event_files')){
                foreach ((array)$request->file('event_files') as $file) {
                    $file->store("public/event/{$event->_id}/");
                } 
            }
            if($request->exists('post_files')){
                foreach ((array)$request->file('post_files') as $file) {
                    $file->store("public/post/{$post->_id}/");
                } 
            }
            return redirect()->back()->with(['success' => true]);
        } catch(Exception $e) {
            $session->abortTransaction();
        }
        // End Transaction
    }

    function edit($id){
        Gate::authorize('notBanned');
        Gate::authorize('owns', Event::where('_id', $id)->firstOrFail()->user);
        $event = Event::where('_id', $id)->first();
        $post = Post::where('_id', $event->post)->first();

        return Inertia::render('EventEdit', 
            ['post' => $post, 
             'event' => $event, 
            ]
        ); 
    }

    function update(Request $request, $id){
        Gate::authorize('notBanned');
        Gate::authorize('owns', Event::where('_id', $id)->firstOrFail()->user);
        $request->validate([
             /* event */
             'event_title' => 'required|string|max:55',
             'event_description' => 'required|string|max:400', 
             'event_type' => 'required',
             'event_place' => 'max:50',
             'event_date' => 'required',
             'event_time' => 'nullable',
             /* post */
             'post_title' => 'required|string|max:55',
             'post_text' => 'required|string|max:400',
             'post_tags' => 'array|max:3',
        ]);
        $event = Event::where('_id', $id)->firstOrFail();
        $event->update([
            'title' => $request->event_title,
            'description' => $request->event_description,
            'type' => $request->event_type,
            'from_date' => $request->event_date,
            'time' => $request->event_time
        ]);
        $event->save();

        $post = Post::where('_id', $event->post)->firstOrFail();
        $post->update([
            'title' => $request->post_title,
            'text' => $request->post_text,
            'tags' => $request->post_tags
        ]);
        $post->save();
        return redirect()->back()->with(['success' => true]);
    }

    function viewEvent($id){
        $postc = new PostController();
        $event = $this->getById($id)[0];
        
        // sanitize of the event
        $creator = User::where('_id', (string) $event->user)->first();
        $post = $postc->show($event->post);
        //list of all post related to the event
        $posts = Post::where('event_id', (string) $event->_id)->get();
        foreach($posts as $p){
            $postc->sanitize($p);
        }
        //list of all partecipant to the event
        $list = array();
        foreach($event->partecipation as $id){
            $user = User::where('_id', $id)->first();
            array_push($list, $user->username);
        }
        $event->partecipation = $list;

        return Inertia::render('EventPage', 
            ['user' => $creator, 
             'event' => $event, 
             'post' => $post, 
             'posts' => $posts
            ]
        ); 
    }
    
    function sanitize($events){
        $count = 0;
        $sanitized = [];
        $sanitized["events"] = [];
        foreach ($events as $event) {
            $count++;
            $fileImages = Storage::disk('public')->files("event/$event->_id");
            $images = [];
            foreach ($fileImages as $fileImage) {
                array_push($images, Storage::url("$fileImage"));
            } 
            $event->images = $images;
            array_push($sanitized["events"], $event);
        }
        $sanitized["count"] = $count;
        return $sanitized;
    }

    /**
     * Get all events on a given range
     *
     * @return void
     * @author yourname
     */
    public function getByRange($from, $to){
        Log::debug("getByRange called: $from - $to");
        return $this->sanitize(Event::where('from_date', '>=', $from)->where('to_date', '<=', $to)->get());
    }

    /**
     * Get event details
     *
     * @return void
     * @author yourname
     */
    public function getById($id){
        return $this->sanitize(Event::where('_id',$id)->get())["events"];
    }

    /**
     * Get all events on given day
     *
     * @return void
     * @author yourname
     */
    public function getByDate($date){
	return $this->sanitize(
		Event::where('from_date', '>=', $date)
		->where('to_date', '<=', $date)
		->get()
	);
    }
    
    /**
     * Get all today's events
     *
     * @return void
     * @author yourname
     */
    public function getToday(){
        $today = date("Y-m-d");
        return $this->sanitize(Event::where('from_date', '>=', $today)->where('to_date', '<=', $today)->get());
    }
    
    /**
     * Get all month's events
     *
     * @return void
     * @author yourname
     */
    public function getMonth($date){
        $first = date('Y-m-01', strtotime($date));
        $last  = date('Y-m-t',strtotime($first));
        return $this->sanitize(Event::where('from_date', '>=', $first)->where('to_date', '<=', $last)->get());
    }

    /**
     * Get only dates of all month's events
     *
     * @return void
     * @author yourname
     */
    public function getMonthMini($date){
        $first = date('Y-m-01', strtotime($date));
        $last  = date('Y-m-t',strtotime($first));
        $events = $this->sanitize(
            Event::where('from_date', '>=', $first)
                ->where('to_date', '<=', $last)
		->where('isbanned','!=', true)
                ->get()
        );

        $toturn = [];
        foreach ($events["events"] as $event) {
            array_push($toturn, $event->from_date);
        }
        return $toturn;
    }

    public function getUserEvents(Request $params){
        $events = [];

        if($params->isOwner){
            $query=Event::first()->where('user', $params->userId);
            if ($params->offset != null && $params->offset != ""){
                $query = $query->offset($params->offset);
            }
    
            if ($params->numElements != null && $params->numElements != ""){
                $query = $query->limit($params->numElements);
            }
            $events= $query->get();
        }
        else{
            $temp=[];
            $partecipations= EventPartecipations::first()->get();
            foreach($partecipations as $part){
                if($part->user==$params->userId){
                    $event=Event::first()->where('_id', $part->event)->get();
                    array_push($temp, $event);
                }
            }

            foreach($temp as $event){
                array_push($events, $event[0]);
            }

            $events = array_slice($events, $params->offset, $params->numElements); 
        };

        $this->sanitize($events);

        return ($events);
    }

    public function getPromoted(){
	return $this->sanitize(Event::where("ispromoted", true)->get());
    }

    public function promote($id){
	Gate::authorize('isAdmin');

	$event = Event::where("_id", $id)->firstOrFail();
	$event->promote();
	$event->save();
    }

    public function getEvents(Request $params){

	$query = Event::where('isbanned', '!=',  true);

        if ($params->offset != null && $params->offset != ""){
            $query = $query->limit(10)->offset($params->offset);
        }

        if ($params->searchString != null && $params->searchString != ""){
            $query=$query->where('title', 'like', "%{$params->searchString}%");
        }

        if ($params->location != null && $params->location != ""){
            $query=$query->where('place', 'like', "%{$params->location}%");
        }

        if ($params->eventstart != null && $params->eventstart != ""){
            $query=$query->where('from_date', '>=', "{$params->eventstart}");
        }

        if ($params->eventend != null && $params->eventend != ""){
            $query=$query->where('from_date', '<=', "{$params->eventend}");
        }

        if ($params->tags != null && $params->tags != ""){
            foreach ($params->tags as $tag){
		$type = Tag::where('_id', $tag)->first()->name;
		$query=$query->where('type', 'like', "{$type}");
            }
        }
	$events = $query->orderBy('from_date', 'DESC')->get();
	$this->sanitize($events);

	return $events;
    }

    public function all(){
        return Inertia::render('Events', ['events' => Event::all()]);
    }
}
