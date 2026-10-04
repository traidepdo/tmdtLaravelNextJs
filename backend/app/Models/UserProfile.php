<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'phone_number',
        'avatar',
        'gender',
        'birthday',
        'address',
        'ward',
        'district',
        'city',
        'bio',
    ];

    protected function casts(): array
    {
        return [
            'birthday' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
