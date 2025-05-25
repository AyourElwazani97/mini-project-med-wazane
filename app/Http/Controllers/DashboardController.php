<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;


class DashboardController extends Controller
{
    public function index()
    {
        $total_users = User::count();
        $total_projects = Project::count();
        $total_tasks = Task::count();

        $projects = Project::latest()->get();
        return Inertia::render('dashboard', [
            "total_users" => $total_users,
            "total_projects" => $total_projects,
            "total_tasks" => $total_tasks,
            "projects" => $projects
        ]);
    }
}
