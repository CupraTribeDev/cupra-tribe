<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use DateInterval;
use DateTime;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $post = fake()->randomElement(Post::where('isbanned', false)->get());
        $start = fake()->dateTimeBetween('-1 years', '+ 1 month');
        $end = fake()->dateTimeBetween($start, $start->add(new DateInterval('P7D')));
        $isofficial = User::where('_id', $post->posted_by_id)->first()->role == 'admin' ? true : false;
        return [
            //
            "post" => $post->_id,
            "user" => $post->posted_by_id,
            "title"=> fake()->text(30),
	    "partecipation" => [],
            "description" => fake()->text(5000),
            "from_date" => $start->format('Y-m-d'),
            "to_date" => $end->format('Y-m-d'),
            "type" => fake()->randomElement([
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
	    'Montagna'
	    ]),
            "isofficial" => $isofficial,
            "isbanned" => fake()->randomElement([false,false,false,false,false,false,false,false,false,true]),
        ];
    }
}
