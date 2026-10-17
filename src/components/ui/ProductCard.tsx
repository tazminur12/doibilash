"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
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

  // Support both individual props and product object
  const currentTitle = title ?? product?.title ?? "বগুড়ার স্পেশাল দই";
  const currentPrice = price ?? product?.price ?? "৳ 500";
  const currentOriginalPrice = originalPrice ?? product?.originalPrice ?? "৳ 600";
  const currentImage =
    image ??
    product?.image ??
    "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80";
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

  const handleOrder = () => {
    if (onOrder) {
      onOrder();
    } else {
      const parsedPrice =
        typeof currentPrice === "number"
          ? currentPrice
          : parseInt(String(currentPrice).replace(/[^0-9]/g, ""), 10) || 500;
      addItem({
        id: product?.id ?? currentTitle,
        title: currentTitle,
        price: parsedPrice,
        priceText: formatPrice(currentPrice),
        image: currentImage,
        unit: currentUnit,
      });
    }
  };

  return (
    <div className="group relative bg-white border border-stone-200/80 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <Link href={productHref} className="relative aspect-square w-full overflow-hidden bg-stone-100 rounded-t-xl block">
        <Image
          src={currentImage}
          alt={currentTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="aspect-square w-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge (Top Right) */}
        {currentBadge && (
          <span className="absolute top-0 right-0 bg-doibrand-accent text-white text-xs px-2 py-1 rounded-bl-lg font-medium shadow-sm z-10">
            {currentBadge}
          </span>
        )}
      </Link>

      {/* Middle Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <Link href={productHref} className="block group/title">
            <h3
              className="font-bengali text-doibrand-dark font-semibold text-sm md:text-base line-clamp-2 group-hover/title:text-doibrand-accent transition-colors"
              title={currentTitle}
            >
              {currentTitle}
            </h3>
          </Link>

          {/* Unit / Weight subtitle if present */}
          {currentUnit && (
            <p className="text-[11px] text-gray-500 font-bengali mt-0.5">
              {currentUnit}
            </p>
          )}

          {/* Pricing */}
          <div className="mt-2 flex items-baseline flex-wrap">
            <span className="text-doibrand-dark font-bold text-base sm:text-lg">
              {formatPrice(currentPrice)}
            </span>
            {currentOriginalPrice && (
              <span className="text-gray-400 text-xs line-through ml-2">
                {formatPrice(currentOriginalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOrder}
          className="w-full bg-white border border-doibrand-gold text-doibrand-gold text-sm font-medium font-bengali rounded-md py-2 mt-3 hover:bg-doibrand-gold hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.98]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার করুন</span>
        </button>
      </div>
    </div>
  );
}
