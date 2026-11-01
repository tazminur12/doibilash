"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";
import {
  ALL_PERMISSIONS,
  ROLE_META,
  type TeamRole,
} from "@/lib/teamStorage";
import {
  authFetch,
  clearCurrentUser,
  getCurrentUser,
  setCurrentUser,
  type UserSession,
} from "@/lib/authStorage";
import { toBnDigits } from "@/lib/bangla";

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN";
  teamRole: string;
  teamRoleLabel: string;
  designation: string;
  status: string;
  permissions: string[];
  avatarUrl: string | null;
  avatarInitials: string;
  notes?: string;
  lastLogin: string | null;
  joinedAt: string;
  hasPassword: boolean;
};

function formatDateBn(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return toBnDigits(
      d.toLocaleString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch {
    return iso;
  }
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-stone-600">{label}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 pr-10 text-sm text-[#351C1B] placeholder:text-stone-400 focus:border-[#C48A4E] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          aria-label={visible ? "Hide" : "Show"}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  );
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [notes, setNotes] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toast, setToast] = useState<string | null>(null);
  const [sweetAlert, setSweetAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const fireAlert = (opts: {
    type?: "success" | "error" | "warning";
    title?: string;
    message: string;
  }) => {
    setSweetAlert({
      isOpen: true,
      type: opts.type || "success",
      title:
        opts.title ||
        (opts.type === "error" ? "দুঃখিত!" : opts.type === "warning" ? "সতর্কতা" : "সফল হয়েছে!"),
      message: opts.message,
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const applyProfile = (admin: AdminProfile) => {
    setProfile(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone || "");
    setDesignation(admin.designation || "");
    setNotes(admin.notes || "");
  };

  const syncLocalSession = (admin: AdminProfile) => {
    const existing = getCurrentUser();
    const next: UserSession = {
      id: admin.id,
      name: admin.name,
      phone: admin.phone || "",
      email: admin.email,
      avatarUrl: admin.avatarUrl,
      role: "ADMIN",
      teamRole: admin.teamRole,
      designation: admin.designation,
      avatarInitials: admin.avatarInitials,
      permissions: admin.permissions,
      joinedAt: admin.joinedAt,
      city: existing?.city || "",
      address: existing?.address || "",
    };
    setCurrentUser(next);
  };

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch("/api/admin/me");
      const data = await res.json();
      if (data.ok && data.admin) {
        applyProfile(data.admin as AdminProfile);
        syncLocalSession(data.admin as AdminProfile);
      } else {
        fireAlert({
          type: "error",
          title: "সেশন নেই",
          message: data.error || "অ্যাডমিন প্রোফাইল লোড করা যায়নি। আবার লগইন করুন।",
        });
        if (data.needsLogin) {
          setTimeout(() => {
            clearCurrentUser();
            router.push("/login");
          }, 1200);
        }
      }
    } catch {
      fireAlert({
        type: "error",
        message: "সার্ভারে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sweetAlert.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSweetAlert((p) => ({ ...p, isOpen: false }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sweetAlert.isOpen]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      fireAlert({ type: "warning", message: "নাম খালি রাখা যাবে না।" });
      return;
    }
    setIsSaving(true);
    try {
      const res = await authFetch("/api/admin/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          designation: designation.trim(),
          notes: notes.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok && data.admin) {
        applyProfile(data.admin as AdminProfile);
        syncLocalSession(data.admin as AdminProfile);
        showToast("প্রোফাইল আপডেট হয়েছে");
        fireAlert({
          type: "success",
          title: "প্রোফাইল সংরক্ষিত",
          message: data.message || "আপনার তথ্য সফলভাবে আপডেট হয়েছে।",
        });
      } else {
        fireAlert({
          type: "error",
          message: data.error || "প্রোফাইল আপডেট ব্যর্থ হয়েছে।",
        });
      }
    } catch {
      fireAlert({ type: "error", message: "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      fireAlert({
        type: "warning",
        title: "পাসওয়ার্ড ছোট",
        message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      fireAlert({
        type: "warning",
        title: "মিলছে না",
        message: "নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।",
      });
      return;
    }
    if (profile?.hasPassword && !currentPassword) {
      fireAlert({
        type: "warning",
        message: "বর্তমান পাসওয়ার্ড দিন।",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authFetch("/api/admin/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword || undefined,
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setProfile((p) => (p ? { ...p, hasPassword: true } : p));
        showToast("পাসওয়ার্ড পরিবর্তন হয়েছে");
        fireAlert({
          type: "success",
          title: "পাসওয়ার্ড আপডেট",
          message: data.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।",
        });
      } else {
        fireAlert({
          type: "error",
          title: "পাসওয়ার্ড ত্রুটি",
          message: data.error || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।",
        });
      }
    } catch {
      fireAlert({ type: "error", message: "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    if (confirm("অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?")) {
      clearCurrentUser();
      window.location.href = "/login";
    }
  };

  const roleMeta =
    profile && ROLE_META[profile.teamRole as TeamRole]
      ? ROLE_META[profile.teamRole as TeamRole]
      : null;

  const permissionLabels = (profile?.permissions || [])
    .map((id) => ALL_PERMISSIONS.find((p) => p.id === id)?.labelBn)
    .filter(Boolean) as string[];

  if (isLoading) {
    return (
      <div className="font-bengali min-h-[60vh] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <RefreshCw className="w-8 h-8 animate-spin text-[#C48A4E]" />
          <p className="text-sm font-medium">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="font-bengali min-h-[50vh] flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-[#351C1B]">প্রোফাইল পাওয়া যায়নি</h2>
          <p className="text-sm text-stone-500">
            টিম অ্যাকাউন্ট দিয়ে লগইন করুন, তারপর আবার চেষ্টা করুন।
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#351C1B] text-amber-50 text-sm font-bold"
          >
            লগইন পেজে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-bengali space-y-6 pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
        <Link href="/admin" className="hover:text-[#C48A4E]">
          ড্যাশবোর্ড
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-stone-600 font-semibold">আমার প্রোফাইল</span>
      </div>

      {/* Hero identity */}
      <section className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-linear-to-br from-[#351C1B] via-[#4A2624] to-[#A95E35] text-amber-50 shadow-lg">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#C48A4E]/20 blur-2xl pointer-events-none" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#FAF8F5] to-[#C48A4E] p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#351C1B] flex items-center justify-center text-xl sm:text-2xl font-black text-[#C48A4E]">
              {profile.avatarInitials || profile.name.slice(0, 2)}
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                {profile.name}
              </h2>
              {roleMeta && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${roleMeta.badgeBg}`}
                >
                  <Shield className="w-3 h-3" />
                  {profile.teamRoleLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
                <BadgeCheck className="w-3 h-3" />
                {profile.status === "Active" ? "সক্রিয়" : profile.status}
              </span>
            </div>
            <p className="text-sm text-amber-100/80 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{profile.designation || "পদবি নির্ধারিত নয়"}</span>
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-amber-100/60">
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {profile.email}
              </span>
              {profile.phone ? (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {toBnDigits(profile.phone)}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                যোগদান: {formatDateBn(profile.joinedAt)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/25 hover:bg-red-500/20 border border-white/10 text-xs font-bold text-amber-100 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            লগআউট
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: role + permissions */}
        <aside className="space-y-5 xl:col-span-1">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C48A4E]/15 text-[#A95E35] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#351C1B]">রোল ও অ্যাক্সেস</h3>
                <p className="text-[11px] text-stone-400">আপনার প্যানেল অনুমতি</p>
              </div>
            </div>

            {roleMeta && (
              <div
                className={`rounded-xl border p-3.5 space-y-1 ${roleMeta.bg} ${roleMeta.border}`}
              >
                <div className={`text-sm font-bold ${roleMeta.color}`}>
                  {roleMeta.labelBn}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {roleMeta.subtitle}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                অনুমতিসমূহ ({toBnDigits(String(permissionLabels.length))})
              </div>
              {permissionLabels.length === 0 ? (
                <p className="text-xs text-stone-400">কোনো অনুমতি নির্ধারিত নেই।</p>
              ) : (
                <ul className="space-y-1.5 max-h-64 overflow-y-auto">
                  {permissionLabels.map((label) => (
                    <li
                      key={label}
                      className="flex items-start gap-2 text-xs text-stone-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
              <div className="flex justify-between gap-2">
                <span>সর্বশেষ লগইন</span>
                <span className="font-medium text-stone-700 text-right">
                  {formatDateBn(profile.lastLogin)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span>অ্যাকাউন্ট আইডি</span>
                <span className="font-mono text-[10px] text-stone-600 truncate max-w-[55%]">
                  {profile.id}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/team"
            className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-xs hover:border-[#C48A4E]/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C48A4E]" />
              <div>
                <div className="text-xs font-bold text-[#351C1B]">টিম ও রোলস</div>
                <div className="text-[10px] text-stone-400">অন্য সদস্যদের ব্যবস্থাপনা</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#C48A4E]" />
          </Link>
        </aside>

        {/* Right: edit forms */}
        <div className="xl:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
              <User className="w-4 h-4 text-[#C48A4E]" />
              <div>
                <h3 className="text-sm font-extrabold text-[#351C1B]">ব্যক্তিগত তথ্য</h3>
                <p className="text-[11px] text-stone-400">
                  নাম, যোগাযোগ ও পদবি আপডেট করুন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-stone-600">পূর্ণ নাম</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-[#351C1B] focus:border-[#C48A4E] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/20"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-stone-600">ইমেইল</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-[#351C1B] focus:border-[#C48A4E] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/20"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-stone-600">মোবাইল</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-[#351C1B] focus:border-[#C48A4E] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/20"
                />
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-stone-600">পদবি / ডিজিনেশন</span>
                <input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="যেমন: ফাউন্ডার ও প্রধান নির্বাহী"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-[#351C1B] focus:border-[#C48A4E] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/20"
                />
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-stone-600">নোট (ঐচ্ছিক)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm text-[#351C1B] focus:border-[#C48A4E] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/20 resize-y"
                />
              </label>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] text-amber-50 text-xs font-bold shadow-md disabled:opacity-60 hover:shadow-lg transition-all"
              >
                {isSaving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {isSaving ? "সংরক্ষণ হচ্ছে..." : "প্রোফাইল সংরক্ষণ"}
              </button>
            </div>
          </form>

          <form
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
              <KeyRound className="w-4 h-4 text-[#C48A4E]" />
              <div>
                <h3 className="text-sm font-extrabold text-[#351C1B]">পাসওয়ার্ড পরিবর্তন</h3>
                <p className="text-[11px] text-stone-400">
                  {profile.hasPassword
                    ? "নিরাপত্তার জন্য বর্তমান পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড সেট করুন"
                    : "এখনো পাসওয়ার্ড নেই — নতুন পাসওয়ার্ড সেট করুন"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.hasPassword && (
                <div className="sm:col-span-2">
                  <PasswordField
                    label="বর্তমান পাসওয়ার্ড"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    autoComplete="current-password"
                  />
                </div>
              )}
              <PasswordField
                label="নতুন পাসওয়ার্ড"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="কমপক্ষে ৬ অক্ষর"
                autoComplete="new-password"
              />
              <PasswordField
                label="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 border border-amber-100 px-3 py-2.5 text-[11px] text-amber-900/80">
              <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A95E35]" />
              <p>
                পাসওয়ার্ড পরিবর্তনের পর পরবর্তী লগইনে নতুন পাসওয়ার্ড ব্যবহার করবেন। রোল (যেমন
                সুপার অ্যাডমিন) শুধুমাত্র উচ্চতর অ্যাডমিন পরিবর্তন করতে পারেন।
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#351C1B]/20 bg-[#351C1B] text-amber-50 text-xs font-bold disabled:opacity-60 hover:bg-[#4A2624] transition-colors"
              >
                {isChangingPassword ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5" />
                )}
                {isChangingPassword ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#351C1B] text-amber-50 text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C48A4E]" />
          {toast}
        </div>
      )}

      {sweetAlert.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 font-bengali">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                sweetAlert.type === "error"
                  ? "bg-red-50 text-red-600"
                  : sweetAlert.type === "warning"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {sweetAlert.type === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : sweetAlert.type === "warning" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-[#351C1B]">{sweetAlert.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{sweetAlert.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setSweetAlert((p) => ({ ...p, isOpen: false }))}
              className="w-full py-2.5 rounded-xl bg-[#351C1B] text-amber-50 text-xs font-bold"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
