export type CheckoutPayMethod = "bkash" | "nagad";

export interface CheckoutDraftItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
}

export interface CheckoutDraft {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  deliveryArea: "inside" | "outside";
  notes: string;
  items: CheckoutDraftItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: CheckoutPayMethod;
  promoCode?: string;
}

const KEY = "doibilash_checkout_payment_draft_v1";

export function saveCheckoutDraft(draft: CheckoutDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(draft));
}

export function readCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as CheckoutDraft;
    if (draft.paymentMethod !== "bkash" && draft.paymentMethod !== "nagad") return null;
    if (!draft.customerName || !draft.customerPhone || !Array.isArray(draft.items) || draft.items.length === 0) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function clearCheckoutDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
