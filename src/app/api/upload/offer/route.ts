import { NextResponse } from "next/server";
import { uploadOfferImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "কোনো ছবি সিলেক্ট করা হয়নি।" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "শুধুমাত্র ছবি (JPG, PNG, WebP, SVG) আপলোড করতে পারবেন।" },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "ছবির সাইজ সর্বোচ্চ ৮ মেগাবাইট (8MB) হতে পারবে।" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload directly to Cloudinary under 'doibilash/offers'
    const uploadResult = await uploadOfferImage(buffer, "doibilash/offers");

    return NextResponse.json({
      ok: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      message: "ছবি সফলভাবে ক্লাউডিনারিতে আপলোড হয়েছে!",
    });
  } catch (error: any) {
    console.error("Offer image upload API error:", error);
    return NextResponse.json(
      { ok: false, error: "ছবি আপলোড ব্যর্থ হয়েছে। ক্লাউডিনারি কনফিগারেশন যাচাই করুন।" },
      { status: 500 }
    );
  }
}

