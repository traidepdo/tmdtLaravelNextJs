"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Heart, ShoppingBag } from "lucide-react";
import { toggleLikeAction } from "@/actions/like";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState<boolean>(product.is_saved || false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;

    setIsSaving(true);
    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!previousState);

    try {
      const res = await toggleLikeAction(product.id);
      if (res.success && typeof res.is_saved === "boolean") {
        setIsSaved(res.is_saved);
      } else {
        setIsSaved(previousState);
        if (res.message) alert(res.message);
      }
    } catch (err) {
      setIsSaved(previousState);
      console.error("Toggle like error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const hasDiscount = product.sale_price && product.sale_price < product.base_price;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 shadow-sm">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {product.images?.[0]?.image_url ? (
            <img
              src={product.images[0].image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-12 h-12" />
            </div>
          )}
        </Link>

        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold pointer-events-none shadow-sm">
            SALE
          </span>
        )}

        <button
          onClick={handleToggleLike}
          disabled={isSaving}
          aria-label="Lưu sản phẩm"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-sm z-10 ${
            isSaved
              ? "bg-rose-50 text-rose-500 border border-rose-200"
              : "bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 border border-slate-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      <Link href={`/products/${product.slug}`} className="p-4 space-y-2 block">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-indigo-600 uppercase tracking-wider">
            {product.brand?.name || "Chính hãng"}
          </span>
          {product.gender && (
            <span className="text-slate-400 uppercase font-mono">{product.gender}</span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-slate-900">
            {formatPrice(product.sale_price ?? product.base_price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
