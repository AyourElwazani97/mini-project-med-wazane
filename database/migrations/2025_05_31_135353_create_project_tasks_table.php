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
        Schema::create('project_tasks', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['en_attente', 'en_cours', 'terminé'])
                ->default('en_attente')
                ->index();
            $table->date('due_date')->nullable();
            $table->text("description");
            $table->foreignId('created_by')->constrained("users", "id")->onDelete('cascade');
            $table->foreignId('project_id')->constrained("projects", "id")->onDelete('cascade');
            $table->foreignId('user_id')->constrained("users", "id")->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_tasks');
    }
};
