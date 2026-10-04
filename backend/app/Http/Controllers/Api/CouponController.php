<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\CouponUsage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Danh sách mã giảm giá công khai đang còn hiệu lực
     */
    public function index(): JsonResponse
    {
        $now = now();
        $coupons = Coupon::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')->orWhereRaw('used_count < usage_limit');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $coupons,
        ]);
    }

    /**
     * Kiểm tra và tính thử số tiền giảm của một mã giảm giá (Check / Validate Coupon)
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'order_amount' => 'required|numeric|min:0',
        ]);

        $code = trim(strtoupper($request->input('code')));
        $orderAmount = (float) $request->input('order_amount');
        $user = $request->user();

        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mã giảm giá không tồn tại hoặc đã hết hạn/hết lượt sử dụng.',
            ], 400);
        }

        if ($orderAmount < $coupon->min_order_amount) {
            return response()->json([
                'status' => 'error',
                'message' => 'Đơn hàng tối thiểu ' . number_format($coupon->min_order_amount) . ' VNĐ mới được áp dụng mã này.',
            ], 400);
        }

        // Kiểm tra giới hạn dùng của từng user
        if ($user && $coupon->usage_limit_per_user) {
            $userUsageCount = CouponUsage::where('coupon_id', $coupon->id)
                ->where('user_id', $user->id)
                ->count();

            if ($userUsageCount >= $coupon->usage_limit_per_user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bạn đã sử dụng hết số lượt cho phép của mã giảm giá này.',
                ], 400);
            }
        }

        $discount = $coupon->calculateDiscount($orderAmount);

        return response()->json([
            'status' => 'success',
            'message' => 'Áp dụng mã giảm giá thành công!',
            'data' => [
                'coupon' => $coupon,
                'discount_amount' => $discount,
                'final_amount' => max(0, $orderAmount - $discount),
            ],
        ]);
    }
}
