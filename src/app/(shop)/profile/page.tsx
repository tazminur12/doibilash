"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Plus,
  Check,
  ShieldCheck,
  X,
  AlertCircle,
  Crown,
  Home,
  Receipt,
  Wallet,
  Sparkles,
  BadgePercent,
  EyeOff,
  Package,
  Camera,
  Loader2,
  Upload,
  Trash2,
} from "lucide-react";
import { toBnDigits } from "@/lib/bangla";
import {
  getCurrentUser,
  clearCurrentUser,
  setCurrentUser,
  syncCurrentUserWithServer,
  authFetch,
  setAuthToken,
} from "@/lib/authStorage";

// ─── Types ──────────────────────────────────────────────────────────────────

type TabType = "dashboard" | "orders" | "address" | "settings";
type OrderStatus = "Processing" | "Shipped" | "Delivered";
type AddressKey = "shipping" | "billing";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  deliveryCharge: number;
  deliveryMethod: string;
  paymentMethod: string;
}

interface AddressData {
  title: string;
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
}

const DEMO_ADDRESS = "ফ্ল্যাট ৪বি, বাড়ি ২৫, রোড ৭, সেক্টর ৪, উত্তরা";

function isDemoAddress(address: { fullAddress?: string } | null | undefined): boolean {
  return (address?.fullAddress || "").trim() === DEMO_ADDRESS;
}

function toSavedAddress(raw: unknown, title: string): AddressData | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<AddressData>;
  const fullAddress = typeof data.fullAddress === "string" ? data.fullAddress.trim() : "";
  if (!fullAddress || fullAddress === DEMO_ADDRESS) return null;
  return {
    title: data.title || title,
    name: typeof data.name === "string" ? data.name : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    fullAddress,
    city: typeof data.city === "string" ? data.city : "",
  };
}

const STATUS_CONFIG: Record<OrderStatus, { labelBn: string; classes: string; dot: string; icon: React.ElementType; step: number }> = {
  Processing: {
    labelBn: "প্রসেসিং হচ্ছে",
    classes: "bg-[#FBF1E4] text-doibrand-accent ring-doibrand-gold/30",
    dot: "bg-doibrand-gold animate-pulse",
    icon: Clock,
    step: 1,
  },
  Shipped: {
    labelBn: "পাঠানো হয়েছে",
    classes: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500 animate-pulse",
    icon: Truck,
    step: 2,
  },
  Delivered: {
    labelBn: "ডেলিভারি সম্পন্ন",
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    step: 3,
  },
};

const PROGRESS_STEPS = ["অর্ডার গ্রহণ", "প্রস্তুত", "পাঠানো হয়েছে", "ডেলিভারি"];

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { id: "orders", label: "আমার অর্ডার", icon: ShoppingBag },
  { id: "address", label: "ঠিকানা বুক", icon: MapPin },
  { id: "settings", label: "অ্যাকাউন্ট সেটিংস", icon: Settings },
];

const ORDER_FILTERS: { label: string; value: "all" | OrderStatus }[] = [
  { label: "সকল অর্ডার", value: "all" },
  { label: "প্রসেসিং", value: "Processing" },
  { label: "পাঠানো হয়েছে", value: "Shipped" },
  { label: "ডেলিভারি সম্পন্ন", value: "Delivered" },
];

const orderTotal = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.qty * item.price, 0) + order.deliveryCharge;

const formatTaka = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

const cardClass = "rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]";

const inputClass =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-doibrand-dark placeholder-stone-400 ring-1 ring-stone-200 outline-none transition focus:ring-2 focus:ring-doibrand-gold/60 focus:shadow-[0_0_0_4px_rgba(196,138,78,0.12)]";

// ─── Small Components ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${meta.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.labelBn}
    </span>
  );
}

