<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectUser;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function PHPUnit\Framework\isEmpty;

class ProjectController extends Controller
{

    public function index()
    {
        //get mes project
        $data = ProjectUser::where("user_id", Auth::user()->id)
            ->select(["id", "project_id"])
            ->with(["projects"])
            ->get();
        return Inertia::render("Projects/Index", [
            "assignments" => $data
        ]);
    }

    //page admin
    public function project_admin()
    {
        if (request()->user()->type_user !== "admin") {
            return redirect()->back()->with("error", "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }
        $allUsers = User::select(['id', 'name', 'email', 'type_user'])
            ->where("type_user", "!=", "admin")
            ->get();
        $projectUserIds = ProjectUser::pluck('user_id')->toArray();
        $data = Project::with(["project_users"])
            ->where("created_by", request()->user()->id)->latest()->get()->map(function ($project) {
                $project->time_left = Carbon::parse($project->created_at)
                    ->locale("fr")
                    ->diffForHumans(Carbon::parse($project->due_date));
                return $project;
            });
        return Inertia::render("Projects/Admin/Index", [
            "projects" => $data,
            'users' => $allUsers->map(function ($user) use ($projectUserIds) {
                return [
                    ...$user->toArray(),
                    'is_linked' => in_array($user->id, $projectUserIds)
                ];
            }),
        ]);

    }
    public function create()
    {
        if (request()->user()->type_user !== "admin") {
            return redirect()->back()->with("error", "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }
    }

    public function store(Request $request)
    {
        if (request()->user()->type_user !== "admin") {
            return redirect()->back()->with("error", "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }

        $validatedData = $request->validate([
            "name" => "required|string|unique:projects,name",
            "desc_prj" => "required|string",
            "due_date" => "required|date",
            "status" => "string"
        ]);

        if (Carbon::now()->format("Y-m-d") > Carbon::parse($validatedData['due_date'])->format('Y-m-d')) {
            return back()->with([
                'error' => 'La date d\'échéance doit être postérieure à la date actuelle.'
            ]);
        }

        DB::beginTransaction();
        try {
            Project::create([
                "name" => $validatedData['name'],
                "desc_prj" => $validatedData['desc_prj'],
                "due_date" => Carbon::parse($validatedData['due_date'])->format('Y-m-d'),
                "status" => $validatedData['status'],
                "created_by" => $request->user()->id // Optional: track who created the project
            ]);

            DB::commit();
            return redirect()->back()->with([
                'success' => 'Projet créé avec succès!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', "Échec de la création du projet. Veuillez réessayer ou contacter le support si le problème persiste.");
        }
    }

    public function addUserToProjects(Request $request, int $id)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $project = Project::find($id);
        if (!$project) {
            return redirect()->back()->with('error', 'Projet non trouvé');
        }

        $userId = $validated['user_id'];

        $isUserInProject = $project->project_users()
            ->where('user_id', $userId)
            ->exists();

        if ($isUserInProject) {
            $project->project_users()->where('user_id', $userId)->delete();
            $message = 'Utilisateur retiré du projet avec succès';
        } else {
            $project->project_users()->create([
                'project_id' => $project->id,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $message = 'Utilisateur ajouté au projet avec succès';
        }

        return redirect()->back()->with('success', $message);
    }

    public function show(Project $project)
    {
        $project->load(['project_users.users']);
        $allUsers = User::
            whereNotIn('id', $project->project_users->pluck('user_id'))
            ->where("type_user", "!=", "admin")
            ->get()->toArray();

        return Inertia::render("Projects/Admin/Show", [
            'project' => $project,
            'allUsers' => $allUsers,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        if (request()->user()->type_user !== "admin") {
            return redirect()->back()->with("error", "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }

        $validatedData = $request->validate([
            "name" => "required|string|unique:projects,name, " . $project->id,
            "desc_prj" => "required|string",
            "due_date" => "required|date",
        ]);

        DB::beginTransaction();
        try {
            $project->update([
                "name" => $validatedData['name'],
                "desc_prj" => $validatedData['desc_prj'],
                "due_date" => Carbon::parse($validatedData['due_date'])->format('Y-m-d'),
            ]);
            DB::commit();
            return redirect()->back()->with([
                'success' => 'Projet modifié avec succès!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', "Échec de la modification du projet. Veuillez réessayer ou contacter le support si le problème persiste.");
        }
    }

    public function update_status(Request $request, int $id)
    {
        if (request()->user()->type_user !== "admin") {
            return redirect()
                ->back()
                ->with("error", "Action non autorisée : Seuls les administrateurs peuvent modifier le statut des projets.");
        }

        $project = Project::find($id);
        if (!$project) {
            return redirect()
                ->back()
                ->with('error', "Projet introuvable : Le projet spécifié n'existe pas ou a déjà été supprimé.");
        }

        try {
            $validStatuses = ['En attente', 'En cours', 'Terminé', 'Annulé'];

            if (!in_array($request->input("status"), $validStatuses)) {
                return redirect()
                    ->back()
                    ->with('error', "Statut invalide : Veuillez choisir parmi les options disponibles.");
            }

            $project->status = $request->input("status");
            $project->save();

            return redirect()
                ->back()
                ->with("success", "Statut mis à jour : Le projet '{$project->name}' est maintenant marqué comme '{$project->status}'.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Erreur de mise à jour : Une erreur technique est survenue. Veuillez réessayer plus tard.");
        }
    }


    public function destroy(Project $project)
    {
        if (request()->user()->type_user !== "admin") {
            return redirect()
                ->back()
                ->with("error", "Action non autorisée : Seuls les administrateurs peuvent supprimer des projets.");
        }

        // List of protected statuses that cannot be deleted
        $protectedStatuses = ['En cours', 'En attente'];

        if (in_array($project->status, $protectedStatuses)) {
            return redirect()
                ->back()
                ->with("error", "Suppression impossible : Le projet '{$project->name}' ne peut pas être supprimé car son statut est '{$project->status}'. Seuls les projets terminés ou annulés peuvent être supprimés.");
        }

        try {
            $projectName = $project->name;
            $project->delete();

            return redirect()
                ->back()
                ->with("success", "Projet supprimé : '{$projectName}' a été définitivement supprimé du système.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', "Échec de suppression : Impossible de supprimer le projet en raison d'une erreur technique.");

        }
    }
}
