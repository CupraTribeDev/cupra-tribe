<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PublicController;
use App\Models\Event;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use App\Models\User;
use App\Models\Post;
use Barryvdh\Debugbar\DataCollector\EventCollector;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
*/

/*
#################################################################################
General Route
#################################################################################
*/
Route::get('/', function () { return Inertia::render('Home');})
    ->name('home');

/*
#################################################################################
Event Route
#################################################################################
*/
Route::get('/events', [EventController::class, 'all'])
    ->name('events');

Route::get('/search', function() { return Inertia::render('Search');})
    ->name('search');

Route::get('/newent', function () { return Inertia::render('NewEvent'); })
    ->name('new.event')
    ->middleware('auth');

Route::get('/e/{id}', [EventController::class, 'viewEvent'])
    ->name('viewevent');

Route::get('/newent', function () { return Inertia::render('NewEvent'); })
    ->name('new.event')
    ->middleware('auth');

Route::post("/content/event/new", [EventController::class, 'newEvent'])
    ->name("api.content.event.new")
    ->middleware('auth');

Route::put('/content/event/add/partecipant/{id}', [EventController::class, 'addPartecipation'])
    ->name('api.content.event.add.partecipant')
    ->middleware('auth');

Route::get('/content/event/partecipant/{id}', [EventController::class, 'listPartecipant'])
    ->name('api.event.partecipant')
    ->middleware('auth');

Route::put('/content/event/remove/partecipant/{id}', [EventController::class, 'removePartecipation'])
    ->name('api.content.event.remove.partecipant')
    ->middleware('auth');

Route::get('/event/getposts/{id}', [EventController::class, 'getEventPosts'])
    ->name('api.content.event.posts');
Route::get('/content/event/edit/{id}', [EventController::class, 'edit'])
    ->name('edit.event')
    ->middleware('auth');
Route::put('/content/event/edit/{id}', [EventController::class, 'update'])
    ->name('update.event')
    ->middleware('auth');

Route::put('/content/event/cancel/{id}', [EventController::class, 'cancelEvent'] )
    ->name('cancel.event')
    ->middleware('auth');
    /*
#################################################################################
Post Route
#################################################################################
*/
Route::get('/post/{id}', [PostController::class, 'viewPost'])
    ->name('viewpost');

Route::get('/newpost', function () {return Inertia::render('NewPost');})
    ->name('new.post')
    ->middleware('auth');

Route::get("/post/edit/{id}", [PostController::class, 'edit'])
    ->name("api.content.post.edit")
    ->middleware('auth');

Route::put("/content/put/post/update/{id}", [PostController::class, 'update'])
    ->name("post.edit")
    ->middleware('auth');

Route::post("/content/post/post/publish", [PostController::class, 'store'])
    ->name("api.content.post.new")
    ->middleware('auth');

Route::delete('content/post/post/destroy/{id}', [PostController::class, 'destroy'])
    ->name('api.content.delete.post')
    ->middleware('auth');

Route::put("/content/put/post/report/{id}", [PostController::class, 'reportPost'])
    ->name("put.post.report")
    ->middleware('auth');

Route::get('/content/get/posts', [PostController::class, 'getPosts'])
    ->name('api.content.get.posts');

Route::get('/content/get/post/details/{id}', [PostController::class, 'show'])
    ->name('api.content.get.post');

/*
#################################################################################
Comment and Like Route
#################################################################################
*/
Route::post("/content/post/comment/new", [PostController::class, 'newComment'])
    ->name("api.content.post.comment.new")
    ->middleware('auth');

Route::delete("/content/post/comment/delete/{comment_id}", [PostController::class, 'deleteComment'])
    ->name("api.content.post.comment.delete")
    ->middleware('auth');

Route::patch("/content/post/comment/patch", [PostController::class, 'patchComment'])
    ->name("api.content.post.comment.patch")
    ->middleware('auth');

Route::post("/content/post/{id}/like/{islike}", [PostController::class, 'like'])
    ->name("api.content.post.like")
    ->middleware('auth');

Route::put("/content/comment/report/{id}", [PostController::class, 'reportComment'])
    ->name("put.comment.report")
    ->middleware('auth');



/*
#################################################################################
User Route
#################################################################################
*/
Route::get('/u/{username}', [UserController::class, 'viewUser'])
    ->name('viewuser');


