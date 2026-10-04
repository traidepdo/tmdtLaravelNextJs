<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Danh sách thương hiệu (kèm số lượng sản phẩm & trưng bày nổi bật)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Brand::where('is_active', true)
            ->with(['showcases' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order');
            }])
            ->withCount(['products', 'followers']);

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $brands = $query->get();

        // Kiểm tra user đã follow brand nào chưa nếu có token
        $user = auth('sanctum')->user();
        if ($user) {
            $followedBrandIds = $user->followedBrands()->pluck('brands.id')->toArray();
            $brands->each(function ($b) use ($followedBrandIds) {
                $b->is_followed = in_array($b->id, $followedBrandIds);
            });
        }

        return response()->json([
            'status' => 'success',
            'data' => $brands,
        ]);
    }

    /**
     * Chi tiết trang trưng bày riêng của thương hiệu
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'showcases' => function ($q) {
                    $q->where('is_active', true)->orderBy('sort_order');
                },
                'products' => function ($q) {
                    $q->where('is_active', true)
                        ->with(['variants', 'images'])
                        ->latest();
                },
            ])
            ->withCount(['products', 'followers'])
            ->firstOrFail();

        $user = auth('sanctum')->user();
        $brand->is_followed = $user ? $user->followedBrands()->where('brand_id', $brand->id)->exists() : false;

        return response()->json([
            'status' => 'success',
            'data' => $brand,
        ]);
    }

    /**
     * Theo dõi / Bỏ theo dõi thương hiệu (Toggle Follow)
     */
    public function toggleFollow(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $brand = Brand::findOrFail($id);

        $exists = $user->followedBrands()->where('brand_id', $brand->id)->exists();

        if ($exists) {
            $user->followedBrands()->detach($brand->id);
            $isFollowed = false;
            $message = "Đã bỏ theo dõi thương hiệu {$brand->name}.";
        } else {
            $user->followedBrands()->attach($brand->id);
            $isFollowed = true;
            $message = "Đang theo dõi thương hiệu {$brand->name} thành công!";
        }

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'is_followed' => $isFollowed,
            'followers_count' => $brand->followers()->count(),
        ]);
    }
}
