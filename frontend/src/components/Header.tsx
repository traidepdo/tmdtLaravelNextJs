import Link from "next/link";
import { getCurrentUser, hasRole } from "@/lib/auth-server";
import LogoutButton from "@/components/LogoutButton";
import {
  Sparkles,
  ShoppingBag,
  LayoutDashboard,
  ShieldAlert,
  Search,
  User,
  LogIn,
  Layers,
  ChevronDown,
} from "lucide-react";

import { categoryService } from "@/services/category.service";
import { brandService } from "@/services/brand.service";

export default async function Header() {
  const [user, categories, brands] = await Promise.all([
    getCurrentUser(),
    categoryService.getCategories(),
    brandService.getBrands({ per_page: 8 }),
  ]);

  const isCustomer = user ? await hasRole(user, "customer") : false;
  const isStaff = user ? await hasRole(user, "staff") : false;
  const isAdmin = user ? await hasRole(user, "admin") : false;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/40 backdrop-blur-md backdrop-saturate-150 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* 1. Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  BlueSky
                </span>
                <span className="text-[9px] text-indigo-600 font-bold tracking-widest uppercase -mt-0.5">
                  Modern TMDT
                </span>
              </div>
            </Link>

            {/* Public Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Trang chủ
              </Link>

              {/* Brands Dropdown Menu */}
              <div className="relative group/brands py-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 group-hover/brands:text-indigo-600 group-hover/brands:bg-white/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover/brands:text-indigo-600 transition-colors" />
                  <span>Nhãn hàng</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover/brands:text-indigo-600 group-hover/brands:rotate-180 transition-transform duration-300" />
                </button>

                {/* Brands Dropdown Box */}
                <div className="absolute top-full left-0 w-72 pt-1 opacity-0 pointer-events-none translate-y-2 group-hover/brands:opacity-100 group-hover/brands:pointer-events-auto group-hover/brands:translate-y-0 transition-all duration-300 ease-out z-50">
                  <div className="p-3 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/10 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span>Đối tác chính hãng</span>
                      <span className="text-indigo-600">{brands.length} thương hiệu</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {brands.map((b) => (
                        <Link
                          key={b.id}
                          href={`/products?brand=${b.slug}`}
                          className="group/item flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover/item:bg-indigo-600 text-slate-600 group-hover/item:text-white flex items-center justify-center transition-colors font-bold text-[10px]">
                              {b.name.charAt(0)}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 group-hover/item:text-indigo-700 transition-colors">
                              {b.name}
                            </span>
                          </div>

                          {b.products_count !== undefined && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 group-hover/item:bg-indigo-100 text-slate-500 group-hover/item:text-indigo-600 transition-colors">
                              {b.products_count} SP
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href="/brands"
                        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Xem tất cả nhãn hàng</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Dropdown Menu */}
              <div className="relative group/dropdown py-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 group-hover/dropdown:text-indigo-600 group-hover/dropdown:bg-white/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-500 group-hover/dropdown:text-indigo-600 transition-colors" />
                  <span>Danh mục</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover/dropdown:text-indigo-600 group-hover/dropdown:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Box */}
                <div className="absolute top-full left-0 w-72 pt-1 opacity-0 pointer-events-none translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:pointer-events-auto group-hover/dropdown:translate-y-0 transition-all duration-300 ease-out z-50">
                  <div className="p-3 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/10 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span>Bộ sưu tập nổi bật</span>
                      <span className="text-indigo-600">{categories.length} danh mục</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          className="group/item flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover/item:bg-indigo-600 text-slate-600 group-hover/item:text-white flex items-center justify-center transition-colors">
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 group-hover/item:text-indigo-700 transition-colors">
                              {cat.name}
                            </span>
                          </div>

                          {cat.products_count !== undefined && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 group-hover/item:bg-indigo-100 text-slate-500 group-hover/item:text-indigo-600 transition-colors">
                              {cat.products_count}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href="/categories"
                        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Xem tất cả danh mục</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* 2. Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm xl:max-w-md items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              className="w-full pl-10 pr-4 py-1.5 text-xs bg-black/5 hover:bg-black/10 focus:bg-black/5 border border-black/10 focus:border-indigo-500 rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-sm transition-all"
            />
          </div>

          {/* 3. Right: User Actions & Portals */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Portals Links */}
                <div className="flex items-center gap-1.5 pr-2 sm:pr-3 border-r border-slate-200">

                  {(isStaff || isAdmin) && (
                    <Link
                      href="/staff/orders"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
                      title="Quản lý đơn hàng Staff"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Staff</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
                      title="Trang quản trị Admin"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}
                </div>

                {/* User Identity Profile Link */}
                <Link
                  href="/dashboard/user"
                  className="group flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                  title="Hồ sơ cá nhân"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-slate-200 group-hover:scale-105 transition-transform">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {user.roles?.[0] ?? "Member"}
                    </span>
                  </div>
                </Link>

                {/* Logout action */}
                <LogoutButton />
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] rounded-lg transition-all shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Đăng nhập</span>
                </Link>

                <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-white/[0.08]">
                  <Link
                    href="/staff/login"
                    className="px-2.5 py-1.5 text-xs font-medium text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all"
                  >
                    Staff
                  </Link>
                  <Link
                    href="/admin/login"
                    className="px-2.5 py-1.5 text-xs font-medium text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
