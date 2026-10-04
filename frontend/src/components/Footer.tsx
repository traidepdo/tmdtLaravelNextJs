import Link from "next/link";
import { ShieldCheck, Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-indigo-600 hover:text-indigo-700 transition"
            >
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <span>TMDT SSR Portal</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Hệ thống thương mại điện tử hiện đại kết hợp Laravel Sanctum API và Next.js SSR App Router.
            </p>
          </div>

          {/* Cột 2: Khám phá / Danh mục */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Khám phá
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 transition">
                  Tài khoản của tôi
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-indigo-600 transition">
                  Tất cả sản phẩm
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dành cho nội bộ / Cổng đăng nhập */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Cổng nội bộ
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/staff/login" className="hover:text-emerald-600 transition">
                  Cổng Nhân viên (Staff)
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-rose-600 transition">
                  Cổng Quản trị viên (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Hỗ trợ */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@tmdt.local</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>Laravel + Next.js App</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TMDT Portal. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-slate-400 transition">
              Điều khoản dịch vụ
            </Link>
            <Link href="#" className="hover:text-slate-400 transition">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
