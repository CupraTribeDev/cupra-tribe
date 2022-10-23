<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    //mettere tra gli attributi i valori di default per isenabled 

    protected $fillable = [
        'title',
        'description',
        'user',
        'post',
        'from_date',
        'to_date',
        'isenabled',
        'ispromoted',
        'isbanned',
        'isofficial',
        'type',
        'partecipation',
        'time',
        'place',
        'iscanceled'
    ];
    
    public function promote($value=null){
	if($value!=null)
	    $this->ispromoted = $value ? true : false;
	elseif($this->ispromoted)
	    $this->ispromoted = false;
	else
	    $this->ispromoted = true;
    }
}
