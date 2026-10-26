import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  Flame,
  Leaf,
  Quote,
  ArrowRight,
  PhoneCall,
  MapPin,
  Milk,
  Users,
  Award,
  CalendarHeart,
  Crown,
} from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "আমাদের সম্পর্কে — বগুড়ার ঐতিহ্যবাহী দই ও মিষ্টান্ন",
  description:
    "দই বিলাসের গল্প — বগুড়ার শতবর্ষী ঐতিহ্যবাহী মাটির সরার দই, খাঁটি গাওয়া ঘি ও প্রিমিয়াম মিষ্টান্নের গৌরবময় যাত্রা।",
  path: "/about",
});

interface Milestone {
  year: string;
  title: string;
  description: string;
  badge?: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "২০১২",
    title: "ঐতিহ্যের বীজ রোপণ",
    description:
      "বগুড়ার ঐতিহ্যবাহী পরিবারের কারিগরি জ্ঞানকে ভিত্তি করে ঘরোয়া পরিসরে খাঁটি সরার দই তৈরির মাধ্যমে আমাদের যাত্রার সূচনা।",
    badge: "শুরু",
  },
  {
    year: "২০১৬",
    title: "খামারি নেটওয়ার্ক ও সিরাজগঞ্জের দুধ",
    description:
      "গুণমান অক্ষুণ্ণ রাখতে সরাসরি স্থানীয় খামারি ও সিরাজগঞ্জের বিখ্যাত শাহজাদপুরের খাঁটি গাভীর দুধ সংগ্রহের নেটওয়ার্ক গড়ে তোলা হয়।",
  },
  {
    year: "২০২০",
    title: "ঢাকায় আধুনিক কোল্ড-চেইন ডেলিভারি",
    description:
      "বগুড়ার খাঁটি স্বাদ রাজধানী ঢাকাসহ অন্যান্য শহরের ভোজনরসিকদের ঘরে ঘরে পৌঁছে দিতে নিরাপদ আধুনিক প্যাকেজিং ও দ্রুততম ডেলিভারি ব্যবস্থা চালু।",
  },
  {
    year: "২০২৪",
    title: "পণ্যের বৈচিত্র্য ও মিষ্টান্ন সম্ভার",
    description:
      "সরার দইয়ের পাশাপাশি গাওয়া ঘি, শাহী লাড্ডু, ঘিয়ে ভাজা লাচ্ছা সেমাই এবং সুন্দরবনের খাঁটি মধুর মতো প্রিমিয়াম পণ্যের অন্তর্ভুক্তি।",
  },
  {
    year: "বর্তমান",
    title: "৫০,০০০+ পরিবারের নির্ভরতার প্রতীক",
    description:
      "আজ দই বিলাস বাংলাদেশের প্রতিটি উৎসব, পারিবারিক আয়োজন ও দৈনন্দিন খাদ্যতালিকায় খাঁটি স্বাদের এক নির্ভরযোগ্য নাম।",
    badge: "বর্তমান গৌরব",
  },
];

const STATS = [
  { icon: Milk, value: "১০০%", label: "খাঁটি দেশি গাভীর দুধ" },
  { icon: Users, value: "৫০,০০০+", label: "সন্তুষ্ট গ্রাহক ও পরিবার" },
  { icon: CalendarHeart, value: "২০১২", label: "সাল থেকে আমাদের যাত্রা" },
  { icon: ShieldCheck, value: "০%", label: "ভেজাল বা রাসায়নিক রঙ" },
];

const VALUES = [
  {
    icon: Leaf,
    title: "১০০% খাঁটি ও নির্ভেজাল উপাদান",
    description:
      "কোনো কৃত্রিম রং, ক্ষতিকর ফ্লেভার, ভেজাল বা রাসায়নিক প্রিজারভেটিভ ছাড়া শতভাগ প্রাকৃতিক দেশি গাভীর ঘন দুধ ও খাঁটি উপাদান ব্যবহার করা হয়।",
  },
  {
    icon: Flame,
    title: "ঐতিহ্যবাহী কাঠের জ্বালের কারিগরি",
    description:
      "বগুড়ার আদি রেসিপি অনুসারে দীর্ঘ সময় ধরে বিশেষ তামার কড়াইয়ে কাঠের মৃদু আঁচে দুধ ঘন করে প্রাকৃতিক মিষ্টতা ফুটিয়ে তোলা হয়।",
  },
  {
    icon: ShieldCheck,
    title: "বিশেষ লাল মাটির সরায় জমানো",
    description:
      "বগুড়ার ঐতিহ্যবাহী পোড়ামাটির তৈরি সরা অতিরিক্ত আর্দ্রতা শুষে নেয়, যার ফলে দই হয় ঘন, সুস্বাদু ও দীর্ঘক্ষণ টাটকা থাকে।",
  },
  {
    icon: HeartHandshake,
    title: "অটুট বিশ্বাস ও গ্রাহক সন্তুষ্টি",
    description:
      "গ্রাহকের তৃপ্তিই আমাদের পরম অর্জন। যেকোনো অনাকাঙ্ক্ষিত অসন্তুষ্টিতে আমরা নিঃশর্ত পরিবর্তন বা সমাধান নিশ্চিত করি।",
  },
];

