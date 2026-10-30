"use client";

import React from "react";
import Image from "next/image";
import { Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { StoredOrder, STATUS_META } from "@/lib/orderStorage";
import { toBnDigits } from "@/lib/bangla";

export default function OrderInvoice({
  order,
  onClose,
  showPrintButton = true,
}: {
  order: StoredOrder;
  onClose?: () => void;
  showPrintButton?: boolean;
}) {
  const statusInfo = STATUS_META[order.status] || STATUS_META.Pending;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="font-bengali text-stone-800">
      {/* Non-printed action bar */}
      {showPrintButton && (
        <div className="print:hidden flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ফিরে যান</span>
              </button>
            )}
            <span className="text-xs text-stone-500 font-sans">
              ইনভয়েস প্রিভিউ ও প্রিন্ট
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-doibrand-dark text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-doibrand-gold" />
              <span>ইনভয়েস প্রিন্ট করুন (Print A4)</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Printable Invoice Paper (A4 Optimized) ────────────────────────── */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-lg max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none">
        {/* Header with Luxury Brand Identity */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b-2 border-stone-100 gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl font-extrabold text-doibrand-dark tracking-tight">
                দই বিলাস
              </span>
              <span className="text-xs font-bold text-doibrand-gold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
                ঐতিহ্যের স্বাদ
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              বগুড়ার খাঁটি দুগ্ধজাত ও প্রিমিয়াম মিষ্টির বিশ্বস্ত প্রতিষ্ঠান
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 mt-2 font-sans">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-doibrand-gold" /> +880 1712-345678
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-doibrand-gold" /> order@doibilash.com
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-doibrand-gold" /> Bogura / Dhaka, Bangladesh
              </span>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-amber-100 text-doibrand-dark text-xs font-bold rounded-lg font-sans uppercase tracking-wider mb-1">
              INVOICE / বিল
            </span>
            <h3 className="text-lg font-extrabold text-doibrand-dark font-sans">
              #{order.invoiceNo || `INV-${order.id}`}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 font-sans">
              তারিখ: <strong className="text-stone-800">{order.createdAt}</strong>
            </p>
            <p className="text-xs text-stone-500 font-sans">
              অর্ডার নং: <strong className="text-stone-800">#{order.id}</strong>
            </p>
          </div>
        </div>

        {/* Billed To & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-stone-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-doibrand-gold block mb-1">
              গ্রাহকের তথ্য (Billed To):
            </span>
            <h4 className="text-base font-bold text-doibrand-dark">
              {order.customerName}
            </h4>
            <p className="text-xs text-stone-600 font-sans mt-0.5">
              ফোন: <strong>{order.customerPhone}</strong>
            </p>
            {order.customerEmail && (
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                ইমেইল: {order.customerEmail}
              </p>
            )}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-doibrand-gold block mb-1">
              ডেলিভারি ঠিকানা (Shipping Address):
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {order.shippingAddress}
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                {order.deliveryArea}
              </span>
              {order.deliveryTimeSlot && (
                <span className="text-stone-500 text-[11px]">
                  সময়: {order.deliveryTimeSlot}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-stone-200 text-stone-600 text-[11px] uppercase">
                <th className="py-3 px-2 w-10 text-center">নং</th>
                <th className="py-3 px-3">পণ্যের বিবরণ</th>
                <th className="py-3 px-3">প্যাকেজ</th>
                <th className="py-3 px-3 text-right">একক মূল্য</th>
                <th className="py-3 px-3 text-center">পরিমাণ</th>
                <th className="py-3 px-3 text-right">মোট (টাকা)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {order.items.map((item, index) => (
                <tr key={index} className="hover:bg-amber-50/20">
                  <td className="py-3 px-2 text-center text-stone-400 font-sans">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3 font-bold text-doibrand-dark text-sm">
                    {item.title}
                  </td>
                  <td className="py-3 px-3 text-stone-500 font-sans">
                    {item.unit || "১ টি"}
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    ৳{item.price.toLocaleString("en-US")}
                  </td>
                  <td className="py-3 px-3 text-center font-bold font-sans">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-doibrand-dark font-sans">
                    ৳{(item.price * item.quantity).toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Payment Stamp */}
        <div className="pt-4 border-t-2 border-stone-200 flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Payment Method & Guarantee Stamp */}
          <div className="space-y-3 max-w-sm">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">পেমেন্ট মেথড:</span>
                <strong className="text-doibrand-dark font-sans">{order.paymentMethod}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">পেমেন্ট স্ট্যাটাস:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    order.paymentStatus === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.paymentStatus === "Paid" ? "পরিশোধিত (PAID)" : "বাকি (UNPAID)"}
                </span>
              </div>
              {order.notes && (
                <div className="pt-1 text-[11px] text-stone-500 border-t border-stone-200">
                  নোট: {order.notes}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-doibrand-gold shrink-0" />
              <span>১০০% খাঁটি ও নির্ভেজাল পণ্যের নিশ্চয়তা।</span>
            </div>
          </div>

          {/* Amount Calculation Box */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-stone-600">
              <span>পণ্য উপমোট (Subtotal):</span>
              <span className="font-bold font-sans">৳{order.subtotal.toLocaleString("en-US")}</span>
            </div>
            <div className="flex justify-between py-1 text-stone-600">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-bold font-sans">৳{order.deliveryFee.toLocaleString("en-US")}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between py-1 text-emerald-600 font-semibold">
                <span>বিশেষ অফার ছাড়:</span>
                <span className="font-sans">- ৳{order.discount.toLocaleString("en-US")}</span>
              </div>
            )}
            <div className="flex justify-between py-2.5 border-t-2 border-stone-300 text-sm font-bold text-doibrand-dark">
              <span>সর্বমোট প্রদেয় (Grand Total):</span>
              <span className="text-lg text-doibrand-accent font-sans">
                ৳{order.totalAmount.toLocaleString("en-US")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note & Signatures */}
        <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 gap-4">
          <div>
            <p className="font-semibold text-stone-600">দই বিলাস বেছে নেওয়ার জন্য ধন্যবাদ!</p>
            <p className="text-[10px] mt-0.5">
              পণ্য সংক্রান্ত যেকোনো বিষয়ে যোগাযোগ করুন: support@doibilash.com
            </p>
          </div>

          <div className="text-center sm:text-right">
            <div className="w-36 border-b border-stone-300 mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-stone-400">
              কর্তৃপক্ষের স্বাক্ষর
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
