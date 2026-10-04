import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Laravel Sanctum + Spatie Permission & Next.js Middleware",
  description: "Xác thực và phân quyền bằng JWT Token và Next.js Middleware",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full bg-slate-50 text-slate-900">
      <body className="min-h-full flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
