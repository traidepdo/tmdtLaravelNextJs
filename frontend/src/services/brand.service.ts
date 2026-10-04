import { http } from "@/lib/http";
import { Brand } from "@/types/product";

export interface BrandQueryParams {
    featured?: number;
    per_page?: number;
    page?: number;
}

export const brandService = {
    async getBrands(params?: BrandQueryParams): Promise<Brand[]> {
        try {
            const res = await http.get<{ data: any }>("/brands", params, { cache: "no-store" });
            const result = res.data;
            if (Array.isArray(result)) return result;
            if (Array.isArray(result?.data)) return result.data;
            return [];
        } catch (error) {
            console.error("Get brands failed", error);
            return [];
        }
    }
};