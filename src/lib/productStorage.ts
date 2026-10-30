export interface StoredProduct {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stockStatus: "In Stock" | "Out of Stock";
  image: string;
  galleryImages?: string[];
  description: string;
  features: string[];
  badge?: string;
  isFeatured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export const DEFAULT_PRODUCTS: StoredProduct[] = [
  {
    id: "PROD-001",
    slug: "bogra-special-doi",
    name: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
    nameEn: "Special Bogura Shorar Doi",
    category: "প্রিমিয়াম দই",
    price: 500,
    originalPrice: 600,
    stockStatus: "In Stock",
    image: "/Product/doi.jpg",
    unit: "১ কেজি মাটির সরা",
    description: "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের সরার দই। খাঁটি গাভীর ঘন দুধের সাথে সঠিক মাত্রায় জ্বাল দিয়ে বিশেষ মাটির সরায় প্রাকৃতিক উপায়ে প্রস্তুত করা হয়।",
    features: [
      "১০০% খাঁটি দেশি গাভীর ঘন দুধ থেকে তৈরি",
      "মাটির সরায় দীর্ঘক্ষণ প্রাকৃতিক প্রক্রিয়ায় জমানো",
      "কোনো কৃত্রিম চিনি বা ক্ষতিকর রাসায়নিক মুক্ত",
      "টাটকা ও স্বাস্থ্যকর মাটির পাত্রে ডেলিভারি",
    ],
    badge: "Hot Sale",
    isFeatured: true,
    rating: 5,
    reviewsCount: 120,
    createdAt: "2026-01-10",
  },
  {
    id: "PROD-002",
    slug: "pure-ghee",
    name: "খাঁটি দানাদার গাওয়া ঘি",
    nameEn: "Pure Danadar Cow Ghee",
    category: "খাঁটি গাওয়া ঘি",
    price: 950,
    originalPrice: 1100,
    stockStatus: "In Stock",
    image: "/Product/placeholder.svg",
    unit: "৫০০ গ্রাম জার",
    description: "সম্পূর্ণ প্রাকৃতিক উপায়ে তৈরি সুগন্ধি ও দানাদার খাঁটি গাওয়া ঘি। দেশি গাভীর ননী থেকে বিলোনী পদ্ধতিতে প্রস্তুত।",
    features: [
      "১০০% খাঁটি মাখন থেকে তৈরি",
      "আকর্ষণীয় ঘ্রাণ ও গোল্ডেন দানাদার টেক্সচার",
      "ভিটামিন এ, ডি ও ই সমৃদ্ধ",
    ],
    badge: "Best Seller",
    isFeatured: true,
    rating: 5,
    reviewsCount: 95,
    createdAt: "2026-01-12",
  },
  {
    id: "PROD-003",
    slug: "shahi-ghee-motichoor-laddu",
    name: "ঐতিহ্যবাহী ঘি-এ ভাজা মতিচুর লাড্ডু",
    nameEn: "Traditional Motichoor Laddu",
    category: "লাড্ডু",
    price: 550,
    originalPrice: 650,
    stockStatus: "In Stock",
    image: "/Product/placeholder.svg",
    unit: "১ কেজি প্রিমিয়াম বক্স",
    description: "খাঁটি ঘিয়ে ভাজা মতিচুর ও বেসনের স্পেশাল লাড্ডু। প্রতিটি কামড়ে পাবেন অতুলনীয় স্বাদ ও ঘ্রাণ।",
    features: [
      "খাঁটি গাওয়া ঘিয়ে ভাজা",
      "উন্নতমানের বেসন ও বাদাম দিয়ে তৈরি",
      "প্রিমিয়াম গিফট বক্সে প্যাকিং",
    ],
    badge: "Popular",
    isFeatured: false,
    rating: 5,
    reviewsCount: 84,
    createdAt: "2026-01-15",
  },
  {
    id: "PROD-004",
    slug: "clay-pot-sweet-curd",
    name: "মাটির হাঁড়ির মিষ্টি দই",
    nameEn: "Clay Pot Sweet Curd",
    category: "প্রিমিয়াম দই",
    price: 420,
    originalPrice: 480,
    stockStatus: "Out of Stock",
    image: "/Product/doi.jpg",
    unit: "৫০০ গ্রাম হাঁড়ি",
    description: "ছোট মাটির হাঁড়িতে জমাট বাঁধা ঘন মিষ্টি দই। উৎসব কিংবা ঘরোয়া মিষ্টিমুখের জন্য সেরা।",
    features: [
      "প্রাকৃতিক মাটির হাঁড়িতে জমানো",
      "গাভীর টাটকা ঘন দুধ",
      "মিডিয়াম মিষ্টির নিখুঁত ব্যালেন্স",
    ],
    badge: "Special",
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 65,
    createdAt: "2026-01-18",
  },
  {
    id: "PROD-005",
    slug: "traditional-sponge-rosogolla",
    name: "ঐতিহ্যবাহী নরম স্পঞ্জ রসগোল্লা",
    nameEn: "Traditional Sponge Rosogolla",
    category: "ঐতিহ্যবাহী মিষ্টি",
    price: 600,
    originalPrice: 700,
    stockStatus: "In Stock",
    image: "/Product/placeholder.svg",
    unit: "১ কেজি বক্স",
    description: "খাঁটি ছানার তৈরি মুখে দিলে মিলিয়ে যাওয়া নরম তুলতুলে মিষ্টি স্পঞ্জ রসগোল্লা।",
    features: [
      "১০০% খাঁটি গরুর দুধের তাজা ছানা",
      "রসালো নরম স্পঞ্জি টেক্সচার",
      "হালকা চিনির সিরাপে সংরক্ষিত",
    ],
    badge: "Fresh",
    isFeatured: true,
    rating: 5,
    reviewsCount: 110,
    createdAt: "2026-01-22",
  },
  {
    id: "PROD-006",
    slug: "special-ghee-roasted-laccha-semai",
    name: "স্পেশাল প্রিমিয়াম লাচ্ছা সেমাই",
    nameEn: "Special Premium Laccha Semai",
    category: "লাচ্ছা সেমাই",
    price: 450,
    originalPrice: 520,
    stockStatus: "In Stock",
    image: "/Product/laccha_semai.jpg",
    unit: "৫০০ গ্রাম প্যাকেট",
    description: "ঘিয়ে ভাজা মচমচে প্রিমিয়াম কোয়ালিটির লাচ্ছা সেমাই। কোনো ক্ষতিকর প্রিজারভেটিভ নেই।",
    features: [
      "খাঁটি ঘিয়ে ভাজা মুচমুচে লাচ্ছা",
      "জাফরানি সুবাস ও প্রাকৃতিক উপাদান",
      "ঈদ ও ঘরোয়া আড্ডার প্রিয় পদ",
    ],
    badge: "Hot Sale",
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 92,
    createdAt: "2026-01-25",
  },
  {
    id: "PROD-007",
    slug: "ghee-mini-cup-doi",
    name: "ঘি ভাজা সর মাটির কাপ দই (৪ পিস)",
    nameEn: "Ghee Fried Mini Cup Doi (4 Pcs)",
    category: "প্রিমিয়াম দই",
    price: 450,
    originalPrice: 520,
    stockStatus: "In Stock",
    image: "/Product/mini_doi.png",
    unit: "৪টি কাপ বক্স",
    description: "বিশেষ পোড়া মাটির কাপে পরিবেশনযোগ্য সুস্বাদু ছোট সরার মিষ্টি দই।",
    features: [
      "ব্যক্তিগত পরিবেশনের জন্য পারফেক্ট",
      "পুরু ঘি ভাজা সরের আস্তরণ",
      "মাটির খাঁটি প্রাকৃতিক ঘ্রাণ",
    ],
    badge: "New",
    isFeatured: true,
    rating: 5,
    reviewsCount: 45,
    createdAt: "2026-02-01",
  },
];

const STORAGE_KEY = "doibilash_admin_products_v2";

export function getStoredProducts(): StoredProduct[] {
  if (typeof window === "undefined") {
    return DEFAULT_PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProduct(product: StoredProduct): StoredProduct[] {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id || p.slug === product.slug);

  let updated: StoredProduct[];
  if (index >= 0) {
    updated = [...products];
    updated[index] = { ...product };
  } else {
    updated = [product, ...products];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save product to localStorage", err);
    }
  }
  return updated;
}

export function deleteProduct(id: string): StoredProduct[] {
  const products = getStoredProducts();
  const updated = products.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete product from localStorage", err);
    }
  }
  return updated;
}

export function getProductByIdOrSlug(identifier: string): StoredProduct | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.id === identifier || p.slug === identifier);
}
