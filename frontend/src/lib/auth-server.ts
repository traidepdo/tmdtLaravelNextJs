"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User, AuthResponse } from "@/types/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Lấy Bearer Token từ httpOnly cookie trên server (SSR / Server Component / Server Action)
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token || null;
}

/**
 * Lấy thông tin user hiện tại từ Server Component (SSR)
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Không cache để đảm bảo tính real-time của session
    });

    if (!res.ok) {
      // Xoá cookie cũ/hết hạn để tránh vòng lặp redirect
      cookieStore.delete("auth_token");
      cookieStore.delete("user_data");
      return null;
    }

    const result = await res.json();
    return (result.data || result.user || result) as User;
  } catch (error) {
    console.error("Error fetching current user on server:", error);
    return null;
  }
}

/**
 * Server Action: Đăng nhập
 */
export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const portal = (formData.get("portal") as string) || "customer";

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password, portal }),
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        error:
          result.message ||
          (result.errors
            ? Object.values(result.errors).flat().join(", ")
            : "Đăng nhập thất bại."),
      };
    }

    const authData = (result.data || result) as AuthResponse;
    const cookieStore = await cookies();

    // Lưu httpOnly cookies an toàn tuyệt đối
    cookieStore.set("auth_token", authData.token, COOKIE_OPTIONS);
    cookieStore.set("user_data", JSON.stringify(authData.user), {
      ...COOKIE_OPTIONS,
      httpOnly: false, // Để middleware Next.js đọc nhanh role
    });
  } catch (err: any) {
    return { error: err.message || "Lỗi kết nối máy chủ." };
  }

  // Chuyển hướng theo từng portal sau khi đăng nhập thành công
  if (portal === "admin") {
    redirect("/admin");
  } else if (portal === "staff") {
    redirect("/staff/orders");
  } else {
    redirect("/dashboard/user");
  }
}

/**
 * Server Action: Đăng ký (chỉ áp dụng cho Khách hàng)
 */
export async function registerAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        error:
          result.message ||
          (result.errors
            ? Object.values(result.errors).flat().join(", ")
            : "Đăng ký thất bại."),
      };
    }

    const authData = (result.data || result) as AuthResponse;
    const cookieStore = await cookies();

    cookieStore.set("auth_token", authData.token, COOKIE_OPTIONS);
    cookieStore.set("user_data", JSON.stringify(authData.user), {
      ...COOKIE_OPTIONS,
      httpOnly: false,
    });
  } catch (err: any) {
    return { error: err.message || "Lỗi kết nối máy chủ." };
  }

  redirect("/dashboard/user");
}

/**
 * Server Action: Đăng xuất
 */
export async function logoutAction(): Promise<void> {
  const token = await getServerToken();
  try {
    if (token) {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error("Logout API error:", err);
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
    redirect("/");
  }
}

/**
 * Kiểm tra role của user
 */
export async function hasRole(
  user: User | null,
  roles: string | string[]
): Promise<boolean> {
  if (!user || !user.roles) return false;
  const roleList = Array.isArray(roles) ? roles : [roles];
  return roleList.some((role) => user.roles.includes(role));
}

/**
 * Kiểm tra permission của user
 */
export async function hasPermission(
  user: User | null,
  permissions: string | string[]
): Promise<boolean> {
  if (!user || !user.permissions) return false;
  const permList = Array.isArray(permissions) ? permissions : [permissions];
  return permList.some((perm) => user.permissions.includes(perm));
}
