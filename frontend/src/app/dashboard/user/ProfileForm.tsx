"use client";

import { useActionState, useState } from "react";
import { updateProfileAction, UpdateProfileState } from "./actions";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Edit3,
} from "lucide-react";

interface ProfileFormProps {
  initialData: {
    id: number;
    name: string;
    email: string;
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
  };
}

const initialState: UpdateProfileState = {};

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );
  const [isEditing, setIsEditing] = useState(false);

  const { profile } = initialData;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <span>Chỉnh sửa thông tin tài khoản</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cập nhật chi tiết hồ sơ cá nhân và địa chỉ nhận hàng của bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            isEditing
              ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              <span>Đóng biểu mẫu</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Sửa thông tin</span>
            </>
          )}
        </button>
      </div>

      {/* Thông báo kết quả Submit */}
      {state.success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {state.success === false && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {/* Form chỉnh sửa */}
      {isEditing ? (
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Tên */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Họ và tên *</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={initialData.name}
                required
                placeholder="Nhập họ và tên"
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {state.errors?.name && (
                <p className="text-xs text-rose-400">{state.errors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email *</span>
              </label>
              <input
                type="email"
                name="email"
                defaultValue={initialData.email}
                required
                placeholder="example@domain.com"
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {state.errors?.email && (
                <p className="text-xs text-rose-400">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Số điện thoại</span>
              </label>
              <input
                type="text"
                name="phone_number"
                defaultValue={profile?.phone_number || ""}
                placeholder="0987654321"
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {state.errors?.phone_number && (
                <p className="text-xs text-rose-400">{state.errors.phone_number[0]}</p>
              )}
            </div>

            {/* Giới tính */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Giới tính</span>
              </label>
              <select
                name="gender"
                defaultValue={profile?.gender || "other"}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ngày sinh</span>
              </label>
              <input
                type="date"
                name="birthday"
                defaultValue={
                  profile?.birthday
                    ? new Date(profile.birthday).toISOString().split("T")[0]
                    : ""
                }
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Ảnh đại diện (URL)
              </label>
              <input
                type="url"
                name="avatar"
                defaultValue={profile?.avatar || ""}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Nhóm Địa chỉ */}
          <div className="pt-2 border-t border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Địa chỉ nhận hàng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  name="city"
                  defaultValue={profile?.city || ""}
                  placeholder="TP. Hồ Chí Minh"
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Quận / Huyện</label>
                <input
                  type="text"
                  name="district"
                  defaultValue={profile?.district || ""}
                  placeholder="Quận 1"
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Phường / Xã</label>
                <input
                  type="text"
                  name="ward"
                  defaultValue={profile?.ward || ""}
                  placeholder="Phường Bến Nghé"
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Địa chỉ cụ thể (Số nhà, tên đường)</label>
              <input
                type="text"
                name="address"
                defaultValue={profile?.address || ""}
                placeholder="123 Đường Nguyễn Huệ..."
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Tiểu sử / Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Giới thiệu ngắn (Bio)</label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={profile?.bio || ""}
              placeholder="Chia sẻ đôi điều về bạn..."
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
