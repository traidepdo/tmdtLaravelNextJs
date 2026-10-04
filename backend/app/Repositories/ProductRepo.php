<?php

namespace App\Repositories;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class ProductRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected Product $product
    ) {}
    
    public function getList(array $params, ?int $userId = null): LengthAwarePaginator
    {
        $query = $this->product->newQuery()
            ->where('is_active', true)
            ->with(['brand', 'category', 'variants', 'images']);
        if ($userId) {
            $query->withExists(['savedProducts as is_saved' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
        }

        $query = $this->filter($query, $params);
        $query = $this->sort($query, $params);

        $products = $this->paginate($query, $params);

        return $this->attachSavedStatus($products);
    }

    public function getTopSelling(int $limit = 5)
    {
        $products = $this->product->newQuery()
            ->where('is_active', true)
            ->with(['brand', 'category', 'variants', 'images'])
            ->orderByDesc('count_buy')
            ->take($limit)
            ->get();

        return $this->attachSavedStatus($products);
    }
    public function getDetail(string|int $identifier): Product
    {
        $query = $this->product->newQuery()
            ->where('is_active', true)
            ->with(['brand', 'category', 'variants', 'images']);

        if (is_numeric($identifier)) {
            $product = $query->findOrFail($identifier);
        } else {
            $product = $query->where('slug', $identifier)->firstOrFail();
        }

        return $this->attachSavedStatus($product);
    }

    protected function filter($query, array $params)
    {
        $search = $params['search'] ?? null;
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%")
                  ->orWhere('sku_prefix', 'ILIKE', "%{$search}%");
            });
        }

        if (!empty($params['brand'])) {
            $query->whereHas('brand', function ($q) use ($params) {
                $q->where('slug', $params['brand']);
            });
        }
        
        if (!empty($params['category'])) {
            $query->whereHas('category', function ($q) use ($params) {
                $q->where('slug', $params['category']);
            });
        }

        if (!empty($params['gender'])) {
            $query->where('gender', $params['gender']);
        }

        if (isset($params['featured']) && $params['featured'] !== '') {
            $query->where('is_featured', filter_var($params['featured'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query;
    }

    protected function sort($query, array $params)
    {
        $sort = $params['sort'] ?? 'newest';

        return match ($sort) {
            'price_asc' => $query->orderBy('base_price', 'asc'),
            'price_desc' => $query->orderBy('base_price', 'desc'),
            'featured' => $query->orderByDesc('is_featured')->latest(),
            default => $query->latest(),
        };
    }

    protected function paginate($query, array $params)
    {
        return $query->paginate($params['per_page'] ?? 12);
    }
    protected function attachSavedStatus($resource)
    {
        $user = auth('sanctum')->user();
        if (!$user) {
            return $resource;
        }

        $savedIds = $user->savedProducts()->pluck('products.id')->toArray();

        if ($resource instanceof LengthAwarePaginator) {
            $resource->getCollection()->transform(function ($p) use ($savedIds) {
                $p->is_saved = in_array($p->id, $savedIds);
                return $p;
            });
        } elseif ($resource instanceof Product) {
            $resource->is_saved = in_array($resource->id, $savedIds);
        }

        return $resource;
    }
}
