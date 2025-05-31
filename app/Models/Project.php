<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        "name",
        "desc_prj",
        "due_date",
        "status",
        "created_by",
    ];

    public function project_users()
    {
        return $this->hasMany(ProjectUser::class);
    }
    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks() {
        return $this->hasMany(ProjectTask::class, "project_id");
    }

}
