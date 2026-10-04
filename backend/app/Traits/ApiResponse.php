<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    /**
     * Trả về response thành công (Success JSON response).
     *
     * @param  mixed  $data
     * @param  string|null  $message
     * @param  int  $code
     * @return JsonResponse
     */
    public function successResponse(mixed $data = null, ?string $message = null, int $code = Response::HTTP_OK): JsonResponse
    {
        $response = [
            'status' => 'success',
            'code' => $code,
        ];

        if ($message !== null) {
            $response['message'] = $message;
        }

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    /**
     * Trả về response lỗi (Error JSON response).
     *
     * @param  string|null  $message
     * @param  int  $code
     * @param  mixed  $errors
     * @return JsonResponse
     */
    public function errorResponse(?string $message = 'Đã có lỗi xảy ra', int $code = Response::HTTP_BAD_REQUEST, mixed $errors = null): JsonResponse
    {
        $response = [
            'status' => 'error',
            'code' => $code,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
