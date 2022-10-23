<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Faker\Factory as Faker;
use App\Models\User as User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('IT-it');

        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'username' => 'Admin',
            'email' => 'admin@admin.com',
            'birthday' => '1999-01-01',
            'role' => 'admin',
            'isbanned' => false,
            'exp' => $faker->randomNumber(5),
            'password' => Hash::make('admin'),
            'api_token' => Str::random(60),
        ]);

        User::factory()->create([
            'first_name' => 'Began',
            'last_name' => 'Bajrami',
            'username' => 'begbaj',
            'email' => 'beganbajrami@gmail.com',
            'birthday' => '2000-02-08',
            'role' => 'admin',
            'isbanned' => false,
            'exp' => $faker->randomNumber(5),
            'password' => Hash::make('Shifu!'),
            'api_token' => Str::random(60),
        ]);

        User::factory()->create([
            'first_name' => 'Rahmi',
            'last_name' => 'El Mechri',
            'username' => 'OT-Rax',
            'email' => 'raximus@gmail.com',
            'birthday' => '2000-10-19',
            'role' => 'admin',
            'isbanned' => false,
            'exp' => $faker->randomNumber(5),
            'password' => Hash::make('Shifu!'),
            'api_token' => Str::random(60),
        ]);

        User::factory()->create([
            'first_name' => 'Davide',
            'last_name' => 'De Zuane',
            'username' => 'Davide',
            'email' => 'davide@gmail.com',
            'birthday' => '2000-10-28',
            'role' => 'admin',
            'isbanned' => false,
            'exp' => $faker->randomNumber(5),
            'password' => Hash::make('Shifu!'),
            'api_token' => Str::random(60),
        ]);

        User::factory()->create([
            'first_name' => 'Emilio Joseph',
            'last_name' => 'Grieco',
            'username' => 'emi-2205',
            'email' => 'emilio@gmail.com',
            'birthday' => '1999-05-22',
            'role' => 'admin',
            'isbanned' => false,
            'exp' => $faker->randomNumber(5),
            'password' => Hash::make('Shifu!'),
            'api_token' => Str::random(60),
        ]);

        for($i = 0; $i < 100; $i++){
            User::factory()->create([
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'username' => $faker->userName,
                'email' => $faker->email,
                'birthday' => $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
                'role' => $faker->randomElement(['moderator','member']),
                'exp' => $faker->randomNumber(5),
                'isbanned' => $faker->randomElement([false, false, false, false, false, false, false, false , false, true]),
                'password' => Hash::make('Shifu!'),
                'api_token' => Str::random(60),
            ]);
        }

    }
}
