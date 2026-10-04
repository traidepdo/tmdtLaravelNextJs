<?php

namespace App\Repositories;
use App\Models\SavedProduct;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\User;
use App\Models\Product;
class LikeRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected SavedProduct $savedProduct
    ) {
    }
    
    public function getList(int $userId, array $filter = [], int $limit = 10): LengthAwarePaginator
    {
        $query = $this->savedProduct->newQuery()
                            ->where('user_id', $userId)
                            ->with(['product.category', 'product.brand', 'product.images', 'product.variants']);
        $query = $this->filterLike($query, $filter);
        $data = $query->paginate($limit);
        return $data;
    }
    public function toggleSave(int $userId, int $productId): array
    {
        $user = User::findOrFail($userId);
        $product = Product::findOrFail($productId);

        $exists = $user->savedProducts()->where('product_id', $product->id)->exists();

        if ($exists) {
            $user->savedProducts()->detach($product->id);
            $isSaved = false;
            $message = "Đã bỏ lưu sản phẩm khỏi danh sách yêu thích.";
        } else {
            $user->savedProducts()->attach($product->id);
            $isSaved = true;
            $message = "Đã lưu sản phẩm vào danh sách yêu thích!";
        }

        return [
            'message' => $message,
            'is_saved' => $isSaved,
            'saved_count' => $user->savedProducts()->count(),
        ];
    }

    public function filterLike($query, array $filter = [])
    {
        $keyword = $filter['search'] ?? $filter['keyword'] ?? null;
        $category = $filter['category'] ?? null;
        $brand = $filter['brand'] ?? null;
        $sortBy = $filter['sort_by'] ?? null;
        $sortOrder = $filter['sort_order'] ?? 'desc';

        if ($keyword) {
            $query->whereHas('product', function ($q) use ($keyword) {
                $q->where('name', 'LIKE', '%' . $keyword . '%')
                  ->orWhere('slug', 'LIKE', '%' . $keyword . '%')
                  ->orWhere('sku_prefix', 'LIKE', '%' . $keyword . '%');
            });
        }

        if ($category) {
            $query->whereHas('product.category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        if ($brand) {
            $query->whereHas('product.brand', function ($q) use ($brand) {
                $q->where('slug', $brand);
            });
        }

        if ($sortBy === 'created_at') {
            $query->orderBy('created_at', $sortOrder);
        } else {
            $query->latest('id');
        }

        return $query;
    }
}
