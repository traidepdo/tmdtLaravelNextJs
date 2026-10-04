import Link from "next/link";
import { getCurrentUser, hasRole } from "@/lib/auth-server";
import LogoutButton from "@/components/LogoutButton";
import {
  ShieldCheck,
  ShoppingBag,
  LayoutDashboard,
  Lock,
} from "lucide-react";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-400 hover:text-indigo-300 transition">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
              <span>TMDT SSR Portal</span>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Trang chủ
              </Link>

              {user && (
                <>
                  {(await hasRole(user, "customer")) && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard Khách
                    </Link>
                  )}

                  {((await hasRole(user, "staff")) || (await hasRole(user, "admin"))) && (
                    <Link
                      href="/staff/orders"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-emerald-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      Đơn hàng (Staff)
                    </Link>
                  )}

                  {(await hasRole(user, "admin")) && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-rose-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Lock className="w-4 h-4 text-rose-400" />
                      Quản trị (Admin)
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-100">{user.name}</span>
                  <div className="flex gap-1 justify-end">
                    {user.roles?.map((role) => (
                      <span
                        key={role}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          role === "admin"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : role === "staff"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
                >
                  Khách hàng
                </Link>
                <Link
                  href="/staff/login"
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition"
                >
                  Cổng Staff
                </Link>
                <Link
                  href="/admin/login"
                  className="px-3 py-1.5 text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg transition"
                >
                  Cổng Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
