<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'nullable|string|in:cod,vnpay,momo,banking',
            'shipping_fee' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'coupon_code' => 'nullable|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Họ tên người nhận không được để trống.',
            'customer_email.required' => 'Email không được để trống.',
            'customer_email.email' => 'Email không đúng định dạng.',
            'customer_phone.required' => 'Số điện thoại không được để trống.',
            'shipping_address.required' => 'Địa chỉ nhận hàng không được để trống.',
            'items.required' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'items.min' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'items.*.product_variant_id.required' => 'Vui lòng chọn biến thể sản phẩm.',
            'items.*.product_variant_id.exists' => 'Biến thể sản phẩm không tồn tại.',
            'items.*.quantity.required' => 'Số lượng mua không hợp lệ.',
            'items.*.quantity.min' => 'Số lượng mua tối thiểu là 1.',
        ];
    }
}
