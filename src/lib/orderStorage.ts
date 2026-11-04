export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentMethod = "Cash on Delivery" | "bKash" | "Nagad" | "Bank Transfer";
export type PaymentStatus = "Paid" | "Unpaid" | "Partial";

export interface OrderItem {
  id?: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
}

export interface StoredOrder {
  id: string;
  invoiceNo: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  deliveryArea: "ঢাকা সিটি" | "ঢাকার বাইরে";
  deliveryTimeSlot?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  /** bKash/Nagad transaction id submitted by the customer */
  transactionId?: string;
  /** Screenshot of the mobile-banking payment */
  paymentProofUrl?: string;
  status: OrderStatus;
}

export function paymentStatusLabel(order: {
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
}): string {
  if (order.paymentStatus === "Paid") return "পেমেন্ট হয়ে গেছে";
  if (order.paymentStatus === "Partial") return "আংশিক পরিশোধ";
  if (order.paymentMethod === "Cash on Delivery") return "ক্যাশ অন ডেলিভারি";
  return "বাকি";
}

export const STATUS_META: Record<
  OrderStatus,
  { labelBn: string; color: string; bg: string; border: string }
> = {
  Pending: {
    labelBn: "অপেক্ষমান",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Processing: {
    labelBn: "প্রস্তুত হচ্ছে",
    color: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Shipped: {
    labelBn: "ডেলিভারিতে আছে",
    color: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  Delivered: {
    labelBn: "সম্পন্ন",
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  Cancelled: {
    labelBn: "বাতিল",
    color: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

/** Demo orders removed — live data comes from Supabase via /api/admin/orders */
export const DEFAULT_ORDERS: StoredOrder[] = [];
