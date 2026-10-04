"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export interface UpdateProfileState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function updateProfileAction(
  prevState: UpdateProfileState | null,
  formData: FormData
): Promise<UpdateProfileState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      message: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.",
    };
  }

  const payload: Record<string, any> = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone_number: formData.get("phone_number") || null,
    gender: formData.get("gender") || null,
    birthday: formData.get("birthday") || null,
    address: formData.get("address") || null,
    ward: formData.get("ward") || null,
    district: formData.get("district") || null,
    city: formData.get("city") || null,
    bio: formData.get("bio") || null,
    avatar: formData.get("avatar") || null,
  };

  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Cập nhật hồ sơ thất bại.",
        errors: result.errors || {},
      };
    }

    // Cập nhật lại cookie user_data nếu có
    const updatedUser = result.data || result;
    if (updatedUser) {
      const existingUserData = cookieStore.get("user_data")?.value;
      let existing = {};
      if (existingUserData) {
        try {
          existing = JSON.parse(decodeURIComponent(existingUserData));
        } catch {}
      }

      cookieStore.set(
        "user_data",
        JSON.stringify({
          ...existing,
          name: updatedUser.name,
          email: updatedUser.email,
        }),
        {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }
      );
    }

    revalidatePath("/dashboard/user");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: result.message || "Cập nhật hồ sơ thành công!",
    };
  } catch (error: any) {
    console.error("Error update profile:", error);
    return {
      success: false,
      message: error.message || "Đã xảy ra lỗi kết nối với máy chủ.",
    };
  }
}
