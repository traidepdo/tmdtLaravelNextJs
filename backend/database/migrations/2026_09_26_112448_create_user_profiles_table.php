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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('phone_number', 20)->nullable();
            $table->string('avatar')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('birthday')->nullable();
            $table->string('address')->nullable(); // Địa chỉ chi tiết (số nhà, đường)
            $table->string('ward')->nullable(); // Phường / Xã
            $table->string('district')->nullable(); // Quận / Huyện
            $table->string('city')->nullable(); // Tỉnh / Thành phố
            $table->text('bio')->nullable(); // Giới thiệu ngắn
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
