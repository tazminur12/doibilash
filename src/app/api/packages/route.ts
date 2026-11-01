import { NextResponse } from "next/server";
import { getPublicPackages } from "@/lib/packageService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const packages = await getPublicPackages();
    return NextResponse.json({ ok: true, packages });
  } catch (error: any) {
    console.error("Public packages GET error:", error);
    return NextResponse.json(
      { ok: false, error: "উপহার প্যাকেজ লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

