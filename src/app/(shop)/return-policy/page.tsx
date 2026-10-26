import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import React from "react";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  ListChecks,
  Wallet,
  Smartphone,
  Landmark,
  PackageCheck,
  Info,
  Clock,
  Camera,
  ShieldCheck,
  MessageCircle,
  Mail,
} from "lucide-react";
import StaticPageLayout, { PolicyCard } from "@/components/ui/StaticPageLayout";

export const metadata: Metadata = pageMetadata({
  title: "রিটার্ন পলিসি",
  description:
    "দই বিলাসের রিটার্ন ও রিফান্ড নীতিমালা — পণ্য ফেরত, প্রতিস্থাপন ও অর্থ ফেরতের সম্পূর্ণ নির্দেশিকা।",
  path: "/return-policy",
});

const ELIGIBLE = [
  { title: "ক্ষতিগ্রস্ত প্যাকেজিং", text: "ট্রানজিটে পণ্যের প্যাকেট ভেঙে গেলে বা ফাটলে।" },
  { title: "ভুল পণ্য", text: "আপনি যা অর্ডার করেছিলেন তার বদলে অন্য পণ্য পাঠানো হলে।" },
  { title: "মানহীন পণ্য", text: "দই নষ্ট, ঘি দুর্গন্ধযুক্ত বা মধুতে ভেজাল প্রমাণিত হলে।" },
  { title: "মেয়াদোত্তীর্ণ পণ্য", text: "পণ্যের মেয়াদ শেষ হওয়ার পরে ডেলিভারি দেওয়া হলে।" },
];

const NOT_ELIGIBLE = [
  "পণ্য খোলার পর শুধু পছন্দ না হলে",
  "ডেলিভারির ২৪ ঘণ্টার পরে আবেদন করা হলে",
  "সঠিকভাবে সংরক্ষণ না করার কারণে নষ্ট হলে",
  "পরিষ্কারভাবে গ্রাহকের দোষে পণ্য নষ্ট হলে",
];

const STEPS = [
  { icon: MessageCircle, text: "ডেলিভারির ২৪ ঘণ্টার মধ্যে WhatsApp বা ইমেইলে যোগাযোগ করুন।" },
  { icon: Camera, text: "পণ্যের ছবি বা ভিডিও পাঠান যেখানে সমস্যাটি স্পষ্ট দেখা যাচ্ছে।" },
  { icon: Info, text: "আপনার অর্ডার নম্বর ও ফোন নম্বর উল্লেখ করুন।" },
  { icon: Clock, text: "আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করে সমাধান জানাবে।" },
];

const REFUNDS = [
  { icon: Smartphone, title: "বিকাশ / নগদ / রকেট", time: "২৪–৪৮ ঘণ্টার মধ্যে" },
  { icon: Landmark, title: "ব্যাংক ট্রান্সফার", time: "৩–৫ কার্যদিবসের মধ্যে" },
  { icon: PackageCheck, title: "পণ্য প্রতিস্থাপন", time: "পরবর্তী ডেলিভারি সাইকেলে বিনামূল্যে" },
];

