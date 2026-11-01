import prisma from "@/lib/prisma";
import type {
  CorporateOrder,
  CorporateOrderItem,
  CorporateEventType,
  CorporateOrderStatus,
} from "@/lib/corporateOrderStorage";

function mapPrismaCorporateOrder(row: {
  id: string;
  quotationNo: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  eventType: string;
  deliveryDate: string;
  deliveryAddress: string;
  approxQuantityText: string;
  items: unknown;
  subtotal: number;
  vatOrTaxPercent: number;
  vatOrTaxAmount: number;
  customBrandingFee: number;
  totalBudget: number;
  advancePaid: number;
  dueAmount: number;
  paymentTerms: string;
  status: string;
  assignedManager: string;
  customLogoBranding: boolean;
  notes: string | null;
  createdAt: Date;
}): CorporateOrder {
  return {
    id: row.id,
    quotationNo: row.quotationNo,
    companyName: row.companyName,
    contactPerson: row.contactPerson,
    designation: row.designation || "",
    phone: row.phone,
    email: row.email || "",
    eventType: row.eventType as CorporateEventType,
    deliveryDate: row.deliveryDate || "",
    deliveryAddress: row.deliveryAddress || "",
    approxQuantityText: row.approxQuantityText || "",
    items: Array.isArray(row.items) ? (row.items as CorporateOrderItem[]) : [],
    subtotal: row.subtotal,
    vatOrTaxPercent: row.vatOrTaxPercent,
    vatOrTaxAmount: row.vatOrTaxAmount,
    customBrandingFee: row.customBrandingFee,
    totalBudget: row.totalBudget,
    advancePaid: row.advancePaid,
    dueAmount: row.dueAmount,
    paymentTerms: row.paymentTerms || "",
    status: row.status as CorporateOrderStatus,
    assignedManager: row.assignedManager || "",
    customLogoBranding: Boolean(row.customLogoBranding),
    notes: row.notes || undefined,
    createdAt: row.createdAt.toISOString().split("T")[0],
  };
}

/** No demo seed — empty DB is intentional for B2B */
export async function getAdminCorporateOrders(): Promise<CorporateOrder[]> {
  const rows = await prisma.corporateOrder.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPrismaCorporateOrder);
}

export async function getCorporateOrderByIdDb(
  identifier: string
): Promise<CorporateOrder | null> {
  const row = await prisma.corporateOrder.findFirst({
    where: {
      OR: [{ id: identifier }, { quotationNo: identifier }],
    },
  });
  if (!row) return null;
  return mapPrismaCorporateOrder(row);
}
