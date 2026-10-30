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
  status: OrderStatus;
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

export const DEFAULT_ORDERS: StoredOrder[] = [
  {
    id: "DB-98421",
    invoiceNo: "INV-2026-98421",
    createdAt: "২০২৬-১০-২৮",
    customerName: "তানভীর আহমেদ",
    customerPhone: "01712-345678",
    customerEmail: "tanveer@gmail.com",
    shippingAddress: "বাড়ি ১২, রোড ৪, সেক্টর ৪, উত্তরা, ঢাকা",
    deliveryArea: "ঢাকা সিটি",
    deliveryTimeSlot: "সকাল ১০টা - দুপুর ২টা",
    notes: "সরায় যেন কোনো দাগ না থাকে, ফ্রেশ দই দিবেন।",
    items: [
      {
        id: "item-1",
        productId: "bogra-special-doi",
        title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
        price: 500,
        quantity: 2,
        unit: "১ কেজি মাটির সরা",
        image: "/Product/doi.jpg",
      },
      {
        id: "item-2",
        productId: "ghee-mini-cup-doi",
        title: "ঘি ভাজা সর মাটির কাপ দই (৪ পিস)",
        price: 450,
        quantity: 1,
        unit: "৪টি কাপ বক্স",
        image: "/Product/mini_doi.png",
      },
    ],
    subtotal: 1450,
    deliveryFee: 60,
    discount: 50,
    totalAmount: 1460,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    status: "Processing",
  },
  {
    id: "DB-98420",
    invoiceNo: "INV-2026-98420",
    createdAt: "২০২৬-১০-২৮",
    customerName: "শাহরিয়ার কবীর",
    customerPhone: "01823-456789",
    customerEmail: "shahriar.kabir@yahoo.com",
    shippingAddress: "ফ্ল্যাট ৫বি, রোড ২৭, ধানমন্ডি, ঢাকা",
    deliveryArea: "ঢাকা সিটি",
    deliveryTimeSlot: "বিকাল ৩টা - সন্ধ্যা ৭টা",
    items: [
      {
        id: "item-3",
        productId: "pure-ghee",
        title: "খাঁটি দানাদার গাওয়া ঘি",
        price: 950,
        quantity: 1,
        unit: "৫০০ গ্রাম জার",
        image: "/Product/placeholder.svg",
      },
    ],
    subtotal: 950,
    deliveryFee: 60,
    discount: 0,
    totalAmount: 1010,
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    status: "Pending",
  },
  {
    id: "DB-98419",
    invoiceNo: "INV-2026-98419",
    createdAt: "২০২৬-১০-২৭",
    customerName: "ফারহানা ইয়াসমিন",
    customerPhone: "01934-567890",
    customerEmail: "farhana.y@outlook.com",
    shippingAddress: "হাউজ ৮, রোড ৭১, গুলশান-২, ঢাকা",
    deliveryArea: "ঢাকা সিটি",
    items: [
      {
        id: "item-4",
        productId: "traditional-sponge-rosogolla",
        title: "ঐতিহ্যবাহী নরম স্পঞ্জ রসগোল্লা",
        price: 600,
        quantity: 2,
        unit: "১ কেজি বক্স",
        image: "/Product/placeholder.svg",
      },
      {
        id: "item-5",
        productId: "shahi-ghee-motichoor-laddu",
        title: "শাহী গাওয়া ঘি মতিচুর লাড্ডু",
        price: 550,
        quantity: 1,
        unit: "১ কেজি প্রিমিয়াম বক্স",
        image: "/Product/placeholder.svg",
      },
    ],
    subtotal: 1750,
    deliveryFee: 60,
    discount: 100,
    totalAmount: 1710,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    status: "Delivered",
  },
  {
    id: "DB-98418",
    invoiceNo: "INV-2026-98418",
    createdAt: "২০২৬-১০-২৬",
    customerName: "মাহমুদুল হাসান",
    customerPhone: "01545-678901",
    shippingAddress: "ব্লক সি, লাইন ৪, মিরপুর-১০, ঢাকা",
    deliveryArea: "ঢাকা সিটি",
    items: [
      {
        id: "item-6",
        productId: "special-ghee-roasted-laccha-semai",
        title: "স্পেশাল প্রিমিয়াম লাচ্ছা সেমাই",
        price: 450,
        quantity: 2,
        unit: "৫০০ গ্রাম প্যাকেট",
        image: "/Product/laccha_semai.jpg",
      },
    ],
    subtotal: 900,
    deliveryFee: 60,
    discount: 0,
    totalAmount: 960,
    paymentMethod: "Nagad",
    paymentStatus: "Paid",
    status: "Delivered",
  },
  {
    id: "DB-98417",
    invoiceNo: "INV-2026-98417",
    createdAt: "২০২৬-১০-২৬",
    customerName: "নাজমুল সাকিব",
    customerPhone: "01656-789012",
    shippingAddress: "রোড ১১, ব্লক ডি, বনানী, ঢাকা",
    deliveryArea: "ঢাকা সিটি",
    notes: "গ্রাহক অর্ডার বাতিল করেছেন",
    items: [
      {
        id: "item-7",
        productId: "clay-pot-sweet-curd",
        title: "মাটির হাঁড়ির মিষ্টি দই",
        price: 420,
        quantity: 1,
        unit: "৫০০ গ্রাম হাঁড়ি",
        image: "/Product/doi.jpg",
      },
    ],
    subtotal: 420,
    deliveryFee: 60,
    discount: 0,
    totalAmount: 480,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    status: "Cancelled",
  },
  {
    id: "DB-98416",
    invoiceNo: "INV-2026-98416",
    createdAt: "২০২৬-১০-২৫",
    customerName: "আব্দুল্লাহ আল মামুন",
    customerPhone: "01767-890123",
    customerEmail: "mamun.bogra@gmail.com",
    shippingAddress: "জেলখানা মোড়, খান্দার, বগুড়া সদর, বগুড়া",
    deliveryArea: "ঢাকার বাইরে",
    items: [
      {
        id: "item-8",
        productId: "special-ghee-roasted-laccha-semai",
        title: "স্পেশাল প্রিমিয়াম লাচ্ছা সেমাই",
        price: 450,
        quantity: 4,
        unit: "৫০০ গ্রাম প্যাকেট",
        image: "/Product/laccha_semai.jpg",
      },
      {
        id: "item-9",
        productId: "pure-ghee",
        title: "খাঁটি দানাদার গাওয়া ঘি",
        price: 950,
        quantity: 1,
        unit: "৫০০ গ্রাম জার",
        image: "/Product/placeholder.svg",
      },
    ],
    subtotal: 2750,
    deliveryFee: 120,
    discount: 150,
    totalAmount: 2720,
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    status: "Shipped",
  },
];

const STORAGE_KEY = "doibilash_admin_orders_v2";

export function getStoredOrders(): StoredOrder[] {
  if (typeof window === "undefined") {
    return DEFAULT_ORDERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ORDERS;
  } catch {
    return DEFAULT_ORDERS;
  }
}

export function saveOrder(order: StoredOrder): StoredOrder[] {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === order.id);

  let updated: StoredOrder[];
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
      console.error("Failed to save order to localStorage", err);
    }
  }
  return updated;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): StoredOrder[] {
  const orders = getStoredOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update status in localStorage", err);
    }
  }
  return updated;
}

export function deleteOrder(id: string): StoredOrder[] {
  const orders = getStoredOrders();
  const updated = orders.filter((o) => o.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete order from localStorage", err);
    }
  }
  return updated;
}

export function getOrderById(id: string): StoredOrder | undefined {
  const orders = getStoredOrders();
  const cleanId = id.replace("#", "");
  return orders.find((o) => o.id.replace("#", "") === cleanId);
}
