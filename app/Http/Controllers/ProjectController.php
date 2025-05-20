<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectUser;
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
        $data = [];
        $related_user = ProjectUser::where("user_id", Auth::user()->id)
            ->with("project")
            ->get();
        if (!isEmpty($related_user)) {
            $data = Project::where("id", $related_user->project_id)->get();
        }
        return Inertia::render("Projects/Index", [
            "projects" => $data
        ]);
    }

    //page admin
    public function project_admin()
    {
        if (request()->user()->type_user !== "admin") {
            return redirect()->back()->with("error", "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }
        $data = Project::with(["project_users", "project_users.users"])
            ->where("created_by", request()->user()->id)->get();

        return Inertia::render("Projects/Admin/Index", [
            "projects" => $data
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

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
