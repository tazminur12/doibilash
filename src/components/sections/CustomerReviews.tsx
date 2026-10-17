import React from "react";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  review: string;
  rating: number;
  location?: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "তানভীর আহমেদ",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    review:
      "দইয়ের স্বাদ অসাধারণ! বগুড়ার সেই আসল মিষ্টি সুবাস আর খাঁটি সরের নিখুঁত স্বাদ পেয়েছি। ডেলিভারি অনেক ফাস্ট ছিল এবং মাটির সরাটি অক্ষত অবস্থায় পেয়েছি।",
    rating: 5,
    location: "বনানী, ঢাকা",
  },
  {
    id: 2,
    name: "নুসরাত জাহান",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    review:
      "ঘি আর সুন্দরবনের মধু একসাথে নিয়েছিলাম। খাঁটি গাওয়া ঘিয়ের সুবাসে পুরো রান্নাঘর মেতে উঠেছিল। পরিবারের সবাই ভীষণ প্রশংসা করেছে। নিশ্চিন্তে অর্ডার করতে পারেন।",
    rating: 5,
    location: "উত্তরা, ঢাকা",
  },
  {
    id: 3,
    name: "মাহমুদুল হাসান",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    review:
      "রসগোল্লা আর স্পেশাল সরার দই এককথায় অতুলনীয়। মিষ্টির ব্যালেন্স একদম পারফেক্ট, অতিরিক্ত মিষ্টি নয়। কাস্টমার সাপোর্টের ব্যবহারও খুব আন্তরিক ছিল।",
    rating: 5,
    location: "ধানমন্ডি, ঢাকা",
  },
];

export default function CustomerReviews() {
  return (
    <section className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <h2 className="font-bengali text-2xl font-bold text-doibrand-dark">
            কাস্টমারদের মতামত
          </h2>
          <p className="text-xs sm:text-sm text-doibrand-accent font-medium mt-1 font-bengali">
            Customer Reviews & Experiences
          </p>
          <div className="w-12 h-0.5 bg-doibrand-gold mt-2 rounded-full" />
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Top: 5 Golden Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-doibrand-gold fill-current w-4 h-4"
                    />
                  ))}
                </div>

                {/* Middle: Review text in Bengali */}
                <p className="text-gray-600 font-bengali leading-relaxed mt-3 mb-4 text-sm sm:text-base">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              {/* Bottom: Customer Profile Area */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-stone-200">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="40px"
                    className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-doibrand-dark font-bengali truncate">
                    {review.name}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
