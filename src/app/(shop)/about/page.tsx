import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  HeartHandshake,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Truck,
  Leaf,
  Users,
  Quote,
  ArrowRight,
  PhoneCall,
  MapPin,
} from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে | দই বিলাস - বগুড়ার ঐতিহ্যবাহী দই ও মিষ্টান্ন",
  description:
    "দই বিলাসের গল্প — বগুড়ার শতবর্ষী ঐতিহ্যবাহী মাটির সরার দই, খাঁটি গাওয়া ঘি ও প্রিমিয়াম মিষ্টান্নের গৌরবময় যাত্রা।",
};

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
      "সরার দইয়ের পাশাপাশি গাওয়া ঘি, শাহী লাড্ডু, ঘিয়ে ভাজা লাচ্ছা সেমাই এবং সুন্দরবনের খাঁটি মধুর মতো প্রিমিয়াম পণ্যের অন্তর্ভুক্তি।",
  },
  {
    year: "বর্তমান",
    title: "৫০,০০০+ পরিবারের নির্ভরতার প্রতীক",
    description:
      "আজ দই বিলাস বাংলাদেশের প্রতিটি উৎসব, পারিবারিক আয়োজন ও দৈনন্দিন খাদ্যতালিকায় খাঁটি স্বাদের এক নির্ভরযোগ্য নাম।",
    badge: "বর্তমান গৌরব",
  },
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
      "বগুড়ার আদি রেসিপি অনুসারে দীর্ঘ সময় ধরে বিশেষ তামার কড়াইয়ে কাঠের মৃদু আঁচে দুধ ঘন করে প্রাকৃতিক মিষ্টতা ফুটিয়ে তোলা হয়।",
  },
  {
    icon: ShieldCheck,
    title: "বিশেষ লাল মাটির সরায় জমানো",
    description:
      "বগুড়ার ঐতিহ্যবাহী পোড়ামাটির তৈরি সরা অতিরিক্ত আর্দ্রতা শুষে নেয়, যার ফলে দই হয় ঘন, সুস্বাদু ও দীর্ঘক্ষণ টাটকা থাকে।",
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
      "বৃহৎ পাত্রে মৃদু তাপে দুধ দীর্ঘ সময় নাড়াচাড়া করে ঘন করা হয়, যা দইয়ের প্রাকৃতিক সোনালী-বাদামী বর্ণ ও অতুলনীয় ঘ্রাণ তৈরি করে।",
  },
  {
    step: "০৩",
    title: "মাটির সরায় সাজানো ও ছাঁকা",
    description:
      "বগুড়ার কারিগরদের হাতে তৈরি বিশেষ লাল মাটির সরায় ঘন দুধ ঢেলে নিখুঁত মাত্রায় আদি কালচার (দইয়ের বীজ) মিশ্রিত করা হয়।",
  },
  {
    step: "০৪",
    title: "প্রাকৃতিক তাপে জমানো ও প্যাকেজিং",
    description:
      "তাপনিয়ন্ত্রিত ঐতিহ্যবাহী খড়ের কুঠুরিতে ১২-১৪ ঘণ্টা রেখে নিখুঁত জমাত বাঁধার পর জীবাণুমুক্ত ফুড-গ্রেড প্যাকিংয়ে গ্রাহকের জন্য প্রস্তুত করা হয়।",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark">
      {/* ── 1. Hero Story Banner ───────────────────────────────── */}
      <section className="relative bg-doibrand-dark text-white overflow-hidden py-16 sm:py-24">
        {/* Ambient Gradient Glows */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-doibrand-gold/25 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-doibrand-accent/20 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Traditional Dot Matrix Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C48A4E_1.5px,transparent_1.5px)] [background-size:24px_24px]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-300 font-bengali mb-6">
            <Link href="/" className="hover:text-doibrand-gold transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-doibrand-gold font-medium">আমাদের সম্পর্কে</span>
          </nav>

          <div className="max-w-3xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-doibrand-gold/20 border border-doibrand-gold/40 text-doibrand-gold px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 font-bengali">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ঐতিহ্য ও বিশুদ্ধতার অনন্য যাত্রা</span>
            </div>

            {/* Main Title */}
            <h1 className="font-bengali text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2] mb-6">
              বগুড়ার শতাব্দী প্রাচীন দই ঐতিহ্যের আধুনিক রূপায়ণ
            </h1>

            {/* Subtitle */}
            <p className="font-bengali text-stone-200 text-base sm:text-lg sm:leading-relaxed font-light mb-10 max-w-2xl">
              দই বিলাস শুধু একটি মিষ্টির ব্র্যান্ড নয়; এটি খাঁটি দুধ, পরম যত্ন আর শতবর্ষী বাঙালি খাদ্যসংস্কৃতির এক সজীব স্মারক। আমরা আধুনিক সুরক্ষায় ঐতিহ্যের আসল স্বাদ পরিবেশন করি।
            </p>
          </div>

          {/* Quick Stat Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-stone-700/60">
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-doibrand-gold font-sans">
                ১০০%
              </div>
              <p className="font-bengali text-xs sm:text-sm text-stone-300 mt-1 font-medium">
                খাঁটি দেশি গাভীর দুধ
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-doibrand-gold font-sans">
                ৫০,০০০+
              </div>
              <p className="font-bengali text-xs sm:text-sm text-stone-300 mt-1 font-medium">
                সন্তুষ্ট গ্রাহক ও পরিবার
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-doibrand-gold font-sans">
                ১৫+ বছর
              </div>
              <p className="font-bengali text-xs sm:text-sm text-stone-300 mt-1 font-medium">
                পারিবারিক কারিগরি ঐতিহ্য
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl font-bold text-doibrand-gold font-sans">
                ০%
              </div>
              <p className="font-bengali text-xs sm:text-sm text-stone-300 mt-1 font-medium">
                ভেজাল বা রাসায়নিক রঙ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The Origin Story & Craftsmanship ──────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Collage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group">
                <Image
                  src="https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80"
                  alt="বগুড়ার ঐতিহ্যবাহী সরার দই"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                  <Image
                    src="https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80"
                    alt="খাঁটি গাভীর দুধ জ্বাল দেওয়া"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md group">
                  <Image
                    src="https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80"
                    alt="প্রিমিয়াম মিষ্টান্ন ও লাড্ডু"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>

            {/* Floating Glassmorphic Quote Badge */}
            <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xl max-w-xs hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                <Quote className="w-5 h-5" />
              </div>
              <p className="font-bengali text-xs font-semibold text-doibrand-dark leading-snug">
                “মাটির সরায় জমে থাকা নির্ভেজাল ভালোবাসা আর শতাব্দী প্রাচীন কারিগরি”
              </p>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-doibrand-accent font-bengali text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ঐতিহ্যের শিকড়</span>
            </div>

            <h2 className="font-bengali text-3xl sm:text-4xl font-bold text-doibrand-dark leading-snug">
              বগুড়ার মহাস্থানগড় থেকে সারা দেশের প্রতিটি গৃহকোণে
            </h2>

            <p className="font-bengali text-gray-700 text-sm sm:text-base leading-relaxed">
              বাংলাদেশে বগুড়ার দই কেবল একটি খাবার নয়, এটি একটি আভিজাত্য। নবাবী আমল থেকে শুরু করে আজ পর্যন্ত বগুড়ার সরার দইয়ের স্বাদের জুড়ি মেলা ভার। তবে শহরের যান্ত্রিক ব্যস্ততায় আসল খাঁটি স্বাদের দই পাওয়া দিন দিন অসম্ভব হয়ে উঠেছিল।
            </p>

            <p className="font-bengali text-gray-700 text-sm sm:text-base leading-relaxed">
              সেই হারিয়ে যাওয়া খাঁটি স্বাদ আর সততাকে ফিরিয়ে আনতে আমাদের পথচলা। বগুড়া ও সিরাজগঞ্জের স্থানীয় গোয়ালাদের থেকে সরাসরি দুধ সংগ্রহ করে, শতাব্দী প্রাচীন প্রাকৃতিক জমানোর কৌশল ও কঠোর স্বাস্থ্যবিধি মেনে প্রতিটি সরা প্রস্তুত করা হয়।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200/70 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-doibrand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bengali font-bold text-sm text-doibrand-dark">
                    প্রাকৃতিক কালচার
                  </h4>
                  <p className="font-bengali text-xs text-gray-500 mt-0.5">
                    বংশের পুরনো আদি দইয়ের বীজ ছাড়া কোনো কৃত্রিম জমাটকারক নেই
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200/70 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-doibrand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bengali font-bold text-sm text-doibrand-dark">
                    পোড়ামাটির বিশেষ সরা
                  </h4>
                  <p className="font-bengali text-xs text-gray-500 mt-0.5">
                    বগুড়ার কারিগরদের ঐতিহ্যবাহী লাল পোড়ামাটি যা জলীয় অংশ শোষে
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Four Pillars of Core Values ────────────────────── */}
      <section className="py-16 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-doibrand-accent font-bengali">
              আমাদের মূলনীতি
            </span>
            <h2 className="font-bengali text-3xl sm:text-4xl font-bold text-doibrand-dark mt-2 mb-3">
              যে চারটি স্তম্ভের ওপর দাঁড়িয়ে দই বিলাস
            </h2>
            <p className="font-bengali text-xs sm:text-sm text-gray-600">
              আমরা মানের সাথে কখনো আপস করি না। প্রতিটি পদক্ষেপে থাকে কঠোর সততা ও দায়বদ্ধতা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-doibrand-light rounded-2xl p-6 border border-stone-200/80 hover:border-doibrand-gold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/80 text-doibrand-gold flex items-center justify-center mb-5 group-hover:bg-doibrand-gold group-hover:text-white transition-colors shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bengali font-bold text-lg text-doibrand-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="font-bengali text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-200/50 flex items-center gap-1.5 text-xs text-doibrand-gold font-bengali font-semibold">
                    <span>শতভাগ সুনিশ্চিত</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Artisanal Making Process ─────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-doibrand-accent font-bengali">
            কারিগরী প্রণালী
          </span>
          <h2 className="font-bengali text-3xl sm:text-4xl font-bold text-doibrand-dark mt-2 mb-3">
            কীভাবে তৈরি হয় দই বিলাসের স্পেশাল সরার দই?
          </h2>
          <p className="font-bengali text-xs sm:text-sm text-gray-600">
            যান্ত্রিক অটোমেশন নয়; নিপুণ কারিগরের হাতের মমতায় তৈরি হয় নিখুঁত ঘনত্বের আসল দই।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((proc, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Step Number */}
                <div className="text-4xl font-bold text-doibrand-gold/20 font-sans group-hover:text-doibrand-gold/40 transition-colors mb-3">
                  {proc.step}
                </div>
                <h3 className="font-bengali font-bold text-base sm:text-lg text-doibrand-dark mb-2">
                  {proc.title}
                </h3>
                <p className="font-bengali text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {proc.description}
                </p>
              </div>

              <div className="mt-6 w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="bg-doibrand-gold h-full rounded-full transition-all duration-300"
                  style={{ width: `${(idx + 1) * 25}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Growth Timeline / Journey ────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-doibrand-accent font-bengali">
              আমাদের মাইলফলক
            </span>
            <h2 className="font-bengali text-3xl sm:text-4xl font-bold text-doibrand-dark mt-2 mb-3">
              একটি স্বপ্ন থেকে আজ ঐতিহ্যের বিশ্বস্ত প্রতীক
            </h2>
            <p className="font-bengali text-xs sm:text-sm text-gray-600">
              ১২ বছরের নিষ্ঠা, পরিশ্রম ও গ্রাহকের অফুরন্ত ভালোবাসায় আজকের দই বিলাস।
            </p>
          </div>

          {/* Timeline Vertical Track */}
          <div className="relative border-l-2 border-doibrand-gold/30 ml-4 sm:ml-32 space-y-10">
            {MILESTONES.map((item, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8 group">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-doibrand-gold group-hover:scale-125 transition-transform" />

                {/* Year Label */}
                <span className="sm:absolute sm:-left-28 sm:top-0 font-sans font-bold text-sm sm:text-base text-doibrand-accent block mb-1 sm:mb-0">
                  {item.year}
                </span>

                <div className="bg-doibrand-light rounded-xl p-5 border border-stone-200/80 group-hover:border-doibrand-gold transition-colors shadow-2xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bengali font-bold text-base sm:text-lg text-doibrand-dark">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="text-[10px] font-bengali bg-doibrand-gold text-white px-2 py-0.5 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-bengali text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Founder's Message Card ─────────────────────────── */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="bg-doibrand-dark text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-stone-800">
          {/* Subtle Glows */}
          <div
            className="absolute top-0 right-0 w-80 h-80 bg-doibrand-gold/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Avatar / Portrait */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-doibrand-gold/60 shadow-lg shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                alt="রহিম উদ্দিন, প্রতিষ্ঠাতা ও প্রধান কারিগর"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>

            {/* Message Text */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <Quote className="w-8 h-8 text-doibrand-gold/60 mx-auto md:mx-0" />
              <p className="font-bengali text-base sm:text-lg text-stone-200 leading-relaxed font-light italic">
                “আমরা ব্যবসা করার উদ্দেশ্যে যাত্রা শুরু করিনি; আমরা শুরু করেছিলাম আমাদের শৈশবের স্মৃতি, মা-দাদির হাতের খাঁটি স্বাদের হারিয়ে যাওয়া অনুভূতিটিকে বাঁচিয়ে রাখতে। দই বিলাসের প্রতি আপনার আস্থা আমাদের সবচেয়ে মূল্যবান সম্পদ।”
              </p>
              <div>
                <h4 className="font-bengali font-bold text-lg text-white">
                  মোহাম্মদ রহিম উদ্দিন
                </h4>
                <p className="font-bengali text-xs text-doibrand-gold mt-0.5">
                  প্রতিষ্ঠাতা ও প্রধান কারিগর, দই বিলাস
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Call To Action (Experience the Authenticity) ───── */}
      <section className="py-16 bg-white border-t border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-doibrand-accent px-4 py-1.5 rounded-full text-xs font-semibold font-bengali mb-4">
            <Sparkles className="w-4 h-4" />
            <span>খাঁটি স্বাদের অভিজ্ঞতা নিন</span>
          </div>

          <h2 className="font-bengali text-3xl sm:text-4xl font-bold text-doibrand-dark mb-4">
            আজই আপনার পারিবারিক আয়োজনে নিয়ে আসুন বগুড়ার আসল স্বাদ
          </h2>

          <p className="font-bengali text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8 font-light">
            স্পেশাল সরার দই, শাহী লাড্ডু কিংবা গাওয়া ঘিয়ে ভাজা লাচ্ছা সেমাই — সবই পৌঁছে যাবে আপনার ঠিকানায় সম্পূর্ণ তাজা অবস্থায়।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-doibrand-dark text-white font-bengali font-bold text-sm hover:bg-doibrand-gold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>সকল পণ্য দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/category/premium-doi"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-doibrand-dark text-doibrand-dark font-bengali font-semibold text-sm hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>প্রিমিয়াম দই সংগ্রহ</span>
            </Link>
          </div>

          {/* Quick Contact Line */}
          <div className="mt-10 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-bengali">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-doibrand-gold" />
              <span>হটলাইন: +৮৮০ ১৭০০-০০০০০০</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-doibrand-gold" />
              <span>কারখানা: শেরপুর রোড, বগুড়া সদর, বগুড়া</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
