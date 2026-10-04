<?php

namespace App\Services;
use App\Repositories\CategoryRepo;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
class CategoryService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected CategoryRepo $categoryRepo
    ) {}

    public function getList(): Collection
    {
        return $this->categoryRepo->getList();
    }
    
    public function getDetail($slug): Category
    {
        return $this->categoryRepo->getDetail($slug);
    }
}
