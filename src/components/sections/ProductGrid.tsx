import React from "react";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { TrendingUp, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { storedProductToCardItem } from "@/lib/catalogMap";
import { getTopSellingProducts } from "@/lib/productService";

const getCachedTopSelling = unstable_cache(
  async () => getTopSellingProducts(5),
  ["home-top-selling-products-v1"],
  { revalidate: 60 }
);

export default async function ProductGrid() {
  const products = await getCachedTopSelling()
    .then((rows) => rows.map(storedProductToCardItem))
    .catch((err) => {
      console.error("ProductGrid load failed:", err);
      return [];
    });

  return (
    <section className="w-full font-bengali pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent shadow-[0_4px_12px_-8px_rgba(169,94,53,0.6)]">
              <TrendingUp className="w-3.5 h-3.5 text-doibrand-gold" />
              বেস্ট সেলার
            </span>
            <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight text-doibrand-dark">
              Top Selling{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
              জনপ্রিয় ও সর্বাধিক বিক্রিত পণ্যসমূহ
            </p>
          </div>

          <Link
            href="/shop"
            className="group hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-4 py-2 text-sm font-semibold text-doibrand-accent hover:bg-doibrand-dark hover:text-doibrand-light hover:border-doibrand-dark transition-all"
          >
            সব পণ্য দেখুন
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white/70 ring-1 ring-stone-200 py-12 text-center text-sm text-stone-500">
            এখনো কোনো পণ্য নেই। শীঘ্রই যুক্ত হবে।
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id ?? product.slug} product={product} />
            ))}
          </div>
        )}

        <Link
          href="/shop"
          className="sm:hidden mt-5 flex items-center justify-center gap-1 text-sm font-semibold text-doibrand-accent"
        >
          সব পণ্য দেখুন
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