const PROCESS_STEPS = [
  {
    step: "০১",
    title: "খাঁটি গাভীর দুধ সংগ্রহ",
    description:
      "প্রতিদিন ভোরবেলা সরাসরি স্থানীয় নির্ভরযোগ্য খামারিদের কাছ থেকে ফ্যাটসমৃদ্ধ ঘন দুধ সংগ্রহ ও ল্যাব টেস্টের মাধ্যমে বিশুদ্ধতা নিশ্চিত করা হয়।",
  },
  {
    step: "০২",
    title: "ধীরগতির জ্বাল ও ক্যারামেলাইজেশন",
    description:
      "বৃহৎ পাত্রে মৃদু তাপে দুধ দীর্ঘ সময় নাড়াচাড়া করে ঘন করা হয়, যা দইয়ের প্রাকৃতিক সোনালী-বাদামী বর্ণ ও অতুলনীয় ঘ্রাণ তৈরি করে।",
  },
  {
    step: "০৩",
    title: "মাটির সরায় সাজানো",
    description:
      "বগুড়ার কারিগরদের হাতে তৈরি বিশেষ লাল মাটির সরায় ঘন দুধ ঢেলে নিখুঁত মাত্রায় আদি কালচার (দইয়ের বীজ) মিশ্রিত করা হয়।",
  },
  {
    step: "০৪",
    title: "প্রাকৃতিক তাপে জমানো ও প্যাকেজিং",
    description:
      "তাপনিয়ন্ত্রিত ঐতিহ্যবাহী খড়ের কুঠুরিতে ১২-১৪ ঘণ্টা রেখে নিখুঁত জমাট বাঁধার পর জীবাণুমুক্ত ফুড-গ্রেড প্যাকিংয়ে প্রস্তুত করা হয়।",
  },
];

const CEO = {
  name: "মাইশা ফাহমিদা",
  englishName: "Maisha Fahmida",
  title: "প্রধান নির্বাহী কর্মকর্তা (CEO)",
  image: "/About/Maisha_Fahmida.jpg",
  message:
    "আমরা ব্যবসা করার উদ্দেশ্যে যাত্রা শুরু করিনি; আমরা শুরু করেছিলাম শৈশবের স্মৃতি, মা-দাদির হাতের খাঁটি স্বাদের হারিয়ে যাওয়া অনুভূতিটিকে বাঁচিয়ে রাখতে। প্রতিটি সরায় আমরা সেই সততা ও যত্ন পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ। দই বিলাসের প্রতি আপনার আস্থাই আমাদের সবচেয়ে মূল্যবান সম্পদ।",
  commitments: ["গুণমানে কোনো আপস নয়", "গ্রাহক সন্তুষ্টি সর্বাগ্রে", "ঐতিহ্য ও আধুনিকতার মেলবন্ধন"],
};

const heroGradient =
  "relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_24px_60px_-34px_rgba(169,94,53,0.6)]";

