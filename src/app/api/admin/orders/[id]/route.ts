import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getOrderByIdOrNumber,
  buildShippingJson,
  toPrismaStatus,
  mapPrismaOrderToStored,
} from "@/lib/orderService";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/orderStorage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderByIdOrNumber(id);
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "অর্ডার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }
    const { dbId, ...rest } = order;
    return NextResponse.json({ ok: true, order: rest, dbId });
  } catch (error: unknown) {
    console.error("Admin order GET error:", error);
    return NextResponse.json(
      { ok: false, error: "অর্ডার লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await getOrderByIdOrNumber(id);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "অর্ডার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

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
      paymentStatus,
      status,
      invoiceNo,
    } = body;

    // Status-only quick update
    if (
      status !== undefined &&
      customerName === undefined &&
      items === undefined &&
      shippingAddress === undefined
    ) {
      const updated = await prisma.order.update({
        where: { id: existing.dbId },
        data: { status: toPrismaStatus(status as OrderStatus) },
      });
      return NextResponse.json({
        ok: true,
        message: "অর্ডার স্ট্যাটাস আপডেট হয়েছে।",
        order: mapPrismaOrderToStored(updated),
      });
    }

    const area =
      deliveryArea === "ঢাকার বাইরে"
        ? "ঢাকার বাইরে"
        : deliveryArea === "ঢাকা সিটি"
          ? "ঢাকা সিটি"
          : existing.deliveryArea;

    const fee =
      deliveryFee !== undefined ? Number(deliveryFee) || 0 : existing.deliveryFee;
    const disc =
      discount !== undefined ? Number(discount) || 0 : existing.discount;
    const safeItems = items !== undefined ? items : existing.items;
    const computedSubtotal =
      subtotal !== undefined
        ? Number(subtotal) || 0
        : Array.isArray(safeItems)
          ? safeItems.reduce(
              (sum: number, it: { price?: number; quantity?: number }) =>
                sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
              0
            )
          : existing.subtotal;
    const computedTotal =
      totalAmount !== undefined
        ? Number(totalAmount) || 0
        : Math.max(0, computedSubtotal + fee - disc);

    const updated = await prisma.order.update({
      where: { id: existing.dbId },
      data: {
        customerName:
          customerName !== undefined
            ? String(customerName).trim()
            : existing.customerName,
        customerPhone:
          customerPhone !== undefined
            ? String(customerPhone).trim()
            : existing.customerPhone,
        customerEmail:
          customerEmail !== undefined
            ? customerEmail
              ? String(customerEmail).trim().toLowerCase()
              : null
            : existing.customerEmail || null,
        shippingAddress: buildShippingJson({
          shippingAddress:
            shippingAddress !== undefined
              ? String(shippingAddress).trim()
              : existing.shippingAddress,
          deliveryArea: area,
          deliveryTimeSlot:
            deliveryTimeSlot !== undefined
              ? deliveryTimeSlot
              : existing.deliveryTimeSlot,
          invoiceNo: invoiceNo || existing.invoiceNo,
          subtotal: computedSubtotal,
        }),
        status:
          status !== undefined
            ? toPrismaStatus(status as OrderStatus)
            : toPrismaStatus(existing.status),
        deliveryMethod: `হোম ডেলিভারি (${area})`,
        paymentMethod:
          paymentMethod !== undefined
            ? (paymentMethod as PaymentMethod)
            : existing.paymentMethod,
        paymentStatus:
          paymentStatus !== undefined
            ? (paymentStatus as PaymentStatus)
            : existing.paymentStatus,
        deliveryCharge: fee,
        discount: disc,
        totalAmount: computedTotal,
        items: safeItems,
        notes:
          notes !== undefined
            ? notes
              ? String(notes).trim()
              : null
            : existing.notes || null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `অর্ডার ${updated.orderNumber} সফলভাবে আপডেট হয়েছে।`,
      order: mapPrismaOrderToStored(updated),
    });
  } catch (error: unknown) {
    console.error("Admin order PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "অর্ডার আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getOrderByIdOrNumber(id);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "অর্ডার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.order.delete({ where: { id: existing.dbId } });

    return NextResponse.json({
      ok: true,
      message: `অর্ডার ${existing.id} মুছে ফেলা হয়েছে।`,
    });
  } catch (error: unknown) {
    console.error("Admin order DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "অর্ডার ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
