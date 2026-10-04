<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class FilterRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sort_by' => 'nullable|string|in:created_at,updated_at,price,name',
            'sort_order' => 'nullable|string|in:asc,desc',
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'sort_by.in' => 'Sort by must be one of: created_at,updated_at,price,name',
            'sort_order.in' => 'Sort order must be one of: asc,desc',
            'search.max' => 'Search must be at most 255 characters',
            'category.max' => 'Category must be at most 255 characters',
            'brand.max' => 'Brand must be at most 255 characters',
        ];
    }
}
