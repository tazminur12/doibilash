"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Phone,
} from "lucide-react";

type InviteInfo = {
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  designation: string;
};

export default function AcceptInvitePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-bengali text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#C48A4E] border-t-transparent rounded-full animate-spin" />
            <span>ইনভাইটেশন যাচাই হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <AcceptInviteContent />
    </React.Suspense>
  );
}

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [loadError, setLoadError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoadError("ইনভাইটেশন লিংকটি অসম্পূর্ণ। ইমেইল থেকে সম্পূর্ণ লিংকটি খুলুন।");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/auth/accept-invite?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setLoadError(data.error || "ইনভাইটেশন যাচাই করা যায়নি।");
        } else {
          setInvite(data.invite);
        }
      } catch {
        if (!cancelled) setLoadError("সার্ভারে সংযোগ করা যায়নি।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password.trim().length < 6) {
      setFormError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("পাসওয়ার্ড ও নিশ্চিতকরণ মিলছে না।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: password.trim(),
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFormError(data.error || "পাসওয়ার্ড সেট করা যায়নি।");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/login?redirect=/admin&invited=1");
      }, 1600);
    } catch {
      setFormError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] font-bengali text-stone-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-amber-100 shadow-lg mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#351C1B] tracking-tight">অ্যাডমিন ইনভাইটেশন</h1>
          <p className="text-sm text-stone-500 mt-1">পাসওয়ার্ড সেট করে টিমে যোগ দিন</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl p-6 sm:p-8">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-10 text-stone-500">
              <Clock className="w-8 h-8 animate-spin text-[#C48A4E]" />
              <span className="text-sm">ইনভাইটেশন যাচাই হচ্ছে...</span>
            </div>
          )}

          {!loading && loadError && (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{loadError}</p>
              <Link
                href="/login?redirect=/admin"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#C48A4E] hover:underline"
              >
                লগইন পেজে যান <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {!loading && success && (
            <div className="text-center space-y-3 py-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-stone-900">পাসওয়ার্ড সেট হয়েছে!</h2>
              <p className="text-sm text-stone-600">এখন লগইন পেজে নিয়ে যাওয়া হচ্ছে...</p>
            </div>
          )}

          {!loading && invite && !success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-2xl bg-[#FAF8F5] border border-amber-900/10 p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
                  আপনাকে অ্যাডমিন হিসেবে রিকোয়েস্ট পাঠানো হয়েছে
                </p>
                <div className="font-bold text-stone-900">{invite.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <Mail className="w-3.5 h-3.5 text-[#C48A4E]" />
                  <span>{invite.email}</span>
                </div>
                <div className="text-xs text-stone-500">
                  রোল: <span className="font-semibold text-stone-800">{invite.roleLabel}</span>
                  {invite.designation ? ` · ${invite.designation}` : ""}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  মোবাইল নম্বর (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-XXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  নতুন পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full pl-10 pr-12 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="আবার পাসওয়ার্ড লিখুন"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                  />
                </div>
              </div>

              {formError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-600 ring-1 ring-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] py-3 text-sm font-bold text-amber-50 shadow-lg hover:brightness-110 disabled:opacity-60 transition"
              >
                {submitting && <Clock className="w-4 h-4 animate-spin" />}
                <span>{submitting ? "সেভ হচ্ছে..." : "পাসওয়ার্ড সেট করুন ও চালিয়ে যান"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
