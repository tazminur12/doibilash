"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  Smartphone,
  Wallet,
} from "lucide-react";
import { StoredOrder, STATUS_META, paymentStatusLabel } from "@/lib/orderStorage";

type Filter = "all" | "paid" | "due" | "cod" | "bkash" | "nagad";

function methodLabel(method: string) {
  if (method === "bKash") return "বিকাশ";
  if (method === "Nagad") return "নগদ";
  if (method === "Bank Transfer") return "ব্যাংক";
  return "ক্যাশ অন ডেলিভারি";
}

function isSettled(order: StoredOrder) {
  return order.paymentStatus === "Paid" || order.status === "Delivered";
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(res.ok && data.ok && Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const markPaid = async (order: StoredOrder) => {
    setSavingId(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Paid" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showToast(data.error || "পেমেন্ট আপডেট করা যায়নি");
        return;
      }
      const updated = (data.order as StoredOrder) || { ...order, paymentStatus: "Paid" as const };
      setOrders((prev) => prev.map((item) => (item.id === order.id ? updated : item)));
      showToast(`${order.id} — পেমেন্ট হয়ে গেছে`);
    } catch {
      showToast("সার্ভারে সংযোগ করা যায়নি");
    } finally {
      setSavingId(null);
    }
  };

  const counts = useMemo(() => {
    const paid = orders.filter(isSettled);
    const due = orders.filter((order) => !isSettled(order));
    return {
      all: orders.length,
      paid: paid.length,
      due: due.length,
      cod: orders.filter((order) => order.paymentMethod === "Cash on Delivery").length,
      bkash: orders.filter((order) => order.paymentMethod === "bKash").length,
      nagad: orders.filter((order) => order.paymentMethod === "Nagad").length,
      collected: paid.reduce((sum, order) => sum + order.totalAmount, 0),
      pendingAmount: due.reduce((sum, order) => sum + order.totalAmount, 0),
    };
  }, [orders]);

  const visible = orders.filter((order) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q) ||
      (order.transactionId || "").toLowerCase().includes(q);
    if (!matchesQuery) return false;
    if (filter === "paid") return isSettled(order);
    if (filter === "due") return !isSettled(order);
    if (filter === "cod") return order.paymentMethod === "Cash on Delivery";
    if (filter === "bkash") return order.paymentMethod === "bKash";
    if (filter === "nagad") return order.paymentMethod === "Nagad";
    return true;
  });

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "সব পেমেন্ট", count: counts.all },
    { id: "paid", label: "পেমেন্ট হয়ে গেছে", count: counts.paid },
    { id: "due", label: "বাকি", count: counts.due },
    { id: "cod", label: "ক্যাশ অন ডেলিভারি", count: counts.cod },
    { id: "bkash", label: "বিকাশ", count: counts.bkash },
    { id: "nagad", label: "নগদ", count: counts.nagad },
  ];

  return (
    <div className="space-y-5 font-bengali">
      <div>
        <h1 className="text-2xl font-extrabold text-doibrand-dark">পেমেন্ট</h1>
        <p className="mt-1 text-sm text-stone-500">
          বিকাশ ও নগদে যাঁরা টাকা পাঠিয়েছেন, এবং ক্যাশ অন ডেলিভারিতে যাঁরা এখনো দেননি — দুটোই এখানে। টাকা পেলে স্ট্যাটাস বদলান। ডেলিভারি সম্পূর্ণ হলে পেমেন্ট নিজে থেকে হয়ে গেছে দেখাবে।
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { label: "পেমেন্ট হয়ে গেছে", value: counts.paid, note: `৳${counts.collected.toLocaleString("en-US")}`, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50" },
          { label: "বাকি", value: counts.due, note: `৳${counts.pendingAmount.toLocaleString("en-US")}`, icon: Clock, tone: "text-amber-700 bg-amber-50" },
          { label: "ক্যাশ অন ডেলিভারি", value: counts.cod, note: "হাতে টাকা", icon: Banknote, tone: "text-stone-700 bg-stone-100" },
          { label: "বিকাশ / নগদ", value: counts.bkash + counts.nagad, note: "অগ্রিম পেমেন্ট", icon: Smartphone, tone: "text-doibrand-accent bg-amber-50" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-4 border border-stone-200/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500">{card.label}</span>
              <span className={`w-7 h-7 rounded-lg grid place-items-center ${card.tone}`}>
                <card.icon className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-doibrand-dark font-sans">{card.value}</p>
            <span className="text-[10px] text-stone-400">{card.note}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90">
        <div className="flex items-center gap-1 overflow-x-auto">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  active ? "bg-doibrand-dark text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {item.label} <span className="font-sans">{item.count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative md:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="অর্ডার, নাম, ফোন বা ট্রানজেকশন আইডি"
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-doibrand-gold/40"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 flex items-center justify-center gap-2 text-stone-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          পেমেন্ট লোড হচ্ছে...
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
          <Wallet className="w-8 h-8 mx-auto text-doibrand-gold" />
          <p className="mt-3 font-bold">এই ফিল্টারে কোনো পেমেন্ট নেই</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF8F5] text-xs text-stone-600 border-b border-stone-200/80">
                <tr>
                  <th className="py-3 px-5">অর্ডার</th>
                  <th className="py-3 px-5">গ্রাহক</th>
                  <th className="py-3 px-5">মাধ্যম</th>
                  <th className="py-3 px-5">টাকা</th>
                  <th className="py-3 px-5">প্রুফ</th>
                  <th className="py-3 px-5">অবস্থা</th>
                  <th className="py-3 px-5 text-right">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => {
                  const settled = isSettled(order);
                  const delivered = order.status === "Delivered";
                  return (
                    <tr key={order.id} className="border-b border-stone-100 last:border-0">
                      <td className="py-4 px-5">
                        <Link href={`/admin/orders/${order.id}`} className="font-bold font-sans text-doibrand-accent hover:underline">
                          #{order.id}
                        </Link>
                        <p className="text-[11px] text-stone-400 font-sans">{order.createdAt}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-semibold">{order.customerName}</p>
                        <p className="text-[11px] text-stone-500 font-sans">{order.customerPhone}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-xs font-bold">{methodLabel(order.paymentMethod)}</span>
                        <p className="text-[11px] text-stone-400">{STATUS_META[order.status]?.labelBn || order.status}</p>
                      </td>
                      <td className="py-4 px-5 font-bold font-sans text-doibrand-accent">
                        ৳{order.totalAmount.toLocaleString("en-US")}
                      </td>
                      <td className="py-4 px-5 text-xs">
                        {order.transactionId ? (
                          <p className="font-sans font-bold">{order.transactionId}</p>
                        ) : (
                          <p className="text-stone-400">ট্রানজেকশন আইডি নেই</p>
                        )}
                        {order.paymentProofUrl && (
                          <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="text-doibrand-accent font-bold hover:underline">
                            স্ক্রিনশট দেখুন
                          </a>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            settled ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {settled ? "পেমেন্ট হয়ে গেছে" : paymentStatusLabel(order)}
                        </span>
                        {delivered && (
                          <p className="mt-1 text-[10px] font-semibold text-emerald-700">ডেলিভারি সম্পন্ন</p>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {settled ? (
                          <span className="text-[11px] font-bold text-emerald-700">
                            {delivered ? "ডেলিভারি সম্পন্ন — পেমেন্ট হয়ে গেছে" : "পেমেন্ট হয়ে গেছে"}
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={savingId === order.id}
                            onClick={() => markPaid(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
                          >
                            {savingId === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            পেমেন্ট হয়েছে
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-doibrand-dark px-4 py-3 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
