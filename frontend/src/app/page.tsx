import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth-server";
import { Product, Brand, Category } from "@/types/product";
import { productService } from "@/services/product.service";
import { brandService } from "@/services/brand.service";
import { categoryService } from "@/services/category.service";
import TypewriterText from "@/components/TypewriterText";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ShoppingBag,
  Sparkles,
  Flame,
  ArrowRight,
  Heart,
  Layers,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";

import { cookies } from "next/headers";

async function getHomeData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const [products, featuredProducts, brands, categories] = await Promise.all([
      productService.getProducts({ per_page: 8 }, token),
      productService.getProducts({ featured: 1, per_page: 4 }, token),
      brandService.getBrands({ per_page: 10 }),
      categoryService.getCategories(),
    ]);

    return {
      products,
      featuredProducts,
      brands,
      categories,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      products: [],
      featuredProducts: [],
      brands: [],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const { products, featuredProducts, brands, categories } = await getHomeData();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO BANNER SECTION - BLUE SKY (CENTERED MINIMALIST LUXURY) */}
      <section className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        >
          <source src="/77021-561020328.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-slate-950/50 backdrop-brightness-95" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

        {/* Content Container (Căn giữa trung tâm, thương hiệu BLUE SKY) */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <p className="text-xs sm:text-sm tracking-[0.35em] text-sky-300/90 uppercase font-light">
            Blue Sky Luxury Fashion
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white leading-tight">
            BLUE SKY <br />
            <span className="font-semibold">
              <TypewriterText
                words={[
                  "Đẳng Cấp & Tinh Tế",
                  "Thời Thượng & Độc Bản",
                  "Phong Cách Hiện Đại",
                ]}
                className="bg-gradient-to-r from-sky-200 via-white to-sky-400 bg-clip-text text-transparent"
              />
            </span>
          </h1>

          {/* <p className="text-slate-200 text-sm sm:text-base font-light tracking-wide max-w-lg mx-auto drop-shadow-sm">
            Nơi hội tụ những thiết kế thời trang vượt thời gian dành cho bạn.
          </p> */}

          <div className="pt-4 flex justify-center">
            <Link
              href="#products-section"
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 border border-white/30 backdrop-blur-md text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 shadow-xl shadow-sky-950/30"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER SHOWCASE: ÁO SƠ MI */}


      {/* 2. CATEGORIES SECTION */}
      {categories.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Khám Phá Thời Trang</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Danh Mục Nổi Bật
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Lựa chọn trang phục theo sở thích và phong cách riêng của bạn
                </p>
              </div>

              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:gap-2 transition-all self-start sm:self-auto"
              >
                <span>Xem tất cả danh mục</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.slice(0, 4).map((cat) => {
                const categoryImages: Record<string, string> = {
                  "ao-so-mi": "/aosomi.webp",
                  "vay-dam": "/vay1.webp",
                  "dam-nu": "/vay1.webp",
                  "vay-nu": "/vay2.jpg",
                  "ao-thun": "/aosomi.webp",
                };
                const imageUrl = cat.image || categoryImages[cat.slug] || "/aosomi.webp";

                return (
                  <Link
                    key={cat.id}
                    href={`#cat-${cat.slug}`}
                    className="group relative p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 flex items-center gap-4"
                  >
                    {/* Small Avatar Image Box */}
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cat.products_count !== undefined ? `${cat.products_count} sản phẩm` : "Xem ngay"}
                      </p>
                    </div>

                    {/* Small Arrow Icon */}
                    <div className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* 3. FEATURED PRODUCTS (SẢN PHẨM NỔI BẬT) */}
      {featuredProducts.length > 0 && (
        <ScrollReveal direction="up" delay={150}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
                  <Flame className="w-4 h-4" /> Xu hướng hot
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Sản Phẩm Nổi Bật</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* BANNER SHOWCASE: ÁO SƠ MI */}
      <ScrollReveal direction="up" delay={100}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-100 via-white to-sky-50/50 rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm overflow-hidden relative">
            {/* Background subtle glow */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Bên trái: Giới thiệu về Áo Sơ Mi */}
            <div className="lg:col-span-6 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Bộ Sưu Tập Signature</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Áo Sơ Mi Cao Cấp <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-800">
                  Thanh Lịch & Hiện Đại
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Được dệt từ những sợi cotton cao cấp nhập khẩu, mang lại cảm giác mềm mại, thoáng mát và tôn dáng chuẩn mực. Sự lựa chọn hoàn hảo cho phong cách công sở chỉn chu và những buổi gặp gỡ sang trọng.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="block text-xl font-bold text-slate-900">100% Cotton</span>
                  <span className="text-xs text-slate-500">Thoáng khí, chống nhăn tự nhiên</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="block text-xl font-bold text-slate-900">Tailored Fit</span>
                  <span className="text-xs text-slate-500">Phom dáng vừa vặn, tôn vẻ lịch lãm</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/products?category=ao-so-mi"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-indigo-500/20"
                >
                  <span>Khám phá bộ sưu tập sơ mi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Bên phải: Box ảnh Áo Sơ Mi */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full h-[450px] sm:h-[520px] lg:h-[580px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl group bg-slate-100">
                <img
                  src="/aosomi.webp"
                  alt="Bộ sưu tập Áo Sơ Mi Blue Sky"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600">New Arrival</span>
                    <h4 className="text-sm font-bold text-slate-900">BlueSky Premium Shirt Series</h4>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900 text-white rounded-lg">2026 Edition</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* BANNER SHOWCASE: VÁY & ĐẦM THỜI TRANG NỮ */}
      <ScrollReveal direction="up" delay={150}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-gradient-to-bl from-rose-50/60 via-white to-pink-50/40 rounded-3xl border border-rose-100 p-8 sm:p-12 shadow-sm relative overflow-hidden">
            {/* Background subtle glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Bên trái: 2 ảnh váy xếp đè lên nhau nghệ thuật */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
              <div className="absolute left-2 sm:left-6 top-4 w-[60%] sm:w-[58%] h-[340px] sm:h-[400px] rounded-3xl overflow-hidden shadow-xl border-4 border-white transform -rotate-6 hover:-rotate-3 transition-transform duration-500 z-10 bg-slate-100">
                <img
                  src="/vay2.jpg"
                  alt="Đầm Nữ Thời Trang Blue Sky 2"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              <div className="absolute right-2 sm:right-6 bottom-2 w-[62%] sm:w-[60%] h-[360px] sm:h-[430px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20 bg-slate-100">
                <img
                  src="/vay1.webp"
                  alt="Đầm Nữ Thời Trang Blue Sky 1"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 backdrop-blur-md border border-white/60 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Trending Dress</span>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">BlueSky Elegance Dress</p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">Hot</span>
                </div>
              </div>
            </div>

            {/* Bên phải: Giới thiệu về Bộ Sưu Tập Váy Nữ */}
            <div className="lg:col-span-6 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Nữ Tính & Quyến Rũ</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Váy & Đầm Thiết Kế <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600">
                  Tôn Vinh Nét Duyên Phái Đẹp
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Mỗi thiết kế đầm váy tại BlueSky là sự kết hợp tinh tế giữa phom dáng nhẹ nhàng, chất liệu lụa satin mềm mại cùng những đường cắt may tỉ mỉ, giúp nàng tự tin tỏa sáng rạng ngời từ dạo phố đến các buổi tiệc dạ hội.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-rose-100/80 shadow-xs">
                  <span className="block text-xl font-bold text-slate-900">Chất Liệu Lụa</span>
                  <span className="text-xs text-slate-500">Mềm mại, bay bổng & thoáng mát</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-rose-100/80 shadow-xs">
                  <span className="block text-xl font-bold text-slate-900">Phom Dáng Chuẩn</span>
                  <span className="text-xs text-slate-500">Tôn vòng eo và nét đẹp nữ tính</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/products?category=vay-dam"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-rose-500/20"
                >
                  <span>Khám phá bộ sưu tập đầm váy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 4. BRANDS SHOWCASE */}
      {brands.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Đối Tác Chính Hãng</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Các Thương Hiệu Nổi Bật</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {brands.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-500/40 hover:shadow-md flex flex-col items-center justify-center space-y-2 transition"
                  >
                    <span className="text-base font-bold text-slate-800">{b.name}</span>
                    <span className="text-xs text-slate-500">{b.products_count || 0} sản phẩm</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* 5. ALL PRODUCTS CATALOG */}
      <ScrollReveal direction="up" delay={100}>
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-indigo-600" /> Tất Cả Sản Phẩm
              </h2>
              <p className="text-sm text-slate-500 mt-1">Cập nhật những mẫu mới nhất vừa về kho</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Hiện tại chưa có sản phẩm nào trong hệ thống.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}
