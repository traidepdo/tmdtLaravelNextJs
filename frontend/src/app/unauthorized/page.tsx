"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Suspense } from "react";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const requiredRole = searchParams.get("required");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="inline-flex p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">403 - Quyền truy cập bị từ chối</h1>
          <p className="text-sm text-slate-400">
            Tài khoản hiện tại của bạn không có đủ quyền hạn để truy cập trang này.
            {requiredRole && (
              <span className="block mt-2 font-medium text-rose-300">
                Yêu cầu vai trò: <code className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{requiredRole}</code>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            Về Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Đang tải...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
