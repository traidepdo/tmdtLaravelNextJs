import { http } from "@/lib/http";
import { Product } from "@/types/product";

export interface ProductQueryParams {
    per_page?: number;
    page?: number;
    category?: string;
    featured?: number;
}

export const productService = {
    async getProducts(params?: ProductQueryParams, token?: string): Promise<Product[]> {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const res = await http.get<{ data: any }>("/products", params, { 
                headers, 
                cache: "no-store" 
            });
            const result = res.data;
            if (Array.isArray(result)) return result;
            if (Array.isArray(result?.data)) return result.data;
            return [];
        } catch (error) {
            console.error("Get products failed", error);
            return [];
        }
    },

    async getProductBySlug(slug: string, token?: string): Promise<Product | null> {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const res = await http.get<{ data: Product }>(`/products/${slug}`, undefined, { 
                headers, 
                cache: "no-store" 
            });
            return res.data || null;
        } catch {
            return null;
        }
    },

    async getTopProducts(limit: number = 5): Promise<Product[]> {
        try {
            const res = await http.get<{ data: Product[] }>("/products/top", { limit }, { cache: "no-store" });
            const result = res.data;
            if (Array.isArray(result)) return result;
            return [];
        } catch (error) {
            console.error("Get top products failed", error);
            return [];
        }
    },
};
