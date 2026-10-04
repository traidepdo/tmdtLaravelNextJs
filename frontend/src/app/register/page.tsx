"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/auth-server";
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, {});

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tạo tài khoản mới</h1>
          <p className="text-sm text-slate-400">
            Tài khoản đăng ký mới sẽ tự động được gán role <code className="text-indigo-300">customer</code>
          </p>
        </div>

        {state?.error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Mật khẩu (tối thiểu 6 ký tự)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            {isPending ? "Đang xử lý trên Server..." : "Đăng ký ngay"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
