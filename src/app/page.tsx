import React from "react";
import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import TrustUspStrip from "@/components/sections/TrustUspStrip";
import FlashDealSection from "@/components/sections/FlashDealSection";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import ProductGrid from "@/components/sections/ProductGrid";
import HeritageStorySection from "@/components/sections/HeritageStorySection";
import GiftHamperSection from "@/components/sections/GiftHamperSection";
import CustomerReviews from "@/components/sections/CustomerReviews";
import HomeFaqSection from "@/components/sections/HomeFaqSection";
import { getPublicHeroBanners } from "@/lib/heroBannerService";
import { SITE, pageMetadata } from "@/lib/site";
import { JsonLd, faqPageSchema } from "@/lib/seo";
import { FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${SITE.tagline} — অনলাইন অর্ডার`,
    description: SITE.description,
    path: "/",
    keywords: [...SITE.keywords],
  }),
  title: {
    absolute: `${SITE.name} | ${SITE.tagline} — ${SITE.englishName}`,
  },
};

export default async function Home() {
  const heroBanners = await getPublicHeroBanners();
  const featuredFaqs = FAQS.filter((f) => f.featured).map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark">
      <JsonLd data={faqPageSchema(featuredFaqs)} />

      {/* Accessible primary heading for SEO (brand stays visual in header/hero) */}
      <h1 className="sr-only">
        {SITE.name} — {SITE.tagline}. বগুড়ার খাঁটি সরার দই, গাওয়া ঘি ও মিষ্টান্ন
        হোম ডেলিভারি সারা বাংলাদেশে।
      </h1>

      {/* 1. Hero Banner Slider */}
      <HeroSection banners={heroBanners} />

      {/* 2. Premium 4-Pillar Trust & Quality USP Strip */}
      <TrustUspStrip />

      {/* 3. Live Countdown Flash Deals & Limited Stock Specials */}
      <FlashDealSection />

      {/* 4. Featured Categories Bar */}
      <FeaturedCategories />

      {/* 5. Top Selling Products Grid */}
      <ProductGrid />

      {/* 6. Heritage Story & Traditional Craftsmanship Process */}
      <HeritageStorySection />

      {/* 7. Celebration & Festive Gift Hampers */}
      <GiftHamperSection />

      {/* 8. Customer Reviews & Experiences */}
      <CustomerReviews />

      {/* 9. Frequently Asked Questions (FAQ) Accordion */}
      <HomeFaqSection />
    </main>
  );
}
