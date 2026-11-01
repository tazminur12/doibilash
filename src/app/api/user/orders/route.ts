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

// Seed helper for newly registered or demo user if no orders exist yet
async function seedInitialUserOrders(userId: string, name: string, phone: string, email?: string | null) {
  const sampleOrders = [
    {
      orderNumber: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      customerName: name,
      customerPhone: phone,
      customerEmail: email || `${phone}@customer.doibilash.com`,
      shippingAddress: {
        title: "শিপিং ঠিকানা",
        name,
        phone,
        fullAddress: "বাড়ি ১২, রোড ৫, ধানমন্ডি",
        city: "ঢাকা সিটি",
      },
      status: "SHIPPED" as const,
      deliveryMethod: "হোম ডেলিভারি (ঢাকা সিটি)",
      paymentMethod: "ক্যাশ অন ডেলিভারি",
      paymentStatus: "Unpaid",
      deliveryCharge: 60,
      totalAmount: 2450,
      items: [
        {
          name: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
          qty: 2,
          price: 500,
          image: "/Product/doi.jpg",
        },
        {
          name: "খাঁটি দানাদার গাওয়া ঘি (৫০০ গ্রাম)",
          qty: 1,
          price: 1450,
          image: "/Product/placeholder.svg",
        },
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      orderNumber: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      customerName: name,
      customerPhone: phone,
      customerEmail: email || `${phone}@customer.doibilash.com`,
      shippingAddress: {
        title: "শিপিং ঠিকানা",
        name,
        phone,
        fullAddress: "বাড়ি ১২, রোড ৫, ধানমন্ডি",
        city: "ঢাকা সিটি",
      },
      status: "DELIVERED" as const,
      deliveryMethod: "এক্সপ্রেস ডেলিভারি",
      paymentMethod: "বিকাশ",
      paymentStatus: "Paid",
      deliveryCharge: 60,
      totalAmount: 1600,
      items: [
        {
          name: "সুন্দরবনের প্রাকৃতিক মধু",
          qty: 1,
          price: 850,
          image: "/Product/placeholder.svg",
        },
        {
          name: "প্রিমিয়াম খোরমা খেজুর",
          qty: 1,
          price: 750,
          image: "/Product/placeholder.svg",
        },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      orderNumber: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      customerName: name,
      customerPhone: phone,
      customerEmail: email || `${phone}@customer.doibilash.com`,
      shippingAddress: {
        title: "শিপিং ঠিকানা",
        name,
        phone,
        fullAddress: "বাড়ি ১২, রোড ৫, ধানমন্ডি",
        city: "ঢাকা সিটি",
      },
      status: "DELIVERED" as const,
      deliveryMethod: "স্ট্যান্ডার্ড ডেলিভারি",
      paymentMethod: "ক্যাশ অন ডেলিভারি",
      paymentStatus: "Paid",
      deliveryCharge: 60,
      totalAmount: 1260,
      items: [
        {
          name: "স্পেশাল মাটির কাপ দই (৪ পিস)",
          qty: 3,
          price: 420,
          image: "/Product/mini_doi.png",
        },
      ],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
  ];

  for (const o of sampleOrders) {
    await prisma.order.create({ data: o });
  }
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

    // Find orders by userId or customerPhone
    let orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { customerPhone: user.phone },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // If zero orders found, seed initial sample orders for the user
    if (orders.length === 0) {
      try {
        await seedInitialUserOrders(user.id, user.name, user.phone, user.email);
        orders = await prisma.order.findMany({
          where: {
            OR: [
              { userId: user.id },
              { customerPhone: user.phone },
            ],
          },
          orderBy: { createdAt: "desc" },
        });
      } catch (err) {
        console.error("Error seeding initial orders:", err);
      }
    }

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

