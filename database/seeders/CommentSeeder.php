<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$faker = Faker::create();
		$users = User::all();
		$posts = Post::all();
		for ($i = 0; $i < 100; $i++) {
			$user = $faker->randomElement($users);
			$post = $faker->randomElement($posts);

			$reports = [];
			$end = random_int(0, 100);
	
			for ($i = 0; $i < $end; $i++) {
				$user= $faker->randomElement($users);
				$id = $user->_id;
				if (!(in_array($id, $reports))) {
					array_push($reports, $id);
				}
			}
			$comment = Comment::factory()->create([
				'text' => $faker->text(500),
				'commented_by_id' => $user->_id,
				'commented_by_username' => $user->username,
				'isbanned' => $faker->randomElement([false, false, false, false, false, false, false, false, false, true]),
				'parent_post' => $post->_id,
				'isdeleted' => $faker->randomElement([false, false, false, false, false, false, false, false, false, true]),
				'isreply_to' => 'nan',
				'report' => $reports,
			]);
		}
		$comments = Comment::all();
		foreach ($comments as $replied_comment) {
			for ($i = 0; $i < 5; $i++) {
				$user = $faker->randomElement($users);
				$comment = Comment::factory()->create([
					'text' => $faker->text(500),
					'commented_by_id' => $user->_id,
					'commented_by_username' => $user->username,
					'isbanned' => $faker->randomElement([false, false, false, false, false, false, false, false, false, true]),
					'parent_post' => $replied_comment->parent_post,
					'isdeleted' => $faker->randomElement([false, false, false, false, false, false, false, false, false, true]),
					'isreply_to' => $replied_comment->_id,
				]);
			}
		}
		$replying_comments = Comment::whereNotNull('isreply_to')->get();
		foreach ($replying_comments as $replied_comment) {
			for ($i = 0; $i < 3; $i++) {
				$user = $faker->randomElement($users);
				$comment = Comment::factory()->create([
					'text' => $faker->text(500),
					'commented_by_id' => $user->_id,
					'commented_by_username' => $user->username,
					'isbanned' => $faker->randomElement([false, false, false, false, false, false, false, false, false, true]),
					'parent_post' => $replied_comment->parent_post,
					'isdeleted' => $faker->randomElement([false, false, false, false, false, false, false, false, false, true]),
					'isreply_to' => $replied_comment->_id,
				]);
			}
		}
	}
}
