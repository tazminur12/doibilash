import { CATEGORY_LIST, type CategoryInfo, type CategoryProduct } from "@/data/categories";

export interface ProductDetail {
  slug: string;
  title: string;
  englishTitle: string;
  price: number;
  originalPrice: number;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  unit: string;
  description: string;
  features: string[];
  images: string[];
  categorySlug?: string;
}

const PRODUCTS_DATABASE: Record<string, ProductDetail> = {
  "bogra-special-doi": {
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার দই",
    englishTitle: "Bogra Special Shora Doi",
    price: 500,
    originalPrice: 600,
    rating: 5,
    reviewsCount: 120,
    inStock: true,
    unit: "১ কেজি মাটির সরা",
    description:
      "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের সরার দই। খাঁটি গাভীর ঘন দুধের সাথে সঠিক মাত্রায় জ্বাল দিয়ে বিশেষ মাটির সরায় প্রাকৃতিক উপায়ে প্রস্তুত করা হয়। এতে কোনো প্রকার ক্ষতিকর কৃত্রিম রঙ, ফ্লেভার বা প্রিজারভেটিভ ব্যবহার করা হয় না।",
    features: [
      "১০০% খাঁটি দেশি গাভীর ঘন দুধ থেকে তৈরি",
      "মাটির সরায় দীর্ঘক্ষণ প্রাকৃতিক প্রক্রিয়ায় জমানো",
      "কোনো কৃত্রিম চিনি বা ক্ষতিকর রাসায়নিক মুক্ত",
      "টাটকা ও স্বাস্থ্যকর প্যাকেজিংয়ে ডেলিভারি",
    ],
    images: [
      "/Product/doi.jpg",
      "/Product/mini_doi.png",
    ],
    categorySlug: "premium-doi",
  },
  "pure-ghee": {
    slug: "pure-ghee",
    title: "খাঁটি গাওয়া ঘি (দানাদার)",
    englishTitle: "Premium Cow Ghee",
    price: 1450,
    originalPrice: 1600,
    rating: 5,
    reviewsCount: 95,
    inStock: true,
    unit: "৯০০ গ্রাম জার",
    description:
      "সম্পূর্ণ প্রাকৃতিক উপায়ে তৈরি সুগন্ধি ও দানাদার খাঁটি গাওয়া ঘি। দেশি গাভীর ননী থেকে বিলোনী পদ্ধতিতে প্রস্তুত যা আপনার খাবারের স্বাদ বাড়াবে শতগুণ।",
    features: [
      "১০০% খাঁটি মাখন থেকে তৈরি",
      "আকর্ষণীয় ঘ্রাণ ও গোল্ডেন দানাদার টেক্সচার",
      "ভিটামিন এ, ডি ও ই সমৃদ্ধ",
    ],
    images: [
      "/Product/placeholder.svg",
    ],
  },
  "sundarban-honey": {
    slug: "sundarban-honey",
    title: "সুন্দরবনের প্রাকৃতিক মধু",
    englishTitle: "Sundarbans Raw Honey",
    price: 850,
    originalPrice: 980,
    rating: 5,
    reviewsCount: 140,
    inStock: true,
    unit: "৫০০ গ্রাম কাঁচের বোতল",
    description:
      "সুন্দরবনের গভীর অরণ্য থেকে মৌয়ালদের দ্বারা সংগৃহীত সম্পূর্ণ অপরিশোধিত প্রাকৃতিক মধু। খলিসা ও গরান ফুলের খাঁটি নির্যাস।",
    features: [
      "১০০% খাঁটি ও অপরিশোধিত কাঁচা মধু",
      "অ্যান্টিঅক্সিডেন্ট ও পুষ্টিগুণে ভরপুর",
      "রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে সহায়ক",
    ],
    images: [
      "/Product/placeholder.svg",
    ],
  },
  "special-ghee-roasted-laccha-semai": {
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    englishTitle: "Special Ghee Roasted Laccha Semai",
    price: 480,
    originalPrice: 560,
    rating: 5,
    reviewsCount: 88,
    inStock: true,
    unit: "৫০০ গ্রাম বক্স",
    description:
      "খাঁটি গাওয়া ঘিয়ে বাদামি করে ভাজা মুচমুচে প্রিমিয়াম লাচ্ছা সেমাই। কোনো কৃত্রিম উপাদান ছাড়াই নিখুঁত কারিগরি দক্ষতায় প্রস্তুত।",
    features: [
      "১০০% খাঁটি গাওয়া ঘি দিয়ে ভাজা",
      "ঝরঝরে ও অত্যন্ত সুস্বাদু",
      "পরিচ্ছন্ন ও এয়ারটাইট স্বাস্থ্যসম্মত প্যাকেজিং",
    ],
    images: ["/Product/laccha_semai.jpg"],
    categorySlug: "laccha-semai",
  },
  "mini-doi-cup": {
    slug: "mini-doi-cup",
    title: "ঘি ভাজা সর মাটির কাপ দই (৪ পিস)",
    englishTitle: "Mini Doi Cup Set (4 pcs)",
    price: 450,
    originalPrice: 520,
    rating: 5,
    reviewsCount: 64,
    inStock: true,
    unit: "৪টি কাপ বক্স",
    description:
      "ব্যক্তিগত পরিবেশনের জন্য অত্যন্ত আকর্ষণীয় ছোট মাটির কাপের সুস্বাদু সরার দই। যেকোনো অনুষ্ঠানে অতিথি আপ্যায়নে দারুণ মানানসই।",
    features: [
      "ঐতিহ্যবাহী ছোট মাটির পাত্রে জমানো",
      "পুরু সর ও লোভনীয় ক্যারামেল স্বাদ",
      "আলাদা ৪টি সার্ভিং কাপ",
    ],
    images: ["/Product/mini_doi.png", "/Product/doi.jpg"],
    categorySlug: "premium-doi",
  },
  "mango-special-doi": {
    slug: "mango-special-doi",
    title: "আমের স্পেশাল পাকা আম দই",
    englishTitle: "Mango Special Doi",
    price: 550,
    originalPrice: 650,
    rating: 5,
    reviewsCount: 72,
    inStock: true,
    unit: "১ কেজি মাটির সরা",
    description:
      "তাজা পাকা আমের খাঁটি পাল্প ও গাভীর ঘন দুধের অসাধারণ যুগলবন্দীতে তৈরি অনন্য স্বাদের পাকা আম দই।",
    features: [
      "প্রাকৃতিক পাকা আমের পাল্প সমৃদ্ধ",
      "কোনো কৃত্রিম ফ্লেভার বা কালার নেই",
      "বিশেষ মাটির সরায় জমানো",
    ],
    images: ["/Product/mango.jpg", "/Product/doi.jpg"],
    categorySlug: "premium-doi",
  },
  "sponge-rosogolla": {
    slug: "sponge-rosogolla",
    title: "ঐতিহ্যবাহী স্পঞ্জ রসগোল্লা",
    englishTitle: "Traditional Sponge Rosogolla",
    price: 420,
    originalPrice: 480,
    inStock: true,
    unit: "১ কেজি বক্স",
    description:
      "খাঁটি গাভীর দুধের ছানা দিয়ে তৈরি নরম ও রসালো স্পঞ্জ রসগোল্লা। হালকা মিষ্টি সিরায় ভেজানো ঐতিহ্যবাহী স্বাদ।",
    features: ["খাঁটি দুধের ছানা থেকে তৈরি", "নরম ও স্পঞ্জি টেক্সচার", "স্বাস্থ্যসম্মত প্যাকেজিং"],
    images: [
      "/Product/placeholder.svg",
    ],
  },
  "ajwa-dates": {
    slug: "ajwa-dates",
    title: "প্রিমিয়াম খোরমা খেজুর",
    englishTitle: "Premium Dates",
    price: 750,
    originalPrice: 900,
    inStock: true,
    unit: "১ কেজি প্যাকেট",
    description: "বাছাইকৃত প্রিমিয়াম মানের নরম ও মিষ্টি খোরমা খেজুর। প্রাকৃতিক শক্তি ও পুষ্টির চমৎকার উৎস।",
    features: ["বাছাইকৃত প্রিমিয়াম খেজুর", "প্রাকৃতিক মিষ্টতা", "এয়ারটাইট প্যাকেজিং"],
    images: [
      "/Product/placeholder.svg",
    ],
  },
};

