<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->type_user !== "admin") {
            return redirect()->back()
                ->with('error', "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }
        $query = User::query()->latest();
        if ($request->input("type") !== null) {
            $query->where("type_user", $request->input("type"));
        }
        if ($request->input("start_date") !== null && $request->input("end_date")) {
            $query->whereBetween("created_at", [
                Carbon::parse($request->input("start_date"))->format("Y-m-d"),
                Carbon::parse($request->input("end_date"))->format("Y-m-d"),
            ]);
        }
        $users = $query->get();
        return Inertia::render("Users/Index", ["users" => $users]);
    }


    public function destroy(int $id)
    {
        // Check if current user is admin
        if (Auth::user()->type_user !== "admin") {
            return redirect()->back()
                ->with('error', "Accès refusé : Vous n'avez pas les autorisations nécessaires pour effectuer cette action.");
        }

        try {
            $user = User::find($id);

            if (!$user) {
                return redirect()->back()
                    ->with('error', 'Utilisateur non trouvé.');
            }

            // Check if target user is admin
            if ($user->type_user === "admin") {
                return redirect()->back()
                    ->with('error', 'Les administrateurs ne peuvent pas être supprimés.');
            }

            $user->delete();

            return redirect()->back()
                ->with('success', 'Utilisateur supprimé avec succès.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Une erreur est survenue lors de la suppression.');
        }
    }
}
