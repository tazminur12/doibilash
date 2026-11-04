import prisma from "@/lib/prisma";
import type {
  StoredOrder,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/orderStorage";
import type { OrderStatus as PrismaOrderStatus } from "@prisma/client";

type ShippingJson = {
  fullAddress?: string;
  address?: string;
  city?: string;
  deliveryTimeSlot?: string;
  invoiceNo?: string;
  subtotal?: number;
  title?: string;
  name?: string;
  phone?: string;
  transactionId?: string;
  paymentProofUrl?: string;
};

const STATUS_TO_PRISMA: Record<OrderStatus, PrismaOrderStatus> = {
  Pending: "PENDING",
  Processing: "PROCESSING",
  Shipped: "SHIPPED",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
};

const STATUS_FROM_PRISMA: Record<string, OrderStatus> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function parseShipping(raw: unknown): ShippingJson {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as ShippingJson;
    } catch {
      return { fullAddress: raw };
    }
  }
  if (typeof raw === "object") return raw as ShippingJson;
  return {};
}

function normalizeItems(raw: unknown): OrderItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: Record<string, unknown>, idx: number) => ({
    id: String(item.id || `item-${idx}`),
    productId: item.productId ? String(item.productId) : undefined,
    title: String(item.title || item.name || "পণ্য"),
    price: Number(item.price) || 0,
    quantity: Number(item.quantity ?? item.qty ?? 1) || 1,
    unit: String(item.unit || "১টি"),
    image: item.image ? String(item.image) : undefined,
  }));
}

export function mapPrismaOrderToStored(row: {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: unknown;
  status: string;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  items: unknown;
  notes: string | null;
  createdAt: Date;
}): StoredOrder {
  const shipping = parseShipping(row.shippingAddress);
  const items = normalizeItems(row.items);
  const computedSubtotal =
    shipping.subtotal ??
    items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const city =
    shipping.city === "ঢাকার বাইরে" ? "ঢাকার বাইরে" : "ঢাকা সিটি";

  const paymentMethod = ([
    "Cash on Delivery",
    "bKash",
    "Nagad",
    "Bank Transfer",
  ].includes(row.paymentMethod)
    ? row.paymentMethod
    : row.paymentMethod.includes("বিকাশ") || row.paymentMethod.toLowerCase().includes("bkash")
      ? "bKash"
      : row.paymentMethod.includes("নগদ") || row.paymentMethod.toLowerCase().includes("nagad")
        ? "Nagad"
        : row.paymentMethod.includes("ব্যাংক") || row.paymentMethod.toLowerCase().includes("bank")
          ? "Bank Transfer"
          : "Cash on Delivery") as PaymentMethod;

  const paymentStatus = (
    ["Paid", "Unpaid", "Partial"].includes(row.paymentStatus)
      ? row.paymentStatus
      : "Unpaid"
  ) as PaymentStatus;

  return {
    id: row.orderNumber,
    invoiceNo:
      shipping.invoiceNo ||
      `INV-${row.orderNumber.replace(/^#?DB-?/i, "")}`,
    createdAt: row.createdAt.toISOString().split("T")[0],
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail || undefined,
    shippingAddress: shipping.fullAddress || shipping.address || "",
    deliveryArea: city,
    deliveryTimeSlot: shipping.deliveryTimeSlot || undefined,
    notes: row.notes || undefined,
    items,
    subtotal: computedSubtotal,
    deliveryFee: row.deliveryCharge,
    discount: row.discount || 0,
    totalAmount: row.totalAmount,
    paymentMethod,
    paymentStatus,
    transactionId: shipping.transactionId || undefined,
    paymentProofUrl: shipping.paymentProofUrl || undefined,
    status: STATUS_FROM_PRISMA[row.status] || "Processing",
  };
}

export function toPrismaStatus(status: OrderStatus): PrismaOrderStatus {
  return STATUS_TO_PRISMA[status] || "PROCESSING";
}

export function buildShippingJson(order: Partial<StoredOrder>): ShippingJson {
  return {
    fullAddress: order.shippingAddress || "",
    city: order.deliveryArea || "ঢাকা সিটি",
    deliveryTimeSlot: order.deliveryTimeSlot,
    invoiceNo: order.invoiceNo,
    subtotal: order.subtotal,
    ...(order.transactionId ? { transactionId: order.transactionId } : {}),
    ...(order.paymentProofUrl ? { paymentProofUrl: order.paymentProofUrl } : {}),
  };
}

/** Delivered orders are collected — keep payment status in step with delivery. */
export async function settleDeliveredPayments() {
  await prisma.order.updateMany({
    where: {
      status: "DELIVERED",
      NOT: { paymentStatus: "Paid" },
    },
    data: { paymentStatus: "Paid" },
  });
}

/** No demo seed — admin orders come only from real creates / storefront */
export async function getAdminOrders(): Promise<StoredOrder[]> {
  await settleDeliveredPayments();
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPrismaOrderToStored);
}

export async function getOrderByIdOrNumber(
  identifier: string
): Promise<(StoredOrder & { dbId: string }) | null> {
  const clean = identifier.replace(/^#/, "");
  const row = await prisma.order.findFirst({
    where: {
      OR: [{ id: clean }, { orderNumber: clean }, { orderNumber: `#${clean}` }],
    },
  });
  if (!row) return null;
  return { ...mapPrismaOrderToStored(row), dbId: row.id };
}
