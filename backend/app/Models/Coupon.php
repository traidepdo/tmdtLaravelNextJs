<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'description',
        'type', // 'percentage' | 'fixed'
        'value',
        'min_order_amount',
        'max_discount_amount',
        'usage_limit',
        'used_count',
        'usage_limit_per_user',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'usage_limit_per_user' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Kiểm tra coupon có hợp lệ tại thời điểm hiện tại không
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        if ($this->start_date && $now->lt($this->start_date)) {
            return false;
        }

        if ($this->end_date && $now->gt($this->end_date)) {
            return false;
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Tính toán số tiền được giảm theo tổng giá trị đơn hàng
     */
    public function calculateDiscount(float $orderAmount): float
    {
        if ($orderAmount < $this->min_order_amount) {
            return 0;
        }

        $discount = 0;

        if ($this->type === 'percentage') {
            $discount = ($orderAmount * $this->value) / 100;
            if ($this->max_discount_amount !== null && $discount > $this->max_discount_amount) {
                $discount = (float) $this->max_discount_amount;
            }
        } else {
            $discount = (float) $this->value;
        }

        return min($discount, $orderAmount);
    }
}
