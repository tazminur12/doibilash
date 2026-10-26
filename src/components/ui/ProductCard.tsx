"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, CheckCircle2, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface ProductItem {
  id?: string | number;
  slug?: string;
  href?: string;
  title: string;
  price: string | number;
  originalPrice?: string | number;
  image: string;
  badge?: string;
  unit?: string;
}

export interface ProductCardProps {
  product?: ProductItem;
  href?: string;
  title?: string;
  price?: string | number;
  originalPrice?: string | number;
  image?: string;
  badge?: string;
  unit?: string;
  onOrder?: () => void;
}

const parseAmount = (val: string | number) =>
  typeof val === "number" ? val : parseInt(String(val).replace(/[^0-9]/g, ""), 10) || 0;

export default function ProductCard({
  product,
  href,
  title,
  price,
  originalPrice,
  image,
  badge,
  unit,
  onOrder,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (addedTimer.current) clearTimeout(addedTimer.current);
  }, []);

  // Support both individual props and product object
  const currentTitle = title ?? product?.title ?? "বগুড়ার স্পেশাল দই";
  const currentPrice = price ?? product?.price ?? "৳ 500";
  const currentOriginalPrice = originalPrice ?? product?.originalPrice ?? "৳ 600";
  const currentImage =
    image ??
    product?.image ??
    "/Product/placeholder.svg";
  const currentBadge = badge ?? product?.badge ?? "Hot Sale";
  const currentUnit = unit ?? product?.unit;
  const productHref =
    href ??
    product?.href ??
    (product?.slug ? `/products/${product.slug}` : "/products/bogra-special-doi");

  // Format currency prefix if a bare number is passed
  const formatPrice = (val: string | number) => {
    if (typeof val === "number") {
      return `৳ ${val}`;
    }
    return val.startsWith("৳") ? val : `৳ ${val}`;
  };

  const priceAmount = parseAmount(currentPrice);
  const originalAmount = currentOriginalPrice ? parseAmount(currentOriginalPrice) : 0;
  const discountPercent =
    originalAmount > priceAmount && priceAmount > 0
      ? Math.round(((originalAmount - priceAmount) / originalAmount) * 100)
      : 0;

  const handleOrder = () => {
    if (onOrder) {
      onOrder();
    } else {
      addItem({
        id: product?.id ?? currentTitle,
        title: currentTitle,
        price: priceAmount || 500,
        priceText: formatPrice(currentPrice),
        image: currentImage,
        unit: currentUnit,
      });
    }
    setIsAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group/card relative flex flex-col rounded-2xl bg-white p-2 sm:p-2.5 ring-1 ring-stone-200/70 shadow-[0_8px_24px_-18px_rgba(53,28,27,0.4)] transition-all duration-300 hover:-translate-y-1 hover:ring-doibrand-gold/50 hover:shadow-[0_22px_40px_-22px_rgba(169,94,53,0.55)]">
      {/* Image */}
      <div className="relative">
        <Link
          href={productHref}
          className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[#F5EDE3]"
        >
          {imageFailed ? (
            <span className="absolute inset-0 grid place-items-center bg-linear-to-br from-[#FBEBD2] via-[#F3D7AE] to-[#E2B57C]">
              <span className="text-5xl font-bold text-white/85 drop-shadow-sm select-none font-bengali">
                {Array.from(currentTitle)[0]}
              </span>
            </span>
          ) : (
            <Image
              src={currentImage}
              alt={currentTitle}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              onError={() => setImageFailed(true)}
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/15 to-transparent" />
        </Link>

        {currentBadge && (
          <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-2 py-0.5 text-[10px] font-bold text-white shadow-[0_4px_10px_-4px_rgba(169,94,53,0.8)] font-bengali">
            {currentBadge}
          </span>
        )}

        {/* Quick add (desktop hover) */}
        <button
          type="button"
          onClick={handleOrder}
          aria-label="Quick add to cart"
          className="hidden md:grid absolute bottom-2 right-2 w-9 h-9 place-items-center rounded-full bg-white/95 text-doibrand-accent shadow-lg ring-1 ring-doibrand-gold/30 opacity-0 translate-y-2 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-y-0 hover:bg-doibrand-accent hover:text-white cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1 sm:px-1.5 pt-3 pb-1">
        {currentUnit && (
          <p className="text-[10px] font-semibold tracking-wide text-doibrand-gold font-bengali">
            {currentUnit}
          </p>
        )}

        <Link href={productHref} className="mt-0.5 block">
          <h3
            className="font-bengali text-[13px] sm:text-[15px] font-bold leading-snug text-doibrand-dark line-clamp-2 min-h-[2.6em] transition-colors group-hover/card:text-doibrand-accent"
            title={currentTitle}
          >
            {currentTitle}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-base sm:text-lg font-black text-doibrand-accent">
            {formatPrice(currentPrice)}
          </span>
          {currentOriginalPrice && (
            <span className="text-[11px] sm:text-xs text-stone-400 line-through">
              {formatPrice(currentOriginalPrice)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="ml-auto rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200/70">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOrder}
          className={`mt-3 w-full rounded-xl py-2 sm:py-2.5 text-[13px] sm:text-sm font-semibold font-bengali flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 active:scale-[0.98] ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-[#FBF1E4] text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-linear-to-r hover:from-doibrand-accent hover:to-doibrand-gold hover:text-white hover:ring-transparent hover:shadow-[0_10px_22px_-12px_rgba(169,94,53,0.9)]"
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              যুক্ত হয়েছে
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              অর্ডার করুন
            </>
          )}
        </button>
      </div>
    </div>
  );
}
