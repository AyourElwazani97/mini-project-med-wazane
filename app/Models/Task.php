<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        "nom_task",
        "description",
        "due_date",
        "is_completed",
        "is_important",
        "user_id"
    ];

    protected $casts = [  // Recommended: Cast booleans and dates
        'due_date' => 'datetime',
        'is_completed' => 'boolean',
        'is_important' => 'boolean'
    ];

    // Relationship to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
