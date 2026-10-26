import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Building2,
  Heart,
  Briefcase,
  Gift,
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  Factory,
  BadgePercent,
  Palette,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import CorporateInquiryForm from "@/components/contact/CorporateInquiryForm";

export const metadata: Metadata = pageMetadata({
  title: "কর্পোরেট যোগাযোগ — বিয়ে ও কর্পোরেট ইভেন্টের বিশেষ অর্ডার",
  description:
    "বিয়ে, কর্পোরেট গিফটিং ও যেকোনো উৎসবের জন্য দই বিলাসের বাল্ক অর্ডার — ৫০টির বেশি অর্ডারে বিশেষ ছাড় ও কাস্টম লোগো প্যাকেজিং।",
  path: "/contact",
});

const CONTACT = {
  phoneDisplay: "01645-460095",
  phoneHref: "tel:+8801645460095",
  whatsapp: "8801645460095",
  email: "support@doibilash.com",
  office: "বনানী, ঢাকা - ১২১৩, বাংলাদেশ",
  factory: "শেরপুর রোড, বগুড়া সদর, বগুড়া",
};

const HIGHLIGHTS = [
  { icon: BadgePercent, text: "৫০+ অর্ডারে বিশেষ ছাড়" },
  { icon: Palette, text: "কাস্টম লোগো প্যাকেজিং" },
  { icon: CalendarCheck, text: "নির্ধারিত তারিখে ডেলিভারি" },
];

const SERVICES = [
  {
    icon: Heart,
    title: "বিয়ে ও পারিবারিক অনুষ্ঠান",
    description: "গায়ে হলুদ, বিয়ে ও বৌভাতে অতিথি আপ্যায়নের জন্য মাটির সরার দই ও মিষ্টি।",
  },
  {
    icon: Briefcase,
    title: "কর্পোরেট গিফটিং",
    description: "ক্লায়েন্ট ও কর্মীদের জন্য প্রতিষ্ঠানের লোগোসহ প্রিমিয়াম গিফট হ্যাম্পার।",
  },
  {
    icon: Building2,
    title: "অফিস ইভেন্ট ও মিটিং",
    description: "সেমিনার, বার্ষিক অনুষ্ঠান ও বোর্ড মিটিংয়ের জন্য ডেজার্ট প্যাকেজ।",
  },
  {
    icon: Gift,
    title: "ঈদ ও উৎসব উপহার",
    description: "ঈদ, পূজা ও নববর্ষে প্রিয়জনকে পাঠানোর জন্য বিশেষ উৎসব বক্স।",
  },
];

const STEPS = [
  { number: "০১", title: "যোগাযোগ করুন", description: "ফর্ম পূরণ, কল বা WhatsApp-এ আপনার চাহিদা জানান।" },
  { number: "০২", title: "মেনু ও বাজেট", description: "আপনার বাজেট অনুযায়ী পণ্য ও পরিমাণ চূড়ান্ত করা হবে।" },
  { number: "০৩", title: "কাস্টম প্যাকেজিং", description: "লোগো, শুভেচ্ছা কার্ড ও প্যাকেজিং ডিজাইন অনুমোদন।" },
  { number: "০৪", title: "সময়মতো ডেলিভারি", description: "কোল্ড-চেইনে নির্ধারিত তারিখে নিরাপদে পৌঁছে দেওয়া।" },
];

