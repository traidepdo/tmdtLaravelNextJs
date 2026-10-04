<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\Profile;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 1. Thương hiệu (Brands & Showcases)
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{slug}', [BrandController::class, 'show']);

// 2. Danh mục quần áo (Categories)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// 3. Sản phẩm & Biến thể (Products & Variants)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/top', [ProductController::class, 'topProducts']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// 4. Mã giảm giá (Coupons)
Route::get('/coupons', [CouponController::class, 'index']);
Route::post('/coupons/check', [CouponController::class, 'check']);

// 5. Đơn hàng (Khách vãng lai hoặc đã đăng nhập đều có thể tạo đơn / xem theo mã)
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{code}', [OrderController::class, 'show']);

Route::get('/test/{slug}', [Test::class, 'index']);
Route::get('/test/oder/{userId}', [Test::class, 'oder']);
/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Auth)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/likes', [LikeController::class, 'getLike']);
    Route::post('/likes', [LikeController::class, 'toggleLike']);
    // Profile
    Route::get('/profile', [Profile::class, 'index']);
    Route::put('/profile', [Profile::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 4. Tính năng Người dùng: Lưu sản phẩm (Wishlist) & Theo dõi thương hiệu
    Route::post('/products/{id}/save', [ProductController::class, 'toggleSave']);
    Route::get('/saved-products', [ProductController::class, 'savedList']);
    Route::post('/brands/{id}/follow', [BrandController::class, 'toggleFollow']);

    // 5. Quản lý Đơn hàng cá nhân
    Route::get('/my-orders', [OrderController::class, 'index']);
    Route::post('/orders/{code}/cancel', [OrderController::class, 'cancel']);

    // Role-protected routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Welcome Super Admin!',
                'data' => [
                    'total_users' => \App\Models\User::count(),
                    'total_products' => \App\Models\Product::count(),
                    'total_brands' => \App\Models\Brand::count(),
                    'roles' => \Spatie\Permission\Models\Role::with('permissions')->get(),
                ],
            ]);
        });
    });

    Route::middleware('role:staff|admin')->group(function () {
        Route::get('/staff/orders', function () {
            return response()->json([
                'status' => 'success',
                'message' => 'Staff/Admin orders list',
                'orders' => [
                    ['id' => 101, 'customer' => 'Nguyen Van A', 'total' => 250000, 'status' => 'pending'],
                    ['id' => 102, 'customer' => 'Tran Thi B', 'total' => 500000, 'status' => 'completed'],
                ],
            ]);
        });
    });
});
