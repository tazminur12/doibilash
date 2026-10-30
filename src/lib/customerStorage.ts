export type CustomerTier = "VIP" | "Gold" | "Regular" | "New" | "Wholesale";
export type CustomerStatus = "Active" | "Inactive";

export interface StoredCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: "ঢাকা সিটি" | "ঢাকার বাইরে";
  totalOrders: number;
  totalSpent: number;
  tier: CustomerTier;
  status: CustomerStatus;
  joinedDate: string;
  notes?: string;
  preferences?: string[];
  avatarInitials?: string;
}

export const TIER_META: Record<
  CustomerTier,
  { labelBn: string; color: string; bg: string; border: string }
> = {
  VIP: {
    labelBn: "ভিআইপি (VIP)",
    color: "text-amber-900",
    bg: "bg-linear-to-r from-amber-100 to-amber-200",
    border: "border-amber-300",
  },
  Gold: {
    labelBn: "গোল্ড লয়াল",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Regular: {
    labelBn: "নিয়মিত গ্রাহক",
    color: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  New: {
    labelBn: "নতুন গ্রাহক",
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  Wholesale: {
    labelBn: "পাইকারি / করপোরেট",
    color: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
};

export const DEFAULT_CUSTOMERS: StoredCustomer[] = [
  {
    id: "CUST-001",
    name: "তানভীর আহমেদ",
    phone: "01712-345678",
    email: "tanvir.ahmed@example.com",
    address: "বাড়ি ১২, রোড ৪, সেক্টর ৪, উত্তরা, ঢাকা",
    city: "ঢাকা সিটি",
    totalOrders: 12,
    totalSpent: 18450,
    tier: "VIP",
    status: "Active",
    joinedDate: "১২ জানুয়ারি, ২০২৬",
    notes: "বগুড়ার সরার দই খুব পছন্দ করেন। প্রতি সপ্তাহে নিয়মিত অর্ডার করেন।",
    preferences: ["বগুড়ার সরার দই", "মাটির কাপ দই", "কম মিষ্টি"],
    avatarInitials: "তাআ",
  },
  {
    id: "CUST-002",
    name: "শাহরিয়ার কবীর",
    phone: "01823-456789",
    email: "shahriar.kabir@example.com",
    address: "ফ্ল্যাট ৫বি, রোড ২৭, ধানমন্ডি, ঢাকা",
    city: "ঢাকা সিটি",
    totalOrders: 8,
    totalSpent: 12200,
    tier: "Gold",
    status: "Active",
    joinedDate: "০৫ মার্চ, ২০২৬",
    notes: "খাঁটি দানাদার গাওয়া ঘি এর নিয়মিত ক্রেতা।",
    preferences: ["খাঁটি গাওয়া ঘি", "মতিচুর লাড্ডু"],
    avatarInitials: "শাক",
  },
  {
    id: "CUST-003",
    name: "ফারহানা ইয়াসমিন",
    phone: "01934-567890",
    email: "farhana.yasmin@example.com",
    address: "হাউজ ৮, রোড ৭১, গুলশান-২, ঢাকা",
    city: "ঢাকা সিটি",
    totalOrders: 5,
    totalSpent: 7950,
    tier: "Regular",
    status: "Active",
    joinedDate: "১৮ মে, ২০২৬",
    notes: "পারিবারিক অনুষ্ঠানের জন্য মিষ্টি অর্ডার দেন।",
    preferences: ["ঐতিহ্যবাহী রসগোল্লা", "চমচম"],
    avatarInitials: "ফায়া",
  },
  {
    id: "CUST-004",
    name: "মাহমুদুল হাসান",
    phone: "01545-678901",
    email: "mahmudul.h@example.com",
    address: "ব্লক সি, লাইন ৪, মিরপুর-১০, ঢাকা",
    city: "ঢাকা সিটি",
    totalOrders: 9,
    totalSpent: 13700,
    tier: "Gold",
    status: "Active",
    joinedDate: "০৯ আগস্ট, ২০২৬",
    notes: "লাচ্ছা সেমাই ও মিষ্টি নিয়মিত ক্রয় করেন।",
    preferences: ["প্রিমিয়াম লাচ্ছা সেমাই", "বগুড়ার লাল দই"],
    avatarInitials: "মাহা",
  },
  {
    id: "CUST-005",
    name: "আব্দুল্লাহ আল মামুন",
    phone: "01767-890123",
    email: "mamun.bogra@gmail.com",
    address: "জেলখানা মোড়, খান্দার, বগুড়া সদর, বগুড়া",
    city: "ঢাকার বাইরে",
    totalOrders: 6,
    totalSpent: 9800,
    tier: "Regular",
    status: "Active",
    joinedDate: "১৪ সেপ্টেম্বর, ২০২৬",
    notes: "বগুড়ার স্থানীয় ক্রেতা, ডেলিভারি দ্রুত করতে হবে।",
    preferences: ["লাচ্ছা সেমাই ফ্যামিলি প্যাক", "গাওয়া ঘি"],
    avatarInitials: "আমা",
  },
  {
    id: "CUST-006",
    name: "নুসরাত জাহান",
    phone: "01656-789012",
    email: "nusrat.jahan@example.com",
    address: "রোড ১১, ব্লক ডি, বনানী, ঢাকা",
    city: "ঢাকা সিটি",
    totalOrders: 2,
    totalSpent: 2650,
    tier: "New",
    status: "Active",
    joinedDate: "১০ অক্টোবর, ২০২৬",
    notes: "নতুন গ্রাহক। প্রথম অর্ডারে পজিটিভ রিভিউ দিয়েছেন।",
    preferences: ["মাটির হাঁড়ির মিষ্টি দই"],
    avatarInitials: "নুজা",
  },
];

const STORAGE_KEY = "doibilash_admin_customers_v2";

export function getStoredCustomers(): StoredCustomer[] {
  if (typeof window === "undefined") {
    return DEFAULT_CUSTOMERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOMERS));
      return DEFAULT_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CUSTOMERS;
  } catch {
    return DEFAULT_CUSTOMERS;
  }
}

export function saveCustomer(customer: StoredCustomer): StoredCustomer[] {
  const customers = getStoredCustomers();
  const index = customers.findIndex((c) => c.id === customer.id || c.phone === customer.phone);

  let updated: StoredCustomer[];
  if (index >= 0) {
    updated = [...customers];
    updated[index] = { ...customer };
  } else {
    updated = [customer, ...customers];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save customer to localStorage", err);
    }
  }
  return updated;
}

export function deleteCustomer(id: string): StoredCustomer[] {
  const customers = getStoredCustomers();
  const updated = customers.filter((c) => c.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete customer from localStorage", err);
    }
  }
  return updated;
}

export function getCustomerById(id: string): StoredCustomer | undefined {
  const customers = getStoredCustomers();
  return customers.find((c) => c.id === id || c.phone === id);
}
