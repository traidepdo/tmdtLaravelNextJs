<?php

namespace App\Services;
use App\Repositories\ProfileRepo;
use App\Models\User;
class ProfileServices
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected ProfileRepo $profileRepo
    ){}
    public function getProfile(int $id): User
    {
        return $this->profileRepo->getProfile($id);
    }
    public function updateProfile(int $id, array $params): User
    {
        return $this->profileRepo->updateProfile($id, $params);
    }


    // public function updateProfile(int $id, array $params): User
    // {
    //     $user = auth()->user();
    //     if($user->id !== $id){
    //         abort(403);
    //     }
    //     return $this->profileRepo->updateProfile($id, $params);
    // }
}
