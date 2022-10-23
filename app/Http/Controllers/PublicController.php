<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Rules;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function showRules(){
        // if(empty($username)){
        //     $user= null;
        // }
        // else{
        //     $user = User::where('username', $username)->where('isbanned', false)->first();
        // }

        $rules= Rules::first();
        if($rules==null){
            $rules= new Rules(['text' => '']);
            $rules->save();
        }
        return Inertia::render('Rules', ['rules' => $rules]);
        // return Inertia::render('Rules', ['user' => $user, 'rules' => $rules]);
    }
}
