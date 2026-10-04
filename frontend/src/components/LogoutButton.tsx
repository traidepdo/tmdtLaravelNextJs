"use client";

import { logoutAction } from "@/lib/auth-server";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition shadow-sm"
      title="Đăng xuất"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">
        {isPending ? "Đang thoát..." : "Đăng xuất"}
      </span>
    </button>
  );
}
