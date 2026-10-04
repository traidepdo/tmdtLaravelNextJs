<?php

namespace App\Repositories;
use App\Models\Category;
use Illuminate\Support\Collection;
class CategoryRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getList(): Collection
    {
        $categories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->with(['children' => function ($q) {
                $q->where('is_active', true)->withCount('products');
            }])
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();
        return $categories;    
    }   

    public function getDetail($slug): Category
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'children' => function ($q) {
                    $q->where('is_active', true);
                },
                'products' => function ($q) {
                    $q->where('is_active', true)
                        ->with(['brand', 'variants', 'images'])
                        ->latest();
                },
            ])
            ->withCount('products')
            ->firstOrFail();
        return $category;
    }
}
