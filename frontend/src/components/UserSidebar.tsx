"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react";

interface UserSidebarProps {
  user?: {
    name: string;
    email: string;
    roles?: string[];
    avatar?: string | null;
  };
}

export default function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Tổng quan Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Hồ sơ cá nhân",
      href: "/dashboard/user",
      icon: User,
      exact: true,
    },
    {
      title: "Đơn mua của tôi",
      href: "/dashboard/orders",
      icon: ShoppingBag,
      badge: "Mới",
    },
    {
      title: "Sản phẩm yêu thích",
      href: "/dashboard/saved",
      icon: Heart,
    },
    {
      title: "Sổ địa chỉ",
      href: "/dashboard/addresses",
      icon: MapPin,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Mini Profile Card */}
      {user && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center gap-3.5 shadow-lg shadow-black/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-[10px]"
              />
            ) : (
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-indigo-400 text-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                {user.roles?.[0] || "Customer"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu tài khoản
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                  }`}
                />
                <span>{item.title}</span>
              </div>

              {item.badge ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight
                  className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                    isActive ? "opacity-100 translate-x-0 text-indigo-200" : "text-slate-500"
                  }`}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Security & System Info / Shortcut */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bảo mật tài khoản</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tài khoản được bảo vệ bởi xác thực 2 lớp & Laravel Sanctum Token.
        </p>
      </div>
    </aside>
  );
}
