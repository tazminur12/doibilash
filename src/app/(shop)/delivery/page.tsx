import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import React from "react";
import Link from "next/link";
import {
  Truck,
  MapPin,
  Wallet,
  Clock,
  ListChecks,
  Snowflake,
  AlertTriangle,
  Home,
  Building2,
  Gift,
  PhoneCall,
  Mail,
  Milk,
  Droplets,
  Flame,
  Map as MapIcon,
} from "lucide-react";
import StaticPageLayout, { PolicyCard } from "@/components/ui/StaticPageLayout";

export const metadata: Metadata = pageMetadata({
  title: "ডেলিভারি তথ্য",
  description:
    "দই বিলাসের ডেলিভারি এলাকা, চার্জ, সময়সীমা ও বিশেষ শর্তাবলী সম্পর্কে বিস্তারিত তথ্য।",
  path: "/delivery",
});

const RATES = [
  { icon: Home, area: "ঢাকার ভেতরে", fee: "৳ ৬০", time: "২৪ ঘণ্টার মধ্যে", note: "ঢাকা মেট্রোপলিটনের সকল থানা ও এলাকা" },
  { icon: Building2, area: "ঢাকার বাইরে", fee: "৳ ১২০", time: "৪৮–৭২ ঘণ্টার মধ্যে", note: "সকল জেলা সদর ও উপজেলা, কুরিয়ারের মাধ্যমে" },
];

const COVERAGE = [
  { title: "ঢাকা মেট্রোপলিটন এলাকা", text: "সব থানা ও এলাকা কভার করা হয়।" },
  { title: "বিভাগীয় শহর", text: "চট্টগ্রাম, রাজশাহী, খুলনা, সিলেট, বরিশাল, রংপুর, ময়মনসিংহ।" },
  { title: "জেলা সদর ও উপজেলা", text: "কুরিয়ার সার্ভিসের মাধ্যমে সারা দেশে।" },
];

const PROCESS = [
  "অর্ডার কনফার্মেশনের পর আমাদের টিম ২ ঘণ্টার মধ্যে প্রস্তুতি শুরু করে।",
  "পণ্য তাপমাত্রা-নিয়ন্ত্রিত প্যাকেজিংয়ে প্যাক করা হয় — দই ও ঘির ক্ষেত্রে বিশেষ কুলিং ব্যাগ ব্যবহার করা হয়।",
  "অর্ডার আইডি ও মোবাইল নম্বর দিয়ে যেকোনো সময় অর্ডারের অবস্থা ট্র্যাক করতে পারবেন।",
  "ডেলিভারির আগে ডেলিভারি পার্টনার আপনাকে ফোন করবে।",
  "পণ্য বুঝে নেওয়ার পর পেমেন্ট (COD) করুন।",
];

const STORAGE = [
  { icon: Milk, title: "দই", text: "পেয়েই ফ্রিজে (৪–৭°C) রাখুন; ৭–১০ দিন পর্যন্ত স্বাদ ও সর অক্ষত থাকে।" },
  { icon: Flame, title: "ঘি", text: "ঘরের তাপমাত্রায় রাখা যাবে, তবে সূর্যালোক থেকে দূরে।" },
  { icon: Droplets, title: "মধু", text: "ঘরের তাপমাত্রায় শুকনো জায়গায় রাখুন, ফ্রিজের প্রয়োজন নেই।" },
];

