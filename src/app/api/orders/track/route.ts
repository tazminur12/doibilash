import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapPrismaOrderToStored } from "@/lib/orderService";
import type { OrderStatus } from "@/lib/orderStorage";

export const dynamic = "force-dynamic";

const STATUS_STEP: Record<OrderStatus, number> = {
  Pending: 0,
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 0,
};

function normalizeOrderId(raw: string): string {
  const digits = raw.trim().toUpperCase().replace(/^#?\s*(DB)?\s*-?\s*/, "");
  return digits ? `DB-${digits}` : "";
}

function normalizePhone(raw: string): string {
  return String(raw).replace(/[\s-]/g, "").replace(/^\+?88/, "");
}

function formatBnDate(d: Date): string {
  try {
    return d.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function formatBnDateTime(d: Date): string {
  try {
    return d.toLocaleString("bn-BD", {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return d.toISOString();
  }
}

function buildUpdates(status: OrderStatus, createdAt: Date) {
  const placed = {
    timestamp: formatBnDateTime(createdAt),
    description: "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।",
  };
  if (status === "Pending") return [placed];
  if (status === "Processing") {
    return [
      placed,
      {
        timestamp: formatBnDateTime(createdAt),
        description: "আপনার পণ্যটি কোল্ড-চেইন প্যাকেজিংয়ে প্রস্তুত করা হচ্ছে।",
      },
    ];
  }
  if (status === "Shipped") {
    return [
      placed,
      {
        timestamp: formatBnDateTime(createdAt),
        description: "আপনার পণ্যটি প্যাক করা হয়েছে।",
      },
      {
        timestamp: formatBnDateTime(createdAt),
        description: "পণ্যটি ডেলিভারি টিমের কাছে হস্তান্তর করা হয়েছে, পথে রয়েছে।",
      },
    ];
  }
  if (status === "Delivered") {
    return [
      placed,
      {
        timestamp: formatBnDateTime(createdAt),
        description: "আপনার পণ্যটি প্যাক করা হয়েছে।",
      },
      {
        timestamp: formatBnDateTime(createdAt),
        description: "পণ্যটি ডেলিভারি টিমের কাছে হস্তান্তর করা হয়েছে।",
      },
      {
        timestamp: formatBnDateTime(createdAt),
        description: "আপনার পণ্যটি সফলভাবে পৌঁছে দেওয়া হয়েছে। ধন্যবাদ!",
      },
    ];
  }
  return [
    placed,
    {
      description: "এই অর্ডারটি বাতিল করা হয়েছে। সহায়তার জন্য হেল্পলাইনে যোগাযোগ করুন।",
    },
  ];
}

/** Public track — orderNumber + phone must match */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = normalizeOrderId(searchParams.get("orderNumber") || searchParams.get("orderId") || "");
    const phone = normalizePhone(searchParams.get("phone") || "");

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { ok: false, error: "অর্ডার আইডি এবং মোবাইল নম্বর দিন।" },
        { status: 400 }
      );
    }

    const row = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!row) {
      return NextResponse.json(
        { ok: false, error: "অর্ডারটি খুঁজে পাওয়া যায়নি। অর্ডার আইডি যাচাই করুন।" },
        { status: 404 }
      );
    }

    const orderPhone = normalizePhone(row.customerPhone);
    if (orderPhone !== phone) {
      return NextResponse.json(
        { ok: false, error: "ফোন নম্বরটি এই অর্ডারের সাথে মেলেনি। পুনরায় চেষ্টা করুন।" },
        { status: 403 }
      );
    }

    const stored = mapPrismaOrderToStored(row);
    const activeStepIndex = STATUS_STEP[stored.status] ?? 0;
    const est = new Date(row.createdAt);
    est.setDate(est.getDate() + (stored.deliveryArea === "ঢাকার বাইরে" ? 3 : 1));

    return NextResponse.json({
      ok: true,
      tracking: {
        id: `#${stored.id}`,
        orderNumber: stored.id,
        phone: orderPhone,
        date: formatBnDate(row.createdAt),
        estimatedDelivery: formatBnDate(est),
        activeStepIndex: stored.status === "Cancelled" ? 0 : activeStepIndex,
        status: stored.status,
        cancelled: stored.status === "Cancelled",
        deliveryAddress: stored.shippingAddress,
        paymentMethod: stored.paymentMethod,
        paymentStatus: stored.paymentStatus,
        deliveryCharge: stored.deliveryFee,
        discount: stored.discount,
        totalAmount: stored.totalAmount,
        items: stored.items.map((it) => ({
          name: it.title,
          qty: it.quantity,
          price: it.price,
        })),
        updates: buildUpdates(stored.status, row.createdAt),
      },
    });
  } catch (error: unknown) {
    console.error("Order track GET error:", error);
    return NextResponse.json(
      { ok: false, error: "অর্ডার ট্র্যাক করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
