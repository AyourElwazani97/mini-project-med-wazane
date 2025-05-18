<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string("nom_task");
            $table->text("description")->nullable();  // For more detailed task info
            $table->date("due_date")->nullable(); // Deadline for the task
            $table->boolean("is_completed")->default(false); // Task completion status
            $table->boolean("is_important")->default(false); // Priority flag
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
