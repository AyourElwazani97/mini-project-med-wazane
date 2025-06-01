<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class DashboardController extends Controller
{
    public function index()
    {
        $total_users = User::count();
        $total_projects = Project::count();
        $total_tasks = Task::count();
        $my_total_tasks = Task::where("user_id", Auth::user()->id)->count();
        $projects = Project::withCount(["tasks", "project_users"])
            ->latest()
            ->get()
            ->map(function ($project) {
                $dueDate = Carbon::parse($project->due_date);
                $now = now();

                if ($dueDate->isPast()) {
                    $project->time_left = 'Échéance passée';
                } else {
                    $project->time_left = $dueDate->diffForHumans($now, [
                        'syntax' => 2,
                        'parts' => 2,
                        'locale' => 'fr'
                    ]);
                }
                return $project;
            });
        $tasks = ProjectTask::with(["user"])->latest()->get();
        return Inertia::render('dashboard', [
            "total_users" => $total_users,
            "total_projects" => $total_projects,
            "total_tasks" => $total_tasks,
            "projects" => $projects,
            "my_total_tasks" => $my_total_tasks,
            "tasks" => $tasks
        ]);
    }
}