const parseAmount = (val: string | number | undefined) =>
  typeof val === "number" ? val : parseInt(String(val ?? "").replace(/[^0-9]/g, ""), 10) || 0;

const findInCategories = (slug: string): { product: CategoryProduct; category: CategoryInfo } | null => {
  for (const category of CATEGORY_LIST) {
    const product = category.products.find((p) => p.slug === slug);
    if (product) return { product, category };
  }
  return null;
};

export function getProductDetail(slug: string): ProductDetail | null {
  if (PRODUCTS_DATABASE[slug]) return PRODUCTS_DATABASE[slug];

  const match = findInCategories(slug);
  if (!match) return null;
  const { product, category } = match;

  return {
    slug,
    title: product.title,
    englishTitle: category.englishName,
    price: product.numericPrice,
    originalPrice: parseAmount(product.originalPrice) || product.numericPrice,
    inStock: true,
    unit: product.unit ?? "",
    description: category.subtitle,
    features: [...category.highlights, "যত্নসহকারে স্বাস্থ্যসম্মত প্যাকেজিং"],
    images: [product.image, category.image].filter((img, i, arr) => arr.indexOf(img) === i),
    categorySlug: category.slug,
  };
}

export function getAllProductSlugs(): string[] {
  const slugs = new Set(Object.keys(PRODUCTS_DATABASE));
  CATEGORY_LIST.forEach((c) => c.products.forEach((p) => p.slug && slugs.add(p.slug)));
  return [...slugs];
}

/** Products from the same category (or the doi category) to show as recommendations. */
export function getRelatedProducts(product: ProductDetail, limit = 4): CategoryProduct[] {
  const category =
    CATEGORY_LIST.find((c) => c.slug === product.categorySlug) ??
    CATEGORY_LIST.find((c) => c.products.some((p) => p.slug === product.slug)) ??
    CATEGORY_LIST[0];
  return category.products.filter((p) => p.slug !== product.slug).slice(0, limit);
}
