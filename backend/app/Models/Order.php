<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_code',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'notes',
        'coupon_id',
        'coupon_code',
        'subtotal',
        'shipping_fee',
        'discount_amount',
        'total_amount',
        'payment_method',
        'payment_status',
        'order_status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Khách hàng đặt đơn (nếu có tài khoản)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mã giảm giá đã áp dụng
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Danh sách sản phẩm / biến thể trong đơn hàng
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Alias liên kết items -> orderVariants nếu gọi theo tên biến thể
     */
    public function orderVariants(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
