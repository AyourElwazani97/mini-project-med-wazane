<?php

namespace App\Http\Controllers;

use App\Models\Referal;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReferalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /* DB::table('referals')->select("id","nom_ref", "date_expiration")->get(); */
        $today = Carbon::today();
        $invitations = Referal::select("id", "nom_ref", "date_expiration")->latest()->get()->map(function ($invitation) use ($today) {
            $invitation->isExpired = $today->gt($invitation->date_expiration);
            return $invitation;
        });
        return Inertia::render("Invitations/Index", [
            "invitations" => $invitations
        ]);
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
        $validatedData = $request->validate([
            "nom_ref" => 'required|string|unique:referals,nom_ref',
            'date_expiration' => 'required|date|after_or_equal:' . Carbon::today()->format('Y-m-d')
        ]);

        DB::beginTransaction();
        try {
            Referal::create([
                "nom_ref" => $validatedData["nom_ref"],
                "date_expiration" => Carbon::parse($validatedData["date_expiration"])->format('Y-m-d'),
            ]);
            DB::commit();
            return redirect()->back()->with('success', 'Invitation créée avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', "Échec de la création de l'nvitation");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Referal $referal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Referal $referal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Referal $referal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Referal $referal)
    {
        //
    }
}
