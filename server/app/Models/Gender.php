<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Gender extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_genders';
    protected $primaryKey = 'gender_id';
    // Route model binding: routes use {gender} param, so tell Eloquent to
    // match it against tbl_genders.gender_id (not the default `id` column).
    protected $routeKeyName = 'gender_id';
    protected $fillable = [
        'gender',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'gender_id', 'gender_id');
    }
}
