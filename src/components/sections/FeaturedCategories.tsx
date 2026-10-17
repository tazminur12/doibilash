import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  englishName: string;
  subtitle: string;
  href: string;
  image: string;
  badge: string;
  itemCount: string;
}

const FEATURED_CATEGORIES: Category[] = [
  {
    id: "premium-doi",
    name: "প্রিমিয়াম দই",
    englishName: "Premium Doi",
    subtitle: "বগুড়ার মাটির সরার দই",
    href: "/category/premium-doi",
    image: "/Product/doi.jpg",
    badge: "হট ফেভারিট",
    itemCount: "৮+ আইটেম",
  },
  {
    id: "laddu",
    name: "শাহী লাড্ডু",
    englishName: "Shahi Laddu",
    subtitle: "খাঁটি ঘিয়ে ভাজা মতিচুর",
    href: "/category/laddu",
    image:
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
    badge: "বেস্ট সেলার",
    itemCount: "৮+ আইটেম",
  },
  {
    id: "laccha-semai",
    name: "লাচ্ছা সেমাই",
    englishName: "Laccha Semai",
    subtitle: "ঘিয়ে ভাজা শাহী লাচ্ছা",
    href: "/category/laccha-semai",
    image: "/Product/laccha_semai.jpg",
    badge: "উৎসব স্পেশাল",
    itemCount: "৮+ আইটেম",
  },
  {
    id: "ghee",
    name: "দানাদার গাওয়া ঘি",
    englishName: "Pure Ghee",
    subtitle: "গাভীর দুধের খাঁটি ননী",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
    badge: "১০০% খাঁটি",
    itemCount: "৫+ আইটেম",
  },
  {
    id: "honey",
    name: "প্রাকৃতিক মধু",
    englishName: "Raw Honey",
    subtitle: "সুন্দরবনের চাকের মধু",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    badge: "ন্যাচারাল",
    itemCount: "৬+ আইটেম",
  },
  {
    id: "sweets",
    name: "ঐতিহ্যবাহী মিষ্টি",
    englishName: "Traditional Sweets",
    subtitle: "রসগোল্লা, চমচম ও সন্দেশ",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=600&q=80",
    badge: "টাটকা স্বাদ",
    itemCount: "১১+ আইটেম",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-stone-50 via-white to-doibrand-light/50 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-100/70 text-doibrand-accent px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 font-bengali">
              <Sparkles className="w-3.5 h-3.5 text-doibrand-gold" />
              <span>বাছাইকৃত বিশেষ কালেকশন</span>
            </div>

            <h2 className="font-bengali text-2xl sm:text-3xl md:text-4xl font-bold text-doibrand-dark tracking-tight">
              জনপ্রিয় ক্যাটাগরিসমূহ
            </h2>

            <p className="font-bengali text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md">
              বগুড়ার শতাব্দী প্রাচীন মাটির সরার দই, খাঁটি গাওয়া ঘি ও মুখরোচক মিষ্টান্নের সমাহার
            </p>
          </div>

          {/* View All Categories Link */}
          <Link
            href="/shop"
            className="group hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bengali font-bold text-doibrand-accent hover:text-doibrand-dark transition-colors"
          >
            <span>সকল ক্যাটাগরি দেখুন</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (1:1 Perfect Square Proportion - Height & Width Identical) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="aspect-square w-full group relative bg-white border border-stone-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-between text-center shadow-xs hover:shadow-xl hover:border-doibrand-gold hover:-translate-y-1.5 transition-all duration-300 focus:outline-none overflow-hidden"
            >
              {/* Top Row: Badge & Item Count */}
              <div className="w-full flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold bg-amber-50 text-doibrand-accent px-2 py-0.5 rounded-full font-bengali border border-amber-200/60 shadow-2xs">
                  {cat.badge}
                </span>
                <span className="text-[10px] text-doibrand-gold font-bengali font-semibold group-hover:text-doibrand-accent transition-colors">
                  {cat.itemCount}
                </span>
              </div>

              {/* Center Image Container with Ring & Hover Zoom */}
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 lg:w-26 lg:h-26 rounded-full overflow-hidden border-2 border-stone-100 group-hover:border-doibrand-gold group-hover:ring-4 group-hover:ring-doibrand-gold/20 shadow-sm transition-all duration-300 p-0.5 bg-stone-50 shrink-0 my-auto">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                    className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle inner overlay on hover */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              </div>

              {/* Bottom: Category Name & Subtitle */}
              <div className="w-full flex flex-col items-center">
                <h3 className="font-bengali font-bold text-sm sm:text-base text-doibrand-dark group-hover:text-doibrand-accent transition-colors line-clamp-1 leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-bengali line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs font-bengali font-bold text-doibrand-accent hover:text-doibrand-dark transition-colors"
          >
            <span>সকল ক্যাটাগরি দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
