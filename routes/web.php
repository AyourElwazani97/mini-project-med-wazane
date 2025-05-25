<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('dashboard', [DashboardController::class, "index"])->middleware(['auth'])->name('dashboard');
Route::resource("tasks", TaskController::class)->middleware("auth");
Route::resource("projects", ProjectController::class)->middleware("auth");


Route::middleware("auth")->group(function () {
    Route::get("admin/projects", [ProjectController::class, "project_admin"]);
    Route::put("admin/projects/{id}/update", [ProjectController::class, "update_status"])->name("update.status.project.admin");
    Route::put("admin/projects/{id}/assign/users", [ProjectController::class, "addUserToProjects"])->name("assign.users.project.admin");
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
