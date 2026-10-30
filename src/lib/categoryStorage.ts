export interface StoredCategory {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  subtitle: string;
  description: string;
  image: string;
  totalProducts: number;
  highlights: string[];
  tags: string[];
  productSlugs: string[];
  isFeatured?: boolean;
  status: "active" | "draft";
  createdAt: string;
}

export interface AvailableProduct {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  categorySlug: string;
  inStock: boolean;
  badge?: string;
}

export const ALL_AVAILABLE_PRODUCTS: AvailableProduct[] = [
  {
    id: "doi-1",
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
    englishTitle: "Bogra Special Shora Sweet Doi",
    price: 500,
    originalPrice: 600,
    unit: "১ কেজি মাটির সরা",
    image: "/Product/doi.jpg",
    categorySlug: "premium-doi",
    inStock: true,
    badge: "Hot Sale",
  },
  {
    id: "doi-2",
    slug: "shahjadpur-tok-doi",
    title: "শাহজাদপুরের খাঁটি টক দই",
    englishTitle: "Shahjadpur Pure Sour Curd",
    price: 380,
    originalPrice: 450,
    unit: "১ কেজি জার",
    image: "/Product/doi.jpg",
    categorySlug: "premium-doi",
    inStock: true,
    badge: "Pure Dairy",
  },
  {
    id: "doi-3",
    slug: "nawabi-zafrani-kheer-doi",
    title: "নবাবী জাফরানি ক্ষীর দই",
    englishTitle: "Nawabi Zafrani Kheer Doi",
    price: 650,
    originalPrice: 750,
    unit: "১ কেজি সরা",
    image: "/Product/doi.jpg",
    categorySlug: "premium-doi",
    inStock: true,
    badge: "Special",
  },
  {
    id: "doi-4",
    slug: "clay-pot-kheersha-doi",
    title: "মাটির হাঁড়ির খাঁটি ক্ষীরসা দই",
    englishTitle: "Clay Pot Pure Kheersha Doi",
    price: 720,
    originalPrice: 820,
    unit: "১.২ কেজি হাঁড়ি",
    image: "/Product/doi.jpg",
    categorySlug: "premium-doi",
    inStock: true,
    badge: "Premium",
  },
  {
    id: "doi-5",
    slug: "ghee-mini-cup-doi",
    title: "ঘি ভাজা সর মাটির কাপ দই (৪ পিস)",
    englishTitle: "Ghee Fried Mini Cup Doi (4 Pcs)",
    price: 450,
    originalPrice: 520,
    unit: "৪টি কাপ বক্স",
    image: "/Product/mini_doi.png",
    categorySlug: "premium-doi",
    inStock: true,
    badge: "New",
  },
  {
    id: "ghee-1",
    slug: "pure-ghee",
    title: "খাঁটি দানাদার গাওয়া ঘি",
    englishTitle: "Pure Danadar Cow Ghee",
    price: 950,
    originalPrice: 1100,
    unit: "৫০০ গ্রাম জার",
    image: "/Product/placeholder.svg",
    categorySlug: "pure-ghee",
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: "laddu-1",
    slug: "shahi-ghee-motichoor-laddu",
    title: "শাহী গাওয়া ঘি মতিচুর লাড্ডু",
    englishTitle: "Shahi Ghee Motichoor Laddu",
    price: 680,
    originalPrice: 780,
    unit: "১ কেজি প্রিমিয়াম বক্স",
    image: "/Product/placeholder.svg",
    categorySlug: "laddu",
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: "laddu-2",
    slug: "pure-besan-nut-laddu",
    title: "খাঁটি বেসন বাদাম লাড্ডু",
    englishTitle: "Pure Besan Nut Laddu",
    price: 550,
    originalPrice: 650,
    unit: "৮০০ গ্রাম বক্স",
    image: "/Product/placeholder.svg",
    categorySlug: "laddu",
    inStock: true,
    badge: "Popular",
  },
  {
    id: "laddu-3",
    slug: "almond-cashew-dry-fruit-laddu",
    title: "আমন্ড ও কাজু ড্রাই ফ্রুট লাড্ডু",
    englishTitle: "Almond & Cashew Dry Fruit Laddu",
    price: 950,
    originalPrice: 1100,
    unit: "১ কেজি গিফট বক্স",
    image: "/Product/placeholder.svg",
    categorySlug: "laddu",
    inStock: true,
    badge: "Premium",
  },
  {
    id: "semai-1",
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    englishTitle: "Special Ghee Roasted Laccha Semai",
    price: 480,
    originalPrice: 560,
    unit: "৫০০ গ্রাম বক্স",
    image: "/Product/laccha_semai.jpg",
    categorySlug: "laccha-semai",
    inStock: true,
    badge: "Hot Sale",
  },
  {
    id: "semai-2",
    slug: "shahi-zafrani-laccha-semai",
    title: "শাহী জাফরানি ড্রাই ফ্রুট লাচ্ছা সেমাই",
    englishTitle: "Shahi Zafrani Dry Fruit Laccha Semai",
    price: 650,
    originalPrice: 750,
    unit: "৫০০ গ্রাম গিফট টিন",
    image: "/Product/laccha_semai.jpg",
    categorySlug: "laccha-semai",
    inStock: true,
    badge: "Premium",
  },
  {
    id: "sweet-1",
    slug: "traditional-sponge-rosogolla",
    title: "ঐতিহ্যবাহী নরম স্পঞ্জ রসগোল্লা",
    englishTitle: "Traditional Sponge Rosogolla",
    price: 600,
    originalPrice: 700,
    unit: "১ কেজি বক্স",
    image: "/Product/placeholder.svg",
    categorySlug: "traditional-sweets",
    inStock: true,
    badge: "Fresh",
  },
  {
    id: "sweet-2",
    slug: "bogra-chamcham-sweet",
    title: "বগুড়ার স্পেশাল পোড়াবাড়ির চমচম",
    englishTitle: "Bogra Special Chomchom Sweet",
    price: 650,
    originalPrice: 750,
    unit: "১ কেজি বক্স",
    image: "/Product/placeholder.svg",
    categorySlug: "traditional-sweets",
    inStock: true,
    badge: "Popular",
  },
  {
    id: "honey-1",
    slug: "sundarban-raw-honey",
    title: "সুন্দরবনের খাঁটি প্রাকৃতিক মধু",
    englishTitle: "Sundarban Pure Raw Honey",
    price: 850,
    originalPrice: 980,
    unit: "৫০০ গ্রাম কাঁচের বোতল",
    image: "/Product/placeholder.svg",
    categorySlug: "pure-honey",
    inStock: true,
    badge: "Organic",
  },
];

