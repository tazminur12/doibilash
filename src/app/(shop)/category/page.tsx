import { pageMetadata } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, Sparkles, Store, ArrowRight } from "lucide-react";
import { CATEGORY_LIST } from "@/data/categories";
import { toBnDigits } from "@/lib/bangla";

export const metadata: Metadata = pageMetadata({
  title: "সকল ক্যাটাগরি",
  description:
    "বগুড়ার প্রিমিয়াম দই, খাঁটি ঘিয়ের লাড্ডু ও লাচ্ছা সেমাই — দই বিলাসের সকল ক্যাটাগরি এক জায়গায়।",
  path: "/category",
});

export default function CategoryIndexPage() {
  const totalProducts = CATEGORY_LIST.reduce((sum, c) => sum + c.products.length, 0);

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_20px_50px_-32px_rgba(169,94,53,0.6)] px-5 py-8 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">ক্যাটাগরি</span>
          </nav>

          <div className="relative mt-5 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
                <Sparkles className="w-3.5 h-3.5" />
                বাছাইকৃত কালেকশন
              </span>
              <h1 className="mt-4 text-3xl sm:text-[44px] font-extrabold leading-tight tracking-tight">
                সকল{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  ক্যাটাগরি
                </span>
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-600">
                বগুড়ার ঐতিহ্যবাহী দই থেকে খাঁটি ঘিয়ের মিষ্টান্ন — আপনার পছন্দের ক্যাটাগরি বেছে নিন।
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-extrabold">{toBnDigits(CATEGORY_LIST.length)}টি</p>
                <p className="text-[11px] text-stone-500">ক্যাটাগরি</p>
              </div>
              <span className="w-px h-9 bg-doibrand-gold/25" />
              <div>
                <p className="text-2xl font-extrabold text-doibrand-accent">{toBnDigits(totalProducts)}+</p>
                <p className="text-[11px] text-stone-500">পণ্য</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {CATEGORY_LIST.map((category, idx) => {
            const lowestPrice = Math.min(...category.products.map((p) => p.numericPrice));
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative block overflow-hidden rounded-3xl bg-white p-2.5 ring-1 ring-stone-200/70 shadow-[0_14px_34px_-24px_rgba(53,28,27,0.45)] transition-all duration-500 hover:-translate-y-1.5 hover:ring-doibrand-gold/50 hover:shadow-[0_28px_50px_-28px_rgba(169,94,53,0.6)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F5EDE3]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    preload={idx === 0}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-bold text-doibrand-accent shadow-sm">
                    {toBnDigits(category.products.length)}টি পণ্য
                  </span>
                  <span className="absolute top-3 right-3 w-10 h-10 grid place-items-center rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold text-white shadow-md transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F3DDB8]">
                      {category.englishName}
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold drop-shadow-sm">{category.name}</h2>
                  </div>
                </div>

                <div className="px-2.5 pt-4 pb-2">
                  <p className="text-xs leading-relaxed text-stone-500 line-clamp-2">{category.subtitle}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <ul className="flex flex-wrap gap-1.5">
                      {category.highlights.slice(0, 2).map((h) => (
                        <li
                          key={h}
                          className="rounded-full bg-[#FBF1E4] px-2.5 py-1 text-[10px] font-semibold text-doibrand-accent ring-1 ring-doibrand-gold/20"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                    <p className="shrink-0 text-right">
                      <span className="block text-[10px] text-stone-400">শুরু</span>
                      <span className="text-base font-black text-doibrand-accent font-sans">৳{lowestPrice}</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Shop CTA */}
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-linear-to-r from-[#F6E2C3] via-[#FFF6EA] to-[#EFD2A6] ring-1 ring-doibrand-gold/25 p-5 sm:p-7 shadow-[0_14px_36px_-24px_rgba(169,94,53,0.55)]">
          <Store className="pointer-events-none absolute -right-6 -bottom-8 w-40 h-40 text-doibrand-gold/15 rotate-12" strokeWidth={1.25} />
          <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold">ঘি, মধু, খেজুর সহ আরও অনেক কিছু</h3>
              <p className="mt-1 text-xs sm:text-sm text-stone-600">আমাদের সম্পূর্ণ কালেকশন ব্রাউজ করুন শপ পেজে।</p>
            </div>
            <Link
              href="/shop"
              className="group shrink-0 inline-flex items-center gap-2 rounded-full bg-doibrand-dark px-6 py-3 text-sm font-bold text-doibrand-light shadow-[0_10px_24px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
            >
              সব পণ্য দেখুন
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
