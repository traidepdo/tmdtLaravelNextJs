<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'brand_id' => $this->brand_id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku_prefix' => $this->sku_prefix,
            'gender' => $this->gender,
            'material' => $this->material,
            'care_instructions' => $this->care_instructions,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'base_price' => (float) $this->base_price,
            'sale_price' => $this->sale_price !== null ? (float) $this->sale_price : null,
            'count_buy' => (int) ($this->count_buy ?? 0),
            'is_featured' => (bool) $this->is_featured,
            'is_active' => (bool) $this->is_active,
            'is_saved' => $this->when(isset($this->is_saved), (bool) $this->is_saved),

            // Relations (Chỉ load khi eager loading có sẵn để tối ưu queries)
            'brand' => $this->whenLoaded('brand', function () {
                return [
                    'id' => $this->brand->id,
                    'name' => $this->brand->name,
                    'slug' => $this->brand->slug,
                    'logo' => $this->brand->logo,
                    'cover_image' => $this->brand->cover_image,
                ];
            }),
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                ];
            }),
            'variants' => $this->whenLoaded('variants', function () {
                return $this->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'sku' => $variant->sku,
                        'color_name' => $variant->color_name,
                        'color_code' => $variant->color_code,
                        'size' => $variant->size,
                        'stock_quantity' => (int) $variant->stock_quantity,
                        'price' => (float) $variant->price,
                        'sale_price' => $variant->sale_price !== null ? (float) $variant->sale_price : null,
                        'image_url' => $variant->image_url,
                        'is_active' => (bool) $variant->is_active,
                    ];
                });
            }),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'image_url' => $img->image_url,
                        'alt_text' => $img->alt_text,
                        'is_thumbnail' => (bool) $img->is_thumbnail,
                        'sort_order' => (int) $img->sort_order,
                    ];
                });
            }),
            'is_saved' => (bool) ($this->is_saved ?? false),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

