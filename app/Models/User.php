<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Contracts\Auth\Authenticatable;
// use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Symfony\Component\ErrorHandler\Error\UndefinedMethodError;

class User extends Eloquent implements Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, AuthenticatableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name' ,
        'last_name',
        'username',
        'email',
        'birthday',
        'role',
        'isbanned',
        'exp',
        'password',
        'api_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Check if user has the given role
     * 
     * @var role
     */
    public function hasRole($role){
	return $this->role == $role;
    }    

    /**
     * Check if user is owner of the resource
     * 
     * @var role
     */
    public function owns($resource_foreign_key){
	return $this->_id == $resource_foreign_key;
    }    
    
    public function checkBan(){
	return !$this->isbanned;
    }

    public function addPoints($value){
	$this->exp += $value;
    }
}
