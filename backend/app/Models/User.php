<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Danh sách sản phẩm người dùng đã lưu (Wishlist)
     */
    public function savedProducts()
    {
        return $this->belongsToMany(Product::class, 'saved_products')->withTimestamps();
    }

    /**
     * Thông tin chi tiết hồ sơ cá nhân
     */
     public function profile()
     {
         return $this->hasOne(UserProfile::class);
     }

    /**
     * Danh sách thương hiệu người dùng đang theo dõi
     */
    public function followedBrands()
    {
        return $this->belongsToMany(Brand::class, 'brand_follows')->withTimestamps();
    }
}
