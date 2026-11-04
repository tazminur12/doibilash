import { NextResponse } from "next/server";
import { uploadOfferImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "পেমেন্টের স্ক্রিনশট সিলেক্ট করুন।" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "শুধুমাত্র ছবি (JPG, PNG, WebP) আপলোড করা যাবে।" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "স্ক্রিনশটের সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadOfferImage(buffer, "doibilash/payments");

    return NextResponse.json({
      ok: true,
      url: uploadResult.url,
    });
  } catch (error: unknown) {
    console.error("Payment proof upload error:", error);
    return NextResponse.json({ ok: false, error: "পেমেন্ট প্রুফ আপলোড করা যায়নি। আবার চেষ্টা করুন।" }, { status: 500 });
  }
}