function MiniProgress({ status }: { status: OrderStatus }) {
  const activeStep = STATUS_CONFIG[status].step;
  const isDelivered = status === "Delivered";
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {PROGRESS_STEPS.map((label, i) => {
        const done = i < activeStep || (isDelivered && i === activeStep);
        const current = i === activeStep && !isDelivered;
        return (
          <div key={label}>
            <div
              className={`h-1.5 rounded-full ${
                done ? "bg-linear-to-r from-doibrand-gold to-doibrand-accent" : current ? "bg-doibrand-gold/40" : "bg-stone-200"
              }`}
            />
            <p className={`mt-1.5 text-[10px] ${done || current ? "font-semibold text-doibrand-dark" : "text-stone-400"}`}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}

function ItemThumb({ item, size = "w-12 h-12" }: { item: OrderItem; size?: string }) {
  return (
    <span className={`relative ${size} shrink-0 overflow-hidden rounded-xl bg-[#F5EDE3] ring-1 ring-stone-200/70`}>
      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
    </span>
  );
}

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 font-bengali">
      <div onClick={onClose} className="absolute inset-0 bg-doibrand-dark/40 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl animate-header-fade-up`}
      >
        {title && (
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-doibrand-gold/15 bg-white/95 backdrop-blur px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-doibrand-dark">{title}</h3>
              {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 grid place-items-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        autoComplete="new-password"
        className={`${inputClass} pr-11 font-sans`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-doibrand-accent cursor-pointer"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ProfileDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState("");

  const [addresses, setAddresses] = useState<Record<AddressKey, AddressData | null>>({
    shipping: null,
    billing: null,
  });
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [editingAddressKey, setEditingAddressKey] = useState<AddressKey | null>(null);
  const [tempAddress, setTempAddress] = useState<AddressData | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [profileData, setProfileData] = useState({
    name: "সম্মানিত গ্রাহক",
    email: "customer@doibilash.com",
    phone: "017XXXXXXXX",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const initialProfileRef = React.useRef({ name: "", email: "", phone: "" });

  // Sweet Alert Modal State
  const [sweetAlert, setSweetAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
    confirmButtonText?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    confirmButtonText: "ঠিক আছে",
  });

  const fireAlert = (options: {
    type?: "success" | "error" | "warning";
    title?: string;
    message: string;
    confirmButtonText?: string;
  }) => {
    setSweetAlert({
      isOpen: true,
      type: options.type || "success",
      title: options.title || (options.type === "error" ? "দুঃখিত!" : "সফল হয়েছে!"),
      message: options.message,
      confirmButtonText: options.confirmButtonText || "ঠিক আছে",
    });
  };

  useEffect(() => {
    if (!sweetAlert.isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSweetAlert((prev) => ({ ...prev, isOpen: false }));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sweetAlert.isOpen]);

  // Helper to populate user and address states
  const applyUserToState = (user: any) => {
    if (!user) return;
    const name = user.name || "সম্মানিত গ্রাহক";
    const email = user.email || `${user.phone}@customer.doibilash.com`;
    const phone = user.phone || "";
    setProfileData({ name, email, phone });
    initialProfileRef.current = { name, email, phone };
    if (user.avatarUrl) setAvatarUrl(user.avatarUrl);

    const plainAddress = typeof user.address === "string" ? user.address.trim() : "";
    const shipping =
      toSavedAddress(user.shippingAddress, "শিপিং ঠিকানা") ??
      (plainAddress && plainAddress !== DEMO_ADDRESS
        ? {
            title: "শিপিং ঠিকানা",
            name: user.name || "",
            phone: user.phone || "",
            fullAddress: plainAddress,
            city: user.city || "",
          }
        : null);
    const billing = toSavedAddress(user.billingAddress, "বিলিং ঠিকানা");
    setAddresses({ shipping, billing });
    setIsLoadingAddresses(false);

    const shippingIsDemo = isDemoAddress(user.shippingAddress);
    const plainIsDemo = plainAddress === DEMO_ADDRESS;
    const billingIsDemo = isDemoAddress(user.billingAddress);
    if (shippingIsDemo || plainIsDemo || billingIsDemo) {
      const payload: Record<string, unknown> = {};
      if (shippingIsDemo) payload.shippingAddress = null;
      if (plainIsDemo) payload.address = "";
      if (billingIsDemo) payload.billingAddress = null;
      authFetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user) setCurrentUser(data.user);
        })
        .catch((err) => console.error("Failed to clear demo address", err));
    }
  };

  const loadOrders = () => {
    authFetch("/api/user/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Failed to load user orders from Supabase", err))
      .finally(() => setIsLoadingOrders(false));
  };

  useEffect(() => {
    // 1. Initial cached user
    const cached = getCurrentUser();
    if (!cached) {
      syncCurrentUserWithServer().then((user) => {
        if (!user) {
          router.push("/login?redirect=/profile");
        } else {
          applyUserToState(user);
          loadOrders();
        }
      });
      return;
    }

    applyUserToState(cached);
    syncCurrentUserWithServer().then((user) => {
      if (user) applyUserToState(user);
    });
    loadOrders();
  }, [router]);

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");

  const stats = {
    total: orders.length,
    active: orders.filter((o) => o.status !== "Delivered").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    spent: orders.reduce((sum, o) => sum + orderTotal(o), 0),
  };

  const filterCount = (value: "all" | OrderStatus) =>
    value === "all" ? orders.length : orders.filter((o) => o.status === value).length;

  const filteredOrders = orders.filter((o) => orderFilter === "all" || o.status === orderFilter);
  const latestOrder = orders[0];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const closeAddressModal = () => {
    setEditingAddressKey(null);
    setTempAddress(null);
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const res = await authFetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: null }),
      });
      const data = await res.json();
      if (data.ok) {
        setAvatarUrl(null);
        const cached = getCurrentUser();
        if (cached) setCurrentUser({ ...cached, avatarUrl: null });
        fireAlert({
          type: "success",
          title: "মুছে ফেলা হয়েছে!",
          message: "আপনার প্রোফাইল ছবি সফলভাবে মুছে ফেলা হয়েছে।",
        });
      } else {
        fireAlert({
          type: "error",
          title: "ব্যর্থ হয়েছে",
          message: data.error || "ছবি মুছতে সমস্যা হয়েছে।",
        });
      }
    } catch {
      fireAlert({
        type: "error",
        title: "সমস্যা হয়েছে",
        message: "ছবি মুছতে নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      fireAlert({
        type: "warning",
        title: "সঠিক ফাইল দিন",
        message: "দয়া করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      fireAlert({
        type: "warning",
        title: "ফাইলের সাইজ বড়",
        message: "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await authFetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setAvatarUrl(json.url);
        const user = getCurrentUser();
        if (user) {
          setCurrentUser({ ...user, avatarUrl: json.url });
        }
        fireAlert({
          type: "success",
          title: "সফল হয়েছে!",
          message: "আপনার প্রোফাইল ছবি সফলভাবে সম্পূর্ণ করা হয়েছে।",
        });
      } else {
        fireAlert({
          type: "error",
          title: "আপলোড ব্যর্থ",
          message: json.error || "ছবি আপলোড সম্পন্ন করা সম্ভব হয়নি।",
        });
      }
    } catch {
      fireAlert({
        type: "error",
        title: "নেটওয়ার্ক সমস্যা",
        message: "ছবি আপলোড করার সময় নেটওয়ার্ক সমস্যা হয়েছে।",
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openAddressEditor = (key: AddressKey) => {
    const existing = addresses[key];
    const phone = profileData.phone && !profileData.phone.includes("X") ? profileData.phone : "";
    const name = profileData.name && profileData.name !== "সম্মানিত গ্রাহক" ? profileData.name : "";
    setEditingAddressKey(key);
    setTempAddress(
      existing
        ? { ...existing }
        : {
            title: key === "shipping" ? "শিপিং ঠিকানা" : "বিলিং ঠিকানা",
            name,
            phone,
            fullAddress: "",
            city: "",
          }
    );
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressKey && tempAddress) {
      const label = editingAddressKey === "shipping" ? "শিপিং ঠিকানা" : "বিলিং ঠিকানা";
      if (!tempAddress.fullAddress.trim()) return;

      try {
        const saved = { ...tempAddress, fullAddress: tempAddress.fullAddress.trim() };
        const payload: Record<string, unknown> = {};
        if (editingAddressKey === "shipping") {
          payload.shippingAddress = saved;
          payload.address = saved.fullAddress;
          payload.city = saved.city;
        } else {
          payload.billingAddress = saved;
        }

        const res = await authFetch("/api/auth/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          fireAlert({
            type: "error",
            title: "ব্যর্থ হয়েছে",
            message: data.error || `${label} সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।`,
          });
          return;
        }

        if (data.token) {
          setAuthToken(data.token);
        }

        if (data.user) {
          setCurrentUser(data.user);
        } else {
          const user = getCurrentUser();
          if (user) {
            setCurrentUser({
              ...user,
              ...(editingAddressKey === "shipping"
                ? { address: saved.fullAddress, city: saved.city, shippingAddress: saved }
                : { billingAddress: saved }),
            });
          }
        }

        setAddresses((prev) => ({ ...prev, [editingAddressKey]: saved }));
        closeAddressModal();
        fireAlert({
          type: "success",
          title: "সফল হয়েছে!",
          message: `আপনার ${label} সংরক্ষণ করা হয়েছে।`,
        });
      } catch (err) {
        console.error("Failed to sync address with Supabase", err);
        fireAlert({
          type: "error",
          title: "ব্যর্থ হয়েছে",
          message: `${label} সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।`,
        });
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setPasswordError("বর্তমান পাসওয়ার্ড দিন।");
        fireAlert({
          type: "warning",
          title: "পাসওয়ার্ড দিন",
          message: "পাসওয়ার্ড পরিবর্তন করতে হলে বর্তমান পাসওয়ার্ডটি প্রদান করুন।",
        });
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
        fireAlert({
          type: "warning",
          title: "পাসওয়ার্ড ছোট",
          message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।");
        fireAlert({
          type: "warning",
          title: "পাসওয়ার্ড মিলছে না",
          message: "নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।",
        });
        return;
      }
    }
    setPasswordError("");
    setIsSavingSettings(true);

    // Track which fields were modified compared to initial state
    const prevName = (initialProfileRef.current.name || "").trim();
    const prevPhone = (initialProfileRef.current.phone || "").trim().replace(/[\s-]/g, "");
    const prevEmail = (initialProfileRef.current.email || "").trim().toLowerCase();

    const currName = profileData.name.trim();
    const currPhone = profileData.phone.trim().replace(/[\s-]/g, "");
    const currEmail = profileData.email.trim().toLowerCase();

    const nameChanged = Boolean(currName && currName !== prevName);
    const phoneChanged = Boolean(currPhone && currPhone !== prevPhone);
    const emailChanged = Boolean(currEmail && currEmail !== prevEmail);
    const passwordChanged = Boolean(newPassword);

    // Build specific Bengali message according to user request
    let successMessage = "আপনার অ্যাকাউন্ট সেটিংস সফলভাবে সম্পূর্ণ করা হয়েছে।";

    const changedList: string[] = [];
    if (phoneChanged) changedList.push("ফোন নম্বর");
    if (nameChanged) changedList.push("নাম");
    if (emailChanged) changedList.push("ইমেইল");

    if (changedList.length === 1) {
      if (phoneChanged) {
        successMessage = "আপনার ফোন নম্বর সফলভাবে সম্পূর্ণ করা হয়েছে।";
      } else if (nameChanged) {
        successMessage = "আপনার নাম সফলভাবে সম্পূর্ণ করা হয়েছে।";
      } else if (emailChanged) {
        successMessage = "আপনার ইমেইল সফলভাবে সম্পূর্ণ করা হয়েছে।";
      }
    } else if (changedList.length === 2) {
      successMessage = `আপনার ${changedList[0]} ও ${changedList[1]} সফলভাবে সম্পূর্ণ করা হয়েছে।`;
    } else if (changedList.length === 3) {
      successMessage = "আপনার নাম, ফোন নম্বর ও ইমেইল সফলভাবে সম্পূর্ণ করা হয়েছে।";
    }

    if (passwordChanged) {
      if (changedList.length > 0) {
        successMessage = `আপনার ${changedList.join(", ")} ও পাসওয়ার্ড সফলভাবে সম্পূর্ণ করা হয়েছে।`;
      } else {
        successMessage = "আপনার পাসওয়ার্ড সফলভাবে সম্পূর্ণ করা হয়েছে।";
      }
    }

    try {
      // 1. Update basic info in Supabase
      const res = await authFetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        fireAlert({
          type: "error",
          title: "ব্যর্থ হয়েছে",
          message: data.error || "প্রোফাইল তথ্য আপডেট করতে সমস্যা হয়েছে।",
        });
        setIsSavingSettings(false);
        return;
      }

      if (data.token) {
        setAuthToken(data.token);
      }
      setCurrentUser(data.user);
      initialProfileRef.current = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      };

      // 2. Change password if filled
      if (newPassword) {
        const passRes = await authFetch("/api/auth/password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const passData = await passRes.json();
        if (!passRes.ok || !passData.ok) {
          setPasswordError(passData.error || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে");
          fireAlert({
            type: "error",
            title: "পাসওয়ার্ড ত্রুটি",
            message: passData.error || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।",
          });
          setIsSavingSettings(false);
          return;
        }
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }

      fireAlert({
        type: "success",
        title: "সফল হয়েছে!",
        message: successMessage,
        confirmButtonText: "ঠিক আছে",
      });
    } catch {
      fireAlert({
        type: "error",
        title: "নেটওয়ার্ক ত্রুটি",
        message: "সার্ভারে সংযোগ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const initial = Array.from(profileData.name)[0] ?? "U";

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Sweet Alert Pop-up Modal */}
      {sweetAlert.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-bengali animate-in fade-in duration-200">
          {/* Backdrop with blur */}
          <div
            onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Sweet Alert Card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sweetalert-title"
            className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
              aria-label="Close"
              className="absolute right-4 top-4 w-8 h-8 grid place-items-center rounded-full bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            {sweetAlert.type === "success" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/60">
                <CheckCircle2 className="h-10 w-10 animate-bounce duration-700" />
              </div>
            )}
            {sweetAlert.type === "error" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/60">
                <AlertCircle className="h-10 w-10 animate-pulse" />
              </div>
            )}
            {sweetAlert.type === "warning" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-8 ring-amber-50/60">
                <AlertCircle className="h-10 w-10 animate-pulse" />
              </div>
            )}

            {/* Title */}
            <h3
              id="sweetalert-title"
              className="text-xl sm:text-2xl font-black text-doibrand-dark tracking-tight"
            >
              {sweetAlert.title}
            </h3>

            {/* Message */}
            <p className="mt-2.5 text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
              {sweetAlert.message}
            </p>

            {/* Confirm Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
                className="w-full inline-flex items-center justify-center rounded-xl bg-linear-to-r from-doibrand-accent to-doibrand-gold py-3 px-6 text-sm sm:text-base font-bold text-white shadow-lg shadow-doibrand-accent/25 hover:brightness-110 active:scale-98 transition cursor-pointer"
              >
                {sweetAlert.confirmButtonText || "ঠিক আছে"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-28 right-4 left-4 sm:left-auto z-[80] sm:w-96 animate-header-fade-up">
          <div role="status" className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-emerald-200 shadow-xl">
            <span className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <p className="flex-1 text-sm font-medium">{toast}</p>
            <button type="button" onClick={() => setToast("")} aria-label="Dismiss" className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Profile Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_24px_60px_-34px_rgba(169,94,53,0.6)] px-5 py-6 sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>আমার অ্যাকাউন্ট</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">{TABS.find((t) => t.id === activeTab)?.label}</span>
          </nav>

          <div className="relative mt-5 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="relative shrink-0 rounded-full p-[3px] bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent shadow-[0_12px_24px_-12px_rgba(169,94,53,0.8)] group">
                <span className="w-16 h-16 sm:w-20 sm:h-20 grid place-items-center rounded-full bg-white text-2xl sm:text-3xl font-extrabold text-doibrand-accent overflow-hidden relative">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={profileData.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    initial
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white z-10">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="ক্লাউডিনারিতে ছবি পরিবর্তন করুন"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#351C1B] text-[#C48A4E] hover:text-white hover:bg-black ring-2 ring-white flex items-center justify-center transition shadow-md cursor-pointer z-20"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </span>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-2.5 py-0.5 text-[10px] font-bold text-white">
                  <Crown className="w-3 h-3 fill-current" />
                  প্রিমিয়াম মেম্বার
                </span>
                <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight truncate">{profileData.name}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 font-sans">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-doibrand-gold" />
                    {profileData.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-doibrand-gold" />
                    {profileData.phone}
                  </span>
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 lg:w-[560px]">
              {[
                { label: "মোট অর্ডার", value: toBnDigits(stats.total), icon: ShoppingBag },
                { label: "চলমান", value: toBnDigits(stats.active), icon: Truck },
                { label: "ডেলিভারকৃত", value: toBnDigits(stats.delivered), icon: CheckCircle2 },
                { label: "মোট কেনাকাটা", value: formatTaka(stats.spent), icon: Wallet, sans: true },
              ].map(({ label, value, icon: Icon, sans }) => (
                <div key={label} className="rounded-2xl bg-white/80 backdrop-blur p-3 ring-1 ring-white shadow-sm">
                  <dt className="flex items-center gap-1.5 text-[10px] font-semibold text-stone-500">
                    <Icon className="w-3.5 h-3.5 text-doibrand-gold" />
                    {label}
                  </dt>
                  <dd className={`mt-1 text-lg font-extrabold text-doibrand-dark ${sans ? "font-sans" : ""}`}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        {/* Sidebar / Mobile Tabs */}
        <aside className="lg:sticky lg:top-32">
          <nav aria-label="Profile tabs" className={`${cardClass} p-2 lg:p-3`}>
            <div className="flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    id={`tab-btn-${id}`}
                    onClick={() => setActiveTab(id)}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 lg:py-3 text-sm transition cursor-pointer ${
                      active
                        ? "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white font-bold shadow-[0_10px_22px_-12px_rgba(169,94,53,0.9)]"
                        : "text-stone-600 hover:bg-[#FBF1E4] hover:text-doibrand-dark"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap lg:flex-1 text-left">{label}</span>
                    {id === "orders" && (
                      <span
                        className={`hidden lg:grid min-w-5 h-5 px-1.5 place-items-center rounded-full text-[10px] font-bold ${
                          active ? "bg-white/25 text-white" : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {toBnDigits(orders.length)}
                      </span>
                    )}
                  </button>
                );
              })}
              <span className="hidden lg:block my-2 h-px bg-stone-100" />
              <button
                type="button"
                id="tab-btn-logout"
                onClick={() => setShowLogoutModal(true)}
                className="shrink-0 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 lg:py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">লগআউট</span>
              </button>
            </div>
          </nav>

          <div className="hidden lg:block mt-4 rounded-3xl bg-linear-to-br from-[#FFF6E9] via-[#FFFDF9] to-[#F8E7CF] p-5 ring-1 ring-doibrand-gold/20">
            <ShieldCheck className="w-6 h-6 text-doibrand-gold" />
            <p className="mt-2 text-sm font-bold">আপনার তথ্য সুরক্ষিত</p>
            <p className="mt-1 text-[11px] leading-relaxed text-stone-500">আমরা আপনার ব্যক্তিগত তথ্য কখনো তৃতীয় পক্ষের সাথে শেয়ার করি না।</p>
          </div>
        </aside>

        {/* Content */}
        <section key={activeTab} className="min-w-0 animate-header-fade-up">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#F6E2C3] via-[#FFF6EA] to-[#EFD2A6] p-6 sm:p-7 ring-1 ring-doibrand-gold/25">
                <Sparkles className="pointer-events-none absolute -right-4 -bottom-6 w-36 h-36 text-doibrand-gold/15" strokeWidth={1.25} />
                <h2 className="relative text-xl sm:text-2xl font-extrabold">
                  স্বাগতম,{" "}
                  <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                    {profileData.name}
                  </span>
                  !
                </h2>
                <p className="relative mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
                  এখান থেকে আপনার অর্ডার ট্র্যাক করুন, ঠিকানা পরিচালনা করুন এবং প্রোফাইল তথ্য আপডেট করুন।
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="inline-flex items-center gap-2 rounded-full bg-doibrand-dark px-5 py-2.5 text-xs sm:text-sm font-bold text-doibrand-light hover:bg-doibrand-accent transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    সকল অর্ডার দেখুন
                  </button>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2.5 text-xs sm:text-sm font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-white transition"
                  >
                    কেনাকাটা করুন
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Latest Order */}
              {isLoadingOrders ? (
                <div className={`${cardClass} p-8 text-center flex items-center justify-center gap-2 text-stone-500`}>
                  <Loader2 className="w-5 h-5 text-doibrand-accent animate-spin" />
                  <span className="text-xs font-semibold">সর্বশেষ অর্ডার লোড হচ্ছে...</span>
                </div>
              ) : latestOrder ? (
                <div className={`${cardClass} p-5 sm:p-6`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">সর্বশেষ অর্ডার</h3>
                      <p className="text-xs text-stone-500">আপনার সর্বশেষ অর্ডারের বর্তমান অবস্থা</p>
                    </div>
                    <StatusBadge status={latestOrder.status} />
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/15">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {latestOrder.items.map((item) => (
                            <span key={item.name} className="rounded-xl ring-2 ring-white">
                              <ItemThumb item={item} />
                            </span>
                          ))}
                        </div>
                        <div>
                          <p className="font-bold font-sans">{latestOrder.id}</p>
                          <p className="text-[11px] text-stone-500">{latestOrder.date} · {toBnDigits(latestOrder.items.length)}টি পণ্য</p>
                        </div>
                      </div>
                      <p className="text-lg font-extrabold text-doibrand-accent font-sans">{formatTaka(orderTotal(latestOrder))}</p>
                    </div>
                    <div className="mt-4">
                      <MiniProgress status={latestOrder.status} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(latestOrder)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FBF1E4] px-4 py-2.5 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-[#F6E4CC] transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      অর্ডার বিস্তারিত
                    </button>
                    <Link
                      href="/track-order"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-doibrand-dark px-4 py-2.5 text-xs font-bold text-doibrand-light hover:bg-doibrand-accent transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      ট্র্যাক করুন
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Truck, label: "অর্ডার ট্র্যাক", href: "/track-order" },
                  { icon: MapPin, label: "ঠিকানা বুক", tab: "address" as TabType },
                  { icon: Settings, label: "সেটিংস", tab: "settings" as TabType },
                  { icon: BadgePercent, label: "অফার দেখুন", href: "/offers" },
                ].map(({ icon: Icon, label, href, tab }) => {
                  const content = (
                    <>
                      <span className="w-11 h-11 grid place-items-center rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-bold">{label}</span>
                    </>
                  );
                  const className = `group flex flex-col items-center gap-2.5 p-4 ${cardClass} hover:ring-doibrand-gold/40 transition cursor-pointer`;
                  return href ? (
                    <Link key={label} href={href} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <button key={label} type="button" onClick={() => tab && setActiveTab(tab)} className={className}>
                      {content}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">আমার অর্ডার</h2>
                  <p className="mt-1 text-xs sm:text-sm text-stone-500">আপনার সম্পন্ন ও চলমান সকল অর্ডার</p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-4 py-2 text-xs font-bold text-white shadow-[0_10px_22px_-12px_rgba(169,94,53,0.9)]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  নতুন অর্ডার
                </Link>
              </div>

              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto hide-scrollbar">
                {ORDER_FILTERS.map((filter) => {
                  const active = orderFilter === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setOrderFilter(filter.value)}
                      aria-pressed={active}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                        active
                          ? "bg-doibrand-dark text-doibrand-light shadow-[0_8px_18px_-10px_rgba(53,28,27,0.8)]"
                          : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
                      }`}
                    >
                      {filter.label}
                      <span className={`text-[10px] ${active ? "text-doibrand-gold" : "text-stone-400"}`}>
                        {toBnDigits(filterCount(filter.value))}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isLoadingOrders ? (
                <div className={`${cardClass} p-12 text-center flex flex-col items-center justify-center gap-3`}>
                  <Loader2 className="w-8 h-8 text-doibrand-accent animate-spin" />
                  <p className="text-sm font-semibold text-stone-600">ডাটাবেজ থেকে আপনার অর্ডারসমূহ লোড করা হচ্ছে...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <article key={order.id} className={`${cardClass} p-5 transition hover:ring-doibrand-gold/40`}>
                      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-doibrand-gold/10">
                        <div>
                          <p className="font-bold font-sans text-base">{order.id}</p>
                          <p className="mt-0.5 text-[11px] text-stone-500">
                            {order.date} · {order.deliveryMethod}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <ul className="py-4 space-y-3">
                        {order.items.map((item) => (
                          <li key={item.name} className="flex items-center gap-3">
                            <ItemThumb item={item} size="w-14 h-14" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-semibold">{item.name}</p>
                              <p className="mt-0.5 text-[11px] text-stone-500">
                                {toBnDigits(item.qty)} × <span className="font-sans">{formatTaka(item.price)}</span>
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-bold font-sans">{formatTaka(item.qty * item.price)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4 border-t border-doibrand-gold/10 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-stone-500">মোট মূল্য</p>
                          <p className="text-lg font-extrabold text-doibrand-accent font-sans">{formatTaka(orderTotal(order))}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FBF1E4] px-3.5 py-2 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-[#F6E4CC] transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            বিস্তারিত
                          </button>
                          {order.status !== "Delivered" && (
                            <Link
                              href="/track-order"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-doibrand-dark px-3.5 py-2 text-xs font-bold text-doibrand-light hover:bg-doibrand-accent transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              ট্র্যাক
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={`${cardClass} p-10 text-center`}>
                  <span className="mx-auto w-16 h-16 grid place-items-center rounded-full bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-8 ring-[#FBF1E4]">
                    <Package className="w-7 h-7" />
                  </span>
                  <h3 className="mt-5 text-base font-bold">
                    {orders.length === 0 ? "এখনো কোনো অর্ডার নেই" : "কোনো অর্ডার পাওয়া যায়নি"}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500">
                    {orders.length === 0
                      ? "আপনি অর্ডার করলে সেগুলো এখানে দেখা যাবে।"
                      : "এই ফিল্টারে বর্তমানে কোনো অর্ডার নেই।"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ADDRESS */}
          {activeTab === "address" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">ঠিকানা বুক</h2>
                <p className="mt-1 text-xs sm:text-sm text-stone-500">পণ্য ডেলিভারি ও চালানের জন্য আপনার সংরক্ষিত ঠিকানা</p>
              </div>

              {isLoadingAddresses ? (
                <div className={`${cardClass} p-12 text-center flex flex-col items-center justify-center gap-3`}>
                  <Loader2 className="w-8 h-8 text-doibrand-accent animate-spin" />
                  <p className="text-sm font-semibold text-stone-600">আপনার সংরক্ষিত ঠিকানা লোড হচ্ছে...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(["shipping", "billing"] as AddressKey[]).map((key) => {
                    const address = addresses[key];
                    const Icon = key === "shipping" ? Home : Receipt;
                    const title = key === "shipping" ? "শিপিং ঠিকানা" : "বিলিং ঠিকানা";
                    return (
                      <div key={key} className={`${cardClass} p-5 sm:p-6 flex flex-col`}>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-2 text-sm font-bold">
                            <span className="w-9 h-9 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                              <Icon className="w-4 h-4" />
                            </span>
                            {address?.title || title}
                          </span>
                          {address && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200/70">
                              সংরক্ষিত
                            </span>
                          )}
                        </div>
                        {address ? (
                          <div className="mt-5 flex-1 rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/15">
                            <p className="text-base font-bold">{address.name}</p>
                            {address.phone && (
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500 font-sans">
                                <Phone className="w-3.5 h-3.5 text-doibrand-gold" />
                                {address.phone}
                              </p>
                            )}
                            <p className="mt-3 flex items-start gap-1.5 text-sm leading-relaxed text-stone-600">
                              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-doibrand-gold" />
                              <span>
                                {address.fullAddress}
                                {address.city && (
                                  <span className="block font-semibold text-doibrand-dark">{address.city}</span>
                                )}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div className="mt-5 flex-1 rounded-2xl bg-[#FFF9F1] p-6 text-center ring-1 ring-doibrand-gold/15">
                            <span className="mx-auto w-12 h-12 grid place-items-center rounded-full bg-white text-doibrand-accent ring-1 ring-doibrand-gold/20">
                              <MapPin className="w-5 h-5" />
                            </span>
                            <p className="mt-3 text-sm font-bold">কোনো ঠিকানা সংরক্ষিত নেই</p>
                            <p className="mt-1 text-xs text-stone-500">আপনি ঠিকানা যোগ করলে সেটি এখানে দেখা যাবে।</p>
                          </div>
                        )}
                        <button
                          type="button"
                          id={`btn-edit-${key}`}
                          onClick={() => openAddressEditor(key)}
                          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBF1E4] py-2.5 text-sm font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-linear-to-r hover:from-doibrand-accent hover:to-doibrand-gold hover:text-white hover:ring-transparent transition cursor-pointer"
                        >
                          {address ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          {address ? "এডিট করুন" : "ঠিকানা যোগ করুন"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-start gap-3 rounded-2xl bg-linear-to-br from-[#FFF6E9] via-[#FFFDF9] to-[#F8E7CF] p-4 ring-1 ring-doibrand-gold/20 text-xs text-stone-600">
                <AlertCircle className="w-4 h-4 shrink-0 text-doibrand-gold" />
                {addresses.shipping
                  ? "চেকআউটের সময় আপনার সংরক্ষিত শিপিং ঠিকানাটি পূরণ হবে। দ্রুত ডেলিভারির জন্য সঠিক ঠিকানা ও সচল মোবাইল নম্বর রাখুন।"
                  : "শিপিং ঠিকানা সংরক্ষণ করলে চেকআউটে সেটি ব্যবহার করা যাবে।"}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">অ্যাকাউন্ট সেটিংস</h2>
                <p className="mt-1 text-xs sm:text-sm text-stone-500">আপনার ব্যক্তিগত তথ্য ও পাসওয়ার্ড আপডেট করুন</p>
              </div>

              <div className={`${cardClass} p-5 sm:p-7`}>
                <h3 className="flex items-center gap-2 pb-4 mb-5 border-b border-doibrand-gold/15 text-base font-bold">
                  <span className="w-8 h-8 grid place-items-center rounded-lg bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                    <User className="w-4 h-4" />
                  </span>
                  ব্যক্তিগত তথ্য
                </h3>

                {/* Cloudinary Profile Photo Section */}
                <div className="mb-6 p-4 rounded-2xl bg-[#FFF9F1] border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-accent p-0.5 shrink-0 shadow-sm">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden relative flex items-center justify-center font-black text-doibrand-accent text-lg">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={profileData.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          initial
                        )}
                        {isUploadingAvatar && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-doibrand-dark">প্রোফাইল ছবি</p>
                      <p className="text-[11px] text-stone-500">Cloudinary সিডিএন-এ হাই-রেজ্যুলেশনে সংরক্ষিত</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={isUploadingAvatar}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-60"
                        title="প্রোফাইল ছবি ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ছবি মুছুন</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 hover:border-doibrand-gold text-xs font-bold text-doibrand-dark hover:text-doibrand-accent shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingAvatar ? "আপলোড হচ্ছে..." : "নতুন ছবি দিন"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold">পুরো নাম *</span>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold">ইমেইল *</span>
                    <input
                      type="email"
                      required
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className={`${inputClass} font-sans`}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-semibold">ফোন নম্বর *</span>
                    <input
                      type="tel"
                      required
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className={`${inputClass} font-sans`}
                    />
                  </label>
                </div>
              </div>

              <div className={`${cardClass} p-5 sm:p-7`}>
                <h3 className="flex items-center gap-2 pb-4 mb-5 border-b border-doibrand-gold/15 text-base font-bold">
                  <span className="w-8 h-8 grid place-items-center rounded-lg bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                    <Lock className="w-4 h-4" />
                  </span>
                  পাসওয়ার্ড পরিবর্তন
                  <span className="text-[11px] font-normal text-stone-400">(ঐচ্ছিক)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    [
                      { key: "currentPassword", label: "বর্তমান পাসওয়ার্ড" },
                      { key: "newPassword", label: "নতুন পাসওয়ার্ড" },
                      { key: "confirmPassword", label: "নিশ্চিত করুন" },
                    ] as const
                  ).map(({ key, label }) => (
                    <div key={key}>
                      <label htmlFor={key} className="mb-1.5 block text-xs font-semibold">
                        {label}
                      </label>
                      <PasswordInput
                        id={key}
                        value={passwordData[key]}
                        onChange={(v) => {
                          setPasswordData({ ...passwordData, [key]: v });
                          setPasswordError("");
                        }}
                      />
                    </div>
                  ))}
                </div>
                {passwordError && (
                  <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 ring-1 ring-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  id="btn-save-settings"
                  disabled={isSavingSettings}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-doibrand-accent to-doibrand-gold px-8 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-14px_rgba(169,94,53,0.95)] hover:brightness-110 transition cursor-pointer disabled:opacity-60"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>সেভ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      {/* Order Details Modal */}
      <Modal
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `অর্ডার ${selectedOrder.id}` : undefined}
        subtitle={selectedOrder?.date}
      >
        {selectedOrder && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/15">
              <span className="text-xs text-stone-500">ডেলিভারি স্ট্যাটাস</span>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <MiniProgress status={selectedOrder.status} />
            <ul className="space-y-2.5">
              {selectedOrder.items.map((item) => (
                <li key={item.name} className="flex items-center gap-3 rounded-2xl p-2.5 ring-1 ring-stone-200/70">
                  <ItemThumb item={item} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-[11px] text-stone-500">{toBnDigits(item.qty)}টি</p>
                  </div>
                  <span className="text-sm font-bold font-sans">{formatTaka(item.qty * item.price)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-dashed border-doibrand-gold/30 pt-4 text-xs">
              <div className="flex justify-between text-stone-500">
                <dt>ডেলিভারি মাধ্যম</dt>
                <dd>{selectedOrder.deliveryMethod}</dd>
              </div>
              <div className="flex justify-between text-stone-500">
                <dt>পেমেন্ট মেথড</dt>
                <dd>{selectedOrder.paymentMethod}</dd>
              </div>
              <div className="flex justify-between text-stone-500">
                <dt>ডেলিভারি চার্জ</dt>
                <dd className="font-sans">{formatTaka(selectedOrder.deliveryCharge)}</dd>
              </div>
              <div className="flex justify-between pt-2 text-base font-extrabold">
                <dt>সর্বমোট</dt>
                <dd className="font-sans text-doibrand-accent">{formatTaka(orderTotal(selectedOrder))}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        open={editingAddressKey !== null && tempAddress !== null}
        onClose={closeAddressModal}
        title={
          tempAddress
            ? `${tempAddress.title} ${editingAddressKey && addresses[editingAddressKey] ? "এডিট করুন" : "যোগ করুন"}`
            : undefined
        }
      >
        {tempAddress && (
          <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">প্রাপকের নাম *</span>
              <input
                type="text"
                required
                value={tempAddress.name}
                onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">মোবাইল নম্বর *</span>
              <input
                type="tel"
                required
                value={tempAddress.phone}
                onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                className={`${inputClass} font-sans`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা) *</span>
              <textarea
                rows={2}
                required
                value={tempAddress.fullAddress}
                onChange={(e) => setTempAddress({ ...tempAddress, fullAddress: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">শহর ও পোস্টাল কোড *</span>
              <input
                type="text"
                required
                value={tempAddress.city}
                onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                className={inputClass}
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeAddressModal}
                className="flex-1 rounded-xl bg-stone-100 py-3 text-sm font-bold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="flex-[2] rounded-xl bg-linear-to-r from-doibrand-accent to-doibrand-gold py-3 text-sm font-bold text-white shadow-[0_10px_22px_-12px_rgba(169,94,53,0.9)] cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Logout Modal */}
      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} maxWidth="max-w-sm">
        <div className="p-6 text-center">
          <span className="mx-auto w-14 h-14 grid place-items-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/60">
            <LogOut className="w-6 h-6" />
          </span>
          <h3 className="mt-5 text-lg font-bold">আপনি কি লগআউট করতে চান?</h3>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            পুনরায় লগইন করে যেকোনো সময় আপনার অর্ডার ইতিহাস দেখতে পারবেন।
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 rounded-xl bg-stone-100 py-3 text-sm font-bold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
            >
              ফিরে যান
            </button>
            <button
              type="button"
              onClick={() => {
                clearCurrentUser();
                setShowLogoutModal(false);
                router.push("/login");
              }}
              className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 transition cursor-pointer"
            >
              লগআউট
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
