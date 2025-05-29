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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string("name")->unique();
            $table->index("name")->unique();
            $table->text("desc_prj");
            $table->date("due_date");
            $table->index("due_date");
            $table->foreignId("created_by")->constrained("users", "id")->onDelete("cascade");
            $table->string("status")->default("en cours");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
