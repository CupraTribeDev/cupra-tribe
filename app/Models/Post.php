<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Post extends Eloquent
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'text',
        'isbanned',
        'ispromoted',
        'posted_by_id',
        'posted_by_username',
        'event_id',
        'tags',
        'report',
        'official_event_id'
    ];

    protected $casts = [
        'isbanned' => 'bool',
        'ispromoted' => 'bool',
    ];

    public function setIsbannedAttribute($value){
        $this->attributes['isbanned'] = $value == null ? false : $value;
    }
    
}
