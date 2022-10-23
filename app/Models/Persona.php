<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Persona extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'persone';

    protected $fillable = [
        'nome', 'cognome'
    ];
}