Route::get('/content/getUsers', [UserController::class, 'getUsers'])
    ->name('api.content.get.users');

Route::get('/content/getUserPosts', [PostController::class, 'getUserPosts'])
    ->name('api.content.get.userposts');

Route::get("/user/editUser/{id}", [UserController::class, 'edit'])
    ->name("api.user.edit")
    ->middleware('auth');

Route::post("/user/updateUser/{id}", [UserController::class, 'update'])
    ->name("api.user.update")
    ->middleware('auth');
Route::post("/user/deleteUser/{id}", [UserController::class, 'destroy'])
    ->name("api.user.destroy")
    ->middleware('auth');
    



/*
#################################################################################
Admin Route
authorizatoin is handled by the controller
except for /logs route
#################################################################################
*/

Route::get('logs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index'])
    ->middleware('can:isAdmin');

Route::get("/admin/dashboard", [AdminController::class, 'index'])
    ->name('dashboard');

Route::get("/admin/action/getReports", [AdminController::class, 'getReports'])
    ->name("api.content.get.reports");

Route::get("/admin/action/ignorePostReports", [AdminController::class, 'ignorePostReports'])
    ->name("api.content.ignore.post.reports");

Route::get("/admin/action/ignoreCommentReports", [AdminController::class, 'ignoreCommentReports'])
    ->name("api.content.ignore.comment.reports");

Route::get("/admin/action/getBans", [AdminController::class, 'getBans'])
    ->name("api.content.get.bans");

Route::get("/admin/action/banPost", [AdminController::class, 'banPost'])
    ->name("api.ban.post");

Route::get("/admin/action/banComment", [AdminController::class, 'banComment'])
    ->name("api.ban.comment");

Route::get("/admin/action/banUser", [AdminController::class, 'banUser'])
    ->name("api.ban.user");

Route::get("/admin/action/unbanPost", [AdminController::class, 'unbanPost'])
    ->name("api.unban.post");

Route::get("/admin/action/unbanComment", [AdminController::class, 'unbanComment'])
    ->name("api.unban.comment");

Route::get("/admin/action/unbanUser", [AdminController::class, 'unbanUser'])
    ->name("api.unban.user");

Route::delete("/admin/action/deleteTag", [AdminController::class, 'deleteTag'])
    ->name("api.content.delete.tag");

Route::post("/admin/action/newTag", [AdminController::class, 'createTag'])
    ->name("api.content.post.tag");

Route::put("/admin/action/editTag", [AdminController::class, 'editTag'])
    ->name("api.content.edit.tag");

Route::get('/rules', [PublicController::class, 'showRules'])
    ->name('rules');

Route::get("/rules/editrules", [AdminController::class, 'rulesEdit'])
    ->name("api.rules.edit")
    ->middleware('auth');

Route::post("/rules/updaterules", [AdminController::class, 'updateRules'])
    ->name("api.rules.update")
    ->middleware('auth');



/*
#################################################################################
Event Route
#################################################################################
*/

Route::get("/content/events/promoted",[EventController::class, 'getPromoted'])
	->name("get.event.promoted");

Route::put("/update/events/promote/{id}",[EventController::class, 'promote'])
	->name("get.event.promote");

Route::get("/content/getEvents/date/{date}", [EventController::class, 'getByDate'] )
	->name("get.event.date");

// deprecated names
Route::get("/content/events",  [EventController::class, 'getEvents'])
	->name("api.content.get.events");

Route::get("/content/getEvents/", [EventController::class, 'getToday'] )
	->name("api.content.events.get.today");

Route::get("/content/getEvents/month/{date}", [EventController::class, 'getMonth'] )
	->name("api.content.events.get.month");

Route::get("/content/getEvents/month/mini/{date}", [EventController::class, 'getMonthMini'] )
	->name("api.content.events.get.mini.month");

Route::get("/content/getEvents/date/{from}/{to}", [EventController::class, 'getByRange'] )
	->name("api.content.events.get.range");


Route::get("/content/getEvents/details/{id}", [EventController::class, 'getById'] )
	->name("api.contentevents.get.details");

Route::get('/content/getUserEvents', [EventController::class, 'getUserEvents'])
	->name("api.content.events.get.userevents");


require __DIR__.'/auth.php';
