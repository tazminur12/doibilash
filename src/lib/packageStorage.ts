export type PackageOccasion =
  | "ঈদ উৎসব"
  | "পহেলা বৈশাখ"
  | "বিয়ে ও পারিবারিক"
  | "কর্পোরেট উপহার"
  | "পূজা ও উৎসব"
  | "নিত্যদিনের উপহার";

export type PackageStatus = "Active" | "Draft" | "Sold Out";

export interface PackageItemComponent {
  productId?: string;
  name: string;
  quantity: string;
}

export interface StoredPackage {
  id: string;
  title: string;
  subtitle: string;
  occasion: PackageOccasion;
  packagingType: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  badge: string;
  image: string;
  features: string[];
  components: PackageItemComponent[];
  isFeatured: boolean;
  status: PackageStatus;
  availableStock: number;
  customGreetingAllowed: boolean;
  createdAt: string;
}

export const OCCASION_META: Record<
  PackageOccasion,
  { labelBn: string; color: string; bg: string; border: string }
> = {
  "ঈদ উৎসব": {
    labelBn: "ঈদ উৎসব",
    color: "text-emerald-900",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  "পহেলা বৈশাখ": {
    labelBn: "পহেলা বৈশাখ",
    color: "text-red-900",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  "বিয়ে ও পারিবারিক": {
    labelBn: "বিয়ে ও পারিবারিক",
    color: "text-purple-900",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  "কর্পোরেট উপহার": {
    labelBn: "কর্পোরেট উপহার",
    color: "text-blue-900",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "পূজা ও উৎসব": {
    labelBn: "পূজা ও উৎসব",
    color: "text-amber-900",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  "নিত্যদিনের উপহার": {
    labelBn: "নিত্যদিনের উপহার",
    color: "text-stone-800",
    bg: "bg-stone-100",
    border: "border-stone-200",
  },
};

export const DEFAULT_PACKAGES: StoredPackage[] = [
  {
    id: "PKG-101",
    title: "শাহী সরা উপহার প্যাকেজ",
    subtitle: "বিয়ে, জন্মদিন ও পারিবারিক অনুষ্ঠানের জন্য রাজকীয় উপহার",
    occasion: "বিয়ে ও পারিবারিক",
    packagingType: "রয়েল গোল্ডেন ফিতা ও সিল্ক গ্রিটিংস বক্স",
    price: 1850,
    originalPrice: 2150,
    discountPercent: 14,
    badge: "সবচেয়ে জনপ্রিয়",
    image: "/Product/doi.jpg",
    isFeatured: true,
    status: "Active",
    availableStock: 45,
    customGreetingAllowed: true,
    createdAt: "২০২৬-০১-১৫",
    features: [
      "১ কেজি বগুড়ার স্পেশাল সরার মিষ্টি দই",
      "৫০০ গ্রাম খাঁটি দানাদার গাওয়া ঘি",
      "২৫০ গ্রাম সুন্দরবনের প্রাকৃতিক মধু",
      "রয়েল গোল্ডেন ফিতা ও ক্যালিগ্রাফি গ্রিটিংস কার্ড",
    ],
    components: [
      { productId: "PROD-001", name: "বগুড়ার স্পেশাল সরার দই", quantity: "১ কেজি" },
      { productId: "PROD-002", name: "খাঁটি দানাদার গাওয়া ঘি", quantity: "৫০০ গ্রাম" },
      { name: "সুন্দরবনের প্রাকৃতিক মধু", quantity: "২৫০ গ্রাম" },
    ],
  },
  {
    id: "PKG-102",
    title: "আনন্দ মিষ্টিমুখ কম্বো বক্স",
    subtitle: "পারিবারিক মেহমান ও উৎসবের শুভক্ষণে অতিথি আপ্যায়নে আদর্শ",
    occasion: "ঈদ উৎসব",
    packagingType: "প্রিমিয়াম ফেস্টিভ্যাল গোল্ড কার্টন",
    price: 1450,
    originalPrice: 1680,
    discountPercent: 14,
    badge: "উৎসব স্পেশাল",
    image: "/Product/laccha_semai.jpg",
    isFeatured: true,
    status: "Active",
    availableStock: 60,
    customGreetingAllowed: true,
    createdAt: "২০২৬-০১-১৮",
    features: [
      "১ কেজি ঐতিহ্যবাহী মাটির হাঁড়ির মিষ্টি দই",
      "১ কেজি নরম স্পঞ্জ রসগোল্লা",
      "৫০০ গ্রাম ঘিয়ে ভাজা প্রিমিয়াম লাচ্ছা সেমাই",
      "উৎসবমুখর ফেস্টিভ্যাল গিফট বক্স প্যাকেজিং",
    ],
    components: [
      { name: "মাটির হাঁড়ির মিষ্টি দই", quantity: "১ কেজি" },
      { name: "নরম স্পঞ্জ রসগোল্লা", quantity: "১ কেজি" },
      { name: "ঘিয়ে ভাজা লাচ্ছা সেমাই", quantity: "৫০০ গ্রাম" },
    ],
  },
  {
    id: "PKG-103",
    title: "কর্পোরেট রয়্যাল গিফট হ্যাম্পার",
    subtitle: "সম্মানিত ব্যবসায়ী ক্লায়েন্ট ও কর্মকর্তাদের বিশেষ শুভেচ্ছা উপহার",
    occasion: "কর্পোরেট উপহার",
    packagingType: "কাস্টম ব্র্যান্ডেড কাঠের লাক্সারি গিফট চেস্ট",
    price: 2450,
    originalPrice: 2800,
    discountPercent: 12,
    badge: "কর্পোরেট চয়েস",
    image: "/Product/mini_doi.png",
    isFeatured: true,
    status: "Active",
    availableStock: 25,
    customGreetingAllowed: true,
    createdAt: "২০২৬-০১-২০",
    features: [
      "৪টি ঐতিহ্যবাহী মাটির কাপ দই সেট",
      "১ কেজি মতিচুর স্পেশাল রাজকীয় লাড্ডু",
      "৫০০ গ্রাম প্রিমিয়াম দানাদার ঘি",
      "কাস্টম ব্র্যান্ডেড কাঠের লাক্সারি বক্স ও সিল্ক ফিতা",
    ],
    components: [
      { name: "মাটির কাপ দই সেট", quantity: "৪ পিস" },
      { name: "মতিচুর লাড্ডু", quantity: "১ কেজি" },
      { name: "খাঁটি দানাদার ঘি", quantity: "৫০০ গ্রাম" },
    ],
  },
  {
    id: "PKG-104",
    title: "বৈশাখী মিষ্টান্ন মেলা সম্ভার",
    subtitle: "পহেলা বৈশাখের প্রথম প্রহরে আত্মীয়স্বজনদের মিষ্টান্ন উপহার",
    occasion: "পহেলা বৈশাখ",
    packagingType: "ঐতিহ্যবাহী নকশিকাঁথা মোটিফ হ্যান্ডমেড বক্স",
    price: 1950,
    originalPrice: 2300,
    discountPercent: 15,
    badge: "বৈশাখ অফার",
    image: "/Product/doi.jpg",
    isFeatured: false,
    status: "Active",
    availableStock: 30,
    customGreetingAllowed: true,
    createdAt: "২০২৬-০১-২২",
    features: [
      "১.৫ কেজি বগুড়ার আসল লাল সরার দই",
      "১ কেজি ঐতিহ্যবাহী চমচম",
      "মাটির প্লেট ও চামচ সেট সম্পূর্ণ ফ্রি",
    ],
    components: [
      { name: "বগুড়ার লাল সরার দই", quantity: "১.৫ কেজি" },
      { name: "ঐতিহ্যবাহী চমচম", quantity: "১ কেজি" },
    ],
  },
];

const STORAGE_KEY = "doibilash_gift_packages_v1";

export function getStoredPackages(): StoredPackage[] {
  if (typeof window === "undefined") {
    return DEFAULT_PACKAGES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PACKAGES));
      return DEFAULT_PACKAGES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PACKAGES;
  } catch {
    return DEFAULT_PACKAGES;
  }
}

export function savePackage(pkg: StoredPackage): StoredPackage[] {
  const packages = getStoredPackages();
  const index = packages.findIndex((p) => p.id === pkg.id);

  let updated: StoredPackage[];
  if (index >= 0) {
    updated = [...packages];
    updated[index] = { ...pkg };
  } else {
    updated = [pkg, ...packages];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save package to localStorage", err);
    }
  }
  return updated;
}

export function deletePackage(id: string): StoredPackage[] {
  const packages = getStoredPackages();
  const updated = packages.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete package from localStorage", err);
    }
  }
  return updated;
}

export function getPackageById(id: string): StoredPackage | undefined {
  const packages = getStoredPackages();
  return packages.find((p) => p.id === id);
}
