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
        "user_id",
        "owner_id",
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'is_completed' => 'boolean',
        'is_important' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    public function owner()
    {
        return $this->belongsTo(User::class, "owner_id");
    }
}