export default function ReturnPolicyPage() {
  return (
    <StaticPageLayout
      breadcrumb="রিটার্ন পলিসি"
      title="রিটার্ন ও"
      highlight="রিফান্ড পলিসি"
      badge="গ্রাহক সুরক্ষা নিশ্চিত"
      subtitle="আমরা বিশ্বাস করি, আপনার সন্তুষ্টিই আমাদের সাফল্য। আমাদের পণ্য খাদ্যসামগ্রী হওয়ায় রিটার্ন নীতি সাধারণ পণ্যের চেয়ে কিছুটা আলাদা — নিচে বিস্তারিত দেওয়া হলো।"
      Icon={RotateCcw}
      pills={[
        { icon: Clock, text: "২৪ ঘণ্টার মধ্যে আবেদন" },
        { icon: Camera, text: "ছবি/ভিডিও প্রমাণই যথেষ্ট" },
        { icon: ShieldCheck, text: "দ্রুত রিফান্ড বা প্রতিস্থাপন" },
      ]}
    >
      <div className="space-y-5">
        {/* Eligibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-white p-6 sm:p-7 ring-1 ring-emerald-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="w-10 h-10 grid place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/70">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              রিটার্ন গ্রহণযোগ্য
            </h2>
            <p className="mt-2 text-xs text-stone-500">ডেলিভারির ২৪ ঘণ্টার মধ্যে নিচের যেকোনো সমস্যায় আবেদন করা যাবে:</p>
            <ul className="mt-4 space-y-3">
              {ELIGIBLE.map(({ title, text }) => (
                <li key={title} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span className="text-sm">
                    <strong>{title}:</strong> <span className="text-stone-600">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 sm:p-7 ring-1 ring-red-200/60 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="w-10 h-10 grid place-items-center rounded-xl bg-red-50 text-red-500 ring-1 ring-red-200/70">
                <XCircle className="w-5 h-5" />
              </span>
              রিটার্ন গ্রহণযোগ্য নয়
            </h2>
            <p className="mt-2 text-xs text-stone-500">নিচের ক্ষেত্রগুলোতে রিটার্ন বা রিফান্ড প্রযোজ্য নয়:</p>
            <ul className="mt-4 space-y-3">
              {NOT_ELIGIBLE.map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-stone-600">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process */}
        <PolicyCard icon={ListChecks} eyebrow="সহজ ৪ ধাপ" title="রিটার্নের প্রক্রিয়া">
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STEPS.map(({ icon: Icon, text }, i) => (
              <li key={text} className="relative rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/15">
                <span className="relative inline-grid w-10 h-10 place-items-center rounded-xl bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25">
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 grid place-items-center rounded-full bg-linear-to-br from-doibrand-accent to-doibrand-gold text-[10px] font-bold text-white">
                    {["১", "২", "৩", "৪"][i]}
                  </span>
                </span>
                <p className="mt-3 text-xs leading-relaxed text-stone-600">{text}</p>
              </li>
            ))}
          </ol>
        </PolicyCard>

        {/* Refunds */}
        <PolicyCard icon={Wallet} eyebrow="অর্থ ফেরত" title="রিফান্ড পদ্ধতি">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {REFUNDS.map(({ icon: Icon, title, time }) => (
              <div key={title} className="rounded-2xl bg-white p-4 ring-1 ring-stone-200/70">
                <span className="w-10 h-10 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <p className="mt-3 text-sm font-bold">{title}</p>
                <p className="mt-0.5 text-xs font-semibold text-doibrand-accent">{time}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-stone-600">
            COD (ক্যাশ অন ডেলিভারি) অর্ডারে রিফান্ড সরাসরি আপনার মোবাইল ব্যাংকিং অ্যাকাউন্টে পাঠানো হবে।
          </p>
        </PolicyCard>

        {/* Note */}
        <div className="flex items-start gap-3 rounded-3xl bg-linear-to-r from-[#F6E2C3] via-[#FFF6EA] to-[#EFD2A6] p-5 sm:p-6 ring-1 ring-doibrand-gold/25">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-doibrand-accent" />
          <p className="text-sm leading-relaxed">
            <strong>বিশেষ দ্রষ্টব্য:</strong> তাজা দুগ্ধজাত পণ্যের প্রকৃতি অনুযায়ী, একবার খোলা পণ্য ফিজিক্যালি ফেরত নেওয়া সম্ভব নয়।
            তাই সমস্যার ছবি/ভিডিও প্রমাণ হিসেবে যথেষ্ট।
          </p>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://wa.me/8801645460095"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 hover:ring-doibrand-gold/40 transition"
          >
            <span className="w-11 h-11 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
              <MessageCircle className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-[11px] text-stone-500">WhatsApp</span>
              <span className="block text-sm font-bold font-sans group-hover:text-doibrand-accent">01645-460095</span>
            </span>
          </a>
          <a
            href="mailto:support@doibilash.com"
            className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 hover:ring-doibrand-gold/40 transition"
          >
            <span className="w-11 h-11 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
              <Mail className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-[11px] text-stone-500">ইমেইল</span>
              <span className="block text-sm font-bold font-sans group-hover:text-doibrand-accent">support@doibilash.com</span>
            </span>
          </a>
        </div>
      </div>
    </StaticPageLayout>
  );
}
