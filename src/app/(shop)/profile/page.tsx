"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  User,
  Phone,
  Mail,
  Lock,
  Edit3,
  Check,
  ShieldCheck,
  PackageCheck,
  X,
  AlertCircle,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type TabType = "dashboard" | "orders" | "address" | "settings";

type OrderStatus = "Processing" | "Shipped" | "Delivered";

interface OrderItem {
  name: string;
  qty: number;
  price: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: string;
  deliveryMethod: string;
}

interface AddressData {
  title: string;
  tag: string;
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
}

// ─── Dummy Data ─────────────────────────────────────────────────────────────

const DUMMY_ORDERS: Order[] = [
  {
    id: "#DB-1029",
    date: "১৫ অক্টোবর, ২০২৬",
    status: "Processing",
    deliveryMethod: "হোম ডেলিভারি (ঢাকা সিটি)",
    items: [
      {
        name: "বগুড়ার স্পেশাল সরার দই (১ কেজি)",
        qty: 2,
        price: "৳ ৭৫০",
        image:
          "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "খাঁটি দানাদার গাওয়া ঘি (৫০০ গ্রাম)",
        qty: 1,
        price: "৳ ৯৫০",
        image:
          "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=120&q=80",
      },
    ],
    total: "৳ ২,৪৫০",
  },
  {
    id: "#DB-1024",
    date: "১০ অক্টোবর, ২০২৬",
    status: "Shipped",
    deliveryMethod: "এক্সপ্রেস ডেলিভারি",
    items: [
      {
        name: "সুন্দরবনের প্রাকৃতিক চাকের মধু (৫০০ গ্রাম)",
        qty: 1,
        price: "৳ ৮৫০",
        image:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "ঐতিহ্যবাহী নরম স্পঞ্জ রসগোল্লা (১ কেজি)",
        qty: 2,
        price: "৳ ৫৫০",
        image:
          "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=120&q=80",
      },
    ],
    total: "৳ ১,৯৮০",
  },
  {
    id: "#DB-1018",
    date: "০২ অক্টোবর, ২০২৬",
    status: "Delivered",
    deliveryMethod: "স্ট্যান্ডার্ড ডেলিভারি",
    items: [
      {
        name: "প্রিমিয়াম মাটির হাঁড়ির মিষ্টি দই (৫০০ গ্রাম)",
        qty: 3,
        price: "৳ ৪২০",
        image:
          "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=120&q=80",
      },
    ],
    total: "৳ ১,২৬০",
  },
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { labelBn: string; classes: string; icon: React.ElementType }
> = {
  Processing: {
    labelBn: "প্রসেসিং হচ্ছে",
    classes: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: Clock,
  },
  Shipped: {
    labelBn: "পাঠানো হয়েছে",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Truck,
  },
  Delivered: {
    labelBn: "ডেলিভারি সম্পন্ন",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: CheckCircle2,
  },
};

// ─── Component: ProfileDashboard ─────────────────────────────────────────────

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  // Address State
  const [addresses, setAddresses] = useState<Record<"shipping" | "billing", AddressData>>({
    shipping: {
      title: "Default Shipping Address",
      tag: "ডিফল্ট শিপিং",
      name: "রহিম উদ্দিন",
      phone: "+880 1712-345678",
      fullAddress: "ফ্ল্যাট ৪বি, বাড়ি ২৫, রোড ৭, সেক্টর ৪, উত্তরা",
      city: "ঢাকা - ১২৩০",
    },
    billing: {
      title: "Default Billing Address",
      tag: "ডিফল্ট বিলিং",
      name: "রহিম উদ্দিন",
      phone: "+880 1712-345678",
      fullAddress: "ফ্ল্যাট ৪বি, বাড়ি ২৫, রোড ৭, সেক্টর ৪, উত্তরা",
      city: "ঢাকা - ১২৩০",
    },
  });

  const [editingAddressKey, setEditingAddressKey] = useState<"shipping" | "billing" | null>(null);
  const [tempAddress, setTempAddress] = useState<AddressData | null>(null);

  // Settings State
  const [profileData, setProfileData] = useState({
    name: "রহিম উদ্দিন",
    email: "rahim.uddin@example.com",
    phone: "+880 1712-345678",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Filter orders
  const filteredOrders = DUMMY_ORDERS.filter((order) => {
    if (orderFilter === "all") return true;
    return order.status.toLowerCase() === orderFilter.toLowerCase();
  });

  // Handle address edit start
  const handleStartEditAddress = (key: "shipping" | "billing") => {
    setEditingAddressKey(key);
    setTempAddress({ ...addresses[key] });
  };

  // Handle address save
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressKey && tempAddress) {
      setAddresses((prev) => ({
        ...prev,
        [editingAddressKey]: tempAddress,
      }));
      setEditingAddressKey(null);
      setTempAddress(null);
      showTemporaryToast("ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে!");
    }
  };

  // Handle settings update
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passwordData.newPassword &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      alert("নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না!");
      return;
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    showTemporaryToast("প্রোফাইল তথ্য ও সেটিংস সফলভাবে আপডেট করা হয়েছে!");
  };

  const showTemporaryToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg("");
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Breadcrumb Header */}
      <div className="border-b border-stone-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Link href="/" className="hover:text-doibrand-gold transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-doibrand-dark font-semibold">আমার অ্যাকাউন্ট</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-doibrand-gold capitalize">
              {activeTab === "dashboard" && "ড্যাশবোর্ড"}
              {activeTab === "orders" && "আমার অর্ডার"}
              {activeTab === "address" && "ঠিকানা বুক"}
              {activeTab === "settings" && "অ্যাকাউন্ট সেটিংস"}
            </span>
          </nav>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs transition-all animate-in fade-in">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button
              onClick={() => setSaveSuccessMsg("")}
              className="text-emerald-600 hover:text-emerald-800 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row gap-8">
        {/* ── Left Sidebar (Navigation) ─────────────────────────────────── */}
        <aside className="w-full md:w-1/4 shrink-0">
          <div className="md:sticky md:top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            {/* User Profile Card Header */}
            <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-gray-100">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-doibrand-gold/20 to-doibrand-accent/20 border-4 border-doibrand-light shadow-sm mb-3 flex items-center justify-center">
                <User className="w-9 h-9 text-doibrand-gold" />
                <span
                  title="Active"
                  className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs"
                />
              </div>
              <h2 className="font-bold text-lg text-doibrand-dark leading-tight">
                {profileData.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-sans">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {profileData.email}
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>প্রিমিয়াম মেম্বার</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5" aria-label="Profile tabs">
              {/* Tab: Dashboard */}
              <button
                type="button"
                id="tab-btn-dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-doibrand-light text-doibrand-gold border-l-4 border-doibrand-gold font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 transition-colors"
                }`}
              >
                <LayoutDashboard
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "dashboard" ? "text-doibrand-gold" : "text-gray-400"
                  }`}
                />
                <span className="flex-1 text-left">ড্যাশবোর্ড</span>
                {activeTab === "dashboard" && (
                  <ChevronRight className="w-4 h-4 text-doibrand-gold" />
                )}
              </button>

              {/* Tab: My Orders */}
              <button
                type="button"
                id="tab-btn-orders"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-doibrand-light text-doibrand-gold border-l-4 border-doibrand-gold font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 transition-colors"
                }`}
              >
                <ShoppingBag
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "orders" ? "text-doibrand-gold" : "text-gray-400"
                  }`}
                />
                <span className="flex-1 text-left">আমার অর্ডার</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-sans font-semibold">
                  {DUMMY_ORDERS.length}
                </span>
                {activeTab === "orders" && (
                  <ChevronRight className="w-4 h-4 text-doibrand-gold ml-1" />
                )}
              </button>

              {/* Tab: Address Book */}
              <button
                type="button"
                id="tab-btn-address"
                onClick={() => setActiveTab("address")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === "address"
                    ? "bg-doibrand-light text-doibrand-gold border-l-4 border-doibrand-gold font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 transition-colors"
                }`}
              >
                <MapPin
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "address" ? "text-doibrand-gold" : "text-gray-400"
                  }`}
                />
                <span className="flex-1 text-left">ঠিকানা বুক</span>
                {activeTab === "address" && (
                  <ChevronRight className="w-4 h-4 text-doibrand-gold" />
                )}
              </button>

              {/* Tab: Account Settings */}
              <button
                type="button"
                id="tab-btn-settings"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-doibrand-light text-doibrand-gold border-l-4 border-doibrand-gold font-bold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 transition-colors"
                }`}
              >
                <Settings
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "settings" ? "text-doibrand-gold" : "text-gray-400"
                  }`}
                />
                <span className="flex-1 text-left">অ্যাকাউন্ট সেটিংস</span>
                {activeTab === "settings" && (
                  <ChevronRight className="w-4 h-4 text-doibrand-gold" />
                )}
              </button>

              {/* Logout Button */}
              <div className="pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  id="tab-btn-logout"
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0 text-red-500" />
                  <span className="flex-1 text-left font-bold">লগআউট</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* ── Right Content Area (Dynamic Views) ────────────────────────── */}
        <section className="w-full md:w-3/4">
          {/* VIEW 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Welcome Message Banner */}
              <div className="bg-gradient-to-r from-doibrand-dark via-stone-900 to-doibrand-dark text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-doibrand-gold/20 text-doibrand-gold text-xs font-semibold mb-3 border border-doibrand-gold/30">
                    <PackageCheck className="w-3.5 h-3.5" />
                    দই বিলাস প্রিমিয়াম ক্লায়েন্ট
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-bengali tracking-tight">
                    স্বাগতম, {profileData.name}!
                  </h1>
                  <p className="text-stone-300 font-bengali text-sm mt-2 max-w-xl leading-relaxed">
                    আপনার ব্যক্তিগত ড্যাশবোর্ডে স্বাগতম। এখান থেকে আপনার সাম্প্রতিক মিষ্টি ও
                    দইয়ের অর্ডার ট্র্যাক করুন, শিপিং ঠিকানা পরিচালনা করুন এবং প্রোফাইল তথ্য
                    আপডেট করুন।
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="px-5 py-2.5 rounded-xl bg-doibrand-gold text-white text-xs sm:text-sm font-semibold hover:bg-doibrand-accent transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      সকল অর্ডার দেখুন
                    </button>
                    <Link
                      href="/shop"
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border border-white/20"
                    >
                      মিষ্টির সম্ভার ঘুরে দেখুন
                    </Link>
                  </div>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-doibrand-gold/10 blur-2xl pointer-events-none" />
              </div>

              {/* Grid of 3 Quick Stat Cards */}
              <div>
                <h3 className="text-lg font-bold text-doibrand-dark mb-4 flex items-center gap-2">
                  <span>অর্ডার সারাংশ</span>
                  <span className="text-xs text-gray-400 font-normal">(সর্বমোট পরিসংখ্যান)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Card 1: Total Orders */}
                  <div className="bg-amber-50/70 border border-amber-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                        মোট অর্ডার (Total Orders)
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-doibrand-gold">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-doibrand-dark font-sans">
                      ১২
                    </div>
                    <p className="text-xs text-amber-900/80 mt-1 font-bengali">
                      সর্বমোট সফল কেনাকাটা
                    </p>
                  </div>

                  {/* Card 2: Pending Orders */}
                  <div className="bg-blue-50/70 border border-blue-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                        অপেক্ষমান (Pending)
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-blue-950 font-sans">
                      ২
                    </div>
                    <p className="text-xs text-blue-900/80 mt-1 font-bengali">
                      প্রসেসিং ও শিপমেন্টে রয়েছে
                    </p>
                  </div>

                  {/* Card 3: Delivered Orders */}
                  <div className="bg-emerald-50/70 border border-emerald-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        ডেলিভারকৃত (Delivered)
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-950 font-sans">
                      ১০
                    </div>
                    <p className="text-xs text-emerald-900/80 mt-1 font-bengali">
                      নিরাপদে পৌঁছে দেওয়া হয়েছে
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Order Preview on Dashboard */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-lg text-doibrand-dark">
                      সর্বশেষ অর্ডার
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      আপনার সর্বশেষ প্রক্রিয়াকৃত অর্ডারের বর্তমান অবস্থা
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-doibrand-gold hover:text-doibrand-accent transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>সকল অর্ডার দেখুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Latest single order snippet */}
                {DUMMY_ORDERS[0] && (
                  <div className="bg-stone-50/80 rounded-xl p-4 sm:p-5 border border-stone-200/60">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-sans text-base text-doibrand-dark">
                          {DUMMY_ORDERS[0].id}
                        </span>
                        <span className="text-xs text-gray-500">
                          {DUMMY_ORDERS[0].date}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                          STATUS_CONFIG[DUMMY_ORDERS[0].status].classes
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{STATUS_CONFIG[DUMMY_ORDERS[0].status].labelBn}</span>
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      {DUMMY_ORDERS[0].items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-doibrand-dark truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 font-sans">
                              পরিমাণ: {item.qty} × {item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        মোট পরিশোধিত:{" "}
                        <strong className="text-doibrand-accent font-bold text-sm">
                          {DUMMY_ORDERS[0].total}
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetails(DUMMY_ORDERS[0])}
                        className="text-xs font-semibold text-doibrand-gold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        অর্ডার বিস্তারিত
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: MY ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-doibrand-dark">আমার অর্ডার</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    আপনার পূর্বে সম্পন্ন ও চলমান সমস্ত অর্ডারের বিশদ বিবরণ
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-semibold text-doibrand-gold border border-doibrand-gold px-4 py-2 rounded-xl hover:bg-doibrand-gold hover:text-white transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  নতুন অর্ডার করুন
                </Link>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {[
                  { label: "সকল অর্ডার", value: "all" },
                  { label: "প্রসেসিং", value: "processing" },
                  { label: "পাঠানো হয়েছে", value: "shipped" },
                  { label: "ডেলিভারি সম্পন্ন", value: "delivered" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setOrderFilter(filter.value)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      orderFilter === filter.value
                        ? "bg-doibrand-gold text-white shadow-xs"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-doibrand-gold/40 hover:text-doibrand-gold"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusMeta = STATUS_CONFIG[order.status];
                    const StatusIcon = statusMeta.icon;

                    return (
                      <div
                        key={order.id}
                        className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {/* Order Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-gray-50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-sans text-base text-doibrand-dark">
                                {order.id}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="text-xs text-gray-500">{order.date}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {order.deliveryMethod}
                            </p>
                          </div>

                          {/* Colorful Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusMeta.classes}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span>{statusMeta.labelBn}</span>
                          </span>
                        </div>

                        {/* Order Products List */}
                        <div className="py-4 space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3.5">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 bg-stone-50 shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-doibrand-dark truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 font-sans">
                                  পরিমাণ: {item.qty} টি × {item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Card Footer */}
                        <div className="pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-xs text-gray-400 block">মোট মূল্য</span>
                            <span className="text-lg font-bold text-doibrand-accent font-sans">
                              {order.total}
                            </span>
                          </div>

                          {/* 'অর্ডার বিস্তারিত' (View Details) button */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrderDetails(order)}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-doibrand-gold hover:text-doibrand-accent hover:underline transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span>অর্ডার বিস্তারিত</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="font-bold text-base text-doibrand-dark mb-1">
                      কোনো অর্ডার পাওয়া যায়নি
                    </h3>
                    <p className="text-xs text-gray-400">
                      এই ফিল্টারের আওতায় বর্তমানে কোনো অর্ডার বিদ্যমান নেই।
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: ADDRESS BOOK */}
          {activeTab === "address" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-doibrand-dark">ঠিকানা বুক</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    পণ্য ডেলিভারি ও চালানের জন্য আপনার সংরক্ষিত ঠিকানাসমূহ
                  </p>
                </div>
              </div>

              {/* 2 Styled Cards for Default Shipping & Billing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Default Shipping Address Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-doibrand-gold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                        {addresses.shipping.title}
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">
                        ডিফল্ট
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-doibrand-dark mb-1">
                      {addresses.shipping.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3 font-sans">
                      <Phone className="w-3.5 h-3.5 text-doibrand-gold" />
                      {addresses.shipping.phone}
                    </p>

                    <div className="pt-3 border-t border-gray-100 text-sm text-stone-600 space-y-1">
                      <p className="leading-relaxed">{addresses.shipping.fullAddress}</p>
                      <p className="font-medium text-doibrand-dark font-sans">
                        {addresses.shipping.city}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50">
                    <button
                      type="button"
                      id="btn-edit-shipping"
                      onClick={() => handleStartEditAddress("shipping")}
                      className="w-full inline-flex items-center justify-center gap-2 border border-doibrand-gold text-doibrand-gold hover:bg-doibrand-gold hover:text-white transition-colors py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>এডিট করুন</span>
                    </button>
                  </div>
                </div>

                {/* Default Billing Address Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-doibrand-accent bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                        {addresses.billing.title}
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">
                        ডিফল্ট
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-doibrand-dark mb-1">
                      {addresses.billing.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3 font-sans">
                      <Phone className="w-3.5 h-3.5 text-doibrand-gold" />
                      {addresses.billing.phone}
                    </p>

                    <div className="pt-3 border-t border-gray-100 text-sm text-stone-600 space-y-1">
                      <p className="leading-relaxed">{addresses.billing.fullAddress}</p>
                      <p className="font-medium text-doibrand-dark font-sans">
                        {addresses.billing.city}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50">
                    <button
                      type="button"
                      id="btn-edit-billing"
                      onClick={() => handleStartEditAddress("billing")}
                      className="w-full inline-flex items-center justify-center gap-2 border border-doibrand-gold text-doibrand-gold hover:bg-doibrand-gold hover:text-white transition-colors py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>এডিট করুন</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Informational tip */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-gray-500 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-doibrand-gold shrink-0" />
                <span>
                  চেকআউটের সময় আপনার ডিফল্ট শিপিং ঠিকানাটি স্বয়ংক্রিয়ভাবে পূরণ হবে।
                  আপনার ডেলিভারি সময় বাঁচাতে সঠিক ঠিকানা ও সচল মোবাইল নম্বর সংরক্ষণ রাখুন।
                </span>
              </div>
            </div>
          )}

          {/* VIEW 4: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-bold text-doibrand-dark">অ্যাকাউন্ট সেটিংস</h1>
                <p className="text-sm text-gray-500 mt-1">
                  আপনার ব্যক্তিগত তথ্য এবং নিরাপত্তা পাসওয়ার্ড আপডেট করুন
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* Section 1: Profile Information */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
                  <h3 className="text-lg font-bold text-doibrand-dark pb-3 border-b border-gray-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-doibrand-gold" />
                    <span>ব্যক্তিগত তথ্য (Profile Information)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        পুরো নাম (Name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        placeholder="আপনার পুরো নাম লিখুন"
                        className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold shadow-xs text-sm font-bengali text-doibrand-dark placeholder-gray-400 bg-white transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        ইমেইল ঠিকানা (Email) *
                      </label>
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        placeholder="name@example.com"
                        className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold shadow-xs text-sm font-sans text-doibrand-dark placeholder-gray-400 bg-white transition-colors"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        ফোন নম্বর (Phone Number) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        placeholder="+880 17XX-XXXXXX"
                        className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold shadow-xs text-sm font-sans text-doibrand-dark placeholder-gray-400 bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Change Password */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
                  <h3 className="text-lg font-bold text-doibrand-dark pb-3 border-b border-gray-100 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-doibrand-gold" />
                    <span>পাসওয়ার্ড পরিবর্তন (Change Password)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        বর্তমান পাসওয়ার্ড
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold shadow-xs text-sm font-sans text-doibrand-dark placeholder-gray-400 bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        নতুন পাসওয়ার্ড
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold shadow-xs text-sm font-sans text-doibrand-dark placeholder-gray-400 bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        নতুন পাসওয়ার্ড নিশ্চিত করুন
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold shadow-xs text-sm font-sans text-doibrand-dark placeholder-gray-400 bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    id="btn-save-settings"
                    className="w-full sm:w-auto px-8 bg-doibrand-dark text-white py-3 rounded-xl hover:bg-stone-900 transition-colors font-bengali font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>সেভ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>

      {/* ── Modal: Order Details ────────────────────────────────────────── */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-lg text-doibrand-dark">
                  অর্ডার বিস্তারিত: {selectedOrderDetails.id}
                </h3>
                <p className="text-xs text-gray-400">{selectedOrderDetails.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 text-xs">
                <span className="text-gray-600">ডেলিভারি স্ট্যাটাস:</span>
                <span
                  className={`font-semibold px-2.5 py-1 rounded-full ${
                    STATUS_CONFIG[selectedOrderDetails.status].classes
                  }`}
                >
                  {STATUS_CONFIG[selectedOrderDetails.status].labelBn}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  অর্ডারকৃত পণ্যের তালিকা
                </h4>
                <div className="space-y-3">
                  {selectedOrderDetails.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-stone-100 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-doibrand-dark">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            পরিমাণ: {item.qty} টি
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-doibrand-dark font-sans">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>ডেলিভারি মাধ্যম:</span>
                  <span>{selectedOrderDetails.deliveryMethod}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>পেমেন্ট মেথড:</span>
                  <span>ক্যাশ অন ডেলিভারি (COD)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-doibrand-accent pt-2 border-t border-gray-100">
                  <span>মোট প্রদেয় মূল্য:</span>
                  <span>{selectedOrderDetails.total}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-2.5 bg-doibrand-dark text-white rounded-xl text-xs font-semibold hover:bg-stone-900 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Address ─────────────────────────────────────────── */}
      {editingAddressKey && tempAddress && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-doibrand-dark">
                {tempAddress.title} এডিট করুন
              </h3>
              <button
                type="button"
                onClick={() => setEditingAddressKey(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  প্রাপকের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={tempAddress.name}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={tempAddress.phone}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, phone: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm font-sans focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={tempAddress.fullAddress}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, fullAddress: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  শহর ও পোস্টাল কোড *
                </label>
                <input
                  type="text"
                  required
                  value={tempAddress.city}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, city: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingAddressKey(null)}
                  className="w-1/2 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-doibrand-dark text-white rounded-xl text-sm font-semibold hover:bg-stone-900 transition-colors cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Logout Confirmation ─────────────────────────────────── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-doibrand-dark mb-2">
              আপনি কি লগআউট করতে চান?
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              লগআউট করলে আপনার বর্তমান সেশন বন্ধ হবে। পুনরায় লগইন করে যেকোনো সময় আপনার
              অর্ডার ইতিহাস দেখতে পারবেন।
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  showTemporaryToast("সফলভাবে লগআউট হয়েছে!");
                }}
                className="w-1/2 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
              >
                লগআউট
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
