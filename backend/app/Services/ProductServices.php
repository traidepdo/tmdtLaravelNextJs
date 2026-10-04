<?php

namespace App\Services;
use App\Repositories\ProductRepo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Product;
class ProductServices
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected ProductRepo $productRepo
    ){}

    public function getDetail(string|int $identifier): Product
    {
        return $this->productRepo->getDetail($identifier);
    }
    public function getList(array $params, ?int $userId = null): LengthAwarePaginator
    {
        return $this->productRepo->getList($params, $userId);
    }
    public function getTopProduct(int $limit = 5)
    {
        return $this->productRepo->getTopSelling($limit);
    }
}
