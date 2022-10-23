<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
	    'text' => null,
	    'commented_by_id' => null,
	    'commented_by_username' => null,
	    'parent_post' => null,
	    'isreply_to' => null,
	    'isdeleted' => null
        ];
    }
}
