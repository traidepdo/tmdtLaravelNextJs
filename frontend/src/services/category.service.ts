import { http } from "@/lib/http";
import { Category } from "@/types/product";

export interface CategoryQueryParams {
    per_page?: number;
    page?: number;
}

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const res = await http.get<{ data: any }>("/categories", undefined, { next: { revalidate: 600 } });
            const result = res.data;
            if (Array.isArray(result)) return result;
            if (Array.isArray(result?.data)) return result.data;
            return [];
        } catch (error) {
            console.error("Get categories failed", error);
            return [];
        }
    }
};