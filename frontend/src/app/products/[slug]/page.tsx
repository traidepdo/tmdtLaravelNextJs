import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import ProductDetailClient from "@/app/products/[slug]/ProductDetailClient";
import { ChevronRight, ArrowLeft } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    return (result.data?.product || result.data || result) as Product;
  } catch (err) {
    console.error("Error fetching product detail:", err);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
        <Link href="/" className="hover:text-white transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        {product.category && (
          <>
            <Link
              href={`/#category-${product.category.slug}`}
              className="hover:text-white transition"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </>
        )}
        <span className="text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Interactive Product Detail */}
      <ProductDetailClient product={product} />
    </div>
  );
}
