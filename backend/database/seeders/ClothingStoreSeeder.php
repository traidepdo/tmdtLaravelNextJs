<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\BrandShowcase;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ClothingStoreSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. SEED BRANDS & SHOWCASES
        // ==========================================
        $coolmate = Brand::updateOrCreate(
            ['slug' => 'coolmate'],
            [
                'name' => 'Coolmate',
                'logo' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
                'banner' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
                'tagline' => 'Giải pháp mua sắm thời trang tiện lợi & chất lượng cho nam giới',
                'description' => 'Thương hiệu thời trang ứng dụng công nghệ may mặc tiên tiến, mang lại sự thoáng khí và thoải mái tối đa.',
                'story' => 'Khởi đầu từ năm 2019 với mong muốn đem đến giải pháp trang phục tối giản, chất lượng cao với mức giá hợp lý nhất cho phái mạnh.',
                'website_url' => 'https://coolmate.me',
                'is_featured' => true,
                'is_active' => true,
            ]
        );

        // Showcases cho Coolmate
        BrandShowcase::updateOrCreate(
            ['brand_id' => $coolmate->id, 'title' => 'BST Thoáng Khí Hè 2026 - Cool Air Max'],
            [
                'subtitle' => 'Chất liệu sợi Microfiber siêu nhẹ khử mùi công nghệ Quick-Dry',
                'media_type' => 'lookbook',
                'media_url' => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80',
                'action_url' => '/brands/coolmate/collections/cool-air',
                'action_text' => 'Khám phá Bộ sưu tập',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        BrandShowcase::updateOrCreate(
            ['brand_id' => $coolmate->id, 'title' => 'Lookbook: Minimalist Daily Wear'],
            [
                'subtitle' => 'Phong cách tối giản thanh lịch cho tuần làm việc năng động',
                'media_type' => 'banner',
                'media_url' => 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1200&auto=format&fit=crop&q=80',
                'action_url' => '/brands/coolmate/lookbook',
                'action_text' => 'Xem Lookbook',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        $dirtyCoins = Brand::updateOrCreate(
            ['slug' => 'dirty-coins'],
            [
                'name' => 'DirtyCoins',
                'logo' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&auto=format&fit=crop&q=80',
                'banner' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&auto=format&fit=crop&q=80',
                'tagline' => 'Biểu tượng thời trang đường phố Streetwear dẫn đầu xu hướng',
                'description' => 'DirtyCoins đại diện cho cá tính mạnh mẽ, phá cách và lối sống tự do phóng khoáng của giới trẻ.',
                'story' => 'Thành lập từ 2017, DirtyCoins không ngừng sáng tạo các thiết kế mang đậm tính nghệ thuật underground và văn hoá Hip-hop.',
                'website_url' => 'https://dirtycoins.vn',
                'is_featured' => true,
                'is_active' => true,
            ]
        );

        // Showcases cho DirtyCoins
        BrandShowcase::updateOrCreate(
            ['brand_id' => $dirtyCoins->id, 'title' => 'Rebel Underground Season 5'],
            [
                'subtitle' => 'Bộ sưu tập Oversized Hoodie & Graphic Tees phong cách cyberpunk',
                'media_type' => 'lookbook',
                'media_url' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
                'action_url' => '/brands/dirty-coins/collections/rebel',
                'action_text' => 'Chiêm ngưỡng BST',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        $levents = Brand::updateOrCreate(
            ['slug' => 'levents'],
            [
                'name' => 'Levents',
                'logo' => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop&q=80',
                'banner' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
                'tagline' => 'Thời trang cao cấp dành cho thế hệ trẻ Gen Z',
                'description' => 'Định hình phong cách trẻ trung với chất liệu vải độc quyền LVT Fabric mềm mịn, chống co giãn.',
                'story' => 'Levents hướng đến sự hoàn hảo trong từng đường kim mũi chỉ và trải nghiệm mở hộp đóng gói sang trọng.',
                'website_url' => 'https://levents.asia',
                'is_featured' => true,
                'is_active' => true,
            ]
        );

        // Showcases cho Levents
        BrandShowcase::updateOrCreate(
            ['brand_id' => $levents->id, 'title' => 'Levents Signature Pop Color 2026'],
            [
                'subtitle' => 'Sự kết hợp các gam màu pastel tươi trẻ và form dáng Raglan hiện đại',
                'media_type' => 'banner',
                'media_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80',
                'action_url' => '/brands/levents/showcase',
                'action_text' => 'Xem Bộ Sưu Tập',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        // ==========================================
        // 2. SEED CATEGORIES
        // ==========================================
        $catAo = Category::updateOrCreate(
            ['slug' => 'ao'],
            ['name' => 'Áo Nam & Nữ', 'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 'sort_order' => 1]
        );

        $catAoThun = Category::updateOrCreate(
            ['slug' => 'ao-thun'],
            ['name' => 'Áo Thun T-Shirt', 'parent_id' => $catAo->id, 'sort_order' => 1]
        );

        $catAoSomi = Category::updateOrCreate(
            ['slug' => 'ao-so-mi'],
            ['name' => 'Áo Sơ Mi', 'parent_id' => $catAo->id, 'sort_order' => 2]
        );

        $catAoHoodie = Category::updateOrCreate(
            ['slug' => 'ao-hoodie-sweater'],
            ['name' => 'Áo Hoodie & Sweater', 'parent_id' => $catAo->id, 'sort_order' => 3]
        );

        $catAoPolo = Category::updateOrCreate(
            ['slug' => 'ao-polo'],
            ['name' => 'Áo Polo', 'parent_id' => $catAo->id, 'sort_order' => 4]
        );

        $catQuan = Category::updateOrCreate(
            ['slug' => 'quan'],
            ['name' => 'Quần', 'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'sort_order' => 2]
        );

        $catQuanJean = Category::updateOrCreate(
            ['slug' => 'quan-jean'],
            ['name' => 'Quần Jean Denim', 'parent_id' => $catQuan->id, 'sort_order' => 1]
        );

        $catQuanKaki = Category::updateOrCreate(
            ['slug' => 'quan-kaki-short'],
            ['name' => 'Quần Short & Kaki', 'parent_id' => $catQuan->id, 'sort_order' => 2]
        );

        // ==========================================
        // 3. SEED PRODUCTS & VARIANTS
        // ==========================================

        // Sản phẩm 1: Áo Thun Coolmate Cotton Compact
        $p1 = Product::updateOrCreate(
            ['slug' => 'ao-thun-coolmate-cotton-compact'],
            [
                'brand_id' => $coolmate->id,
                'category_id' => $catAoThun->id,
                'name' => 'Áo Thun Nam Cotton Compact Premium',
                'sku_prefix' => 'CM-TSHIRT',
                'gender' => 'men',
                'material' => '100% Cotton Compact chống xù lông',
                'care_instructions' => 'Giặt máy ở nhiệt độ thường, không dùng thuốc tẩy mạnh, ủi ở nhiệt độ trung bình.',
                'short_description' => 'Dòng áo thun cơ bản mềm mịn, thoáng mát, thấm hút mồ hôi vượt trội.',
                'description' => 'Áo thun Coolmate Cotton Compact sử dụng sợi bông dài cao cấp giúp áo đanh mịn, không nhăn và giữ form chuẩn sau nhiều lần giặt.',
                'base_price' => 249000,
                'sale_price' => 199000,
                'is_featured' => true,
                'is_active' => true,
            ]
        );

        // Biến thể cho P1: Màu Đen (S, M, L, XL) & Màu Trắng (S, M, L, XL)
        $colorsP1 = [
            ['name' => 'Đen', 'code' => '#000000', 'img' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
            ['name' => 'Trắng', 'code' => '#FFFFFF', 'img' => 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'],
            ['name' => 'Xanh Navy', 'code' => '#001f3f', 'img' => 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
        ];
        $sizesP1 = ['S', 'M', 'L', 'XL'];

        foreach ($colorsP1 as $c) {
            foreach ($sizesP1 as $s) {
                ProductVariant::updateOrCreate(
                    ['product_id' => $p1->id, 'sku' => "CM-TSHIRT-{$c['name']}-{$s}"],
                    [
                        'color_name' => $c['name'],
                        'color_code' => $c['code'],
                        'size' => $s,
                        'price' => 199000,
                        'compare_at_price' => 249000,
                        'stock_quantity' => rand(15, 60),
                        'weight_grams' => 220,
                        'image_url' => $c['img'],
                        'is_active' => true,
                    ]
                );
            }
        }

        // Ảnh chi tiết P1
        ProductImage::updateOrCreate(
            ['product_id' => $p1->id, 'image_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000'],
            ['alt_text' => 'Áo thun Cotton Compact mặt trước', 'is_thumbnail' => true, 'sort_order' => 1]
        );
        ProductImage::updateOrCreate(
            ['product_id' => $p1->id, 'image_url' => 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000'],
            ['alt_text' => 'Áo thun Cotton Compact màu trắng', 'is_thumbnail' => false, 'sort_order' => 2]
        );

        // Sản phẩm 2: Áo Hoodie DirtyCoins Cyberpunk Graphic
        $p2 = Product::updateOrCreate(
            ['slug' => 'ao-hoodie-dirtycoins-cyberpunk'],
            [
                'brand_id' => $dirtyCoins->id,
                'category_id' => $catAoHoodie->id,
                'name' => 'Áo Hoodie DirtyCoins Cyber Graphic Oversize',
                'sku_prefix' => 'DC-HOODIE',
                'gender' => 'unisex',
                'material' => 'Nỉ chân cua định lượng 380gsm dày dặn',
                'care_instructions' => 'Giặt mặt trái, tránh ủi trực tiếp lên hình in.',
                'short_description' => 'Áo hoodie phom rộng đường phố in họa tiết dạ quang nghệ thuật.',
                'description' => 'Chiếc hoodie biểu tượng của DirtyCoins với chất nỉ chân cua cao cấp, mũ 2 lớp đứng form và hình in kéo lụa sắc nét.',
                'base_price' => 650000,
                'sale_price' => 550000,
                'is_featured' => true,
                'is_active' => true,
            ]
        );

        $colorsP2 = [
            ['name' => 'Đen Xám Khói', 'code' => '#1a1a1a', 'img' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800'],
            ['name' => 'Xanh Rêu Pastel', 'code' => '#4a5d4e', 'img' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
        ];
        $sizesP2 = ['M', 'L', 'XL'];

        foreach ($colorsP2 as $c) {
            foreach ($sizesP2 as $s) {
                ProductVariant::updateOrCreate(
                    ['product_id' => $p2->id, 'sku' => "DC-HOODIE-{$c['name']}-{$s}"],
                    [
                        'color_name' => $c['name'],
                        'color_code' => $c['code'],
                        'size' => $s,
                        'price' => 550000,
                        'compare_at_price' => 650000,
                        'stock_quantity' => rand(10, 40),
                        'weight_grams' => 600,
                        'image_url' => $c['img'],
                        'is_active' => true,
                    ]
                );
            }
        }

        // Sản phẩm 3: Áo Sơ Mi Levents Oxford Classic
        $p3 = Product::updateOrCreate(
            ['slug' => 'ao-so-mi-levents-oxford-classic'],
            [
                'brand_id' => $levents->id,
                'category_id' => $catAoSomi->id,
                'name' => 'Áo Sơ Mi Levents Oxford Long Sleeve',
                'sku_prefix' => 'LV-SHIRT',
                'gender' => 'unisex',
                'material' => 'Cotton Oxford dệt hạt nổi thoáng khí',
                'care_instructions' => 'Giặt nhẹ, phơi móc tránh gấp nếp.',
                'short_description' => 'Áo sơ mi basic trẻ trung, dễ phối đồ cả đi học lẫn đi chơi.',
                'description' => 'Thiết kế sơ mi tay dài form Regular trẻ trung từ Levents với tag logo thêu ngực tinh tế.',
                'base_price' => 450000,
                'sale_price' => null,
                'is_featured' => true,
                'is_active' => true,
            ]
        );

        $colorsP3 = [
            ['name' => 'Xanh Baby Blue', 'code' => '#89CFF0', 'img' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
            ['name' => 'Trắng Sữa', 'code' => '#F8F9FA', 'img' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
        ];
        $sizesP3 = ['S', 'M', 'L', 'XL'];

        foreach ($colorsP3 as $c) {
            foreach ($sizesP3 as $s) {
                ProductVariant::updateOrCreate(
                    ['product_id' => $p3->id, 'sku' => "LV-SHIRT-{$c['name']}-{$s}"],
                    [
                        'color_name' => $c['name'],
                        'color_code' => $c['code'],
                        'size' => $s,
                        'price' => 450000,
                        'compare_at_price' => null,
                        'stock_quantity' => rand(20, 50),
                        'weight_grams' => 300,
                        'image_url' => $c['img'],
                        'is_active' => true,
                    ]
                );
            }
        }

        // Sản phẩm 4: Quần Jean Slimfit Coolmate Denim
        $p4 = Product::updateOrCreate(
            ['slug' => 'quan-jean-nam-coolmate-denim-co-gian'],
            [
                'brand_id' => $coolmate->id,
                'category_id' => $catQuanJean->id,
                'name' => 'Quần Jean Nam Denim Co Giãn Thoải Mái',
                'sku_prefix' => 'CM-JEAN',
                'gender' => 'men',
                'material' => '98% Cotton + 2% Spandex co giãn',
                'care_instructions' => 'Giặt riêng trong 2 lần giặt đầu.',
                'short_description' => 'Quần jean form slim fit tôn dáng, co giãn 4 chiều.',
                'description' => 'Quần jean Coolmate ứng dụng công nghệ giặt wash sinh học thân thiện môi trường.',
                'base_price' => 499000,
                'sale_price' => 399000,
                'is_featured' => true,
                'is_active' => true,
            ]
        );

        $colorsP4 = [
            ['name' => 'Xanh Rách Nhẹ', 'code' => '#2b3e50', 'img' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
            ['name' => 'Đen Chàm', 'code' => '#181818', 'img' => 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'],
        ];
        $sizesP4 = ['29', '30', '31', '32', '34'];

        foreach ($colorsP4 as $c) {
            foreach ($sizesP4 as $s) {
                ProductVariant::updateOrCreate(
                    ['product_id' => $p4->id, 'sku' => "CM-JEAN-{$c['name']}-{$s}"],
                    [
                        'color_name' => $c['name'],
                        'color_code' => $c['code'],
                        'size' => $s,
                        'price' => 399000,
                        'compare_at_price' => 499000,
                        'stock_quantity' => rand(15, 45),
                        'weight_grams' => 550,
                        'image_url' => $c['img'],
                        'is_active' => true,
                    ]
                );
            }
        }

        // ==========================================
        // 4. SEED SAMPLE USER SAVED PRODUCTS & FOLLOWS
        // ==========================================
        $customer = User::where('email', 'user@example.com')->first();
        if ($customer) {
            // Khách lưu sản phẩm p1, p2
            $customer->savedProducts()->syncWithoutDetaching([$p1->id, $p2->id]);

            // Khách theo dõi brand Coolmate và DirtyCoins
            $customer->followedBrands()->syncWithoutDetaching([$coolmate->id, $dirtyCoins->id]);
        }

        $this->command->info('Clothing e-commerce database seeded successfully with Brands, Showcases, Categories, Products, and Variants!');
    }
}
