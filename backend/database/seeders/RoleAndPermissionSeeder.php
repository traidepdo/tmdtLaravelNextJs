<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Permissions
        $permissions = [
            'view-dashboard',
            'manage-users',
            'manage-roles',
            'manage-products',
            'view-products',
            'create-order',
            'manage-orders',
        ];

        foreach ($permissions as $permissionName) {
            Permission::findOrCreate($permissionName, 'web');
        }

        // 2. Create Roles and Assign Permissions
        // Admin
        $adminRole = Role::findOrCreate('admin', 'web');
        $adminRole->syncPermissions(Permission::all());

        // Staff
        $staffRole = Role::findOrCreate('staff', 'web');
        $staffRole->syncPermissions([
            'view-dashboard',
            'manage-products',
            'view-products',
            'manage-orders',
        ]);

        // Customer
        $customerRole = Role::findOrCreate('customer', 'web');
        $customerRole->syncPermissions([
            'view-products',
            'create-order',
        ]);

        // 3. Create Sample Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
            ]
        );
        $admin->syncRoles(['admin']);

        // 4. Create Sample Staff User
        $staff = User::updateOrCreate(
            ['email' => 'staff@example.com'],
            [
                'name' => 'Demo Staff',
                'password' => Hash::make('password123'),
            ]
        );
        $staff->syncRoles(['staff']);

        // 5. Create Sample Customer User
        $customer = User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Demo Customer',
                'password' => Hash::make('password123'),
            ]
        );
        $customer->syncRoles(['customer']);

        $this->command->info('Roles, permissions, and sample users seeded successfully!');
    }
}
