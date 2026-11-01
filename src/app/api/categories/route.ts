import { NextResponse } from "next/server";
import { getPublicCategories } from "@/lib/categoryService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getPublicCategories();
    return NextResponse.json({ ok: true, categories });
  } catch (error: any) {
    console.error("Public categories GET error:", error);
    return NextResponse.json(
      { ok: false, error: "ক্যাটাগরি তথ্য লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

