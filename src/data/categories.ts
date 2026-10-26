import type { ProductItem } from "@/components/ui/ProductCard";

export interface CategoryProduct extends ProductItem {
  numericPrice: number;
  tag?: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  englishName: string;
  subtitle: string;
  image: string;
  highlights: string[];
  tags: string[];
  products: CategoryProduct[];
}

export const ALL_TAG = "সকল";

export const CATEGORY_MAP: Record<string, CategoryInfo> = {
  "premium-doi": {
    slug: "premium-doi",
    name: "প্রিমিয়াম দই",
    englishName: "Premium Doi",
    subtitle: "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের মাটির সরার সেরা দই",
    image: "/Product/doi.jpg",
    highlights: ["মাটির সরায় তৈরি", "খাঁটি গরুর দুধ", "প্রিজারভেটিভমুক্ত"],
    tags: [ALL_TAG, "মিষ্টি দই", "টক দই", "ক্ষীরসা দই", "চিনিমুক্ত"],
    products: [
      {
        id: "doi-1",
        slug: "bogra-special-doi",
        title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
        price: "৳ 500",
        numericPrice: 500,
        originalPrice: "৳ 600",
        unit: "১ কেজি মাটির সরা",
        badge: "Hot Sale",
        image: "/Product/doi.jpg",
        tag: "মিষ্টি দই",
      },
      {
        id: "doi-2",
        slug: "shahjadpur-tok-doi",
        title: "শাহজাদপুরের খাঁটি টক দই",
        price: "৳ 380",
        numericPrice: 380,
        originalPrice: "৳ 450",
        unit: "১ কেজি জার",
        badge: "Pure Dairy",
        image:
          "/Product/doi.jpg",
        tag: "টক দই",
      },
      {
        id: "doi-3",
        slug: "nawabi-zafrani-kheer-doi",
        title: "নবাবী জাফরানি ক্ষীর দই",
        price: "৳ 650",
        numericPrice: 650,
        originalPrice: "৳ 750",
        unit: "১ কেজি সরা",
        badge: "Special",
        image:
          "/Product/doi.jpg",
        tag: "ক্ষীরসা দই",
      },
      {
        id: "doi-4",
        slug: "traditional-patkheer-doi",
        title: "ঐতিহ্যবাহী পাতক্ষীর দই",
        price: "৳ 580",
        numericPrice: 580,
        originalPrice: "৳ 680",
        unit: "৮০০ গ্রাম",
        badge: "Popular",
        image:
          "/Product/doi.jpg",
        tag: "মিষ্টি দই",
      },
      {
        id: "doi-5",
        slug: "clay-pot-kheersha-doi",
        title: "মাটির হাঁড়ির খাঁটি ক্ষীরসা দই",
        price: "৳ 720",
        numericPrice: 720,
        originalPrice: "৳ 820",
        unit: "১.২ কেজি হাঁড়ি",
        badge: "Premium",
        image:
          "/Product/doi.jpg",
        tag: "ক্ষীরসা দই",
      },
      {
        id: "doi-6",
        slug: "diabetic-friendly-doi",
        title: "চিনিমুক্ত স্বাস্থ্যকর ডায়াবেটিক দই",
        price: "৳ 420",
        numericPrice: 420,
        originalPrice: "৳ 480",
        unit: "১ কেজি জার",
        badge: "Healthy",
        image:
          "/Product/doi.jpg",
        tag: "চিনিমুক্ত",
      },
      {
        id: "doi-7",
        slug: "ghee-mini-cup-doi",
        title: "ঘি ভাজা সর মাটির কাপ দই (৪ পিস)",
        price: "৳ 450",
        numericPrice: 450,
        originalPrice: "৳ 520",
        unit: "৪টি কাপ বক্স",
        badge: "New",
        image: "/Product/mini_doi.png",
        tag: "মিষ্টি দই",
      },
      {
        id: "doi-8",
        slug: "mahasthangarh-shahi-red-doi",
        title: "মহাস্থানগড়ের শাহী লাল দই",
        price: "৳ 540",
        numericPrice: 540,
        originalPrice: "৳ 620",
        unit: "১ কেজি সরা",
        badge: "Heritage",
        image:
          "/Product/doi.jpg",
        tag: "মিষ্টি দই",
      },
    ],
  },
  laddu: {
    slug: "laddu",
    name: "লাড্ডু",
    englishName: "Laddu",
    subtitle: "খাঁটি গাওয়া ঘি ও উন্নতমানের উপাদানে প্রস্তুত মুখরোচক লাড্ডুর সমাহার",
    image:
      "/Product/placeholder.svg",
    highlights: ["খাঁটি গাওয়া ঘি", "হাতে তৈরি", "গিফট বক্স"],
    tags: [ALL_TAG, "গাওয়া ঘি", "মতিচুর", "ড্রাই ফ্রুটস", "ঐতিহ্যবাহী"],
    products: [
      {
        id: "laddu-1",
        slug: "shahi-ghee-motichoor-laddu",
        title: "শাহী গাওয়া ঘি মতিচুর লাড্ডু",
        price: "৳ 680",
        numericPrice: 680,
        originalPrice: "৳ 780",
        unit: "১ কেজি প্রিমিয়াম বক্স",
        badge: "Best Seller",
        image:
          "/Product/placeholder.svg",
        tag: "মতিচুর",
      },
      {
        id: "laddu-2",
        slug: "pure-besan-nut-laddu",
        title: "খাঁটি বেসন বাদাম লাড্ডু",
        price: "৳ 550",
        numericPrice: 550,
        originalPrice: "৳ 650",
        unit: "৮০০ গ্রাম বক্স",
        badge: "Popular",
        image:
          "/Product/placeholder.svg",
        tag: "গাওয়া ঘি",
      },
      {
        id: "laddu-3",
        slug: "almond-cashew-dry-fruit-laddu",
        title: "আমন্ড ও কাজু ড্রাই ফ্রুট লাড্ডু",
        price: "৳ 950",
        numericPrice: 950,
        originalPrice: "৳ 1,100",
        unit: "১ কেজি গিফট বক্স",
        badge: "Premium",
        image:
          "/Product/placeholder.svg",
        tag: "ড্রাই ফ্রুটস",
      },
      {
        id: "laddu-4",
        slug: "traditional-coconut-laddu",
        title: "ঐতিহ্যবাহী খাঁটি নারকেল লাড্ডু",
        price: "৳ 450",
        numericPrice: 450,
        originalPrice: "৳ 520",
        unit: "১ কেজি প্যাক",
        badge: "Traditional",
        image:
          "/Product/placeholder.svg",
        tag: "ঐতিহ্যবাহী",
      },
      {
        id: "laddu-5",
        slug: "zafrani-boondia-laddu",
        title: "জাফরানি বুন্দিয়া লাড্ডু",
        price: "৳ 520",
        numericPrice: 520,
        originalPrice: "৳ 600",
        unit: "১ কেজি বক্স",
        badge: "Hot Sale",
        image:
          "/Product/placeholder.svg",
        tag: "মতিচুর",
      },
      {
        id: "laddu-6",
        slug: "sugarfree-date-oats-laddu",
        title: "সুগার ফ্রি খেজুর ও ওটস লাড্ডু",
        price: "৳ 780",
        numericPrice: 780,
        originalPrice: "৳ 880",
        unit: "৫০০ গ্রাম বক্স",
        badge: "Healthy",
        image:
          "/Product/placeholder.svg",
        tag: "ড্রাই ফ্রুটস",
      },
      {
        id: "laddu-7",
        slug: "special-mawa-pista-laddu",
        title: "স্পেশাল মাওয়া পেস্তা লাড্ডু",
        price: "৳ 750",
        numericPrice: 750,
        originalPrice: "৳ 850",
        unit: "৮০০ গ্রাম বক্স",
        badge: "Special",
        image:
          "/Product/placeholder.svg",
        tag: "গাওয়া ঘি",
      },
      {
        id: "laddu-8",
        slug: "til-gur-sesame-laddu",
        title: "তিল ও গুড়ের স্বাস্থ্যকর লাড্ডু",
        price: "৳ 420",
        numericPrice: 420,
        originalPrice: "৳ 490",
        unit: "১ কেজি প্যাক",
        badge: "Winter Special",
        image:
          "/Product/placeholder.svg",
        tag: "ঐতিহ্যবাহী",
      },
    ],
  },
  "laccha-semai": {
    slug: "laccha-semai",
    name: "লাচ্ছা সেমাই",
    englishName: "Laccha Semai",
    subtitle: "উৎসব ও ঘরোয়া আয়োজনের সেরা পছন্দ, খাঁটি ঘিয়ে ভাজা মুচমুচে লাচ্ছা সেমাই",
    image: "/Product/laccha_semai.jpg",
    highlights: ["ঘিয়ে ভাজা", "মুচমুচে স্বাদ", "উৎসব স্পেশাল"],
    tags: [ALL_TAG, "গাওয়া ঘি ভাজা", "জাফরানি", "ড্রাই ফ্রুটস", "ফ্যামিলি প্যাক"],
    products: [
      {
        id: "semai-1",
        slug: "special-ghee-roasted-laccha-semai",
        title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
        price: "৳ 480",
        numericPrice: 480,
        originalPrice: "৳ 560",
        unit: "৫০০ গ্রাম বক্স",
        badge: "Hot Sale",
        image: "/Product/laccha_semai.jpg",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-2",
        slug: "shahi-zafrani-laccha-semai",
        title: "শাহী জাফরানি ড্রাই ফ্রুট লাচ্ছা সেমাই",
        price: "৳ 650",
        numericPrice: 650,
        originalPrice: "৳ 750",
        unit: "৫০০ গ্রাম গিফট টিন",
        badge: "Premium",
        image:
          "/Product/laccha_semai.jpg",
        tag: "জাফরানি",
      },
      {
        id: "semai-3",
        slug: "handcrafted-special-semai",
        title: "ঐতিহ্যবাহী হাতে তৈরি স্পেশাল সেমাই",
        price: "৳ 350",
        numericPrice: 350,
        originalPrice: "৳ 420",
        unit: "৪০০ গ্রাম প্যাক",
        badge: "Traditional",
        image:
          "/Product/laccha_semai.jpg",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-4",
        slug: "ghee-nut-raisin-mix-laccha",
        title: "ঘি ভাজা বাদাম-কিশমিশ মিক্স লাচ্ছা",
        price: "৳ 580",
        numericPrice: 580,
        originalPrice: "৳ 680",
        unit: "৫০০ গ্রাম বক্স",
        badge: "Popular",
        image:
          "/Product/laccha_semai.jpg",
        tag: "ড্রাই ফ্রুটস",
      },
      {
        id: "semai-5",
        slug: "royal-premium-butter-laccha",
        title: "রয়েল প্রিমিয়াম বাটার লাচ্ছা সেমাই",
        price: "৳ 520",
        numericPrice: 520,
        originalPrice: "৳ 600",
        unit: "৫০০ গ্রাম বক্স",
        badge: "New",
        image:
          "/Product/laccha_semai.jpg",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-6",
        slug: "whole-wheat-nutritional-semai",
        title: "লাল গমের পুষ্টিকর স্পেশাল সেমাই",
        price: "৳ 380",
        numericPrice: 380,
        originalPrice: "৳ 450",
        unit: "৪৫০ গ্রাম প্যাক",
        badge: "Healthy",
        image:
          "/Product/laccha_semai.jpg",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-7",
        slug: "eid-special-family-pack-laccha",
        title: "ঈদ স্পেশাল ফ্যামিলি প্যাক লাচ্ছা সেমাই",
        price: "৳ 890",
        numericPrice: 890,
        originalPrice: "৳ 1,050",
        unit: "১ কেজি মেগা বক্স",
        badge: "Value Pack",
        image:
          "/Product/laccha_semai.jpg",
        tag: "ফ্যামিলি প্যাক",
      },
      {
        id: "semai-8",
        slug: "milk-ghee-shahi-laccha-semai",
        title: "দুধ-ঘিয়ে প্রস্তুত শাহী লাচ্ছা সেমাই",
        price: "৳ 620",
        numericPrice: 620,
        originalPrice: "৳ 720",
        unit: "৬০০ গ্রাম স্পেশাল বক্স",
        badge: "Heritage",
        image:
          "/Product/laccha_semai.jpg",
        tag: "জাফরানি",
      },
    ],
  },
};

export const CATEGORY_LIST: CategoryInfo[] = Object.values(CATEGORY_MAP);

export const categoryPriceBounds = (category: CategoryInfo) => {
  const prices = category.products.map((p) => p.numericPrice);
  return {
    min: Math.floor(Math.min(...prices) / 50) * 50,
    max: Math.ceil(Math.max(...prices) / 50) * 50,
  };
};
