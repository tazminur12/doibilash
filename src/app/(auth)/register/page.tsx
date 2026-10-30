"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Phone,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  Award,
  Star,
  ChevronLeft,
  Store,
  Check,
  Gift,
  TicketPercent,
} from "lucide-react";
import { registerUser } from "@/lib/authStorage";

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-bengali text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#C48A4E] border-t-transparent rounded-full animate-spin" />
            <span>লোড হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <RegisterContent />
    </React.Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/profile";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Simple password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-zA-Z]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "দুর্বল (Weak)", color: "bg-red-500 text-red-600" };
    if (score <= 3) return { score: 2, label: "সাধারণ (Medium)", color: "bg-amber-500 text-amber-600" };
    return { score: 3, label: "শক্তিশালী (Strong)", color: "bg-emerald-500 text-emerald-600" };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("দয়া করে আপনার পুরো নাম লিখুন।");
      return;
    }
    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      setError("সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }
    if (password.length < 6) {
      setError("পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না, পুনরায় যাচাই করুন।");
      return;
    }
    if (!agreeTerms) {
      setError("রেজিস্ট্রেশন সম্পন্ন করতে শর্তাবলীতে সম্মতি প্রদান করুন।");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerUser({
        name,
        phone: cleanPhone,
        email,
        password,
      });

      if (res.ok) {
        setSuccessMsg(`অভিনন্দন ${res.user.name}! আপনার অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে।`);
        setTimeout(() => {
          router.push(redirectPath);
        }, 900);
      } else {
        setError(res.error);
        setIsLoading(false);
      }
    }, 750);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] font-bengali text-stone-900 flex flex-col justify-between selection:bg-[#C48A4E]/30 selection:text-[#351C1B]">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-5xl rounded-3xl bg-white shadow-[0_24px_70px_-20px_rgba(53,28,27,0.2)] border border-amber-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          
          {/* ── LEFT SHOWCASE PANEL (Desktop) ─────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-linear-to-br from-[#200F0E] via-[#2F1514] to-[#180A09] text-white overflow-hidden">
            {/* Ambient Lighting */}
            <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#C48A4E]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-[#A95E35]/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />

            {/* Brand Logo */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FAF8F5] via-[#F3E5D8] to-[#C48A4E] p-0.5 shadow-md shadow-black/40 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-[#351C1B] flex items-center justify-center text-[#C48A4E]">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-2xl text-white tracking-tight group-hover:text-amber-200 transition-colors">
                      দই বিলাস
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#C48A4E]" />
                  </div>
                  <p className="text-[11px] text-amber-200/70 font-medium">
                    বগুড়ার খাঁটি ঐতিহ্যবাহী আদি স্বাদ
                  </p>
                </div>
              </Link>
            </div>

            {/* Middle Membership Perks */}
            <div className="relative z-10 my-8 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C48A4E]/20 border border-[#C48A4E]/30 text-amber-300 text-xs font-semibold">
                  <Gift className="w-3.5 h-3.5" />
                  সদস্যদের বিশেষ সুবিধাসমূহ
                </span>
                <h2 className="mt-3 text-2xl font-black leading-snug text-white">
                  দই বিলাস পরিবারের সম্মানিত সদস্য হোন
                </h2>
                <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                  অ্যাকাউন্ট তৈরি করে প্রথম অর্ডারেই পান বিশেষ প্রোমো ভাউচার এবং উপভোগ করুন ঝামেলামুক্ত কেনাকাটা।
                </p>
              </div>

              {/* 4 Benefits with icons */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <TicketPercent className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">প্রথম অর্ডারে বিশেষ ভাউচার</p>
                    <p className="text-[11px] text-stone-400">কোড <span className="font-mono text-amber-200 font-bold">DOI100</span> ব্যবহারে ১০০ টাকা সাশ্রয়</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">লাইভ অর্ডার ট্র্যাকিং ও ইতিহাস</p>
                    <p className="text-[11px] text-stone-400">আপনার প্রতিটি অর্ডারের অবস্থান ও মেমো সংরক্ষণ</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">উৎসব সম্ভারে আর্লি এক্সেস</p>
                    <p className="text-[11px] text-stone-400">ঈদ, পূজা ও উৎসবের লিমিটেড গিফট প্যাক সবার আগে</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C48A4E]/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">১০০% গ্রাহক তথ্য গোপনীয়তা</p>
                <p className="text-[10px] text-stone-300">আপনার ব্যক্তিগত তথ্য সুরক্ষিত ও নিরাপদ এনক্রিপ্টেড</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIGN-UP FORM ───────────────────────────────────── */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white relative">
            
            {/* Top Back Nav */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#A95E35] transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ওয়েবসাইটে ফিরে যান</span>
              </Link>

              <div className="text-xs text-stone-500">
                ইতিমধ্যে একাউন্ট আছে?{" "}
                <Link href="/login" className="font-bold text-[#A95E35] hover:underline">
                  লগইন
                </Link>
              </div>
            </div>

            {/* Form Header */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-doibrand-dark tracking-tight">
                    নতুন অ্যাকাউন্ট তৈরি করুন
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    কয়েক সেকেন্ডেই আপনার বিনামূল্যে দই বিলাস প্রোফাইল খুলুন
                  </p>
                </div>

                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
                >
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C48A4E]" />
                </Link>
              </div>

              {/* Feedback messages */}
              {error && (
                <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Sign up form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                  >
                    আপনার পুরো নাম *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 pointer-events-none">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-stone-200 text-sm font-semibold text-doibrand-dark placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E] transition shadow-xs"
                    />
                  </div>
                </div>

                {/* Mobile & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Phone */}
                  <div>
                    <label
                      htmlFor="registerPhone"
                      className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                    >
                      মোবাইল নম্বর *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 pointer-events-none">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        id="registerPhone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-stone-200 text-sm font-semibold text-doibrand-dark placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E] transition shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label
                      htmlFor="registerEmail"
                      className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                    >
                      ইমেইল ঠিকানা (ঐচ্ছিক)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 pointer-events-none">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        id="registerEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-stone-200 text-sm font-semibold text-doibrand-dark placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E] transition shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="regPassword"
                      className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                    >
                      পাসওয়ার্ড *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 pointer-events-none">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        id="regPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="ন্যূনতম ৬ অক্ষর"
                        className="w-full pl-11 pr-11 py-2.5 sm:py-3 rounded-xl border border-stone-200 text-sm font-semibold text-doibrand-dark placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E] transition shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden flex gap-1">
                          <span
                            className={`h-full flex-1 rounded-full ${
                              strength.score >= 1 ? strength.color.split(" ")[0] : "bg-stone-200"
                            }`}
                          />
                          <span
                            className={`h-full flex-1 rounded-full ${
                              strength.score >= 2 ? strength.color.split(" ")[0] : "bg-stone-200"
                            }`}
                          />
                          <span
                            className={`h-full flex-1 rounded-full ${
                              strength.score >= 3 ? strength.color.split(" ")[0] : "bg-stone-200"
                            }`}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${strength.color.split(" ")[1]}`}>
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                    >
                      পাসওয়ার্ড নিশ্চিত করুন *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 pointer-events-none">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                        className={`w-full pl-11 pr-11 py-2.5 sm:py-3 rounded-xl border text-sm font-semibold text-doibrand-dark placeholder-stone-400 bg-white focus:outline-none transition shadow-xs ${
                          passwordsMatch
                            ? "border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                            : passwordsMismatch
                            ? "border-red-400 focus:ring-2 focus:ring-red-400/30"
                            : "border-stone-200 focus:ring-2 focus:ring-[#C48A4E]/30"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {confirmPassword && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold">
                        {passwordsMatch ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            পাসওয়ার্ড মিলেছে
                          </span>
                        ) : (
                          <span className="text-red-500">পাসওয়ার্ড মিলছে না</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#A95E35] focus:ring-[#C48A4E] accent-[#A95E35] cursor-pointer"
                    />
                    <span className="text-xs text-stone-600 leading-snug">
                      আমি দই বিলাসের{" "}
                      <Link href="/terms" target="_blank" className="text-[#A95E35] font-bold hover:underline">
                        ব্যবহারের শর্তাবলী
                      </Link>{" "}
                      এবং{" "}
                      <Link href="/privacy-policy" target="_blank" className="text-[#A95E35] font-bold hover:underline">
                        প্রাইভেসি পলিসি
                      </Link>{" "}
                      পড়ে সম্মতি জানাচ্ছি।
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-linear-to-r from-[#A95E35] via-[#C48A4E] to-[#A95E35] bg-[length:150%_100%] hover:bg-right text-white font-bold text-sm sm:text-base shadow-lg shadow-[#A95E35]/25 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Login Link */}
            <div className="pt-5 mt-5 border-t border-stone-100 text-center">
              <p className="text-xs sm:text-sm text-stone-600">
                ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি আছে?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#A95E35] hover:text-[#C48A4E] transition underline underline-offset-2"
                >
                  লগইন করুন
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
