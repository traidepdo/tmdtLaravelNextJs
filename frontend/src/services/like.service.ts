const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const Like = {
    async getLike(token: string) {
        const datafetch = await fetch(`${API_BASE}/likes`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store"
        });
        if (!datafetch.ok) {
            // throw new Error("Failed to fetch likes")
            return []
        }
        const json = await datafetch.json();
        const data = json.data || json;
        return Array.isArray(data) ? data : data.data || [];
    }

}