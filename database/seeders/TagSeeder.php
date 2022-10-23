<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $post = [
            'Discussione',
            'Domanda',
            'Evento',
            'Organizzazione',
            'Notizia',
            'Padel',
            'Off topic',
            'Guida How-to',
            'Supporto',
            'Racing',
            'Born',
            'Formentor',
            'Leon',
            'Leon Sportsouner',
            'Ateca',
            'e-Racer',
            'Leon Competición',
        ];

        $event = [
            'Padel', 
            'Tennis', 
            'Calcetto',
            'Torneo',
	    'Sport',
	    'Gita',
            'Competizione',
            'Raduno',
            'Reunion',
            'Generico',
            'Escursione',
            'Montagna',
        ];

        foreach ($post as $value) {
            Tag::factory()->create([
                'name' => $value,
                'type' => 'post'
            ]);
        }

        foreach ($event as $value) {
            Tag::factory()->create([
                'name' => $value,
                'type' => 'event'
            ]);
        }
    }
}
