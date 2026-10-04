"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Search, SlidersHorizontal, Tag, Sparkles } from "lucide-react";

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  sale_price?: number | null;
  count_buy?: number;
  brand?: {
    name: string;
    slug: string;
  } | null;
  category?: {
    name: string;
    slug: string;
  } | null;
  images?: {
    image_url: string;
    alt_text?: string;
  }[];
}

interface UserLikesSectionProps {
  initialProducts: ProductItem[];
}

export default function UserLikesSection({ initialProducts }: UserLikesSectionProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [isLoading, setIsLoading] = useState(false);

  // Client filter/search realtime
  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchBrand = p.brand?.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = p.category?.name.toLowerCase().includes(search.toLowerCase());
    return matchName || matchBrand || matchCat;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Heart className="w-5 h-5 fill-rose-500/30" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Sản phẩm đã thích
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                {products.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Danh sách các mẫu trang phục bạn đã lưu / yêu thích</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Lọc nhanh tên, thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Grid of liked products */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/30">
          <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto mb-3 text-slate-500">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">
            {search ? "Không tìm thấy sản phẩm phù hợp" : "Chưa có sản phẩm yêu thích nào"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search
              ? "Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc."
              : "Khám phá các bộ sưu tập thời trang và nhấn biểu tượng Trái tim để lưu sản phẩm bạn thích tại đây."}
          </p>
          {!search && (
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Khám phá sản phẩm ngay</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((item) => {
            const thumbnail =
              item.images?.[0]?.image_url ||
              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80";

            return (
              <div
                key={item.id}
                className="group relative rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 p-3 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 mb-3">
                    <img
                      src={thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="p-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-rose-400 inline-flex shadow-sm">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      </span>
                    </div>

                    {item.brand && (
                      <div className="absolute bottom-2 left-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/20">
                          {item.brand.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Category */}
                  <div className="space-y-1">
                    {item.category && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {item.category.name}
                      </span>
                    )}
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-sm text-slate-200 hover:text-indigo-400 transition line-clamp-1"
                    >
                      {item.name}
                    </Link>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-indigo-400">
                      {(item.sale_price || item.base_price).toLocaleString("vi-VN")} đ
                    </div>
                    {item.sale_price && (
                      <div className="text-[11px] text-slate-500 line-through">
                        {item.base_price.toLocaleString("vi-VN")} đ
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/products/${item.slug}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition flex items-center gap-1.5"
                  >
                    <span>Xem</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
