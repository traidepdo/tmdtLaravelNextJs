<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'banner',
        'tagline',
        'description',
        'story',
        'website_url',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Danh sách sản phẩm của thương hiệu
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Phần trưng bày riêng của thương hiệu (Lookbooks, BST nổi bật, Video banner)
     */
    public function showcases(): HasMany
    {
        return $this->hasMany(BrandShowcase::class)->orderBy('sort_order');
    }

    /**
     * Những người dùng đang theo dõi thương hiệu này
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'brand_follows')->withTimestamps();
    }
}
