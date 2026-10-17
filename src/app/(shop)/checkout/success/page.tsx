"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Truck,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("orderId");
  const orderId = rawOrderId ? (rawOrderId.startsWith("#") ? rawOrderId : `#${rawOrderId}`) : "#DB-98765";
  
  const rawTotal = searchParams.get("total");
  const totalFormatted = rawTotal
    ? `৳ ${Number(rawTotal).toLocaleString()}`
    : "৳ ১২৫০";

  const rawPayment = searchParams.get("payment");
  const paymentText =
    rawPayment === "online"
      ? "Online Payment (bKash/Nagad)"
      : "Cash on Delivery";

  const customerName = searchParams.get("name") || "সম্মানিত গ্রাহক";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-doibrand-light px-4 py-12 font-bengali">
      {/* Large white card */}
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10 text-center animate-in fade-in duration-300">
        
        {/* Success Animation/Icon */}
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs animate-bounce-short">
          <CheckCircle className="w-14 h-14" />
        </div>

        {/* Title */}
        <h1 className="font-bengali text-3xl md:text-4xl font-bold text-doibrand-dark mb-4 tracking-tight">
          আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          ধন্যবাদ <strong className="text-doibrand-dark">{customerName}</strong>! দই বিলাস থেকে অর্ডার করার জন্য আমরা কৃতজ্ঞ। আমাদের প্রতিনিধি খুব শীঘ্রই যোগাযোগ করে ডেলিভারি প্রক্রিয়া সম্পন্ন করবেন।
        </p>

        {/* Order Details Box */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100">
          <div>
            <span className="text-xs text-gray-500 block mb-0.5">অর্ডার নম্বর</span>
            <span className="font-bold text-base text-doibrand-dark font-sans">
              অর্ডার আইডি: {orderId}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-500 block mb-0.5">পরিশোধিত সর্বমোট মূল্য</span>
            <span className="font-bold text-base text-doibrand-accent font-sans">
              টোটাল বিল: {totalFormatted}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-500 block mb-0.5">পেমেন্ট মেথড</span>
            <span className="font-semibold text-sm text-doibrand-dark">
              পেমেন্ট: {paymentText}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-500 block mb-0.5">বর্তমান অবস্থা</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              প্রসেসিং শুরু হয়েছে
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/track-order"
            className="w-full sm:w-auto bg-doibrand-dark text-white px-8 py-3.5 rounded-xl hover:bg-doibrand-gold transition-colors font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>অর্ডার ট্র্যাক করুন</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 hover:border-doibrand-gold hover:text-doibrand-gold px-8 py-3.5 rounded-xl transition-colors font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>

        {/* Bottom guarantee */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-doibrand-gold" />
          <span>১০০% খাঁটি ও গুণগত মান নিশ্চিত - দই বিলাস বগুড়া</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-doibrand-light px-4">
          <div className="w-10 h-10 border-4 border-doibrand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
