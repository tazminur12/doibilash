import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminCorporateOrders } from "@/lib/corporateOrderService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await getAdminCorporateOrders();
    return NextResponse.json({ ok: true, orders });
  } catch (error: unknown) {
    console.error("Admin corporate GET error:", error);
    return NextResponse.json(
      { ok: false, error: "কর্পোরেট অর্ডার তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      quotationNo,
      companyName,
      contactPerson,
      designation,
      phone,
      email,
      eventType,
      deliveryDate,
      deliveryAddress,
      approxQuantityText,
      items,
      subtotal,
      vatOrTaxPercent,
      vatOrTaxAmount,
      customBrandingFee,
      totalBudget,
      advancePaid,
      dueAmount,
      paymentTerms,
      status,
      assignedManager,
      customLogoBranding,
      notes,
    } = body;

    if (!companyName || !String(companyName).trim()) {
      return NextResponse.json(
        { ok: false, error: "প্রতিষ্ঠানের নাম প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }
    if (!contactPerson || !String(contactPerson).trim()) {
      return NextResponse.json(
        { ok: false, error: "যোগাযোগকারীর নাম প্রদান করুন।" },
        { status: 400 }
      );
    }
    if (!phone || !String(phone).trim()) {
      return NextResponse.json(
        { ok: false, error: "যোগাযোগের ফোন নম্বর প্রদান করুন।" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const safeId = id || `CORP-${year}-${Date.now().toString().slice(-4)}`;
    const safeQuotation =
      quotationNo || `QT-DB-${Math.floor(100 + Math.random() * 900)}`;

    const existingQt = await prisma.corporateOrder.findUnique({
      where: { quotationNo: safeQuotation },
    });
    if (existingQt) {
      return NextResponse.json(
        { ok: false, error: "এই কোটেশন নম্বর ইতিমধ্যে ব্যবহৃত হয়েছে।" },
        { status: 409 }
      );
    }

    const safeItems = Array.isArray(items) ? items : [];
    const computedSubtotal =
      subtotal !== undefined
        ? Number(subtotal) || 0
        : safeItems.reduce(
            (sum: number, it: { totalPrice?: number }) => sum + (Number(it.totalPrice) || 0),
            0
          );
    const branding = Number(customBrandingFee) || 0;
    const computedTotal =
      totalBudget !== undefined ? Number(totalBudget) || 0 : computedSubtotal + branding;
    const advance = Number(advancePaid) || 0;
    const computedDue =
      dueAmount !== undefined ? Number(dueAmount) || 0 : Math.max(0, computedTotal - advance);

    const created = await prisma.corporateOrder.create({
      data: {
        id: safeId,
        quotationNo: safeQuotation,
        companyName: String(companyName).trim(),
        contactPerson: String(contactPerson).trim(),
        designation: designation ? String(designation).trim() : "",
        phone: String(phone).trim(),
        email: email ? String(email).trim().toLowerCase() : "",
        eventType: eventType || "কর্পোরেট গিফটিং",
        deliveryDate: deliveryDate ? String(deliveryDate) : "",
        deliveryAddress: deliveryAddress ? String(deliveryAddress).trim() : "",
        approxQuantityText: approxQuantityText ? String(approxQuantityText).trim() : "",
        items: safeItems,
        subtotal: computedSubtotal,
        vatOrTaxPercent: Number(vatOrTaxPercent) || 0,
        vatOrTaxAmount: Number(vatOrTaxAmount) || 0,
        customBrandingFee: branding,
        totalBudget: computedTotal,
        advancePaid: advance,
        dueAmount: computedDue,
        paymentTerms: paymentTerms ? String(paymentTerms).trim() : "",
        status: status || "New Lead",
        assignedManager: assignedManager ? String(assignedManager).trim() : "",
        customLogoBranding: Boolean(customLogoBranding),
        notes: notes ? String(notes).trim() : null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `কর্পোরেট কোটেশন "${created.companyName}" সফলভাবে সংরক্ষিত হয়েছে।`,
      order: {
        ...created,
        items: created.items,
        notes: created.notes || undefined,
        createdAt: created.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: unknown) {
    console.error("Admin corporate POST error:", error);
    return NextResponse.json(
      { ok: false, error: "কর্পোরেট অর্ডার তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
