<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Referal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'referal' => ['required', 'string'],
        ]);

        DB::beginTransaction();
        try {
            $referal = Referal::where("nom_ref", "=", $request->input("referal"))->first();

            if (!$referal) {
                DB::rollBack();
                return redirect()->back()->with("error", "Le code de parrainage que vous avez saisi est invalide.");
            }

            $today = Carbon::today();
            $expiration_date = Carbon::parse($referal->date_expiration);

            if ($today->gt($expiration_date)) {
                DB::rollBack();
                return redirect()->back()->with("error", "Le code de parrainage a expiré.");
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            event(new Registered($user));

            Auth::login($user);
            DB::commit();

            return to_route('dashboard');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with("error", "Une erreur est survenue lors de l'inscription.");
        }
    }
}
