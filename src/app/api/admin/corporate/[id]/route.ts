import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCorporateOrderByIdDb } from "@/lib/corporateOrderService";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getCorporateOrderByIdDb(id);
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "কর্পোরেট অর্ডার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, order });
  } catch (error: unknown) {
    console.error("Admin corporate GET by id error:", error);
    return NextResponse.json(
      { ok: false, error: "কর্পোরেট অর্ডার লোড করতে সমস্যা হয়েছে।" },
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

    const existing = await prisma.corporateOrder.findFirst({
      where: { OR: [{ id }, { quotationNo: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "কর্পোরেট অর্ডার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const {
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

    const safeItems: Prisma.InputJsonValue = (
      items !== undefined
        ? Array.isArray(items)
          ? items
          : existing.items
        : existing.items
    ) ?? [];
    const computedSubtotal =
      subtotal !== undefined
        ? Number(subtotal) || 0
        : Array.isArray(safeItems)
          ? safeItems.reduce(
              (sum: number, it: { totalPrice?: number }) => sum + (Number(it.totalPrice) || 0),
              0
            )
          : existing.subtotal;
    const branding =
      customBrandingFee !== undefined
        ? Number(customBrandingFee) || 0
        : existing.customBrandingFee;
    const computedTotal =
      totalBudget !== undefined ? Number(totalBudget) || 0 : computedSubtotal + branding;
    const advance =
      advancePaid !== undefined ? Number(advancePaid) || 0 : existing.advancePaid;
    const computedDue =
      dueAmount !== undefined ? Number(dueAmount) || 0 : Math.max(0, computedTotal - advance);

    const updated = await prisma.corporateOrder.update({
      where: { id: existing.id },
      data: {
        companyName:
          companyName !== undefined
            ? String(companyName).trim()
            : existing.companyName,
        contactPerson:
          contactPerson !== undefined
            ? String(contactPerson).trim()
            : existing.contactPerson,
        designation:
          designation !== undefined
            ? String(designation).trim()
            : existing.designation,
        phone: phone !== undefined ? String(phone).trim() : existing.phone,
        email:
          email !== undefined ? String(email).trim().toLowerCase() : existing.email,
        eventType: eventType !== undefined ? eventType : existing.eventType,
        deliveryDate:
          deliveryDate !== undefined ? String(deliveryDate) : existing.deliveryDate,
        deliveryAddress:
          deliveryAddress !== undefined
            ? String(deliveryAddress).trim()
            : existing.deliveryAddress,
        approxQuantityText:
          approxQuantityText !== undefined
            ? String(approxQuantityText).trim()
            : existing.approxQuantityText,
        items: safeItems,
        subtotal: computedSubtotal,
        vatOrTaxPercent:
          vatOrTaxPercent !== undefined
            ? Number(vatOrTaxPercent) || 0
            : existing.vatOrTaxPercent,
        vatOrTaxAmount:
          vatOrTaxAmount !== undefined
            ? Number(vatOrTaxAmount) || 0
            : existing.vatOrTaxAmount,
        customBrandingFee: branding,
        totalBudget: computedTotal,
        advancePaid: advance,
        dueAmount: computedDue,
        paymentTerms:
          paymentTerms !== undefined
            ? String(paymentTerms).trim()
            : existing.paymentTerms,
        status: status !== undefined ? status : existing.status,
        assignedManager:
          assignedManager !== undefined
            ? String(assignedManager).trim()
            : existing.assignedManager,
        customLogoBranding:
          customLogoBranding !== undefined
            ? Boolean(customLogoBranding)
            : existing.customLogoBranding,
        notes:
          notes !== undefined
            ? notes
              ? String(notes).trim()
              : null
            : existing.notes,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `কর্পোরেট অর্ডার "${updated.companyName}" সফলভাবে আপডেট হয়েছে।`,
      order: {
        ...updated,
        notes: updated.notes || undefined,
        createdAt: updated.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: unknown) {
    console.error("Admin corporate PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "কর্পোরেট অর্ডার আপডেট করতে সমস্যা হয়েছে।" },
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
    const existing = await prisma.corporateOrder.findFirst({
      where: { OR: [{ id }, { quotationNo: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "কর্পোরেট অর্ডার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.corporateOrder.delete({ where: { id: existing.id } });

    return NextResponse.json({
      ok: true,
      message: `কর্পোরেট অর্ডার "${existing.companyName}" মুছে ফেলা হয়েছে।`,
    });
  } catch (error: unknown) {
    console.error("Admin corporate DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "কর্পোরেট অর্ডার ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
