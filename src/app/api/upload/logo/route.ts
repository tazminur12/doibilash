import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "কোনো ফাইল সিলেক্ট করা হয়নি।" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "শুধুমাত্র ছবি (JPG, PNG, WebP, SVG) আপলোড করতে পারবেন।" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "লোগোর সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary under brand assets folder
    const uploadResult = await uploadImageBuffer(buffer, "doibilash/brand");

    return NextResponse.json({
      ok: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      message: "লোগো সফলভাবে ক্লাউডিনারিতে আপলোড হয়েছে!",
    });
  } catch (error: any) {
    console.error("Logo upload API error:", error);
    return NextResponse.json(
      { ok: false, error: "লোগো আপলোড ব্যর্থ হয়েছে। ক্লাউডিনারি কনফিগারেশন যাচাই করুন।" },
      { status: 500 }
    );
  }
}

