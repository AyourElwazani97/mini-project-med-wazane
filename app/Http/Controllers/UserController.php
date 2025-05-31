<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        if (Auth::user()->type_user !== "admin") {
            return redirect()->back()
                ->with('error', 'Action non autorisée.');
        }
        $users = User::latest()->get();
        return Inertia::render("Users/Index", ["users" => $users]);
    }


    public function destroy(int $id)
    {
        // Check if current user is admin
        if (Auth::user()->type_user !== "admin") {
            return redirect()->back()
                ->with('error', 'Action non autorisée.');
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
