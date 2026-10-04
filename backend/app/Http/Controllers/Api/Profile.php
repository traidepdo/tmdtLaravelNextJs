<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ProfileResource;
use App\Services\ProfileServices;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\ProfileRequest;

class Profile extends Controller
{
    public function __construct(
        protected ProfileServices $profileServices
    ) {}
    
    public function index(Request $request){
        $user= $request->user();
        if(!$user){
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }
        $profile = $this->profileServices->getProfile($user->id);
        return $this->successResponse(new ProfileResource($profile));
    }
    public function updateProfile(ProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        $validatedData = $request->validated();
        
        // Nếu có upload file avatar:
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $validatedData['avatar'] = '/storage/' . $path;
        }

        $profile = $this->profileServices->updateProfile($user->id, $validatedData);

        return $this->successResponse(new ProfileResource($profile), 'Cập nhật thông tin thành công');
    }

}
