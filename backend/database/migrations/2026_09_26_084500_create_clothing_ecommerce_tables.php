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
        // 1. Bảng Thương hiệu (Brands)
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->string('tagline')->nullable(); // Khẩu hiệu thương hiệu
            $table->text('description')->nullable();
            $table->longText('story')->nullable(); // Câu chuyện thương hiệu
            $table->string('website_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Bảng Trưng bày riêng của từng Brand (Brand Showcases / Lookbooks / Highlights)
        Schema::create('brand_showcases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('media_type')->default('image'); // image, video, lookbook, banner
            $table->string('media_url');
            $table->string('action_url')->nullable(); // Đường link khi bấm vào
            $table->string('action_text')->nullable(); // Text của nút (vd: "Khám phá BST Hè 2026")
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Bảng Danh mục quần áo (Categories) - Hỗ trợ cây danh mục cha/con
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Bảng Sản phẩm quần áo (Products)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku_prefix')->nullable();
            $table->string('gender')->default('unisex'); // men, women, unisex, kids
            $table->string('material')->nullable(); // Chất liệu (Cotton 100%, Linen, Jean, Lụa...)
            $table->text('care_instructions')->nullable(); // Hướng dẫn bảo quản/giặt ủi
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->decimal('base_price', 12, 2);
            $table->decimal('sale_price', 12, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Bảng Biến thể quần áo (Product Variants: Màu sắc, Size, Tồn kho, Giá riêng)
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->string('color_name'); // Vd: Đen, Trắng, Xanh Navy, Be...
            $table->string('color_code')->nullable(); // Mã màu hex (#000000, #FFFFFF, #001F3F...)
            $table->string('size'); // Vd: S, M, L, XL, XXL, 29, 30, 31, 32...
            $table->decimal('price', 12, 2);
            $table->decimal('compare_at_price', 12, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->integer('weight_grams')->nullable(); // Khối lượng để tính ship
            $table->string('image_url')->nullable(); // Ảnh đại diện của riêng biến thể màu đó
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 6. Bảng Hình ảnh chi tiết sản phẩm (Product Images)
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('image_url');
            $table->string('alt_text')->nullable();
            $table->boolean('is_thumbnail')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 7. Bảng Lưu sản phẩm yêu thích của khách (Saved Products / Wishlist)
        Schema::create('saved_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'product_id']);
        });

        // 8. Bảng Theo dõi thương hiệu (Brand Follows)
        Schema::create('brand_follows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'brand_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_follows');
        Schema::dropIfExists('saved_products');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brand_showcases');
        Schema::dropIfExists('brands');
    }
};
