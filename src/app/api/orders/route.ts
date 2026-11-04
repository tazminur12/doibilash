import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import {
  buildShippingJson,
  mapPrismaOrderToStored,
  toPrismaStatus,
} from "@/lib/orderService";
import type { PaymentMethod, PaymentStatus } from "@/lib/orderStorage";

export const dynamic = "force-dynamic";

async function getOptionalUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("doibilash_session")?.value;
  if (tokenFromCookie) {
    const payload = verifyToken(tokenFromCookie);
    if (payload?.userId && payload.role !== "ADMIN") return payload.userId;
  }
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const payload = verifyToken(authHeader.slice(7).trim());
    if (payload?.userId && payload.role !== "ADMIN") return payload.userId;
  }
  return null;
}

function normalizePhone(raw: string): string {
  return String(raw).replace(/[\s-]/g, "").replace(/^\+?88/, "");
}

/** Public checkout — create customer order */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
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
      promoCode,
      transactionId,
      paymentProofUrl,
    } = body;

    if (!customerName || !String(customerName).trim()) {
      return NextResponse.json(
        { ok: false, error: "গ্রাহকের নাম প্রদান করুন।" },
        { status: 400 }
      );
    }
    const phone = normalizePhone(String(customerPhone || ""));
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, error: "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।" },
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

    let orderNumber = "";
    for (let attempt = 0; attempt < 8; attempt++) {
      const candidate = `DB-${Math.floor(10000 + Math.random() * 90000)}`;
      const exists = await prisma.order.findUnique({
        where: { orderNumber: candidate },
      });
      if (!exists) {
        orderNumber = candidate;
        break;
      }
    }
    if (!orderNumber) {
      return NextResponse.json(
        { ok: false, error: "অর্ডার নম্বর তৈরি করা যায়নি। আবার চেষ্টা করুন।" },
        { status: 500 }
      );
    }

    const area =
      deliveryArea === "outside" || deliveryArea === "ঢাকার বাইরে"
        ? "ঢাকার বাইরে"
        : "ঢাকা সিটি";

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

    const methodRaw = String(paymentMethod || "cod").toLowerCase();
    const storedPayment: PaymentMethod =
      methodRaw === "bkash" || methodRaw === "online" || methodRaw.includes("bkash") || methodRaw.includes("বিকাশ")
        ? "bKash"
        : methodRaw === "nagad" || methodRaw.includes("nagad") || methodRaw.includes("নগদ")
          ? "Nagad"
          : "Cash on Delivery";

    const isMobilePayment = storedPayment === "bKash" || storedPayment === "Nagad";
    const trx = String(transactionId || "").replace(/\s+/g, "").toUpperCase();
    if (isMobilePayment && !/^[A-Z0-9]{6,30}$/.test(trx)) {
      return NextResponse.json(
        { ok: false, error: "সঠিক ট্রানজেকশন আইডি দিন। বিকাশ বা নগদে পেমেন্ট না হলে অর্ডার কনফার্ম হয় না।" },
        { status: 400 }
      );
    }

    let proofUrl: string | null = null;
    if (paymentProofUrl && typeof paymentProofUrl === "string") {
      try {
        const parsed = new URL(paymentProofUrl);
        if (parsed.protocol === "https:") proofUrl = parsed.toString();
      } catch {
        proofUrl = null;
      }
    }

    const userId = await getOptionalUserId();

    const noteParts = [
      notes ? String(notes).trim() : "",
      promoCode ? `প্রোমো: ${String(promoCode).trim().toUpperCase()}` : "",
    ].filter(Boolean);

    const created = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || undefined,
        customerName: String(customerName).trim(),
        customerPhone: phone,
        customerEmail: customerEmail
          ? String(customerEmail).trim().toLowerCase()
          : null,
        shippingAddress: buildShippingJson({
          shippingAddress: String(shippingAddress).trim(),
          deliveryArea: area,
          deliveryTimeSlot,
          invoiceNo: `INV-${orderNumber.replace(/^DB-/, "")}`,
          subtotal: computedSubtotal,
          transactionId: isMobilePayment ? trx : undefined,
          paymentProofUrl: isMobilePayment && proofUrl ? proofUrl : undefined,
        }),
        status: toPrismaStatus("Pending"),
        deliveryMethod: `হোম ডেলিভারি (${area})`,
        paymentMethod: storedPayment,
        paymentStatus: (isMobilePayment ? "Paid" : "Unpaid") as PaymentStatus,
        deliveryCharge: fee,
        discount: disc,
        totalAmount: computedTotal,
        items,
        notes: noteParts.length ? noteParts.join(" | ") : null,
      },
    });

    // Best-effort: bump customer CRM if phone matches
    try {
      const existingCustomer = await prisma.customer.findUnique({
        where: { phone },
      });
      if (existingCustomer) {
        await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: computedTotal },
            name: existingCustomer.name || String(customerName).trim(),
          },
        });
      } else {
        await prisma.customer.create({
          data: {
            name: String(customerName).trim(),
            phone,
            email: customerEmail
              ? String(customerEmail).trim().toLowerCase()
              : null,
            address: String(shippingAddress).trim(),
            city: area,
            totalOrders: 1,
            totalSpent: computedTotal,
            userId: userId || undefined,
            avatarInitials: String(customerName)
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((p: string) => p[0] || "")
              .join(""),
          },
        });
      }
    } catch (crmErr) {
      console.warn("[Public order] customer sync skipped:", crmErr);
    }

    return NextResponse.json({
      ok: true,
      message: `অর্ডার ${created.orderNumber} সফলভাবে তৈরি হয়েছে।`,
      order: mapPrismaOrderToStored(created),
      orderNumber: created.orderNumber,
    });
  } catch (error: unknown) {
    console.error("Public orders POST error:", error);
    return NextResponse.json(
      { ok: false, error: "অর্ডার তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
