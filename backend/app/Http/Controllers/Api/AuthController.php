<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\createUser;
use App\Http\Requests\loginUser;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(createUser $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign default 'customer' role if exists
        if (Role::where('name', 'customer')->exists()) {
            $user->assignRole('customer');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ], 'Registration successful', Response::HTTP_CREATED);
    }

    /**
     * Login user and create token.
     */
    public function login(loginUser $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return $this->errorResponse('Thông tin đăng nhập không chính xác.', Response::HTTP_UNPROCESSABLE_ENTITY, [
                'email' => ['Thông tin đăng nhập không chính xác.'],
            ]);
        }

        $portal = $validated['portal'] ?? 'customer';
        if ($portal === 'admin' && ! $user->hasRole('admin')) {
            return $this->errorResponse('Tài khoản không có quyền truy cập Cổng Quản trị (Admin).', Response::HTTP_FORBIDDEN);
        }

        if ($portal === 'staff' && ! ($user->hasRole('staff') || $user->hasRole('admin'))) {
            return $this->errorResponse('Tài khoản không có quyền truy cập Cổng Nhân viên (Staff).', Response::HTTP_FORBIDDEN);
        }

        if ($portal === 'customer' && ! $user->hasRole('customer')) {
            return $this->errorResponse('Tài khoản này là tài khoản Quản trị/Nhân viên, vui lòng đăng nhập đúng cổng được phân quyền.', Response::HTTP_FORBIDDEN);
        }

        // Revoke old tokens if desired or keep multiple tokens
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ], 'Login successful');
    }

    /**
     * Get authenticated user profile with roles and permissions.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('profile');

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'profile' => $user->profile,
        ]);
    }

    /**
     * Update user profile information.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'string', 'max:2048'],
            'gender' => ['nullable', 'in:male,female,other'],
            'birthday' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:255'],
            'ward' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        if (isset($validated['name'])) {
            $user->update(['name' => $validated['name']]);
        }

        $profileData = collect($validated)->except('name')->toArray();

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        $user->load('profile');

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'profile' => $user->profile,
        ], 'Cập nhật thông tin tài khoản thành công');
    }

    /**
     * Logout and revoke current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Successfully logged out');
    }
}
