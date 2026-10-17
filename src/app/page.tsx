import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import TrustUspStrip from "@/components/sections/TrustUspStrip";
import FlashDealSection from "@/components/sections/FlashDealSection";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import ProductGrid from "@/components/sections/ProductGrid";
import HeritageStorySection from "@/components/sections/HeritageStorySection";
import GiftHamperSection from "@/components/sections/GiftHamperSection";
import CustomerReviews from "@/components/sections/CustomerReviews";
import HomeFaqSection from "@/components/sections/HomeFaqSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark">
      {/* 1. Hero Banner Slider */}
      <HeroSection />

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
