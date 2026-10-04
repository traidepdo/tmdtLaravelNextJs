<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LikeService;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\ProductResource;
use App\Http\Requests\FilterRequest;
use App\Http\Requests\LikeRequest;
class LikeController extends Controller
{
    protected $likeService;
    public function __construct(LikeService $likeService)
    {
        $this->likeService = $likeService;
    }
    public function getLike(FilterRequest $request) : JsonResponse
    {
        $filter = $request->validated();
        $paginator = $this->likeService->getList($request->user()->id, $filter, 12);
        
        // Trích xuất Product model từ quan hệ SavedProduct
        $products = $paginator->getCollection()->map(function ($saved) {
            $product = $saved->product;
            if ($product) {
                $product->is_saved = true;
            }
            return $product;
        })->filter();

        $paginator->setCollection($products);

        return $this->successResponse(ProductResource::collection($paginator)->response()->getData(true));
    }
    public function toggleLike(LikeRequest $request) : JsonResponse
    {
        $validated = $request->validated();
        $savedProduct = $this->likeService->toggle($request->user()->id, $validated['productId']);
        return $this->successResponse($savedProduct);
    }
}
