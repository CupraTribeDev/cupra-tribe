<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'title' => null,
            'text' => null,
            'isbanned' => null,
            'ispromoted' => null,
            'posted_by_id' => null,
            'posted_by_username' => null,
            'event_id' => null,
        ];
    }
}
