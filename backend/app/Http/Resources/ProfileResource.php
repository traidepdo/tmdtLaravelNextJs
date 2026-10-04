<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,

            // Thông tin chi tiết hồ sơ cá nhân
            'profile' => $this->whenLoaded('profile', function () {
                return [
                    'phone_number' => $this->profile?->phone_number,
                    'avatar' => $this->profile?->avatar,
                    'gender' => $this->profile?->gender,
                    'birthday' => $this->profile?->birthday?->format('Y-m-d'),
                    'address' => $this->profile?->address,
                    'ward' => $this->profile?->ward,
                    'district' => $this->profile?->district,
                    'city' => $this->profile?->city,
                    'bio' => $this->profile?->bio,
                ];
            }),

            // Danh sách vai trò (roles)
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name');
            }),

            // Danh sách quyền hạn (permissions)
            'permissions' => $this->whenLoaded('permissions', function () {
                return $this->getAllPermissions()->pluck('name');
            }),
        ];
    }
}
