"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  Printer,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  FileText,
  User,
  ShieldCheck,
  Edit2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import {
  CorporateOrder,
  CorporateOrderStatus,
  CORP_STATUS_META,
  getCorporateOrderById,
  saveCorporateOrder,
} from "@/lib/corporateOrderStorage";
import { toBnDigits } from "@/lib/bangla";

export default function CorporateDetailView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<CorporateOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const found = getCorporateOrderById(orderId);
    if (found) {
      setOrder(found);
    }
  }, [orderId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusUpdate = (newStatus: CorporateOrderStatus) => {
    if (!order) return;
    const updated = { ...order, status: newStatus };
    saveCorporateOrder(updated);
    setOrder(updated);
    showToast(`স্ট্যাটাস "${CORP_STATUS_META[newStatus].labelBn}" এ আপডেট হয়েছে!`);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!order) {
    return (
      <div className="font-bengali p-12 text-center space-y-4">
        <p className="text-stone-500">কর্পোরেট অর্ডারের তথ্য খুঁজে পাওয়া যায়নি।</p>
        <Link
          href="/admin/corporate"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#351C1B] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কর্পোরেট তালিকায় ফিরে যান</span>
        </Link>
      </div>
    );
  }

  const meta = CORP_STATUS_META[order.status] || CORP_STATUS_META["New Lead"];

  return (
    <div className="font-bengali pb-28 text-stone-900 max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/admin" className="hover:text-[#C48A4E]">
              ড্যাশবোর্ড
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/corporate" className="hover:text-[#C48A4E]">
              কর্পোরেট অর্ডার
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#351C1B] font-bold">{order.quotationNo}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/corporate"
              className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-[#351C1B] shadow-2xs transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#351C1B] tracking-tight">
                  {order.companyName}
                </h1>
                <span
                  className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                >
                  {meta.labelBn}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                কোটেশন আইডি: <strong className="font-mono text-stone-700">{order.quotationNo}</strong> • যোগাযোগকারী:{" "}
                <strong>{order.contactPerson}</strong> ({order.phone})
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs sm:text-sm shadow-2xs flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-[#C48A4E]" />
            <span>প্রিন্ট / PDF চালান</span>
          </button>

          <Link
            href={`/admin/corporate/new?edit=${order.id}`}
            className="px-4 py-2.5 rounded-xl bg-[#351C1B] hover:bg-[#4A2624] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-300" />
            <span>সম্পাদনা</span>
          </Link>
        </div>
      </div>

      {/* Status Pipeline Controls (Print Hidden) */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs print:hidden space-y-3">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
          অর্ডার স্ট্যাটাস পাইপলাইন আপডেট করুন:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {(
            [
              "New Lead",
              "Quotation Sent",
              "Confirmed",
              "In Production",
              "Delivered",
            ] as CorporateOrderStatus[]
          ).map((st) => {
            const isCurrent = order.status === st;
            const sMeta = CORP_STATUS_META[st];
            return (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusUpdate(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-[#351C1B] text-amber-100 shadow-xs scale-102"
                    : `${sMeta.bg} ${sMeta.color} border ${sMeta.border} hover:opacity-80`
                }`}
              >
                {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{sMeta.labelBn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Official A4 Quotation Sheet */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-300 shadow-xl space-y-8 font-sans print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Letterhead */}
        <div className="border-b-2 border-[#351C1B] pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#351C1B] font-bengali">
              দই বিলাস
            </h2>
            <p className="text-xs text-stone-500 font-bengali">
              বগুড়ার খাঁটি ঐতিহ্যবাহী সরার দই, মিষ্টি ও কর্পোরেট উপহার সম্ভার
            </p>
            <div className="text-xs text-stone-600 font-bengali leading-relaxed pt-1">
              প্রধান কার্যালয়: বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা - ১২০৫<br />
              কারখানা: শেরপুর রোড, বগুড়া সদর, বগুড়া • হটলাইন: +880 1712-345678<br />
              ইমেইল: corporate@doibilash.com • ওয়েবসাইট: www.doibilash.com
            </div>
          </div>

          <div className="text-right space-y-1 font-bengali">
            <div className="inline-block px-3 py-1 rounded bg-[#351C1B] text-amber-100 text-xs font-bold font-mono">
              FORMAL QUOTATION & WORK ORDER
            </div>
            <div className="font-mono text-xs text-stone-600 font-bold">
              কোটেশন নং: {order.quotationNo}
            </div>
            <div className="text-xs text-stone-500">
              তারিখ: {order.createdAt}
            </div>
          </div>
        </div>

        {/* Client & Event Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs font-bengali">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              কর্পোরেট ক্লায়েন্ট / প্রাপক:
            </span>
            <div className="font-bold text-stone-900 text-sm">{order.companyName}</div>
            <div>কর্মকর্তা: {order.contactPerson} ({order.designation})</div>
            <div>মোবাইল: {order.phone}</div>
            <div>ইমেইল: {order.email || "N/A"}</div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-stone-200 sm:pl-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              ডেলিভারি ও ইভেন্ট বিবরণ:
            </span>
            <div>অনুষ্ঠানের ধরন: <strong className="text-stone-900">{order.eventType}</strong></div>
            <div>ডেলিভারির তারিখ: <strong className="text-[#351C1B]">{order.deliveryDate}</strong></div>
            <div>ডেলিভারি ভেন্যু: {order.deliveryAddress || "হেড অফিস"}</div>
            <div>মোট পরিমাণ: <strong className="text-[#C48A4E]">{order.approxQuantityText}</strong></div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <table className="w-full text-left border-collapse text-xs font-bengali">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-stone-300 text-stone-700 font-bold uppercase text-[11px]">
                <th className="py-3 px-3">ক্র.</th>
                <th className="py-3 px-4">পণ্যের নাম ও বিবরণ</th>
                <th className="py-3 px-3 text-center">পরিমাণ</th>
                <th className="py-3 px-3 text-right">দর (৳)</th>
                <th className="py-3 px-4 text-right">মোট টাকা (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50">
                  <td className="py-3 px-3 font-mono">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{item.productTitle}</div>
                    {item.packagingCustomization && (
                      <div className="text-[11px] text-[#C48A4E]">
                        প্যাকেজিং: {item.packagingCustomization}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">
                    {item.unitPrice?.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    {item.totalPrice?.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-stone-200 font-bengali text-xs">
          <div className="space-y-2">
            <span className="font-bold text-stone-800 text-xs block">
              চুক্তি ও পেমেন্ট শর্তাবলী:
            </span>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] space-y-1 text-stone-600">
              <div>• {order.paymentTerms}</div>
              <div>• কোল্ড-চেইন ডেলিভারি ভ্যানের মাধ্যমে সঠিক তাপমাত্রায় সরবরাহ নিশ্চিত করা হবে।</div>
              <div>• বিশেষ মাটির পাত্রে দই বিলাসের আদি বগুড়ার কোয়ালিটি নিশ্চয়তা।</div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-stone-700 self-end">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span>উপ-মোট (Subtotal):</span>
              <span className="font-mono font-bold">৳ {order.subtotal?.toLocaleString("en-IN")}</span>
            </div>
            {order.customBrandingFee > 0 && (
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>কাস্টম লোগো ও ব্র্যান্ডিং ফি:</span>
                <span className="font-mono font-bold">৳ {order.customBrandingFee?.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 font-black text-base text-[#351C1B] border-b-2 border-[#351C1B]">
              <span>সর্বমোট বাজেট:</span>
              <span className="font-mono">৳ {order.totalBudget?.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 text-emerald-700 font-bold">
              <span>পরিশোধিত অগ্রিম (Advance):</span>
              <span className="font-mono">৳ {order.advancePaid?.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 text-red-700 font-bold text-sm">
              <span>পরিশোধযোগ্য বকেয়া (Due):</span>
              <span className="font-mono">৳ {order.dueAmount?.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-12 flex items-center justify-between text-xs text-stone-500 font-bengali">
          <div className="text-center space-y-1">
            <div className="w-36 border-b border-stone-400 pb-1 mx-auto font-medium"></div>
            <div>গ্রাহক / অনুমোদনকারী স্বাক্ষর</div>
          </div>

          <div className="text-center space-y-1">
            <div className="w-36 border-b border-stone-400 pb-1 mx-auto font-medium">
              {order.assignedManager}
            </div>
            <div>অনুমোদিত কর্মকর্তা (দই বিলাস)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
