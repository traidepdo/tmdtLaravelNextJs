<?php

namespace App\Repositories;
use App\Models\User;
class ProfileRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected User $user)
    {
    }

    public function getProfile(int $id): User
    {
        $user = $this->user->newQuery()->findOrFail($id);
        return $this->loadRelations($user);
    }
    public function updateProfile(int $id, array $data): User
    {
        $user = $this->user->newQuery()->findOrFail($id);

        // 1. Cập nhật thông tin bảng users (name, email)
        $userData = array_filter([
            'name'  => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
        ]);
        if (!empty($userData)) {
            $user->update($userData);
        }

        // 2. Cập nhật thông tin chi tiết bảng user_profiles
        $profileFields = [
            'phone_number', 'avatar', 'gender', 'birthday',
            'address', 'ward', 'district', 'city', 'bio'
        ];
        $profileData = array_intersect_key($data, array_flip($profileFields));

        if (!empty($profileData)) {
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
        }

        return $this->loadRelations($user);
    }


    protected function loadRelations(User $user): User
    {
        return $user->load(['profile', 'roles', 'permissions']);
    }
    
    
}
