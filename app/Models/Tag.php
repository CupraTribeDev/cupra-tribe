<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
    ];
}
