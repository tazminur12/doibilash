export interface StoreSettings {
  // General Store Info
  storeName: string;
  tagline: string;
  supportEmail: string;
  phone: string;
  hotline: string;
  whatsapp: string;
  address: string;
  factoryAddress: string;
  currencySymbol: string;
  currencyCode: string;
  logoUrl: string;
  metaTitle: string;
  metaDescription: string;

  // Payment Methods
  enableCod: boolean;
  codMaxLimit: number;
  codInstructions: string;
  enableBkash: boolean;
  bkashMerchantNumber: string;
  bkashAccountType: "Merchant" | "Personal";
  enableNagad: boolean;
  nagadMerchantNumber: string;
  nagadAccountType: "Merchant" | "Personal";
  enableRocket: boolean;
  rocketNumber: string;
  enableBankTransfer: boolean;
  bankAccountName: string;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  bankRoutingNumber: string;

  // Shipping & Delivery
  deliveryInsideDhaka: number;
  deliveryTimeInsideDhaka: string;
  deliveryOutsideDhaka: number;
  deliveryTimeOutsideDhaka: string;
  enableFreeShipping: boolean;
  freeShippingThreshold: number;
  enableExpressDelivery: boolean;
  expressDeliveryFee: number;
  expressDeliveryTime: string;
  fragilePackagingFee: number;
  fragilePackagingNote: string;

  // Marketing & Announcements
  enableAnnouncement: boolean;
  announcementText: string;
  announcementLink: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  whatsappLink: string;

  // Operations & Security
  orderAutoConfirmationSms: boolean;
  adminAlertEmail: string;
  lowStockThreshold: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  // General
  storeName: "দই বিলাস - Doi Bilash",
  tagline: "বগুড়ার খাঁটি স্বাদ ও আভিজাত্যের ঐতিহ্যবাহী রসগোল্লা ও সরার দই",
  supportEmail: "support@doibilash.com",
  phone: "+880 1712-345678",
  hotline: "16244",
  whatsapp: "01712345678",
  address: "বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা - ১২০৫",
  factoryAddress: "শেরপুর রোড, বগুড়া সদর, বগুড়া - ৫৮০০",
  currencySymbol: "৳",
  currencyCode: "BDT",
  logoUrl: "/images/logo.png",
  metaTitle: "দই বিলাস | বগুড়ার খাঁটি ঐতিহ্যবাহী সরার দই ও মিষ্টি",
  metaDescription:
    "বগুড়ার খাঁটি গাভীর দুধের সরার দই, মাটির কাপ দই, রসগোল্লা, চমচম ও খাঁটি গাওয়া ঘি সরাসরি আপনার দ্বারে।",

  // Payments
  enableCod: true,
  codMaxLimit: 10000,
  codInstructions:
    "পণ্য ডেলিভারিম্যানের কাছ থেকে নিখুঁতভাবে বুঝে নিয়ে মূল্য পরিশোধ করুন।",
  enableBkash: true,
  bkashMerchantNumber: "01712-345678",
  bkashAccountType: "Merchant",
  enableNagad: true,
  nagadMerchantNumber: "01812-345678",
  nagadAccountType: "Merchant",
  enableRocket: false,
  rocketNumber: "01912-345678-9",
  enableBankTransfer: true,
  bankAccountName: "দই বিলাস ফুডস অ্যান্ড ডেইরি",
  bankName: "ডাচ-বাংলা ব্যাংক পিএলসি",
  bankBranch: "ধানমন্ডি শাখা, ঢাকা",
  bankAccountNumber: "115.120.0098765",
  bankRoutingNumber: "090261234",

  // Shipping
  deliveryInsideDhaka: 60,
  deliveryTimeInsideDhaka: "২৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি",
  deliveryOutsideDhaka: 120,
  deliveryTimeOutsideDhaka: "৪৮–৭২ ঘণ্টার মধ্যে কোল্ড-চেইন ডেলিভারি",
  enableFreeShipping: true,
  freeShippingThreshold: 3000,
  enableExpressDelivery: true,
  expressDeliveryFee: 150,
  expressDeliveryTime: "৩–৬ ঘণ্টার মধ্যে আর্জেন্ট ডেলিভারি",
  fragilePackagingFee: 0,
  fragilePackagingNote:
    "ঐতিহ্যবাহী মাটির হাঁড়ি বিশেষ থার্মোকল ও বাবল-র‍্যাপ প্যাকেজিং ফ্রি",

  // Marketing
  enableAnnouncement: true,
  announcementText:
    "🎉 বৈশাখী আনন্দ উৎসব! ৩,০০০ টাকার অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি ও ফ্রি মাটির কাপ দই!",
  announcementLink: "/offers",
  facebookUrl: "https://facebook.com/doibilash",
  instagramUrl: "https://instagram.com/doibilash",
  youtubeUrl: "https://youtube.com/@doibilash",
  whatsappLink: "https://wa.me/8801712345678",

  // Operations
  orderAutoConfirmationSms: true,
  adminAlertEmail: "admin@doibilash.com",
  lowStockThreshold: 5,
  maintenanceMode: false,
  maintenanceMessage:
    "দই বিলাসের ওয়েবসাইট আপগ্রেড চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত। জরুরি অর্ডারে কল করুন: 01712-345678",
};

const SETTINGS_STORAGE_KEY = "doibilash_admin_settings_v2";

export function getStoreSettings(): StoreSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): StoreSettings {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(
        new CustomEvent("doibilash_settings_updated", { detail: settings })
      );
    } catch (err) {
      console.error("Failed to save store settings to localStorage", err);
    }
  }
  return settings;
}
