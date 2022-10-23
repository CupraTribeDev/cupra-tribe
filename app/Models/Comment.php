<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'commented_by_id',
        'commented_by_username',
        'parent_post',
        'isreply_to',
        'isdeleted',
        'isbanned',
        'report',
    ];

    protected $casts = [
        'isdeleted' => 'bool',
    ];
}
