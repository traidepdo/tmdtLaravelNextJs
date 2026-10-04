const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

type CustomOptions = Omit<RequestInit, "body"> & {
    baseUrl?: string;
    params?: Record<string, any>;
    body?: any;
};

export const http = {
    async request<T>(endpoint: string, options?: CustomOptions): Promise<T> {
        const { baseUrl = API_BASE, params, body, ...customOptions } = options || {};

        // 1. Xử lý query params tự động và sạch sẽ
        let queryString = "";
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            });
            const str = searchParams.toString();
            if (str) queryString = `?${str}`;
        }

        const fullUrl = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}${queryString}`;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(customOptions?.headers as any),
        };

        const res = await fetch(fullUrl, {
            ...customOptions,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            // Có thể throw Custom Error hoặc xử lý refresh token tại đây
            throw new Error(`HTTP Error: ${res.statusText}`);
        }

        return res.json();
    },

    get<T>(url: string, params?: Record<string, any>, options?: CustomOptions) {
        return this.request<T>(url, { ...options, method: "GET", params });
    },

    post<T>(url: string, body?: any, options?: CustomOptions) {
        return this.request<T>(url, { ...options, method: "POST", body });
    },

    put<T>(url: string, body?: any, options?: CustomOptions) {
        return this.request<T>(url, { ...options, method: "PUT", body });
    },

    delete<T>(url: string, options?: CustomOptions) {
        return this.request<T>(url, { ...options, method: "DELETE" });
    },
};