function SectionHeading({ eyebrow, title, highlight, subtitle }: { eyebrow: string; title: string; highlight: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent">
        <Sparkles className="w-3.5 h-3.5 text-doibrand-gold" />
        {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight">
        {title}{" "}
        <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* 1. Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className={`${heroGradient} max-w-7xl mx-auto px-5 py-10 sm:px-10 sm:py-14`}>
          <div className="pointer-events-none absolute -top-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-10 w-96 h-96 rounded-full bg-[#F7D9B0]/50 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">আমাদের সম্পর্কে</span>
          </nav>

          <div className="relative mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
              <Sparkles className="w-3.5 h-3.5" />
              ঐতিহ্য ও বিশুদ্ধতার অনন্য যাত্রা
            </span>
            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.15] tracking-tight">
              বগুড়ার শতাব্দী প্রাচীন দই ঐতিহ্যের{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                আধুনিক রূপায়ণ
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm sm:text-lg leading-relaxed text-stone-600">
              দই বিলাস শুধু একটি মিষ্টির ব্র্যান্ড নয়; এটি খাঁটি দুধ, পরম যত্ন আর শতবর্ষী বাঙালি খাদ্যসংস্কৃতির এক সজীব
              স্মারক। আমরা আধুনিক সুরক্ষায় ঐতিহ্যের আসল স্বাদ পরিবেশন করি।
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-doibrand-dark px-6 py-3 text-sm font-bold text-doibrand-light shadow-[0_12px_26px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
              >
                আমাদের পণ্য দেখুন
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#leadership"
                className="inline-flex items-center gap-2 rounded-full bg-white/85 px-6 py-3 text-sm font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-white transition"
              >
                <Crown className="w-4 h-4" />
                আমাদের নেতৃত্ব
              </a>
            </div>
          </div>

          <dl className="relative mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl bg-white/80 backdrop-blur p-4 sm:p-5 ring-1 ring-white shadow-sm">
                <span className="w-9 h-9 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <dt className="sr-only">{label}</dt>
                <dd className="mt-3 text-2xl sm:text-3xl font-extrabold bg-linear-to-br from-doibrand-dark via-doibrand-accent to-doibrand-gold bg-clip-text text-transparent">
                  {value}
                </dd>
                <p className="mt-0.5 text-[11px] sm:text-xs text-stone-500">{label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-doibrand-gold/20 shadow-[0_24px_50px_-30px_rgba(53,28,27,0.6)] group">
                <Image
                  src="/Product/doi.jpg"
                  alt="বগুড়ার ঐতিহ্যবাহী সরার দই"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-4 pt-10">
                <div className="relative aspect-square overflow-hidden rounded-3xl ring-1 ring-doibrand-gold/20 shadow-[0_24px_50px_-30px_rgba(53,28,27,0.6)] group">
                  <Image
                    src="/Product/mini_doi.png"
                    alt="মাটির কাপ দই"
                    fill
                    sizes="(max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-doibrand-gold/20 shadow-[0_24px_50px_-30px_rgba(53,28,27,0.6)] group">
                  <Image
                    src="/Product/laccha_semai.jpg"
                    alt="ঘিয়ে ভাজা লাচ্ছা সেমাই"
                    fill
                    sizes="(max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-2 sm:-left-4 max-w-xs flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-4 ring-1 ring-doibrand-gold/25 shadow-[0_20px_40px_-20px_rgba(53,28,27,0.5)]">
              <span className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white">
                <Quote className="w-4 h-4 fill-current" />
              </span>
              <p className="text-xs font-semibold leading-snug">“মাটির সরায় জমে থাকা নির্ভেজাল ভালোবাসা আর শতাব্দী প্রাচীন কারিগরি”</p>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent">
              <Sparkles className="w-3.5 h-3.5 text-doibrand-gold" />
              ঐতিহ্যের শিকড়
            </span>
            <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold leading-tight tracking-tight">
              বগুড়ার মহাস্থানগড় থেকে{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                প্রতিটি গৃহকোণে
              </span>
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-stone-600">
              বাংলাদেশে বগুড়ার দই কেবল একটি খাবার নয়, এটি একটি আভিজাত্য। নবাবী আমল থেকে শুরু করে আজ পর্যন্ত বগুড়ার সরার
              দইয়ের স্বাদের জুড়ি মেলা ভার। তবে শহরের যান্ত্রিক ব্যস্ততায় আসল খাঁটি স্বাদের দই পাওয়া দিন দিন অসম্ভব হয়ে উঠেছিল।
            </p>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-stone-600">
              সেই হারিয়ে যাওয়া খাঁটি স্বাদ আর সততাকে ফিরিয়ে আনতে আমাদের পথচলা। বগুড়া ও সিরাজগঞ্জের স্থানীয় গোয়ালাদের থেকে
              সরাসরি দুধ সংগ্রহ করে, শতাব্দী প্রাচীন প্রাকৃতিক জমানোর কৌশল ও কঠোর স্বাস্থ্যবিধি মেনে প্রতিটি সরা প্রস্তুত করা হয়।
            </p>
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "প্রাকৃতিক কালচার", text: "বংশের পুরনো আদি দইয়ের বীজ ছাড়া কোনো কৃত্রিম জমাটকারক নেই" },
                { title: "পোড়ামাটির বিশেষ সরা", text: "বগুড়ার কারিগরদের ঐতিহ্যবাহী লাল পোড়ামাটি যা জলীয় অংশ শোষে" },
              ].map(({ title, text }) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 shadow-[0_10px_28px_-22px_rgba(53,28,27,0.4)]">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-doibrand-gold" />
                  <div>
                    <h3 className="text-sm font-bold">{title}</h3>
                    <p className="mt-0.5 text-xs text-stone-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <SectionHeading
          eyebrow="আমাদের মূলনীতি"
          title="যে চারটি স্তম্ভের ওপর দাঁড়িয়ে"
          highlight="দই বিলাস"
          subtitle="আমরা মানের সাথে কখনো আপস করি না। প্রতিটি পদক্ষেপে থাকে কঠোর সততা ও দায়বদ্ধতা।"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-stone-200/70 shadow-[0_14px_34px_-26px_rgba(53,28,27,0.45)] transition-all duration-300 hover:-translate-y-1 hover:ring-doibrand-gold/50 hover:shadow-[0_24px_44px_-26px_rgba(169,94,53,0.55)]"
            >
              <span className="absolute top-0 left-0 h-[2px] w-0 bg-linear-to-r from-doibrand-gold to-doibrand-accent transition-all duration-500 group-hover:w-full" />
              <span className="w-12 h-12 grid place-items-center rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
                <Icon className="w-6 h-6" />
              </span>
              <h3 className="mt-5 text-base sm:text-lg font-bold leading-snug">{title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Leadership — CEO */}
      <section id="leadership" className="scroll-mt-36 px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className={`${heroGradient} max-w-6xl mx-auto p-6 sm:p-10 lg:p-12`}>
          <div className="pointer-events-none absolute -top-20 right-1/3 w-80 h-80 rounded-full bg-white/60 blur-3xl" />
          <Quote className="pointer-events-none absolute right-6 top-6 w-32 h-32 text-doibrand-gold/10 fill-current" strokeWidth={0} />

          <div className="relative grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] items-center gap-8 md:gap-12">
            {/* Portrait */}
            <div className="relative mx-auto md:mx-0">
              <div className="relative w-56 h-64 sm:w-64 sm:h-72 rounded-[28px] p-1.5 bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent shadow-[0_30px_60px_-30px_rgba(169,94,53,0.85)]">
                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-white">
                  <Image
                    src={CEO.image}
                    alt={`${CEO.name}, ${CEO.title}`}
                    fill
                    sizes="256px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-doibrand-dark px-4 py-2 text-xs font-bold text-doibrand-light shadow-lg">
                <Crown className="w-3.5 h-3.5 text-doibrand-gold fill-current" />
                CEO, দই বিলাস
              </span>
            </div>

            {/* Message */}
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white">
                <Sparkles className="w-3.5 h-3.5" />
                নেতৃত্বের বার্তা
              </span>
              <blockquote className="mt-5 text-base sm:text-xl leading-relaxed text-stone-700">
                <span className="text-3xl leading-none text-doibrand-gold font-serif">“</span>
                {CEO.message}
                <span className="text-3xl leading-none text-doibrand-gold font-serif">”</span>
              </blockquote>

              <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold">{CEO.name}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-doibrand-gold">{CEO.englishName}</p>
                  <p className="mt-1 text-xs text-stone-500">{CEO.title}, দই বিলাস</p>
                </div>
                <span className="hidden md:block w-px self-stretch bg-doibrand-gold/25" />
                <ul className="flex flex-wrap justify-center md:justify-start gap-2">
                  {CEO.commitments.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-doibrand-gold/25"
                    >
                      <Award className="w-3.5 h-3.5 text-doibrand-gold" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <SectionHeading
          eyebrow="কারিগরী প্রণালী"
          title="কীভাবে তৈরি হয়"
          highlight="স্পেশাল সরার দই?"
          subtitle="যান্ত্রিক অটোমেশন নয়; নিপুণ কারিগরের হাতের মমতায় তৈরি হয় নিখুঁত ঘনত্বের আসল দই।"
        />
        <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <span className="pointer-events-none absolute left-[12%] right-[12%] top-7 hidden lg:block h-0.5 bg-linear-to-r from-doibrand-gold/20 via-doibrand-gold/60 to-doibrand-gold/20" />
          {PROCESS_STEPS.map((proc) => (
            <li key={proc.step} className="relative rounded-3xl bg-white p-6 pt-5 ring-1 ring-stone-200/70 shadow-[0_14px_34px_-26px_rgba(53,28,27,0.45)]">
              <span className="relative z-10 w-14 h-14 grid place-items-center rounded-2xl bg-linear-to-br from-doibrand-accent to-doibrand-gold text-lg font-extrabold text-white ring-4 ring-doibrand-light shadow-[0_10px_22px_-10px_rgba(169,94,53,0.9)]">
                {proc.step}
              </span>
              <h3 className="mt-5 text-base font-bold">{proc.title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-500">{proc.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 6. Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <SectionHeading
          eyebrow="আমাদের মাইলফলক"
          title="একটি স্বপ্ন থেকে আজ"
          highlight="ঐতিহ্যের বিশ্বস্ত প্রতীক"
          subtitle="২০১২ সাল থেকে নিষ্ঠা, পরিশ্রম ও গ্রাহকের অফুরন্ত ভালোবাসায় আজকের দই বিলাস।"
        />
        <ol className="relative ml-4 sm:ml-32 space-y-6 border-l-2 border-doibrand-gold/30">
          {MILESTONES.map((item) => (
            <li key={item.year} className="relative pl-7 sm:pl-9 group">
              <span className="absolute -left-[11px] top-5 w-5 h-5 rounded-full bg-white ring-4 ring-doibrand-gold transition-transform group-hover:scale-125" />
              <span className="sm:absolute sm:-left-32 sm:top-4 sm:w-24 sm:text-right inline-block mb-2 sm:mb-0 rounded-full bg-[#FBF1E4] sm:bg-transparent px-3 sm:px-0 py-0.5 text-sm sm:text-base font-extrabold text-doibrand-accent">
                {item.year}
              </span>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-stone-200/70 shadow-[0_10px_28px_-22px_rgba(53,28,27,0.4)] transition group-hover:ring-doibrand-gold/50">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold">{item.title}</h3>
                  {item.badge && (
                    <span className="rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-stone-500">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 7. CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl bg-linear-to-r from-[#F6E2C3] via-[#FFF6EA] to-[#EFD2A6] ring-1 ring-doibrand-gold/25 px-6 py-10 sm:px-12 sm:py-12 text-center shadow-[0_20px_50px_-32px_rgba(169,94,53,0.6)]">
          <Milk className="pointer-events-none absolute -left-6 -bottom-8 w-40 h-40 text-doibrand-gold/15 -rotate-12" strokeWidth={1.25} />
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-doibrand-accent ring-1 ring-doibrand-gold/25">
            <Sparkles className="w-3.5 h-3.5" />
            খাঁটি স্বাদের অভিজ্ঞতা নিন
          </span>
          <h2 className="relative mt-4 text-2xl sm:text-[34px] font-extrabold leading-tight tracking-tight">
            আজই আপনার আয়োজনে নিয়ে আসুন{" "}
            <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
              বগুড়ার আসল স্বাদ
            </span>
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-stone-600">
            স্পেশাল সরার দই, শাহী লাড্ডু কিংবা গাওয়া ঘিয়ে ভাজা লাচ্ছা সেমাই — সবই পৌঁছে যাবে আপনার ঠিকানায় সম্পূর্ণ তাজা অবস্থায়।
          </p>
          <div className="relative mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-doibrand-dark px-7 py-3.5 text-sm font-bold text-doibrand-light shadow-[0_12px_26px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
            >
              সকল পণ্য দেখুন
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/category/premium-doi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/85 px-7 py-3.5 text-sm font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-white transition"
            >
              প্রিমিয়াম দই সংগ্রহ
            </Link>
          </div>
          <div className="relative mt-8 pt-6 border-t border-doibrand-gold/20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-600">
            <a href="tel:+8801645460095" className="inline-flex items-center gap-2 hover:text-doibrand-accent transition-colors">
              <PhoneCall className="w-4 h-4 text-doibrand-gold" />
              হটলাইন: <span className="font-bold font-sans">01645-460095</span>
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-doibrand-gold" />
              কারখানা: শেরপুর রোড, বগুড়া সদর, বগুড়া
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
