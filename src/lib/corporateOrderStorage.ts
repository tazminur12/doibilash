export type CorporateEventType =
  | "কর্পোরেট গিফটিং"
  | "বার্ষিক সাধারণ সভা (AGM)"
  | "বিয়ে ও পারিবারিক অনুষ্ঠান"
  | "অফিস ইভেন্ট ও মিটিং"
  | "ঈদ ও উৎসব উপহার"
  | "পহেলা বৈশাখ উৎসব"
  | "অন্যান্য";

export type CorporateOrderStatus =
  | "New Lead"
  | "Quotation Sent"
  | "Confirmed"
  | "In Production"
  | "Delivered"
  | "Cancelled";

export interface CorporateOrderItem {
  productTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  packagingCustomization?: string;
}

export interface CorporateOrder {
  id: string;
  quotationNo: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  eventType: CorporateEventType;
  deliveryDate: string;
  deliveryAddress: string;
  approxQuantityText: string;
  items: CorporateOrderItem[];
  subtotal: number;
  vatOrTaxPercent: number;
  vatOrTaxAmount: number;
  customBrandingFee: number;
  totalBudget: number;
  advancePaid: number;
  dueAmount: number;
  paymentTerms: string;
  status: CorporateOrderStatus;
  assignedManager: string;
  customLogoBranding: boolean;
  notes?: string;
  createdAt: string;
}

export const CORP_STATUS_META: Record<
  CorporateOrderStatus,
  { labelBn: string; color: string; bg: string; border: string; step: number }
> = {
  "New Lead": {
    labelBn: "নতুন ইনকোয়ারি (Lead)",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    step: 1,
  },
  "Quotation Sent": {
    labelBn: "কোটেশন পাঠানো হয়েছে",
    color: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    step: 2,
  },
  Confirmed: {
    labelBn: "অর্ডার নিশ্চিত ও চুক্তি",
    color: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
    step: 3,
  },
  "In Production": {
    labelBn: "কারখানায় প্রস্তুত হচ্ছে",
    color: "text-orange-800",
    bg: "bg-orange-50",
    border: "border-orange-200",
    step: 4,
  },
  Delivered: {
    labelBn: "সফলভাবে ডেলিভারি সম্পন্ন",
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    step: 5,
  },
  Cancelled: {
    labelBn: "বাতিল",
    color: "text-stone-600",
    bg: "bg-stone-100",
    border: "border-stone-200",
    step: 0,
  },
};

