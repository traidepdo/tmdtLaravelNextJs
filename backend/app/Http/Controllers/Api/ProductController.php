<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductServices;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductServices $productServices
    ) {}

    /**
     * Danh sách sản phẩm quần áo (kèm bộ lọc thương hiệu, danh mục, giới tính, giá, tìm kiếm)
     */
    public function index(Request $request): JsonResponse
    {
        $params = $request->all();
        $userId = $request->user()?->id;
        $products = $this->productServices->getList($params, $userId);

        return $this->successResponse(ProductResource::collection($products)->response()->getData(true));
    }

    /**
     * Chi tiết sản phẩm quần áo kèm tất cả biến thể (màu sắc, size, tồn kho)
     */
    public function show(string $slug): JsonResponse
    {
        $product = $this->productServices->getDetail($slug);
        return $this->successResponse(new ProductResource($product));
    }

    /**
     * Lưu / Bỏ lưu sản phẩm vào Wishlist (Toggle Save)
     */
    

    /**
     * Danh sách sản phẩm đã lưu của người dùng hiện tại
     */
    public function savedList(Request $request): JsonResponse
    {
        $user = $request->user();

        $savedProducts = $user->savedProducts()
            ->with(['brand', 'category', 'images', 'variants'])
            ->latest('saved_products.created_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $savedProducts,
        ]);
    }
    public function topProducts(Request $request): JsonResponse
    {
        $limit = (int) ($request->query('limit', 5));
        $topProducts = $this->productServices->getTopProduct($limit);

        return $this->successResponse(ProductResource::collection($topProducts));
    }
}
