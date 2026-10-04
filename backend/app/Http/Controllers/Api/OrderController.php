<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Danh sách đơn hàng của người dùng hiện tại (hoặc tra cứu theo email/phone)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Order::with(['items.product', 'items.productVariant', 'coupon'])
            ->orderBy('created_at', 'desc');

        if ($user) {
            $query->where('user_id', $user->id);
        } else {
            // Tra cứu qua phone hoặc email cho khách vãng lai
            if ($request->has('email')) {
                $query->where('customer_email', $request->query('email'));
            } elseif ($request->has('phone')) {
                $query->where('customer_phone', $request->query('phone'));
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng đăng nhập hoặc cung cấp email/phone để tra cứu đơn hàng.',
                ], 400);
            }
        }

        $orders = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    }

    /**
     * Chi tiết đơn hàng theo order_code
     */
    public function show(Request $request, string $orderCode): JsonResponse
    {
        $user = $request->user();

        $order = Order::with(['items.product', 'items.productVariant', 'coupon'])
            ->where('order_code', $orderCode)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        // Nếu là user đăng nhập thì kiểm tra quyền sở hữu đơn hàng
        if ($user && $order->user_id && $order->user_id !== $user->id && !$user->hasRole(['admin', 'staff'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền xem đơn hàng này.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $order,
        ]);
    }

    /**
     * Tạo đơn hàng mới
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        DB::beginTransaction();
        try {
            $orderCode = 'ORD-' . date('Ymd') . '-' . strtoupper(Str::random(6));

            $subtotal = 0;
            $orderItemsData = [];

            // 1. Kiểm tra tồn kho & tính toán giá trị
            foreach ($validated['items'] as $item) {
                $variant = ProductVariant::with('product')->lockForUpdate()->find($item['product_variant_id']);

                if (!$variant) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Biến thể sản phẩm không tồn tại.',
                    ], 400);
                }

                if ($variant->stock_quantity < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 'error',
                        'message' => "Sản phẩm '{$variant->product->name} ({$variant->color_name} - {$variant->size})' không đủ số lượng tồn kho (còn {$variant->stock_quantity}).",
                    ], 400);
                }

                $unitPrice = $variant->price;
                $lineTotal = $unitPrice * $item['quantity'];
                $subtotal += $lineTotal;

                // Trừ tồn kho & cộng lượt mua
                $variant->decrement('stock_quantity', $item['quantity']);
                if ($variant->product) {
                    $variant->product->increment('count_buy', $item['quantity']);
                }

                $orderItemsData[] = [
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product ? $variant->product->name : 'Sản phẩm',
                    'sku' => $variant->sku,
                    'color_name' => $variant->color_name,
                    'size' => $variant->size,
                    'image_url' => $variant->image_url ?? ($variant->product->images->first()->image_url ?? null),
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'total_price' => $lineTotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // 2. Xử lý mã giảm giá (nếu có gửi lên)
            $couponId = null;
            $couponCode = null;
            $discountAmount = $validated['discount_amount'] ?? 0;

            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', trim(strtoupper($validated['coupon_code'])))->lockForUpdate()->first();
                if ($coupon && $coupon->isValid() && $subtotal >= $coupon->min_order_amount) {
                    $couponId = $coupon->id;
                    $couponCode = $coupon->code;
                    $discountAmount = $coupon->calculateDiscount($subtotal);
                    $coupon->increment('used_count');
                }
            }

            $shippingFee = $validated['shipping_fee'] ?? 0;
            $totalAmount = max(0, $subtotal + $shippingFee - $discountAmount);

            // 3. Tạo Order
            $order = Order::create([
                'user_id' => $user ? $user->id : null,
                'order_code' => $orderCode,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
                'coupon_id' => $couponId,
                'coupon_code' => $couponCode,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $validated['payment_method'] ?? 'cod',
                'payment_status' => 'pending',
                'order_status' => 'pending',
            ]);

            // 4. Gắn order_id vào items và lưu
            foreach ($orderItemsData as &$itemData) {
                $itemData['order_id'] = $order->id;
            }
            OrderItem::insert($orderItemsData);

            // 5. Lưu coupon usage nếu có dùng mã
            if ($couponId) {
                CouponUsage::create([
                    'coupon_id' => $couponId,
                    'order_id' => $order->id,
                    'user_id' => $user ? $user->id : null,
                    'discount_amount' => $discountAmount,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Đặt hàng thành công!',
                'data' => $order->load(['items', 'coupon']),
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi tạo đơn hàng: ' . $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Hủy đơn hàng (dành cho khách hàng khi đơn còn ở trạng thái pending)
     */
    public function cancel(Request $request, string $orderCode): JsonResponse
    {
        $user = $request->user();

        $order = Order::with('items')->where('order_code', $orderCode)->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if ($user && $order->user_id && $order->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn không có quyền thao tác trên đơn hàng này.',
            ], 403);
        }

        if (!in_array($order->order_status, ['pending', 'confirmed'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể hủy đơn hàng ở trạng thái hiện tại (' . $order->order_status . ').',
            ], 400);
        }

        DB::beginTransaction();
        try {
            $order->order_status = 'cancelled';
            $order->save();

            // Hoàn lại tồn kho
            foreach ($order->items as $item) {
                if ($item->product_variant_id) {
                    ProductVariant::where('id', $item->product_variant_id)->increment('stock_quantity', $item->quantity);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Hủy đơn hàng thành công.',
                'data' => $order,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi hủy đơn hàng: ' . $th->getMessage(),
            ], 500);
        }
    }
}
