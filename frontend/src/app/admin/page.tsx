import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getServerToken, hasRole } from "@/lib/auth-server";
import { Lock, ArrowLeft, Users, Shield } from "lucide-react";

interface RoleItem {
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
}

interface AdminStats {
  total_users: number;
  roles: RoleItem[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function getAdminStats(token: string): Promise<AdminStats | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as AdminStats;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  const token = await getServerToken();

  if (!user || !token) {
    redirect("/admin/login");
  }

  if (! (await hasRole(user, "admin"))) {
    redirect("/unauthorized?required=admin");
  }

  const stats = await getAdminStats(token);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-rose-400" />
              Bảng điều khiển Quản trị (Admin Portal - SSR)
            </h1>
            <p className="text-sm text-slate-400">
              Trang SSR bảo mật cấp cao dành riêng cho Super Admin (HttpOnly Token & Spatie Role Middleware)
            </p>
          </div>
        </div>
      </div>

      {stats ? (
        <div className="space-y-6">
          {/* Stat Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Tổng số người dùng hệ thống</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.total_users}</h3>
            </div>
          </div>

          {/* Roles & Permissions Management List */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" />
              Danh sách vai trò & Quyền hạn hệ thống (Spatie Permissions)
            </h2>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              {stats.roles.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-sm tracking-wider">
                      {r.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      ID: {r.id}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-400 font-medium">Quyền hạn:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.permissions && r.permissions.length > 0 ? (
                        r.permissions.map((p) => (
                          <span
                            key={p.id}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800 font-mono"
                          >
                            {p.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-600 italic">Không có quyền hạn</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
