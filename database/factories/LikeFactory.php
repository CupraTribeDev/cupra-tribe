<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class LikeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $users = User::where('isbanned',false)->get();
        $post = Post::where('isbanned',false)->get();

        return[
            'user_id' => fake()->randomElement($users)->_id,
            'post_id' => fake()->randomElement($post)->_id,
            'islike' => fake()->randomElement([true,true,true,true,true,false]),
            'removed' => fake()->randomElement([false,false,false,false,false,true])
        ];            
    }
}
