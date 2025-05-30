<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referal extends Model
{
    protected $fillable = [
        "nom_ref",
        "date_expiration",
    ];

    protected $casts = ['date_expiration' => 'datetime'];
}
