<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectTask;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:2000',
            'date_echeance' => 'required|date|after_or_equal:today',
            'user_id' => 'required|integer|exists:users,id',
            'project_id' => 'required|integer|exists:projects,id',
        ]);

        try {
            ProjectTask::create([
                "description" => $validated["description"],
                "due_date" => Carbon::parse($validated["date_echeance"])->format('Y-m-d'),
                "user_id" => $validated["user_id"],
                "project_id" => $validated["project_id"],
                "created_by" => Auth::user()->id,
            ]);

            return redirect()->back()->with('success', 'Tâche créée avec succès!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Une erreur est survenue lors de la création de la tâche.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectTask $projectTask)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectTask $projectTask)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        // Validate request
        $validated = $request->validate([
            'status' => 'required|in:en_attente,en_cours,terminé',
        ]);

        try {
            // Find the task
            $task = ProjectTask::find($id);

            if (!$task) {
                return redirect()->back()
                    ->with('error', 'Tâche non trouvée');
            }

            // Check if project exists
            if (!Project::find($task->project_id)) {
                return redirect()->back()
                    ->with('error', 'Projet associé non trouvé');
            }

            // Update task status
            $task->status = $validated['status'];
            $task->save();

            return redirect()->back()
                ->with('success', 'Statut de la tâche mis à jour avec succès');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la mise à jour');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        // Vérifier les permissions
        if (Auth::user()->type_user !== "admin") {
            return redirect()->back()
                ->with('error', "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }

        // Trouver la tâche ou retourner une erreur
        $task = ProjectTask::find($id);
        if (!$task) {
            return redirect()->back()
                ->with('error', "Tâche non trouvée : La tâche spécifiée n'existe pas.");
        }

        // Vérifier le statut de la tâche
        if ($task->status === 'en_cours') {
            return redirect()->back()
                ->with('error', "Impossible de supprimer : La tâche est en cours. Veuillez la terminer ou la remettre en attente avant suppression.");
        }

        try {
            $task->delete();
            return redirect()->back()
                ->with('success', 'Tâche supprimée avec succès.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Une erreur est survenue lors de la suppression ');
        }
    }
}
