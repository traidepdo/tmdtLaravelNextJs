import { redirect } from "next/navigation";
import { getCurrentUser, getServerToken } from "@/lib/auth-server";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const token = await getServerToken();

  if (!user || !token) {
    redirect("/login");
  }

  // Khách hàng / user mặc định vào trang hồ sơ cá nhân /dashboard/user
  redirect("/dashboard/user");
}

