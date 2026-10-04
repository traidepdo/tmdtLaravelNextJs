"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/types/product";
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Sparkles,
  Layers,
  Info,
} from "lucide-react";
import { toggleLikeAction } from "@/actions/like";

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images?.[0]?.image_url || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.[0]?.size || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants?.[0]?.color_name || ""
  );
  const [isSaved, setIsSaved] = useState<boolean>(product.is_saved || false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Nhóm các màu duy nhất
  const availableColors = Array.from(
    new Map(
      (product.variants || []).map((v) => [
        v.color_name,
        { name: v.color_name, code: v.color_code, image_url: v.image_url },
      ])
    ).values()
  );

  // Lấy các size duy nhất
  const availableSizes = Array.from(
    new Set((product.variants || []).map((v) => v.size))
  );

  // Tìm variant đang chọn
  const currentVariant = product.variants?.find(
    (v) =>
      (!selectedColor || v.color_name === selectedColor) &&
      (!selectedSize || v.size === selectedSize)
  );

  const displayPrice =
    currentVariant?.sale_price ||
    currentVariant?.price ||
    product.sale_price ||
    product.base_price;

  const originalPrice =
    currentVariant?.price || product.base_price;

  const hasDiscount =
    (currentVariant?.sale_price && currentVariant.sale_price < currentVariant.price) ||
    (product.sale_price && product.sale_price < product.base_price);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      const res = await toggleLikeAction(product.id);
      if (res.success && typeof res.is_saved === "boolean") {
        setIsSaved(res.is_saved);
      } else if (!res.success && res.message) {
        alert(res.message);
      }
    } catch (e) {
      console.error("Wishlist error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      {/* 1. PRODUCT IMAGES GALLERY (Cột Trái) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
              <ShoppingBag className="w-16 h-16 mb-2" />
              <span>Chưa có ảnh</span>
            </div>
          )}

          {hasDiscount && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-lg shadow-pink-600/30">
              SALE ƯU ĐÃI
            </span>
          )}

          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition shadow-lg ${
              isSaved
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                : "bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-pink-400 border border-slate-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-pink-500" : ""}`} />
          </button>
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.image_url)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition ${
                  selectedImage === img.image_url
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFO & BUY ACTIONS (Cột Phải) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Brand & Category */}
        <div className="space-y-2">
          {product.brand && (
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-400">
              {product.brand.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {product.name}
          </h1>
          <p className="text-xs font-mono text-slate-500">
            SKU: {currentVariant?.sku || product.sku_prefix || "N/A"}
          </p>
        </div>

        {/* Pricing */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-baseline gap-3">
          <span className="text-3xl font-black text-white">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-base text-slate-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-sm text-slate-300 leading-relaxed">
            {product.short_description}
          </p>
        )}

        {/* Color Options */}
        {availableColors.length > 0 && (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Màu sắc: <span className="text-white font-semibold">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    if (color.image_url) setSelectedImage(color.image_url);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                    selectedColor === color.name
                      ? "bg-indigo-600/20 border-indigo-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: color.code || "#333" }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Options */}
        {availableSizes.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kích thước: <span className="text-white font-semibold">{selectedSize}</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl text-sm font-bold border transition flex items-center justify-center ${
                    selectedSize === size
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Buy Button */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 text-slate-400 hover:text-white transition"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-bold text-white min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 py-2 text-slate-400 hover:text-white transition"
              >
                +
              </button>
            </div>

            <button
              onClick={() => alert(`Đã thêm ${quantity} sản phẩm (${product.name}) vào giỏ hàng!`)}
              className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShoppingBag className="w-5 h-5" />
              Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>

        {/* Product Trust Features */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
          <div className="space-y-1">
            <ShieldCheck className="w-5 h-5 text-indigo-400 mx-auto" />
            <p className="text-[11px] font-semibold text-white">Chính Hãng</p>
            <p className="text-[10px] text-slate-400">100% auth</p>
          </div>
          <div className="space-y-1">
            <Truck className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="text-[11px] font-semibold text-white">Giao Hỏa Tốc</p>
            <p className="text-[10px] text-slate-400">2-3 ngày</p>
          </div>
          <div className="space-y-1">
            <RotateCcw className="w-5 h-5 text-pink-400 mx-auto" />
            <p className="text-[11px] font-semibold text-white">Đổi Trả</p>
            <p className="text-[10px] text-slate-400">30 ngày miễn phí</p>
          </div>
        </div>

        {/* Detailed Material & Description */}
        {product.description && (
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-400" /> Mô Tả Chi Tiết
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
