<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Like extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'post_id',
        'islike',
        'removed',
    ];

    protected $casts = [
        'islike' => 'bool',
    ];

    public function setIsLikeAttribute($value){
        $this->attributes['islike'] = $value == null ? false : $value;
    }
}
