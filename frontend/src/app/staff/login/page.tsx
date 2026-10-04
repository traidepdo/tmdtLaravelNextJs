"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-server";
import { Lock, Mail, AlertCircle, ArrowRight, ShoppingBag, ShieldAlert, ArrowLeft } from "lucide-react";

export default function StaffLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleQuickFill = () => {
    setEmail("staff@example.com");
    setPassword("password123");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cổng Nhân viên (Staff Portal)</h1>
          <p className="text-sm text-slate-400">
            Khu vực nội bộ dành riêng cho nhân viên vận hành & kho
          </p>
        </div>

        {/* Quick fill demo button */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            ⚡ Tài khoản mẫu Nhân viên:
          </p>
          <button
            type="button"
            onClick={handleQuickFill}
            className="w-full px-3 py-2 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-1.5 transition"
          >
            Điền nhanh: staff@example.com / password123
          </button>
        </div>

        {state?.error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="portal" value="staff" />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email Nhân viên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            {isPending ? "Đang xác thực trên Server..." : "Đăng nhập Cổng Nhân viên"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Cổng nội bộ: Không hỗ trợ đăng ký tự do. Tài khoản do Admin cấp.
          </p>
        </div>

        <p className="text-center text-sm text-slate-400">
          <Link href="/" className="text-slate-400 hover:text-white inline-flex items-center gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Quay về Trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