export default function DeliveryPage() {
  return (
    <StaticPageLayout
      breadcrumb="ডেলিভারি তথ্য"
      title="ডেলিভারি তথ্য ও"
      highlight="নীতিমালা"
      badge="সারা বাংলাদেশে ডেলিভারি"
      subtitle="আমরা সারা বাংলাদেশে নিরাপদ ও সময়মতো ডেলিভারি নিশ্চিত করি। আপনার পণ্য তাজা অবস্থায় পৌঁছে দেওয়া আমাদের দায়িত্ব।"
      Icon={Truck}
      pills={[
        { icon: Snowflake, text: "কোল্ড-চেইন প্যাকেজিং" },
        { icon: Wallet, text: "ক্যাশ অন ডেলিভারি" },
        { icon: Gift, text: "৳৩,০০০+ অর্ডারে ফ্রি ডেলিভারি" },
      ]}
    >
      <div className="space-y-5">
        {/* Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RATES.map(({ icon: Icon, area, fee, time, note }) => (
            <div
              key={area}
              className="relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]"
            >
              <span className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#F7D9B0]/40 blur-2xl" />
              <div className="relative flex items-start justify-between gap-4">
                <span className="w-12 h-12 grid place-items-center rounded-2xl bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white shadow-[0_10px_22px_-10px_rgba(169,94,53,0.9)]">
                  <Icon className="w-6 h-6" />
                </span>
                <span className="text-3xl font-black bg-linear-to-br from-doibrand-dark via-doibrand-accent to-doibrand-gold bg-clip-text text-transparent">
                  {fee}
                </span>
              </div>
              <h2 className="relative mt-5 text-lg font-bold">{area}</h2>
              <p className="relative mt-1 flex items-center gap-1.5 text-sm font-semibold text-doibrand-accent">
                <Clock className="w-4 h-4" />
                {time}
              </p>
              <p className="relative mt-2 text-xs text-stone-500">{note}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-linear-to-r from-[#F6E2C3] via-[#FFF6EA] to-[#EFD2A6] px-5 py-4 ring-1 ring-doibrand-gold/25">
          <Gift className="w-5 h-5 shrink-0 text-doibrand-accent" />
          <p className="text-sm">
            <strong>বিশেষ সুবিধা:</strong> ৳৩,০০০ টাকার উপরে যেকোনো অর্ডারে সারা দেশে সম্পূর্ণ বিনামূল্যে ডেলিভারি। জরুরি বা একই দিনে
            ডেলিভারির প্রয়োজনে হটলাইনে যোগাযোগ করুন।
          </p>
        </div>

        {/* Coverage */}
        <PolicyCard icon={MapIcon} eyebrow="কভারেজ" title="ডেলিভারি এলাকা">
          <p className="text-sm leading-relaxed text-stone-600">
            দই বিলাস বর্তমানে বাংলাদেশের সকল জেলায় ডেলিভারি প্রদান করে। তবে দুর্গম এলাকায় ডেলিভারি সময়ে পার্থক্য থাকতে পারে।
          </p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {COVERAGE.map(({ title, text }) => (
              <li key={title} className="rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/15">
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  <MapPin className="w-4 h-4 text-doibrand-gold" />
                  {title}
                </p>
                <p className="mt-1 text-xs text-stone-500">{text}</p>
              </li>
            ))}
          </ul>
        </PolicyCard>

        {/* Process */}
        <PolicyCard icon={ListChecks} eyebrow="ধাপে ধাপে" title="ডেলিভারি প্রক্রিয়া">
          <ol className="relative space-y-4">
            {PROCESS.map((text, i) => (
              <li key={text} className="relative flex gap-4">
                {i < PROCESS.length - 1 && (
                  <span className="absolute left-[17px] top-10 bottom-[-12px] w-0.5 bg-linear-to-b from-doibrand-gold/50 to-doibrand-gold/10" />
                )}
                <span className="relative shrink-0 w-9 h-9 grid place-items-center rounded-full bg-linear-to-br from-doibrand-accent to-doibrand-gold text-xs font-bold text-white">
                  {["১", "২", "৩", "৪", "৫"][i]}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-stone-600">
                  {text}
                  {i === 2 && (
                    <Link href="/track-order" className="ml-1 font-semibold text-doibrand-accent hover:underline">
                      ট্র্যাক করুন →
                    </Link>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </PolicyCard>

        {/* Storage */}
        <PolicyCard icon={Snowflake} eyebrow="তাজা রাখার উপায়" title="পণ্য সংরক্ষণ নির্দেশনা">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STORAGE.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/15">
                <span className="w-9 h-9 grid place-items-center rounded-xl bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25">
                  <Icon className="w-4 h-4" />
                </span>
                <p className="mt-3 text-sm font-bold">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">{text}</p>
              </div>
            ))}
          </div>
        </PolicyCard>

        {/* Failed delivery */}
        <PolicyCard icon={AlertTriangle} eyebrow="জেনে রাখুন" title="ডেলিভারি ব্যর্থ হলে কী হবে?">
          <p className="text-sm leading-relaxed text-stone-600">
            আপনি ডেলিভারির সময় উপস্থিত না থাকলে ডেলিভারি পার্টনার পুনরায় চেষ্টা করবে। দুবার ব্যর্থ হলে আমাদের টিম আপনার সাথে যোগাযোগ
            করে নতুন সময় নির্ধারণ করবে।
          </p>
          <p className="mt-4 rounded-r-2xl border-l-4 border-doibrand-gold bg-[#FFF9F1] px-4 py-3 text-sm font-medium">
            দুগ্ধজাত পণ্যের তাজাত্ব নিশ্চিত রাখতে ডেলিভারির সময় কোনো প্রতিনিধি থাকার ব্যবস্থা করুন।
          </p>
        </PolicyCard>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:+8801645460095"
            className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 hover:ring-doibrand-gold/40 transition"
          >
            <span className="w-11 h-11 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
              <PhoneCall className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-[11px] text-stone-500">ডেলিভারি হটলাইন</span>
              <span className="block text-sm font-bold font-sans group-hover:text-doibrand-accent">01645-460095</span>
            </span>
          </a>
          <a
            href="mailto:delivery@doibilash.com"
            className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 hover:ring-doibrand-gold/40 transition"
          >
            <span className="w-11 h-11 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
              <Mail className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-[11px] text-stone-500">ইমেইল</span>
              <span className="block text-sm font-bold font-sans group-hover:text-doibrand-accent">delivery@doibilash.com</span>
            </span>
          </a>
        </div>
      </div>
    </StaticPageLayout>
  );
}
