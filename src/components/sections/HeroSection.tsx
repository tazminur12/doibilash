"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  imageUrl: string;
  altText: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    imageUrl: "/Hero/Hero1.png",
    altText: "বগুড়ার খাঁটি দই - দই বিলাস",
    link: "/shop",
  },
  {
    id: 2,
    imageUrl: "/Hero/Hero2.jpg",
    altText: "দই বিলাস স্পেশাল প্রিমিয়াম মিষ্টান্ন",
    link: "/shop",
  },
];

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeToDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
  const perView = isDesktop ? 2 : 1;
  const maxIndex = Math.max(0, slides.length - perView);
  const activeIndex = Math.min(currentIndex, maxIndex);
  const canSlide = maxIndex > 0;

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (Math.min(prev, maxIndex) === 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || !canSlide) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, canSlide]);

  return (
    <section className="w-full md:max-w-7xl md:mx-auto md:px-6 lg:px-8 md:pt-6 md:pb-8">
      <div
        className="relative group overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Track */}
        <div
          className="flex md:-mx-2.5 lg:-mx-3 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${(activeIndex * 100) / perView}%)` }}
        >
          {slides.map((slide, index) => {
            const isVisible = index >= activeIndex && index < activeIndex + perView;
            return (
              <div
                key={slide.id}
                className="shrink-0 basis-full md:basis-1/2 md:px-2.5 lg:px-3"
                aria-hidden={!isVisible}
              >
                <Link
                  href={slide.link}
                  tabIndex={isVisible ? undefined : -1}
                  className="block relative w-full aspect-[16/9] overflow-hidden bg-stone-900 md:rounded-2xl md:ring-1 md:ring-doibrand-gold/20 md:shadow-[0_18px_40px_-22px_rgba(53,28,27,0.55)] group/card"
                  aria-label={slide.altText}
                >
                  <Image
                    src={slide.imageUrl}
                    alt={slide.altText}
                    fill
                    preload={index === 0}
                    sizes="(min-width: 768px) 640px, 100vw"
                    className="object-cover object-center transition-transform duration-700 md:group-hover/card:scale-[1.03]"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {canSlide && (
          <>
            {/* Left Navigation Arrow */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/85 backdrop-blur text-doibrand-dark shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/85 backdrop-blur text-doibrand-dark shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full h-1.5 sm:h-2 cursor-pointer ${
                    index === activeIndex
                      ? "w-7 sm:w-9 bg-doibrand-gold"
                      : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