export const DEFAULT_CATEGORIES: StoredCategory[] = [
  {
    id: "cat-1",
    slug: "premium-doi",
    name: "Premium Doi",
    nameBn: "প্রিমিয়াম দই",
    subtitle: "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের মাটির সরার সেরা দই",
    description: "বগুড়ার ঐতিহ্যবাহী সরা ও মাটির হাঁড়ির মিষ্টি এবং টক দই। খাঁটি গাভীর দুধ থেকে প্রাকৃতিক উপায়ে তৈরি।",
    image: "/Product/doi.jpg",
    totalProducts: 8,
    highlights: ["মাটির সরায় তৈরি", "খাঁটি গরুর দুধ", "প্রিজারভেটিভমুক্ত", "১০০% প্রাকৃতিক"],
    tags: ["মিষ্টি দই", "টক দই", "ক্ষীরসা দই", "চিনিমুক্ত"],
    productSlugs: ["bogra-special-doi", "shahjadpur-tok-doi", "nawabi-zafrani-kheer-doi", "clay-pot-kheersha-doi", "ghee-mini-cup-doi"],
    isFeatured: true,
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "cat-2",
    slug: "laddu",
    name: "Laddu",
    nameBn: "ঐতিহ্যবাহী লাড্ডু",
    subtitle: "খাঁটি গাওয়া ঘি ও উন্নতমানের উপাদানে প্রস্তুত মুখরোচক লাড্ডুর সমাহার",
    description: "খাঁটি ঘিয়ে ভাজা মতিচুর ও বেসনের স্পেশাল লাড্ডু। প্রতিটি কামড়ে পাবেন অতুলনীয় স্বাদ ও ঘ্রাণ।",
    image: "/Product/placeholder.svg",
    totalProducts: 8,
    highlights: ["খাঁটি গাওয়া ঘি", "হাতে তৈরি", "প্রিমিয়াম গিফট বক্স", "উৎকৃষ্ট বাদাম"],
    tags: ["গাওয়া ঘি", "মতিচুর", "ড্রাই ফ্রুটস", "ঐতিহ্যবাহী"],
    productSlugs: ["shahi-ghee-motichoor-laddu", "pure-besan-nut-laddu", "almond-cashew-dry-fruit-laddu"],
    isFeatured: true,
    status: "active",
    createdAt: "2026-01-20",
  },
  {
    id: "cat-3",
    slug: "pure-ghee",
    name: "Pure Ghee",
    nameBn: "খাঁটি গাওয়া ঘি",
    subtitle: "ঘরোয়া প্রক্রিয়ায় প্রস্তুতকৃত দানাদার সুগন্ধি গাওয়া ঘি",
    description: "দেশি গাভীর ননী থেকে বিলোনী পদ্ধতিতে প্রস্তুত যা আপনার খাবারের স্বাদ বাড়াবে শতগুণ।",
    image: "/Product/placeholder.svg",
    totalProducts: 5,
    highlights: ["১০০% খাঁটি মাখন", "দানাদার টেক্সচার", "প্রাকৃতিক সুবাস"],
    tags: ["দানাদার ঘি", "দেশি গাওয়া ঘি", "অর্গানিক"],
    productSlugs: ["pure-ghee"],
    isFeatured: false,
    status: "active",
    createdAt: "2026-02-01",
  },
  {
    id: "cat-4",
    slug: "laccha-semai",
    name: "Laccha Semai",
    nameBn: "প্রিমিয়াম লাচ্ছা সেমাই",
    subtitle: "উৎসব ও ঘরোয়া আয়োজনের সেরা পছন্দ, খাঁটি ঘিয়ে ভাজা মুচমুচে লাচ্ছা সেমাই",
    description: "ঘিয়ে ভাজা মচমচে প্রিমিয়াম কোয়ালিটির লাচ্ছা সেমাই। কোনো কৃত্রিম প্রিজারভেটিভ নেই।",
    image: "/Product/laccha_semai.jpg",
    totalProducts: 8,
    highlights: ["ঘিয়ে ভাজা", "মুচমুচে স্বাদ", "উৎসব স্পেশাল", "ফ্যামিলি প্যাক"],
    tags: ["গাওয়া ঘি ভাজা", "জাফরানি", "ড্রাই ফ্রুটস"],
    productSlugs: ["special-ghee-roasted-laccha-semai", "shahi-zafrani-laccha-semai"],
    isFeatured: true,
    status: "active",
    createdAt: "2026-02-10",
  },
  {
    id: "cat-5",
    slug: "traditional-sweets",
    name: "Traditional Sweets",
    nameBn: "ঐতিহ্যবাহী মিষ্টি",
    subtitle: "রসগোল্লা, চমচম, কালোজাম এবং খাঁটি ছানার সুস্বাদু মিষ্টির সম্ভার",
    description: "রসগোল্লা, চমচম, কালোজাম এবং ছানার মিষ্টির সম্ভার যা বিশেষ কারিগরদের দ্বারা নিপুণভাবে প্রস্তুত।",
    image: "/Product/placeholder.svg",
    totalProducts: 14,
    highlights: ["খাঁটি ছানা", "কম মিষ্টি", "দৈনিক ফ্রেশ তৈরি"],
    tags: ["রসগোল্লা", "চমচম", "কালোজাম", "ছানার সন্দেশ"],
    productSlugs: ["traditional-sponge-rosogolla", "bogra-chamcham-sweet"],
    isFeatured: false,
    status: "active",
    createdAt: "2026-02-18",
  },
];

const STORAGE_KEY = "doibilash_admin_categories_v2";

export function getStoredCategories(): StoredCategory[] {
  if (typeof window === "undefined") {
    return DEFAULT_CATEGORIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategory(category: StoredCategory): StoredCategory[] {
  const categories = getStoredCategories();
  const index = categories.findIndex((c) => c.id === category.id || c.slug === category.slug);

  let updated: StoredCategory[];
  if (index >= 0) {
    updated = [...categories];
    updated[index] = { ...category };
  } else {
    updated = [category, ...categories];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save category to localStorage", err);
    }
  }
  return updated;
}

export function deleteCategory(id: string): StoredCategory[] {
  const categories = getStoredCategories();
  const updated = categories.filter((c) => c.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete category from localStorage", err);
    }
  }
  return updated;
}

export function getCategoryByIdOrSlug(identifier: string): StoredCategory | undefined {
  const categories = getStoredCategories();
  return categories.find((c) => c.id === identifier || c.slug === identifier);
}
