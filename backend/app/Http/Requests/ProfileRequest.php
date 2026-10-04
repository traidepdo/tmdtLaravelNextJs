<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileRequest extends FormRequest
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
        $userId = $this->user()?->id;

        return [
            // Thông tin bảng users
            'name'         => ['sometimes', 'required', 'string', 'max:255'],
            'email'        => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            
            // Thông tin bảng user_profiles (nullable để cập nhật linh hoạt)
            'phone_number' => ['nullable', 'string', 'max:20'],
            'avatar'       => ['nullable', 'string', 'max:2048'], // hoặc 'image|mimes:jpeg,png,jpg|max:2048' nếu upload file
            'gender'       => ['nullable', 'in:male,female,other'],
            'birthday'     => ['nullable', 'date'],
            'address'      => ['nullable', 'string', 'max:255'],
            'ward'         => ['nullable', 'string', 'max:100'],
            'district'     => ['nullable', 'string', 'max:100'],
            'city'         => ['nullable', 'string', 'max:100'],
            'bio'          => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Vui lòng nhập họ và tên.',
            'email.required'    => 'Vui lòng nhập địa chỉ email.',
            'email.email'       => 'Địa chỉ email không đúng định dạng.',
            'email.unique'      => 'Email này đã được sử dụng.',
            'gender.in'         => 'Giới tính không hợp lệ (male, female, other).',
            'birthday.date'     => 'Ngày sinh không đúng định dạng ngày tháng.',
        ];
    }
}
