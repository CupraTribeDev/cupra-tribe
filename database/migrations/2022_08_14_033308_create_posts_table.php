<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->string("text");
            $table->boolean("isbanned");
            $table->boolean("ispromoted");
            $table->datetime("creation_time");
            $table->datetime("last_edit_time");
            $table->string("posted_by_username");
            $table->integer("posted_by_id");
            $table->integer("event_id");
            $table->array("report");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
};
