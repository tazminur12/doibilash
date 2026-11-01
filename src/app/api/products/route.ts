import { NextResponse } from "next/server";
import {
  getPublicProducts,
  getTopSellingProducts,
} from "@/lib/productService";

export const dynamic = "force-dynamic";

/** Public catalog — Active products from Supabase (?limit= for top sellers) */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitRaw = searchParams.get("limit");
    const limit = limitRaw ? Number(limitRaw) : null;

    const products =
      limit && Number.isFinite(limit) && limit > 0
        ? await getTopSellingProducts(limit)
        : await getPublicProducts();

    return NextResponse.json({ ok: true, products });
  } catch (error: unknown) {
    console.error("Public products GET error:", error);
    return NextResponse.json(
      { ok: false, error: "পণ্য তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
