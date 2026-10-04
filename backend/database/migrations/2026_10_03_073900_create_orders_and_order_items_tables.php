<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Bảng Đơn hàng (Orders)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('order_code')->unique(); // Mã đơn hàng (VD: ORD-20261003-XXXX)
            
            // Thông tin người nhận
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('shipping_address');
            $table->text('notes')->nullable();

            // Tổng tiền & chiết khấu
            $table->decimal('subtotal', 12, 2)->default(0); // Tiền hàng
            $table->decimal('shipping_fee', 12, 2)->default(0); // Phí vận chuyển
            $table->decimal('discount_amount', 12, 2)->default(0); // Giảm giá
            $table->decimal('total_amount', 12, 2); // Tổng thanh toán

            // Trạng thái đơn hàng & thanh toán
            $table->string('payment_method')->default('cod'); // cod, vnpay, momo, banking, stripe...
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('order_status', ['pending', 'confirmed', 'processing', 'shipping', 'completed', 'cancelled'])->default('pending');

            $table->timestamps();
        });

        // 2. Bảng Chi tiết đơn hàng / Biến thể đã đặt (Order Items / Order Variants)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            
            // Snapshot dữ liệu sản phẩm tại thời điểm mua (tránh bị ảnh hưởng khi sản phẩm/variant sau này đổi giá/tên)
            $table->string('product_name');
            $table->string('sku')->nullable();
            $table->string('color_name')->nullable();
            $table->string('size')->nullable();
            $table->string('image_url')->nullable();
            $table->decimal('unit_price', 12, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 12, 2); // unit_price * quantity

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