export const DEFAULT_CORPORATE_ORDERS: CorporateOrder[] = [
  {
    id: "CORP-2026-001",
    quotationNo: "QT-DB-901",
    companyName: "গ্রামীণফোন লিমিটেড (GP House)",
    contactPerson: "রেজোয়ানুল হক",
    designation: "হেড অফ কালচার ও প্রকিউরমেন্ট",
    phone: "01711-500100",
    email: "rezwanul.haque@grameenphone.com",
    eventType: "ঈদ ও উৎসব উপহার",
    deliveryDate: "২০২৬-০৩-২৮",
    deliveryAddress: "জিপি হাউজ, বসুন্ধরা আবাসিক এলাকা, বারিধারা, ঢাকা",
    approxQuantityText: "৩৫০ লাক্সারি গিফট বক্স",
    items: [
      {
        productTitle: "বগুড়ার স্পেশাল সরার মিষ্টি দই (১ কেজি মাটির সরা)",
        quantity: 350,
        unitPrice: 500,
        totalPrice: 175000,
        packagingCustomization: "জিপি ব্র্যান্ডের কাস্টম গোল্ডেন ফিতা ও সিল্ক স্টিকার",
      },
      {
        productTitle: "খাঁটি দানাদার গাওয়া ঘি (৫০০ গ্রাম প্রিমিয়াম জার)",
        quantity: 350,
        unitPrice: 950,
        totalPrice: 332500,
      },
      {
        productTitle: "রয়েল উডেন গিফট বক্স উইথ মেটাল লক",
        quantity: 350,
        unitPrice: 200,
        totalPrice: 70000,
        packagingCustomization: "লেজার এনগ্রেভড জিপি লোগো",
      },
    ],
    subtotal: 577500,
    vatOrTaxPercent: 0,
    vatOrTaxAmount: 0,
    customBrandingFee: 15000,
    totalBudget: 592500,
    advancePaid: 300000,
    dueAmount: 292500,
    paymentTerms: "৫০% অ্যাডভান্স ব্যাংক বিএফটিএন + ডেলিভারির দিনে অবশিষ্ট চেক",
    status: "In Production",
    assignedManager: "তানভীর আহমেদ (অপারেশনস হেড)",
    customLogoBranding: true,
    notes: "বগুড়া কারখানায় মাটির সরায় বিশেষ সিল্ক সিল দেওয়া হচ্ছে। কোল্ড-চেইন কাভার্ড ভ্যানে ডেলিভারি দিতে হবে।",
    createdAt: "২০২৬-০১-২০",
  },
  {
    id: "CORP-2026-002",
    quotationNo: "QT-DB-902",
    companyName: "ব্র্যাক ব্যাংক পিএলসি (হেড অফিস)",
    contactPerson: "সাবরিনা চৌধুরী",
    designation: "সিনিয়র ম্যানেজার, কর্পোরেট অ্যাফেয়ার্স",
    phone: "01819-223344",
    email: "sabrina.c@bracbank.com",
    eventType: "বার্ষিক সাধারণ সভা (AGM)",
    deliveryDate: "২০২৬-০২-১৫",
    deliveryAddress: "অনন্যা কনভেনশন সেন্টার, গুলশান-২, ঢাকা",
    approxQuantityText: "৫০০ কাপ স্পেশাল দই সেট",
    items: [
      {
        productTitle: "ঐতিহ্যবাহী মাটির কাপ দই (ব্যক্তিগত পরিবেশন)",
        quantity: 500,
        unitPrice: 150,
        totalPrice: 75000,
        packagingCustomization: "ব্র্যাক ব্যাংক বিশেষ স্টিকার ও কাঠের চামচ",
      },
      {
        productTitle: "প্রিমিয়াম মতিচুর লাড্ডু গিফট বক্স (৪ পিস)",
        quantity: 500,
        unitPrice: 200,
        totalPrice: 100000,
      },
    ],
    subtotal: 175000,
    vatOrTaxPercent: 0,
    vatOrTaxAmount: 0,
    customBrandingFee: 5000,
    totalBudget: 180000,
    advancePaid: 180000,
    dueAmount: 0,
    paymentTerms: "১০০% প্রিপেইড ব্যাংক চালান",
    status: "Confirmed",
    assignedManager: "তাজমিনুর রহমান",
    customLogoBranding: true,
    notes: "সকাল ৯:০০ টার মধ্যে কনভেনশন হলে ডেলিভারি সম্পন্ন করতে হবে।",
    createdAt: "২০২৬-০১-২৫",
  },
  {
    id: "CORP-2026-003",
    quotationNo: "QT-DB-903",
    companyName: "ইউনিলিভার বাংলাদেশ লিমিটেড",
    contactPerson: "মাহমুদ হাসান",
    designation: "অ্যাডমিন অফিসার",
    phone: "01755-667788",
    email: "mahmud.hasan@unilever.com",
    eventType: "পহেলা বৈশাখ উৎসব",
    deliveryDate: "২০২৬-০৪-১৩",
    deliveryAddress: "ইউনিলিভার অফিস, কারওয়ান বাজার, ঢাকা",
    approxQuantityText: "২০০ সেট লাল দই ও মিষ্টি",
    items: [
      {
        productTitle: "বগুড়ার আসল লাল সরার দই (১.৫ কেজি)",
        quantity: 200,
        unitPrice: 750,
        totalPrice: 150000,
      },
      {
        productTitle: "ঐতিহ্যবাহী চমচম ও রসগোল্লা মিক্স বক্স (১ কেজি)",
        quantity: 200,
        unitPrice: 650,
        totalPrice: 130000,
      },
    ],
    subtotal: 280000,
    vatOrTaxPercent: 0,
    vatOrTaxAmount: 0,
    customBrandingFee: 0,
    totalBudget: 280000,
    advancePaid: 0,
    dueAmount: 280000,
    paymentTerms: "কোটেশন অনুমোদনের পর ৫০% অগ্রিম",
    status: "Quotation Sent",
    assignedManager: "তানভীর আহমেদ",
    customLogoBranding: false,
    notes: "আনুষ্ঠানিক কোটেশন ইমেইলে পাঠানো হয়েছে। কনফার্মেশনের অপেক্ষা করা হচ্ছে।",
    createdAt: "২০২৬-০১-২৮",
  },
];

const STORAGE_KEY = "doibilash_corporate_orders_v1";

export function getStoredCorporateOrders(): CorporateOrder[] {
  if (typeof window === "undefined") {
    return DEFAULT_CORPORATE_ORDERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CORPORATE_ORDERS));
      return DEFAULT_CORPORATE_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CORPORATE_ORDERS;
  } catch {
    return DEFAULT_CORPORATE_ORDERS;
  }
}

export function saveCorporateOrder(order: CorporateOrder): CorporateOrder[] {
  const orders = getStoredCorporateOrders();
  const index = orders.findIndex((o) => o.id === order.id);

  let updated: CorporateOrder[];
  if (index >= 0) {
    updated = [...orders];
    updated[index] = { ...order };
  } else {
    updated = [order, ...orders];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save corporate order to localStorage", err);
    }
  }
  return updated;
}

export function deleteCorporateOrder(id: string): CorporateOrder[] {
  const orders = getStoredCorporateOrders();
  const updated = orders.filter((o) => o.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete corporate order from localStorage", err);
    }
  }
  return updated;
}

export function getCorporateOrderById(id: string): CorporateOrder | undefined {
  const orders = getStoredCorporateOrders();
  return orders.find((o) => o.id === id || o.quotationNo === id);
}
