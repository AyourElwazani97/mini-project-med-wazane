<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Auth::user()->tasks()->latest()->get();
        return Inertia::render("Tasks/Index", [
            "tasks" => $tasks
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'nom_task' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'is_completed' => 'sometimes|boolean',
            'is_important' => 'sometimes|boolean'
        ];
        $validatedData = $request->validated($rules);

        DB::beginTransaction();
        try {

            $task = Task::create([
                'nom_task' => $validatedData['nom_task'],
                'description' => $validatedData['description'] ?? null,
                'due_date' => Carbon::parse($validatedData['due_date'])->format("Y-m-d"),
                'is_completed' => $validatedData['is_completed'] ?? false,
                'is_important' => $validatedData['is_important'] ?? false
            ]);
            DB::commit();
            return redirect()->route('tasks.index', $task)
                ->with('success', 'Task created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create task: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Task $task)
    {
        // Vérification que la tâche existe et appartient à l'utilisateur
        if (!$task || Auth::user()->id !== $task->user_id) {
            return redirect()->route('tasks.index')
                ->with('error', 'Action non autorisée.');
        }

        $rules = [
            'nom_task' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'is_completed' => 'sometimes|boolean',
            'is_important' => 'sometimes|boolean'
        ];

        // Champs validés
        $validatedData = $request->validated($rules);

        DB::beginTransaction();
        try {
            $task->update([
                'nom_task' => $validatedData['nom_task'],
                'description' => $validatedData['description'] ?? null,
                'due_date' => Carbon::parse($validatedData['due_date'])->format("Y-m-d"),
                'is_completed' => $validatedData['is_completed'] ?? false,
                'is_important' => $validatedData['is_important'] ?? false
            ]);

            DB::commit();

            return redirect()->route('tasks.show', $task)
                ->with('success', 'Tâche mise à jour avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Échec de la mise à jour.');
        }
    }

    public function destroy(Task $task)
    {
        // Vérifier que la tâche existe
        if (!$task) {
            return redirect()->route('tasks.index')
                ->with('error', 'Tâche non trouvée.');
        }

        // Vérifier que l'utilisateur est bien le propriétaire
        if (Auth::user()->id !== $task->user_id) {
            return redirect()->route('tasks.index')
                ->with('error', 'Action non autorisée.');
        }

        DB::beginTransaction();
        try {
            $task->delete();
            DB::commit();
            return redirect()->route('tasks.index')
                ->with('success', 'Tâche supprimée avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Échec de la suppression.');
        }
    }
}