<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PostSeeder extends Seeder
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
        $allTags = Tag::all();
        $files = glob("resources/img/assets/*");

        $reports = [];
        $end = random_int(0, 100);

        for ($i = 0; $i < $end; $i++) {
            $user= $faker->randomElement($users);
            $id = $user->_id;
            if (!(in_array($id, $reports))) {
                array_push($reports, $id);
            }
        }

        for($i=0; $i < 100; $i++){
            $content = fopen($files[array_rand($files)], 'r');
            $user = $faker->randomElement($users);
            $tags = [];
            for($j=0; $j < 3; $j++){ 
                array_push($tags, $faker->randomElement($allTags)->_id); 
            }
            $post = Post::factory()->create([
                'title' => $faker->text(150),
                'text' => $faker->text(5000),
                'isbanned' => $faker->randomElement(  [false,false,false,false,false,false,false,false,false,true]),
                'ispromoted' => $faker->randomElement([false,false,false,false,false,false,false,false,false,true]),
                'posted_by_id' => $user->_id,
                'posted_by_username' => $user->username,
                'tags' => $tags,
                'event_id' => null,
                'report' => $reports,
            ]);
            if(fake()->randomElement([true,true,true,false])){
                Storage::disk('public')->put("post/$post->_id/{$faker->text(12)}.png", $content);
            }
        }
    }
}
