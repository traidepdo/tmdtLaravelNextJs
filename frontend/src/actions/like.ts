"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export interface ToggleLikeResponse {
  success: boolean;
  is_saved?: boolean;
  saved_count?: number;
  message?: string;
}

export async function toggleLikeAction(productId: number): Promise<ToggleLikeResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      message: "Vui lòng đăng nhập để lưu sản phẩm yêu thích!",
    };
  }

  try {
    const res = await fetch(`${API_BASE}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: productId,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Không thể thực hiện thao tác.",
      };
    }

    const data = json.data || json;

    revalidatePath("/dashboard/saved");
    revalidatePath("/");
    revalidatePath("/products");

    return {
      success: true,
      is_saved: data.is_saved,
      saved_count: data.saved_count,
      message: data.message,
    };
  } catch (error: any) {
    console.error("Error toggle like:", error);
    return {
      success: false,
      message: error.message || "Lỗi kết nối máy chủ.",
    };
  }
}
