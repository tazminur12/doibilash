"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  Key,
  Lock,
  Edit2,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  X,
  Mail,
  Phone,
  Sparkles,
  ChevronRight,
  Filter,
  Clock,
  Crown,
  Briefcase,
  AlertTriangle,
  Info,
  SendHorizonal,
  KeyRound,
} from "lucide-react";
import {
  TeamMember,
  TeamRole,
  MemberStatus,
  ROLE_META,
  ALL_PERMISSIONS,
} from "@/lib/teamStorage";
import { toBnDigits } from "@/lib/bangla";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<TeamRole | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<MemberStatus | "ALL">("ALL");

  // Form / Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sweet Alert Modal State
  const [sweetAlert, setSweetAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
    confirmButtonText?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    confirmButtonText: "ঠিক আছে",
  });

  const fireAlert = (options: {
    type?: "success" | "error" | "warning";
    title?: string;
    message: string;
    confirmButtonText?: string;
  }) => {
    setSweetAlert({
      isOpen: true,
      type: options.type || "success",
      title: options.title || (options.type === "error" ? "দুঃখিত!" : "সফল হয়েছে!"),
      message: options.message,
      confirmButtonText: options.confirmButtonText || "ঠিক আছে",
    });
  };

  useEffect(() => {
    if (!sweetAlert.isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSweetAlert((prev) => ({ ...prev, isOpen: false }));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sweetAlert.isOpen]);

  // Form Fields
  const [createMode, setCreateMode] = useState<"invite" | "manual">("invite");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState<TeamRole>("Staff");
  const [status, setStatus] = useState<MemberStatus>("Active");
  const [permissions, setPermissions] = useState<string[]>(ROLE_META.Staff.defaultPermissions);
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.ok && Array.isArray(data.members)) {
        setMembers(data.members);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Failed to fetch team members from backend:", err);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingMember(null);
    setCreateMode("invite");
    setName("");
    setEmail("");
    setPhone("");
    setDesignation("");
    setRole("Moderator");
    setStatus("Active");
    setPermissions(ROLE_META.Moderator.defaultPermissions);
    setPassword("");
    setNotes("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setCreateMode("manual");
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setDesignation(member.designation);
    setRole(member.role);
    setStatus(member.status === "Invited" ? "Active" : member.status);
    setPermissions(member.permissions);
    setPassword("");
    setNotes(member.notes || "");
    setIsModalOpen(true);
  };

  const handleResendInvite = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/team/${member.id}/resend-invite`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        fireAlert({
          type: "error",
          title: "পুনরায় পাঠানো যায়নি",
          message: data.error || "ইনভাইট ইমেইল পাঠাতে সমস্যা হয়েছে।",
        });
        return;
      }
      fireAlert({
        type: data.emailSent === false ? "warning" : "success",
        title: data.emailSent === false ? "লিংক নবায়ন হয়েছে" : "ইনভাইট পাঠানো হয়েছে!",
        message: data.message,
      });
      loadData();
    } catch {
      fireAlert({
        type: "error",
        title: "নেটওয়ার্ক ত্রুটি",
        message: "সার্ভারে সংযোগ করা যায়নি।",
      });
    }
  };

  // Handle Role Change in Form (auto-select default permissions)
  const handleRoleChange = (newRole: TeamRole) => {
    setRole(newRole);
    setPermissions(ROLE_META[newRole].defaultPermissions);
  };

  // Toggle specific permission
  const handleTogglePermission = (permId: string) => {
    setPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  // Quick toggle status
  const handleToggleStatus = async (member: TeamMember) => {
    const newStatus: MemberStatus = member.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        fireAlert({
          type: "error",
          title: "পরিবর্তন ব্যর্থ",
          message: data.error || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।",
        });
        return;
      }
      showToast(`${member.name}-এর স্ট্যাটাস ${newStatus === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে।`);
      loadData();
    } catch {
      showToast("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  // Save Member via Backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      fireAlert({
        type: "warning",
        title: "তথ্য অসম্পূর্ণ",
        message: "দয়া করে সদস্যের নাম এবং ইমেইল ঠিকানা প্রদান করুন।",
      });
      return;
    }

    if (!editingMember && createMode === "manual" && !phone.trim()) {
      fireAlert({
        type: "warning",
        title: "তথ্য অসম্পূর্ণ",
        message: "ম্যানুয়াল অ্যাডে মোবাইল নম্বর আবশ্যক।",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const basePayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        designation: designation.trim() || (role === "Super Admin" ? "প্রধান প্রশাসক" : "টিম মেম্বার"),
        role,
        status,
        permissions,
        password: password ? password.trim() : undefined,
        notes: notes.trim(),
      };

      if (editingMember) {
        const res = await fetch(`/api/admin/team/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(basePayload),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          fireAlert({
            type: "error",
            title: "আপডেট ব্যর্থ",
            message: data.error || "টিম সদস্য আপডেট করা যায়নি।",
          });
          setIsSubmitting(false);
          return;
        }

        setIsModalOpen(false);
        fireAlert({
          type: "success",
          title: "আপডেট সফল!",
          message: `সদস্য "${name}"-এর তথ্য সফলভাবে আপডেট করা হয়েছে।`,
        });
        loadData();
      } else if (createMode === "invite") {
        const res = await fetch("/api/admin/team/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: basePayload.name,
            email: basePayload.email,
            phone: basePayload.phone || undefined,
            designation: basePayload.designation,
            role: basePayload.role,
            permissions: basePayload.permissions,
            notes: basePayload.notes,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          fireAlert({
            type: "error",
            title: "ইনভাইট ব্যর্থ",
            message: data.error || "ইনভাইটেশন পাঠানো যায়নি।",
          });
          setIsSubmitting(false);
          return;
        }

        setIsModalOpen(false);
        const fromHint = data.fromEmail ? ` (${data.fromEmail})` : "";
        const linkHint =
          data.emailSent === false && data.inviteUrl
            ? `\n\nম্যানুয়াল লিংক: ${data.inviteUrl}`
            : "";
        fireAlert({
          type: data.emailSent === false ? "warning" : "success",
          title: data.emailSent === false ? "সদস্য যোগ হয়েছে, ইমেইল ব্যর্থ" : "ইনভাইটেশন পাঠানো হয়েছে!",
          message:
            (data.message ||
              `"${name}"-এর মেইলে অ্যাডমিন রিকোয়েস্ট পাঠানো হয়েছে${fromHint}। তিনি লিংক থেকে পাসওয়ার্ড সেট করে লগইন করতে পারবেন।`) +
            linkHint,
        });
        loadData();
      } else {
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(basePayload),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          fireAlert({
            type: "error",
            title: "যুক্ত করা যায়নি",
            message: data.error || "নতুন সদস্য যুক্ত করা সম্ভব হয়নি।",
          });
          setIsSubmitting(false);
          return;
        }

        setIsModalOpen(false);
        fireAlert({
          type: "success",
          title: "সদস্য যুক্ত হয়েছে!",
          message: `নতুন সদস্য "${name}" কে সফলভাবে (${role}) হিসেবে যুক্ত করা হয়েছে।`,
        });
        loadData();
      }
    } catch {
      fireAlert({
        type: "error",
        title: "নেটওয়ার্ক ত্রুটি",
        message: "সার্ভারে সংযোগ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Member via Backend API
  const confirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/team/${memberToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        fireAlert({
          type: "error",
          title: "অপসারণ ব্যর্থ",
          message: data.error || "টিম সদস্য অপসারণ করা সম্ভব হয়নি।",
        });
        setIsDeleting(false);
        setMemberToDelete(null);
        return;
      }

      setMemberToDelete(null);
      fireAlert({
        type: "success",
        title: "অপসারণ সম্পন্ন!",
        message: `সদস্য "${memberToDelete.name}" কে টিম থেকে সফলভাবে অপসারণ করা হয়েছে।`,
      });
      loadData();
    } catch {
      fireAlert({
        type: "error",
        title: "নেটওয়ার্ক সমস্যা",
        message: "সার্ভারে সংযোগ করা যায়নি।",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "ALL" || m.role === selectedRole;
    const matchesStatus = selectedStatus === "ALL" || m.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // KPIs
  const totalCount = members.length;
  const superAdminCount = members.filter((m) => m.role === "Super Admin").length;
  const managersAndMods = members.filter(
    (m) => m.role === "Manager" || m.role === "Moderator"
  ).length;
  const staffCount = members.filter((m) => m.role === "Staff").length;

  return (
    <div className="space-y-8 font-bengali pb-24 max-w-7xl mx-auto">
      {/* Sweet Alert Pop-up Modal */}
      {sweetAlert.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-bengali animate-in fade-in duration-200">
          <div
            onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-sweetalert-title"
            className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
          >
            <button
              type="button"
              onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
              aria-label="Close"
              className="absolute right-4 top-4 w-8 h-8 grid place-items-center rounded-full bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {sweetAlert.type === "success" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/60">
                <CheckCircle2 className="h-10 w-10 animate-bounce duration-700" />
              </div>
            )}
            {sweetAlert.type === "error" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/60">
                <AlertCircle className="h-10 w-10 animate-pulse" />
              </div>
            )}
            {sweetAlert.type === "warning" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-8 ring-amber-50/60">
                <AlertCircle className="h-10 w-10 animate-pulse" />
              </div>
            )}

            <h3
              id="admin-sweetalert-title"
              className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight"
            >
              {sweetAlert.title}
            </h3>

            <p className="mt-2.5 text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
              {sweetAlert.message}
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
                className="w-full inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] py-3 px-6 text-sm sm:text-base font-bold text-white shadow-lg shadow-black/10 hover:brightness-110 active:scale-98 transition cursor-pointer"
              >
                {sweetAlert.confirmButtonText || "ঠিক আছে"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-lg">সদস্য অব্যাহতির নিশ্চয়তা</h3>
                <p className="text-xs text-stone-500">এই অ্যাকশনটি ফেরত নেওয়া যাবে না</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              আপনি কি নিশ্চিত যে আপনি টিম সদস্য{" "}
              <strong className="text-stone-900">{memberToDelete.name}</strong> ({memberToDelete.designation})-কে টিম থেকে অপসারণ করতে চান?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Clock className="w-4 h-4 animate-spin" />}
                <span>{isDeleting ? "অপসারণ হচ্ছে..." : "হ্যাঁ, অপসারণ করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Page Header ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-purple-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
              <ShieldCheck className="w-4 h-4" />
              <span>প্রশাসনিক অ্যাক্সেস ও নিরাপত্তা কন্ট্রোল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#351C1B] tracking-tight">
              টিম মেম্বার ও রোলস ব্যবস্থাপনা
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              সুপার অ্যাডমিন, ম্যানেজার, স্টোর মডারেটর এবং স্টাফদের একাউন্ট তৈরি, দায়িত্ব বণ্টন এবং সূক্ষ্ম পারমিশন কন্ট্রোল এক জায়গা থেকেই পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-sm shadow-lg shadow-[#351C1B]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                <Plus className="w-4 h-4 text-amber-200" />
              </div>
              <span>নতুন সদস্য যুক্ত করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Executive KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#351C1B]/5 text-[#351C1B] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[#C48A4E]" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">মোট টিম সদস্য</div>
            <div className="text-xl sm:text-2xl font-black text-[#351C1B]">
              {toBnDigits(totalCount)} <span className="text-xs font-normal text-stone-400">জন</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">সুপার অ্যাডমিন</div>
            <div className="text-xl sm:text-2xl font-black text-purple-900">
              {toBnDigits(superAdminCount)} <span className="text-xs font-normal text-stone-400">জন</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">ম্যানেজার ও মডারেটর</div>
            <div className="text-xl sm:text-2xl font-black text-blue-900">
              {toBnDigits(managersAndMods)} <span className="text-xs font-normal text-stone-400">জন</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">স্টাফ ও ডিসপ্যাচ</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800">
              {toBnDigits(staffCount)} <span className="text-xs font-normal text-stone-400">জন</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ───────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as MemberStatus | "ALL")}
              aria-label="স্ট্যাটাস ফিল্টার"
              className="px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-hidden"
            >
              <option value="ALL">সকল স্ট্যাটাস</option>
              <option value="Active">সক্রিয়</option>
              <option value="Invited">ইনভাইট পেন্ডিং</option>
              <option value="Inactive">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>

        {/* Role Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> রোল ফিল্টার:
          </span>

          <button
            type="button"
            onClick={() => setSelectedRole("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === "ALL"
                ? "bg-[#351C1B] text-amber-100 shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            সকল ({toBnDigits(members.length)})
          </button>

          {(["Super Admin", "Manager", "Moderator", "Staff"] as TeamRole[]).map((r) => {
            const count = members.filter((m) => m.role === r).length;
            const meta = ROLE_META[r];
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#C48A4E] text-white shadow-xs"
                    : `${meta.bg} ${meta.color} border ${meta.border} hover:opacity-85`
                }`}
              >
                <span>{meta.labelBn.split(" ")[0]}</span>
                <span className="opacity-75">({toBnDigits(count)})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Members Table (Desktop) ───────────────────────────────────── */}
      <div className="hidden lg:block bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-600">
              <th className="py-4 px-6">সদস্যের নাম ও পদবি</th>
              <th className="py-4 px-5">যোগাযোগ</th>
              <th className="py-4 px-5">রোল (Role)</th>
              <th className="py-4 px-5">অনুমোদিত পারমিশন</th>
              <th className="py-4 px-5">স্ট্যাটাস ও শেষ লগইন</th>
              <th className="py-4 px-6 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {filteredMembers.map((member) => {
              const meta = ROLE_META[member.role] || ROLE_META.Staff;
              return (
                <tr key={member.id} className="hover:bg-amber-50/20 transition-colors">
                  {/* Name & Designation */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {member.role === "Super Admin" && (
                            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          )}
                        </div>
                        <div className="text-xs text-stone-500">{member.designation}</div>
                        <span className="text-[10px] font-mono text-stone-400">{member.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-5 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                        <Mail className="w-3 h-3 text-[#C48A4E]" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>{meta.labelBn.split(" (")[0]}</span>
                    </span>
                  </td>

                  {/* Permissions count */}
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{toBnDigits(member.permissions.length)} টি মডিউল</span>
                    </span>
                  </td>

                  {/* Status & Last Login */}
                  <td className="py-4 px-5 text-xs">
                    <div className="space-y-0.5">
                      {member.status === "Invited" ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          ● ইনভাইট পেন্ডিং
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(member)}
                          title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                            member.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                          }`}
                        >
                          ● {member.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </button>
                      )}
                      <div className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{member.lastLogin}</span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {(member.status === "Invited" || member.invitePending) && (
                        <button
                          type="button"
                          onClick={() => handleResendInvite(member)}
                          title="ইনভাইট পুনরায় পাঠান"
                          className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition-colors"
                        >
                          <SendHorizonal className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(member)}
                        title="সম্পাদনা করুন"
                        className="p-2 text-stone-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setMemberToDelete(member)}
                        title="মুছে ফেলুন"
                        disabled={member.role === "Super Admin" && superAdminCount <= 1}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 5. Members Mobile Cards ─────────────────────────────────────── */}
      <div className="block lg:hidden space-y-4">
        {filteredMembers.map((member) => {
          const meta = ROLE_META[member.role] || ROLE_META.Staff;
          return (
            <div
              key={member.id}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {member.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1">
                      <span>{member.name}</span>
                      {member.role === "Super Admin" && (
                        <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                      )}
                    </h4>
                    <p className="text-xs text-stone-500">{member.designation}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                >
                  {meta.labelBn.split(" (")[0]}
                </span>
              </div>

              <div className="bg-stone-50 p-3 rounded-2xl text-xs space-y-1 text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C48A4E]" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                <span className="text-stone-400 text-[11px]">
                  {member.status === "Invited"
                    ? "ইনভাইট পেন্ডিং"
                    : `অনুমতি: ${toBnDigits(member.permissions.length)} টি মডিউল`}
                </span>
                <div className="flex items-center gap-2">
                  {(member.status === "Invited" || member.invitePending) && (
                    <button
                      type="button"
                      onClick={() => handleResendInvite(member)}
                      className="p-2 border border-amber-200 hover:bg-amber-50 text-amber-700 rounded-xl"
                      title="ইনভাইট পুনরায় পাঠান"
                    >
                      <SendHorizonal className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(member)}
                    className="p-2 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberToDelete(member)}
                    className="p-2 border border-stone-200 hover:bg-red-50 text-red-500 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 6. Create / Edit Member Modal ───────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
            {/* Sticky header */}
            <div className="shrink-0 flex items-center justify-between gap-3 border-b border-stone-100 px-4 sm:px-5 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C48A4E] flex items-center justify-center shrink-0">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-stone-900 text-sm sm:text-base truncate">
                    {editingMember ? "টিম সদস্য তথ্য সম্পাদনা" : "নতুন টিম সদস্য ও রোল নিয়োগ"}
                  </h3>
                  <p className="text-[11px] text-stone-500 truncate">
                    {editingMember
                      ? "ভূমিকা ও পারমিশন আপডেট করুন"
                      : createMode === "invite"
                        ? "নাম, ইমেইল ও রোল দিয়ে ইনভাইট পাঠান"
                        : "ম্যানুয়ালি অ্যাকাউন্ট তৈরি করুন"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 shrink-0"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-3.5 space-y-3.5">
                {!editingMember && (
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setCreateMode("invite")}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                        createMode === "invite"
                          ? "bg-white text-[#351C1B] shadow-sm ring-1 ring-[#C48A4E]/40"
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <SendHorizonal className="w-3.5 h-3.5 text-[#C48A4E]" />
                      ইমেইল ইনভাইট
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateMode("manual")}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                        createMode === "manual"
                          ? "bg-white text-[#351C1B] shadow-sm ring-1 ring-[#C48A4E]/40"
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                      ম্যানুয়াল অ্যাড
                    </button>
                  </div>
                )}

                {!editingMember && createMode === "invite" && (
                  <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 border border-amber-200/80 px-3 py-2 text-[11px] text-amber-950 leading-snug">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
                    <p>
                      পাসওয়ার্ড লাগবে না। <strong>info@doibilash.com</strong> থেকে ইনভাইট লিংক যাবে —
                      তিনি পাসওয়ার্ড সেট করে লগইন করবেন।
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      পূর্ণ নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="সদস্যের নাম..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      পদবি
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="যেমন: সাপোর্ট স্পেশালিস্ট"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      অফিসিয়াল ইমেইল *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@doibilash.com"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      মোবাইল
                      {!editingMember && createMode === "invite"
                        ? " (ঐচ্ছিক)"
                        : createMode === "manual" || editingMember
                          ? " *"
                          : ""}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712-XXXXXX"
                      required={Boolean(editingMember) || createMode === "manual"}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                    রোল নির্বাচন *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["Super Admin", "Manager", "Moderator", "Staff"] as TeamRole[]).map((r) => {
                      const isSelected = role === r;
                      const meta = ROLE_META[r];
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleChange(r)}
                          className={`px-2.5 py-2 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-amber-50/70 border-[#C48A4E] ring-1 ring-[#C48A4E]"
                              : "bg-stone-50/50 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          <span className="font-bold text-stone-900 text-[11px] sm:text-xs flex items-center gap-1">
                            {r === "Super Admin" && (
                              <Crown className="w-3 h-3 text-amber-600 fill-amber-400 shrink-0" />
                            )}
                            <span className="truncate">{meta.labelBn.split(" (")[0]}</span>
                            {isSelected && (
                              <Check className="w-3 h-3 text-[#C48A4E] ml-auto shrink-0" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-stone-700">
                      পারমিশনসমূহ
                    </label>
                    <span className="text-[10px] text-[#C48A4E] font-bold">
                      {toBnDigits(permissions.length)} / {toBnDigits(ALL_PERMISSIONS.length)} সক্রিয়
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-stone-50 p-2 rounded-xl border border-stone-200/80 max-h-28 overflow-y-auto">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isChecked = permissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-white shadow-2xs font-semibold text-stone-900"
                              : "text-stone-600 hover:bg-white/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(perm.id)}
                            className="accent-[#C48A4E] shrink-0"
                          />
                          <span className="leading-tight truncate">{perm.labelBn}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {(editingMember || createMode === "manual") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        {editingMember ? "নতুন পাসওয়ার্ড (ঐচ্ছিক)" : "লগইন পাসওয়ার্ড *"}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required={!editingMember && createMode === "manual"}
                        minLength={!editingMember && createMode === "manual" ? 6 : undefined}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        অ্যাকাউন্ট স্ট্যাটাস
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as MemberStatus)}
                        aria-label="অ্যাকাউন্ট স্ট্যাটাস"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden"
                      >
                        <option value="Active">সক্রিয় (Active)</option>
                        <option value="Inactive">সাময়িক স্থগিত</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky footer actions — always visible */}
              <div className="shrink-0 flex items-center justify-end gap-2 border-t border-stone-100 bg-white px-4 sm:px-5 py-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] text-amber-50 font-bold text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {isSubmitting
                      ? createMode === "invite" && !editingMember
                        ? "পাঠানো হচ্ছে..."
                        : "সংরক্ষণ..."
                      : editingMember
                        ? "আপডেট করুন"
                        : createMode === "invite"
                          ? "ইনভাইটেশন পাঠান"
                          : "সংরক্ষণ করুন"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
