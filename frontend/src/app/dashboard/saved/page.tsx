import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserSidebar from "@/components/UserSidebar";
import UserLikesSection from "./UserLikesSection";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-server";
import { Like } from "@/services/like.service";
export default async function UserSavedProductsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const [user, likedProducts] = await Promise.all([
    getCurrentUser(),
    Like.getLike(token),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <UserSidebar
            user={{
              name: user.name,
              email: user.email,
              roles: user.roles,
              avatar: user.profile?.avatar,
            }}
          />

          {/* Main Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard/user"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Hồ sơ cá nhân</span>
              </Link>

              <span className="text-xs font-semibold px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500/40" />
                <span>Yêu thích</span>
              </span>
            </div>

            {/* Banner Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                    <span>Sản phẩm yêu thích</span>
                    <span className="text-sm px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                      {likedProducts.length}
                    </span>
                  </h1>
                  <p className="text-sm text-slate-400">
                    Bộ sưu tập các mẫu trang phục bạn đã lưu và quan tâm tại NEXSTORE
                  </p>
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Khám phá thêm</span>
                </Link>
              </div>
            </div>

            {/* Likes List & Client Filtering Component */}
            <UserLikesSection initialProducts={likedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
