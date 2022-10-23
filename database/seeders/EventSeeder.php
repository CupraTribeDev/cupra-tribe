<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $factory = Event::factory();
        $files = glob("resources/img/assets/*");
        for ($i = 0; $i < 100; $i++) {
            $content = fopen($files[array_rand($files)], 'r');
            $event = $factory->create();
            Storage::disk('public')->put("event/$event->_id/banner.png", $content);
        } 
    }
}
