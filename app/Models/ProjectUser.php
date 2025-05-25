<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectUser extends Model
{
    protected $fillable = [
        "project_id",
        "user_id"
    ];

    public function projects()
    {
        return $this->belongsTo(Project::class, "project_id");
    }

    public function users()
    {
        return $this->hasMany(User::class, "id");
    }
}
