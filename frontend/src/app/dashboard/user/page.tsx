import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserSidebar from "@/components/UserSidebar";
import ProfileForm from "./ProfileForm";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  Clock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  profile?: {
    phone_number?: string | null;
    avatar?: string | null;
    gender?: string | null;
    birthday?: string | null;
    address?: string | null;
    ward?: string | null;
    district?: string | null;
    city?: string | null;
    bio?: string | null;
  } | null;
  roles?: string[];
  permissions?: string[];
}

async function getUserProfile(): Promise<ProfileData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  try {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return (json.data || json) as ProfileData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export default async function UserProfilePage() {
  const profileData = await getUserProfile();

  if (!profileData) {
    redirect("/login");
  }

  const { profile } = profileData;

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar Navigation */}
          <UserSidebar
            user={{
              name: profileData.name,
              email: profileData.email,
              roles: profileData.roles,
              avatar: profile?.avatar,
            }}
          />

          {/* Right Main Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Navigation Breadcrumb & Back */}
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Dashboard</span>
              </Link>
              <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Hồ sơ cá nhân
              </span>
            </div>

            {/* Hero Profile Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profileData.name}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-black text-indigo-400">
                        {profileData.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {profileData.name}
                    </h1>
                    {/* Roles badge */}
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                      {profileData.roles?.map((role) => (
                        <span
                          key={role}
                          className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>{profileData.email}</span>
                  </p>

                  {profile?.bio && (
                    <p className="text-sm text-slate-300 italic pt-1 max-w-xl">
                      "{profile.bio}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form chỉnh sửa Profile (Kết nối PUT /api/profile) */}
            <ProfileForm
              initialData={{
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                profile: profileData.profile,
              }}
            />

            {/* Detailed Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin liên hệ & cá nhân */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Thông tin liên hệ & cá nhân</span>
                </h2>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Số điện thoại:
                    </span>
                    <span className="text-slate-200 font-medium">
                      {profile?.phone_number || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Ngày sinh:
                    </span>
                    <span className="text-slate-200 font-medium">
                      {profile?.birthday || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-slate-500" />
                      Giới tính:
                    </span>
                    <span className="text-slate-200 font-medium capitalize">
                      {profile?.gender === "male"
                        ? "Nam"
                        : profile?.gender === "female"
                          ? "Nữ"
                          : profile?.gender || "Khác / Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao hàng / cư trú */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>Địa chỉ</span>
                </h2>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-400 shrink-0">Địa chỉ cụ thể:</span>
                    <span className="text-slate-200 font-medium text-right">
                      {profile?.address || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Phường / Xã:</span>
                    <span className="text-slate-200 font-medium">
                      {profile?.ward || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Quận / Huyện:</span>
                    <span className="text-slate-200 font-medium">
                      {profile?.district || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tỉnh / Thành phố:</span>
                    <span className="text-slate-200 font-medium">
                      {profile?.city || "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quyền & Tài khoản */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Thông tin tài khoản & Quyền hạn</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Ngày tham gia:
                  </span>
                  <span className="text-slate-200 font-medium">
                    {new Date(profileData.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Trạng thái email:
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {profileData.email_verified_at ? "Đã xác thực" : "Chưa xác thực"}
                  </span>
                </div>
              </div>

              {profileData.permissions && profileData.permissions.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">
                    Danh sách quyền hạn (Permissions):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 font-mono"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
