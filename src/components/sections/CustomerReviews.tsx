"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Star, BadgeCheck, Quote, ChevronLeft, ChevronRight, MapPin, MessageSquareHeart } from "lucide-react";

interface Review {
  id: number;
  name: string;
  review: string;
  rating: number;
  location?: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "তানভীর আহমেদ",
    review:
      "দইয়ের স্বাদ অসাধারণ! বগুড়ার সেই আসল মিষ্টি সুবাস আর খাঁটি সরের নিখুঁত স্বাদ পেয়েছি। ডেলিভারি অনেক ফাস্ট ছিল এবং মাটির সরাটি অক্ষত অবস্থায় পেয়েছি।",
    rating: 5,
    location: "বনানী, ঢাকা",
  },
  {
    id: 2,
    name: "নুসরাত জাহান",
    review:
      "ঘি আর সুন্দরবনের মধু একসাথে নিয়েছিলাম। খাঁটি গাওয়া ঘিয়ের সুবাসে পুরো রান্নাঘর মেতে উঠেছিল। পরিবারের সবাই ভীষণ প্রশংসা করেছে। নিশ্চিন্তে অর্ডার করতে পারেন।",
    rating: 5,
    location: "উত্তরা, ঢাকা",
  },
  {
    id: 3,
    name: "মাহমুদুল হাসান",
    review:
      "রসগোল্লা আর স্পেশাল সরার দই এককথায় অতুলনীয়। মিষ্টির ব্যালেন্স একদম পারফেক্ট, অতিরিক্ত মিষ্টি নয়। কাস্টমার সাপোর্টের ব্যবহারও খুব আন্তরিক ছিল।",
    rating: 5,
    location: "ধানমন্ডি, ঢাকা",
  },
];

const WIDE_QUERY = "(min-width: 768px)";
const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

function subscribeToWide(callback: () => void) {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function Stars({ count, className = "w-4 h-4" }: { count: number; className?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${className} ${i < count ? "text-doibrand-gold fill-current" : "text-stone-200 fill-current"}`}
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const isWide = useSyncExternalStore(
    subscribeToWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false
  );
  const perView = isWide ? 2 : 1;
  const maxIndex = Math.max(0, REVIEWS.length - perView);
  const activeIndex = Math.min(currentIndex, maxIndex);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (Math.min(i, maxIndex) === 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || maxIndex === 0) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, isPaused, maxIndex]);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const arrowClass =
    "w-11 h-11 grid place-items-center rounded-full bg-white text-doibrand-accent ring-1 ring-doibrand-gold/30 shadow-[0_8px_18px_-10px_rgba(169,94,53,0.7)] hover:bg-linear-to-br hover:from-doibrand-accent hover:to-doibrand-gold hover:text-white hover:ring-transparent active:scale-95 transition cursor-pointer";

  return (
    <section className="w-full font-bengali pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-5 lg:gap-6">
        {/* Intro + Rating Summary */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_20px_50px_-30px_rgba(169,94,53,0.55)] p-6 sm:p-8 flex flex-col">
          <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />

          <span className="relative self-start inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent">
            <MessageSquareHeart className="w-3.5 h-3.5 text-doibrand-gold" />
            Customer Reviews
          </span>
          <h2 className="relative mt-3 text-2xl sm:text-[32px] font-extrabold tracking-tight leading-tight text-doibrand-dark">
            কাস্টমারদের{" "}
            <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
              মতামত
            </span>
          </h2>
          <p className="relative mt-1.5 text-xs sm:text-sm text-stone-500">
            হাজারো তৃপ্ত পরিবারের ভালোবাসাই আমাদের সবচেয়ে বড় অনুপ্রেরণা
          </p>

          <div className="relative mt-6 flex items-center gap-4 rounded-2xl bg-white/75 p-4 ring-1 ring-white shadow-sm">
            <span className="text-5xl font-extrabold leading-none bg-linear-to-br from-doibrand-dark via-doibrand-accent to-doibrand-gold bg-clip-text text-transparent">
              ৪.৯
            </span>
            <div>
              <Stars count={5} />
              <p className="mt-1 text-[11px] text-stone-500">
                গড় রেটিং · <span className="font-semibold text-doibrand-dark">৫০,০০০+</span> তৃপ্ত পরিবার
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="relative mt-auto pt-6 hidden lg:flex items-center gap-3">
            <button type="button" onClick={prev} aria-label="Previous review" className={arrowClass}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" onClick={next} aria-label="Next review" className={arrowClass}>
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="ml-2 font-sans text-sm font-semibold tabular-nums text-stone-400">
              <span className="text-doibrand-dark">{String(activeIndex + 1).padStart(2, "0")}</span>
              {" / "}
              {String(maxIndex + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Review Slider */}
        <div
          className="relative min-w-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="overflow-hidden -mx-1 px-1 -my-4 py-4"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex -mx-2.5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${(activeIndex * 100) / perView}%)` }}
            >
              {REVIEWS.map((review, index) => {
                const isVisible = index >= activeIndex && index < activeIndex + perView;
                return (
                  <div
                    key={review.id}
                    className="shrink-0 basis-full md:basis-1/2 px-2.5"
                    aria-hidden={!isVisible}
                  >
                    <figure className="group relative h-full flex flex-col rounded-3xl bg-white p-6 sm:p-7 ring-1 ring-stone-200/70 shadow-[0_14px_34px_-24px_rgba(53,28,27,0.45)] transition-all duration-300 hover:ring-doibrand-gold/50">
                      <Quote
                        className="pointer-events-none absolute top-5 right-5 w-14 h-14 text-doibrand-gold/15 fill-current transition-colors group-hover:text-doibrand-gold/25"
                        strokeWidth={0}
                      />

                      <Stars count={review.rating} />

                      <blockquote className="relative mt-4 flex-1 text-[15px] sm:text-base leading-relaxed text-stone-700">
                        &ldquo;{review.review}&rdquo;
                      </blockquote>

                      <figcaption className="mt-6 flex items-center gap-3 border-t border-doibrand-gold/15 pt-5">
                        <span className="shrink-0 w-12 h-12 grid place-items-center rounded-full bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent text-lg font-bold text-white ring-4 ring-[#FBF1E4]">
                          {Array.from(review.name)[0]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-doibrand-dark">{review.name}</p>
                          {review.location && (
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-stone-500">
                              <MapPin className="w-3 h-3 text-doibrand-gold" />
                              {review.location}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200/70 font-sans">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Verified Buyer
                        </span>
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots + Mobile Controls */}
          <div className="mt-5 flex items-center justify-center lg:justify-start gap-4">
            <button type="button" onClick={prev} aria-label="Previous review" className={`lg:hidden ${arrowClass}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex ? "w-8 bg-linear-to-r from-doibrand-accent to-doibrand-gold" : "w-2 bg-doibrand-gold/30 hover:bg-doibrand-gold/60"
                  }`}
                />
              ))}
            </div>
            <button type="button" onClick={next} aria-label="Next review" className={`lg:hidden ${arrowClass}`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
