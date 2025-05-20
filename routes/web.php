<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::resource("tasks", TaskController::class)->middleware("auth");
Route::resource("projects", ProjectController::class)->middleware("auth");
Route::get("admin/projects", [ProjectController::class, "project_admin"])->middleware("auth");

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
