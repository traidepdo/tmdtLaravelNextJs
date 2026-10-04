<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}
    
    /**
     * Danh sách danh mục cây (Categories tree & subcategories)
     */
    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getList();
        return $this->successResponse(CategoryResource::collection($categories));
    }

    /**
     * Chi tiết danh mục kèm sản phẩm
     */
    public function show(string $slug): JsonResponse
    {
        $category = $this->categoryService->getDetail($slug);
        return $this->successResponse(new CategoryResource($category));
    }
}
