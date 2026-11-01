import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getAdminOrders,
  buildShippingJson,
  toPrismaStatus,
  mapPrismaOrderToStored,
} from "@/lib/orderService";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/orderStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await getAdminOrders();
    return NextResponse.json({ ok: true, orders });
  } catch (error: unknown) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json(
      { ok: false, error: "অর্ডার তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      invoiceNo,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      deliveryArea,
      deliveryTimeSlot,
      notes,
      items,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status,
    } = body;

    if (!customerName || !String(customerName).trim()) {
      return NextResponse.json(
        { ok: false, error: "গ্রাহকের নাম প্রদান করুন।" },
        { status: 400 }
      );
    }
    if (!customerPhone || !String(customerPhone).trim()) {
      return NextResponse.json(
        { ok: false, error: "গ্রাহকের মোবাইল নম্বর প্রদান করুন।" },
        { status: 400 }
      );
    }
    if (!shippingAddress || !String(shippingAddress).trim()) {
      return NextResponse.json(
        { ok: false, error: "ডেলিভারি ঠিকানা প্রদান করুন।" },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "অর্ডারে অন্তত একটি পণ্য যুক্ত করুন।" },
        { status: 400 }
      );
    }

    const orderNumber =
      (id && String(id).replace(/^#/, "")) ||
      `DB-${Math.floor(10000 + Math.random() * 90000)}`;

    const existing = await prisma.order.findUnique({
      where: { orderNumber },
    });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "এই অর্ডার নম্বর ইতিমধ্যে আছে।" },
        { status: 409 }
      );
    }

    const area = deliveryArea === "ঢাকার বাইরে" ? "ঢাকার বাইরে" : "ঢাকা সিটি";
    const fee =
      deliveryFee !== undefined
        ? Number(deliveryFee) || 0
        : area === "ঢাকা সিটি"
          ? 60
          : 120;
    const disc = Number(discount) || 0;
    const computedSubtotal =
      subtotal !== undefined
        ? Number(subtotal) || 0
        : items.reduce(
            (sum: number, it: { price?: number; quantity?: number }) =>
              sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
            0
          );
    const computedTotal =
      totalAmount !== undefined
        ? Number(totalAmount) || 0
        : Math.max(0, computedSubtotal + fee - disc);

    const created = await prisma.order.create({
      data: {
        orderNumber,
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        customerEmail: customerEmail
          ? String(customerEmail).trim().toLowerCase()
          : null,
        shippingAddress: buildShippingJson({
          shippingAddress: String(shippingAddress).trim(),
          deliveryArea: area,
          deliveryTimeSlot,
          invoiceNo:
            invoiceNo || `INV-${orderNumber.replace(/^DB-/, "")}`,
          subtotal: computedSubtotal,
        }),
        status: toPrismaStatus((status as OrderStatus) || "Pending"),
        deliveryMethod: `হোম ডেলিভারি (${area})`,
        paymentMethod: (paymentMethod as PaymentMethod) || "Cash on Delivery",
        paymentStatus: (paymentStatus as PaymentStatus) || "Unpaid",
        deliveryCharge: fee,
        discount: disc,
        totalAmount: computedTotal,
        items,
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `অর্ডার ${created.orderNumber} সফলভাবে তৈরি হয়েছে।`,
      order: mapPrismaOrderToStored(created),
    });
  } catch (error: unknown) {
    console.error("Admin orders POST error:", error);
    return NextResponse.json(
      { ok: false, error: "অর্ডার তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
