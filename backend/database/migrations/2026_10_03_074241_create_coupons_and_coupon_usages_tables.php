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
        // 1. Bảng Mã giảm giá (Coupons / Vouchers)
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // VD: SUMMER2026, FREESHIP, SALE50K
            $table->string('title'); // VD: Giảm 20% cho đơn từ 500k
            $table->text('description')->nullable();
            
            // Loại giảm giá: phần trăm (%) hoặc số tiền cố định (fixed VNĐ)
            $table->enum('type', ['percentage', 'fixed'])->default('fixed');
            $table->decimal('value', 12, 2); // Giá trị giảm (VD: 20 hoặc 50000)
            
            // Điều kiện áp dụng
            $table->decimal('min_order_amount', 12, 2)->default(0); // Đơn tối thiểu
            $table->decimal('max_discount_amount', 12, 2)->nullable(); // Số tiền giảm tối đa (với %)
            
            // Giới hạn số lần dùng
            $table->integer('usage_limit')->nullable(); // Tổng số lượt dùng tối đa của mã
            $table->integer('used_count')->default(0); // Số lượt đã dùng
            $table->integer('usage_limit_per_user')->nullable()->default(1); // Số lần tối đa mỗi user được dùng
            
            // Thời hạn
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });

        // 2. Bảng Lịch sử sử dụng mã giảm giá (Coupon Usages)
        Schema::create('coupon_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coupon_id')->constrained('coupons')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('discount_amount', 12, 2);
            $table->timestamps();
        });

        // 3. Bổ sung coupon_id và coupon_code vào bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->after('notes')->constrained('coupons')->nullOnDelete();
            $table->string('coupon_code')->nullable()->after('coupon_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['coupon_id']);
            $table->dropColumn(['coupon_id', 'coupon_code']);
        });
        Schema::dropIfExists('coupon_usages');
        Schema::dropIfExists('coupons');
    }
};
