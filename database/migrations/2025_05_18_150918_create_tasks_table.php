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
            $table->index("nom_task");
            $table->text("description")->nullable();
            $table->date("due_date")->nullable();
            $table->index("due_date");
            $table->boolean("is_completed")->default(false);
            $table->boolean("is_important")->default(false);
            $table->foreignId("user_id")->constrained("users", "id")->onDelete("cascade");
            $table->foreignId("owner_id")->nullable()->constrained("users", "id")->onDelete("cascade");
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
