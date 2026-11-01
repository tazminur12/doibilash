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

/** Demo data removed — B2B orders live only in Supabase via API */
export const DEFAULT_CORPORATE_ORDERS: CorporateOrder[] = [];
