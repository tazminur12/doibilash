"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CartDrawer({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: CartDrawerProps) {
  const pathname = usePathname();
  const {
    items,
    isOpen: contextIsOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    totalCount,
  } = useCart();

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname === "/orders" ||
    pathname === "/categories" ||
    pathname === "/customers" ||
    pathname === "/products" ||
    pathname === "/settings";
  if (isAdminRoute) return null;

  // Use props if provided, otherwise context
  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const handleClose = propOnClose ?? closeCart;

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sliding Drawer Container */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-doibrand-gold" />
            <h2 className="text-base sm:text-lg font-bold text-doibrand-dark flex items-center gap-1.5">
              <span>Your Cart</span>
              <span className="font-bengali text-xs sm:text-sm text-doibrand-accent font-normal">
                (আপনার কার্ট)
              </span>
            </h2>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-stone-100 text-doibrand-dark text-xs font-semibold">
              {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-doibrand-dark hover:bg-stone-100 transition-colors focus:outline-none"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items (Scrollable List) */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bengali text-base font-semibold text-doibrand-dark mb-1">
                আপনার কার্ট খালি রয়েছে
              </h3>
              <p className="text-xs text-gray-500 mb-6 font-bengali">
                আপনার পছন্দের সুস্বাদু দই ও মিষ্টি যোগ করুন
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg bg-doibrand-gold text-white font-bengali text-sm font-semibold hover:bg-doibrand-accent transition-colors shadow-sm"
              >
                শপিং শুরু করুন
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="py-4 first:pt-1 last:pb-2 flex items-start gap-3 group"
              >
                {/* Product Image */}
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200/80">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="w-16 h-16 rounded-md object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bengali text-sm text-doibrand-dark font-medium line-clamp-2 leading-snug">
                    {item.title}
                  </h4>

                  {item.unit && (
                    <span className="text-[11px] text-gray-400 font-bengali block mt-0.5">
                      {item.unit}
                    </span>
                  )}

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-doibrand-dark">
                      ৳ {item.price.toLocaleString()}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-gray-400">
                        (৳ {(item.price * item.quantity).toLocaleString()})
                      </span>
                    )}
                  </div>

                  {/* Quantity Selector & Trash Button */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors focus:outline-none"
                        title="কমিয়ে দিন"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="px-3 py-0.5 text-xs font-semibold text-doibrand-dark bg-white min-w-7 text-center">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors focus:outline-none"
                        title="বাড়িয়ে দিন"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors focus:outline-none"
                      title="আইটেমটি মুছুন"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50/60 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Subtotal (সাবটোটাল):
              </span>
              <span className="text-lg font-bold text-doibrand-dark">
                ৳ {subtotal.toLocaleString()}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 font-bengali">
              ডেলিভারি চার্জ চেকআউটের সময় নির্ধারণ করা হবে
            </p>

            {/* Proceed to Checkout Button */}
            <Link
              href="/checkout"
              onClick={handleClose}
              className="w-full bg-doibrand-dark text-white font-bold py-3 rounded-lg hover:bg-doibrand-gold transition-colors flex items-center justify-center gap-2 font-bengali text-center shadow-md active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <span className="text-xs font-normal opacity-90">
                (চেকআউট করুন)
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
