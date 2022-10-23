<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class EventPartecipations extends Model
{
    use HasFactory;

    protected $fillable = [
        'event',
        'user',
    ];
}
