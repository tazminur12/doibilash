import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("doibilash_session")?.value;
  if (tokenFromCookie) {
    const payload = verifyToken(tokenFromCookie);
    if (payload?.userId) return payload.userId;
  }

  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    const payload = verifyToken(bearerToken);
    if (payload?.userId) return payload.userId;
  }

  return null;
}

// Map Prisma Order to Frontend Order interface
function mapPrismaOrder(o: {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  deliveryMethod: string;
  paymentMethod: string;
  deliveryCharge: number;
  totalAmount: number;
  items: unknown;
}) {
  const statusMap: Record<string, "Processing" | "Shipped" | "Delivered"> = {
    PENDING: "Processing",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Processing",
  };

  const rawItems = Array.isArray(o.items) ? o.items : [];
  const items = rawItems.map((item: any) => ({
    name: item.title || item.name || "দই বিলাসের পণ্য",
    qty: Number(item.quantity || item.qty || 1),
    price: Number(item.price || 0),
    image: item.image || "/Product/doi.jpg",
  }));

  const formattedDate = new Date(o.createdAt).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    id: o.orderNumber.startsWith("#") ? o.orderNumber : `#${o.orderNumber}`,
    rawId: o.id,
    date: formattedDate,
    status: statusMap[o.status] || "Processing",
    deliveryMethod: o.deliveryMethod || "হোম ডেলিভারি (ঢাকা সিটি)",
    paymentMethod: o.paymentMethod || "ক্যাশ অন ডেলিভারি",
    deliveryCharge: o.deliveryCharge || 60,
    totalAmount: o.totalAmount,
    items,
  };
}

const SEEDED_DEMO_ADDRESS = "বাড়ি ১২, রোড ৫, ধানমন্ডি";
const SEEDED_DEMO_ITEM_NAMES = new Set([
  "বগুড়ার স্পেশাল সরার মিষ্টি দই",
  "খাঁটি দানাদার গাওয়া ঘি (৫০০ গ্রাম)",
  "সুন্দরবনের প্রাকৃতিক মধু",
  "প্রিমিয়াম খোরমা খেজুর",
  "স্পেশাল মাটির কাপ দই (৪ পিস)",
]);

/** Rows previously inserted when a user had no orders. Real checkout orders always carry an invoice number. */
function isSeededDemoOrder(order: { shippingAddress: unknown; items: unknown }): boolean {
  const address = order.shippingAddress;
  if (!address || typeof address !== "object") return false;
  const addr = address as { fullAddress?: string; title?: string; invoiceNo?: string };
  if (addr.fullAddress !== SEEDED_DEMO_ADDRESS || addr.title !== "শিপিং ঠিকানা" || addr.invoiceNo) {
    return false;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  if (items.length === 0) return false;
  return items.every((item) => {
    if (!item || typeof item !== "object") return false;
    const name = (item as { name?: unknown }).name;
    return typeof name === "string" && SEEDED_DEMO_ITEM_NAMES.has(name);
  });
}

async function removeSeededDemoOrders() {
  const candidates = await prisma.order.findMany({
    where: {
      shippingAddress: {
        path: ["fullAddress"],
        equals: SEEDED_DEMO_ADDRESS,
      },
    },
    select: { id: true, shippingAddress: true, items: true },
  });

  const ids = candidates.filter(isSeededDemoOrder).map((order) => order.id);
  if (ids.length === 0) return;

  await prisma.order.deleteMany({ where: { id: { in: ids } } });
}

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({
        ok: true,
        orders: [],
        stats: { total: 0, active: 0, delivered: 0, spent: 0 },
      }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    try {
      await removeSeededDemoOrders();
    } catch (err) {
      console.error("Error removing seeded demo orders:", err);
    }

    const orders = (
      await prisma.order.findMany({
        where: {
          OR: [
            { userId: user.id },
            { customerPhone: user.phone },
          ],
        },
        orderBy: { createdAt: "desc" },
      })
    ).filter((order) => !isSeededDemoOrder(order));

    const mappedOrders = orders.map(mapPrismaOrder);

    // Compute live stats
    const total = mappedOrders.length;
    const active = mappedOrders.filter((o) => o.status !== "Delivered").length;
    const delivered = mappedOrders.filter((o) => o.status === "Delivered").length;
    const spent = mappedOrders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.qty * item.price, 0) + o.deliveryCharge,
      0
    );

    return NextResponse.json({
      ok: true,
      orders: mappedOrders,
      stats: {
        total,
        active,
        delivered,
        spent,
      },
    });
  } catch (error: unknown) {
    console.error("Get User Orders API error:", error);
    return NextResponse.json({ ok: false, error: "অর্ডার লোড করতে ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

