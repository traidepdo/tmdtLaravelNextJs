import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getServerToken, hasRole } from "@/lib/auth-server";
import { ShoppingBag, ArrowLeft, CheckCircle2, Clock } from "lucide-react";

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function getOrders(token: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/staff/orders`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders || [];
  } catch {
    return [];
  }
}

export default async function StaffOrdersPage() {
  const user = await getCurrentUser();
  const token = await getServerToken();

  if (!user || !token) {
    redirect("/staff/login");
  }

  if (! (await hasRole(user, ["staff", "admin"]))) {
    redirect("/unauthorized?required=staff");
  }

  const orders = await getOrders(token);

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
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
              Quản lý đơn hàng (Staff Portal - SSR)
            </h1>
            <p className="text-sm text-slate-400">
              Trang SSR bảo mật bằng HttpOnly Token & Laravel Sanctum Role Middleware
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h2 className="text-base font-bold text-white mb-4">Danh sách đơn hàng mẫu</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-400 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3.5 font-mono font-bold text-indigo-400">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-white">{order.customer}</td>
                  <td className="px-4 py-3.5 font-semibold">
                    {order.total.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                        order.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {order.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
