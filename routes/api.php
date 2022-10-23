<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Models\Event;
use App\Models\EventPartecipations;
use App\Models\Tag;
use Inertia\Inertia;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

#Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
#    return $request->user();
#});

/*
  ############################################################
  # route conventions
  #     camelCase routes
  #     name is made as follows:
  #         api.<api-type>.<api-scope/api-method>.<api-subject>
  #############################################################
  

  ############################################################
  # security considerations
  #     apis should be accessibile only to authenticated users
  #     exceptions are made for GET methods, which are mostly
  #     publicly accessible
  #
  #     CONTENT API:
  #         GET: publicly accessibile
  #         POST: every authenticated user
  #         PUT/PATCH: only creator of content
  #         DELETE: only creator of content, make sure user
  #                 REALLY wants to delete content
  #
  #     USER API:
  #         GET: some GET are publicly accessibile, should not
  #             return sensible informations such as password,
  #             email and real name info (should add an option
  #             wich lets user decide if he/she wants to make
  #             those info public)
  #         POST: not much to post
  #         PUT/PATCH: only by user itself
  #         DELETE: risk operation, make sure user REALLY wants
  #                 to delete
  #
  #     MODERATOR API:
  #         not yet designed, do not implement
  #
  #     ADMIN API:
  #         every action here is accessible ONLY by admins.
  #         admins should be allowed to make EVERY api call
  #         listed above
  ##############################################################
*/ 

/*
  ############################################################
  # CONTENT API
  #############################################################
*/ 



Route::get('/content/tags', function(Request $params) {
    if($params->tagtype=="post"){
	return Tag::where('type', 'post')->get();
    }else if($params->tagtype=="event"){
	return Tag::where('type', 'event')->get();
    }else{
	return Tag::all();
    }
})->name('api.content.tags');

Route::get('/content/tags/post', function(){ return Tag::where('type', 'post')->get();})->name('api.content.tags.post');
Route::get('/content/tags/event', function(){ return Tag::where('type', 'event')->get();})->name('api.content.tags.event');
Route::get('/content/tag/id', [PostController::class, 'getTagId'])->name('api.content.tag.id');

/*
  ############################################################
  # USER API
  #############################################################
*/ 
Route::get('/user/newuser', function(Request $request){ return -1;})->name("api.user.new");
// Route::post("/user/deleteuser", function (Request $request) {return -1;})->name("api.user.delete");
Route::get("/user/getactivities", [UserController::class, 'getActivities'])->name("api.user.get.activities");
// Route::get("/user/deleteuser/{id}", [UserController::class, 'destroy'])->name("api.user.destroy");

/*
  ############################################################
  # CHAT API
  #############################################################
*/ 

Route::post("chat/sendmessage", function (Request $request) {return -1;})->name("api.chat.send");
Route::post("chat/deletemessage", function (Request $request) {return -1;})->name("api.chat.deleteMsg");
Route::get("chat/gethistory");

/*
  ############################################################
  # ADMINISTRATION API
  #############################################################
*/ 
Route::post("/admin/banuser", function (Request $request) {return -1;})->name("api.admin.user.ban");
Route::post("/admin/bancomment", function (Request $request) {return -1;})->name("api.admin.comment.ban");
Route::post("/admin/banpost", function (Request $request) {return -1;})->name("api.admin.post.ban");