const CONTACT_CARDS = [
  { icon: PhoneCall, label: "কর্পোরেট হটলাইন", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref, sans: true },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "সরাসরি মেসেজ করুন",
    href: `https://wa.me/${CONTACT.whatsapp}`,
    external: true,
  },
  { icon: Mail, label: "ইমেইল", value: CONTACT.email, href: `mailto:${CONTACT.email}`, sans: true },
  { icon: MapPin, label: "অফিস", value: CONTACT.office },
  { icon: Factory, label: "কারখানা", value: CONTACT.factory },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-doibrand-light font-bengali text-doibrand-dark">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_24px_60px_-34px_rgba(169,94,53,0.6)] px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-[#F7D9B0]/50 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
          <Gift className="pointer-events-none absolute right-6 bottom-4 hidden md:block w-56 h-56 text-doibrand-gold/10 rotate-12" strokeWidth={1} />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">কর্পোরেট যোগাযোগ</span>
          </nav>

          <div className="relative mt-6 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
              <Sparkles className="w-3.5 h-3.5" />
              কর্পোরেট ও বাল্ক অর্ডার
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              আপনার বিশেষ আয়োজনে{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                রাজকীয় স্বাদ
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-stone-600">
              বিয়ে, কর্পোরেট ইভেন্ট কিংবা উৎসব — বগুড়ার খাঁটি দই ও মিষ্টান্নে আপনার অতিথিদের মুগ্ধ করুন। ৫০টির বেশি
              অর্ডারে বিশেষ ছাড় এবং আপনার প্রতিষ্ঠানের লোগো সম্বলিত কাস্টম উপহার প্যাকেজিং।
            </p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-xs font-semibold text-doibrand-dark ring-1 ring-doibrand-gold/25 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-doibrand-gold" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-doibrand-dark px-6 py-3 text-sm font-bold text-doibrand-light shadow-[0_12px_26px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                এখনই কল করুন
              </a>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-3 text-sm font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-white transition"
              >
                কোটেশন চান
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-[32px] font-extrabold tracking-tight">
              যেসব আয়োজনে{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                আমরা পাশে আছি
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500">ছোট থেকে বড় — যেকোনো আয়োজনের জন্য কাস্টম প্যাকেজ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {SERVICES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl bg-white p-5 ring-1 ring-stone-200/70 shadow-[0_10px_28px_-20px_rgba(53,28,27,0.4)] transition-all duration-300 hover:-translate-y-1 hover:ring-doibrand-gold/50 hover:shadow-[0_22px_40px_-22px_rgba(169,94,53,0.55)]"
              >
                <span className="w-12 h-12 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form + Contact Info */}
      <section id="inquiry" className="scroll-mt-40 px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
          <div className="lg:col-span-3 rounded-3xl bg-white p-5 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_20px_50px_-32px_rgba(53,28,27,0.45)]">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">কোটেশনের জন্য অনুরোধ করুন</h2>
            <p className="mt-1 mb-6 text-xs sm:text-sm text-stone-500">
              নিচের তথ্যগুলো দিন — আমাদের কর্পোরেট টিম আপনার জন্য বিশেষ প্রস্তাব তৈরি করবে।
            </p>
            <CorporateInquiryForm whatsappNumber={CONTACT.whatsapp} />
          </div>

          <aside className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF6E9] via-[#FFFDF9] to-[#F8E7CF] p-5 sm:p-6 ring-1 ring-doibrand-gold/20 shadow-[0_14px_36px_-22px_rgba(169,94,53,0.45)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
              <h3 className="text-lg font-bold">সরাসরি যোগাযোগ</h3>
              <p className="mt-1 text-xs text-stone-500">যেকোনো প্রশ্নে আমরা আছি আপনার পাশে</p>

              <ul className="mt-5 space-y-2.5">
                {CONTACT_CARDS.map(({ icon: Icon, label, value, href, sans, external }) => {
                  const content = (
                    <>
                      <span className="shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25 shadow-sm transition-colors group-hover:bg-doibrand-gold group-hover:text-white">
                        <Icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold text-doibrand-gold">{label}</span>
                        <span className={`block text-sm font-bold text-doibrand-dark truncate ${sans ? "font-sans" : ""}`}>
                          {value}
                        </span>
                      </span>
                      {href && (
                        <ChevronRight className="ml-auto w-4 h-4 shrink-0 text-stone-300 transition-transform group-hover:translate-x-0.5 group-hover:text-doibrand-gold" />
                      )}
                    </>
                  );
                  const rowClass =
                    "group flex items-center gap-3 rounded-2xl bg-white/60 p-3 ring-1 ring-white transition hover:bg-white";
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className={rowClass}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className={rowClass}>{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-5 sm:p-6 ring-1 ring-stone-200/70 shadow-[0_14px_36px_-24px_rgba(53,28,27,0.4)]">
              <h3 className="text-lg font-bold">অর্ডার প্রক্রিয়া</h3>
              <ol className="mt-4 space-y-4">
                {STEPS.map((step, i) => (
                  <li key={step.number} className="relative flex gap-3.5">
                    {i < STEPS.length - 1 && (
                      <span className="absolute left-[18px] top-10 bottom-[-12px] w-px bg-linear-to-b from-doibrand-gold/50 to-doibrand-gold/10" />
                    )}
                    <span className="shrink-0 w-9 h-9 grid place-items-center rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold text-[13px] font-bold text-white shadow-[0_6px_14px_-6px_rgba(169,94,53,0.7)]">
                      {step.number}
                    </span>
                    <span className="pt-1">
                      <span className="block text-sm font-bold">{step.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">{step.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <div className="h-12 md:h-16" />
    </main>
  );
}
