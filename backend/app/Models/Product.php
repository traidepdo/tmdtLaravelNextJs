<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'category_id',
        'name',
        'slug',
        'sku_prefix',
        'gender',
        'material',
        'care_instructions',
        'short_description',
        'description',
        'base_price',
        'sale_price',
        'count_buy',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'count_buy' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Danh sách biến thể (Màu sắc, Size, Tồn kho, Giá)
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Bộ sưu tập hình ảnh chi tiết của sản phẩm
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Những người dùng đã lưu (Wishlist) sản phẩm này
     */
    public function savers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_products')->withTimestamps();
    }
    public function savedProducts(): HasMany
    {
        return $this->hasMany(SavedProduct::class);
    }

}
