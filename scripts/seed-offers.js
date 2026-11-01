const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient();

async function uploadToCloudinary(filePath, publicId) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      return null;
    }
    console.log(`Uploading ${filePath} to Cloudinary as ${publicId}...`);
    const result = await cloudinary.uploader.upload(fullPath, {
      folder: "doibilash/offers",
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    console.log(`✓ Uploaded ${publicId}: ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`Failed to upload ${filePath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("=== Starting Cloudinary Asset Upload and Offers Seeding ===");

  // 1. Upload assets to Cloudinary
  const doiUrl = (await uploadToCloudinary("public/Product/doi.jpg", "doi_special")) || "/Product/doi.jpg";
  const semaiUrl = (await uploadToCloudinary("public/Product/laccha_semai.jpg", "laccha_semai")) || "/Product/laccha_semai.jpg";
  const mangoUrl = (await uploadToCloudinary("public/Product/mango.jpg", "mango_doi")) || "/Product/mango.jpg";
  const miniDoiUrl = (await uploadToCloudinary("public/Product/mini_doi.png", "mini_doi")) || "/Product/mini_doi.png";
  const campaignBannerUrl = (await uploadToCloudinary("public/Hero/Hero1.png", "campaign_banner")) || "/Hero/Hero1.png";

  console.log("\nAssets uploaded successfully!");

  // 2. Seed Promo Codes
  console.log("\nSeeding Promo Codes in Supabase...");
  const promos = [
    {
      id: "doi100",
      code: "DOI100",
      discount: "৳ ১০০ ছাড়",
      condition: "ন্যূনতম ১০০০ টাকার অর্ডারে",
      expiry: "৩১ অক্টোবর ২০২৬ পর্যন্ত",
      expiresAt: new Date("2026-10-31T23:59:59+06:00"),
      description: "প্রথম অর্ডারে স্পেশাল ছাড়",
      tag: "নতুন গ্রাহক",
      rule: { type: "flat", amount: 100 },
      minOrder: 1000,
      isActive: true,
      usageCount: 142,
    },
    {
      id: "ghee15",
      code: "GHEE15",
      discount: "১৫% ছাড়",
      condition: "ন্যূনতম ১৫০০ টাকার গাওয়া ঘি অর্ডারে",
      expiry: "২৫ অক্টোবর ২০২৬ পর্যন্ত",
      expiresAt: new Date("2026-10-25T23:59:59+06:00"),
      description: "গাওয়া ঘি ক্যাটাগরির সকল পণ্যে",
      tag: "স্পেশাল",
      rule: { type: "percent", percent: 15, appliesToKeyword: "ঘি" },
      minOrder: 1500,
      isActive: true,
      usageCount: 88,
    },
    {
      id: "festive250",
      code: "FESTIVE250",
      discount: "৳ ২৫০ ছাড়",
      condition: "ন্যূনতম ২৫০০ টাকার কম্বো অর্ডারে",
      expiry: "১৫ নভেম্বর ২০২৬ পর্যন্ত",
      expiresAt: new Date("2026-11-15T23:59:59+06:00"),
      description: "দই, লাড্ডু ও সেমাই কম্বো প্যাকেজে",
      tag: "মেগা সেভার",
      rule: { type: "flat", amount: 250 },
      minOrder: 2500,
      isActive: true,
      usageCount: 64,
    },
    {
      id: "laddu50",
      code: "LADDU50",
      discount: "৳ ৫০ ছাড়",
      condition: "যেকোনো লাড্ডু বক্স ক্রয়ে",
      expiry: "২৮ অক্টোবর ২০২৬ পর্যন্ত",
      expiresAt: new Date("2026-10-28T23:59:59+06:00"),
      description: "শাহী মতিচুর ও বেসন লাড্ডুতে প্রযোজ্য",
      tag: "জনপ্রিয়",
      rule: { type: "flat", amount: 50 },
      requires: { keyword: "লাড্ডু", minQty: 1 },
      isActive: true,
      usageCount: 95,
    },
    {
      id: "freedel",
      code: "FREEDEL",
      discount: "ফ্রি ডেলিভারি",
      condition: "ন্যূনতম ১২০০ টাকার অর্ডারে",
      expiry: "সীমিত সময়ের জন্য",
      description: "ঢাকা ও বগুড়া সিটিতে সম্পূর্ণ ফ্রি ডেলিভারি",
      tag: "ডেলিভারি অফার",
      rule: { type: "freeDelivery", insideDhakaOnly: true },
      minOrder: 1200,
      isActive: true,
      usageCount: 230,
    },
    {
      id: "doi20",
      code: "DOI20",
      discount: "২০% ছাড়",
      condition: "২ কেজি বা তদূর্ধ্ব মাটির সরার দইয়ে",
      expiry: "৩১ অক্টোবর ২০২৬ পর্যন্ত",
      expiresAt: new Date("2026-10-31T23:59:59+06:00"),
      description: "ঐতিহ্যবাহী বগুড়ার স্পেশাল সরার দইয়ে",
      tag: "হট ডিল",
      rule: { type: "percent", percent: 20, appliesToKeyword: "দই" },
      requires: { keyword: "দই", minQty: 2 },
      isActive: true,
      usageCount: 178,
    },
  ];

  for (const p of promos) {
    await prisma.promoCode.upsert({
      where: { code: p.code },
      update: {
        discount: p.discount,
        condition: p.condition,
        expiry: p.expiry,
        expiresAt: p.expiresAt,
        description: p.description,
        tag: p.tag,
        rule: p.rule,
        minOrder: p.minOrder,
        requires: p.requires,
        isActive: p.isActive,
        usageCount: p.usageCount,
      },
      create: p,
    });
  }
  console.log(`✓ Upserted ${promos.length} Promo Codes`);

  // 3. Seed Flash Deals with Cloudinary Image URLs
  console.log("\nSeeding Flash Deals in Supabase with Cloudinary URLs...");
  const flashDeals = [
    {
      id: "flash-1",
      slug: "bogra-special-doi",
      title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
      price: 400,
      originalPrice: 500,
      unit: "১ কেজি মাটির সরা",
      badge: "ফ্ল্যাশ সেল",
      image: doiUrl,
      soldCount: 42,
      totalStock: 50,
      isActive: true,
    },
    {
      id: "flash-2",
      slug: "shahi-ghee-motichoor-laddu",
      title: "শাহী গাওয়া ঘি মতিচুর লাড্ডু",
      price: 510,
      originalPrice: 680,
      unit: "১ কেজি প্রিমিয়াম বক্স",
      badge: "ফ্ল্যাশ সেল",
      image: miniDoiUrl,
      soldCount: 35,
      totalStock: 40,
      isActive: true,
    },
    {
      id: "flash-3",
      slug: "special-ghee-roasted-laccha-semai",
      title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
      price: 360,
      originalPrice: 480,
      unit: "৫০০ গ্রাম বক্স",
      badge: "ফ্ল্যাশ সেল",
      image: semaiUrl,
      soldCount: 28,
      totalStock: 30,
      isActive: true,
    },
    {
      id: "flash-4",
      slug: "sundarban-honey",
      title: "সুন্দরবনের প্রাকৃতিক খাঁটি মধু",
      price: 680,
      originalPrice: 850,
      unit: "৫০০ গ্রাম কাঁচের জার",
      badge: "ফ্ল্যাশ সেল",
      image: mangoUrl,
      soldCount: 19,
      totalStock: 25,
      isActive: true,
    },
    {
      id: "flash-5",
      slug: "pure-ghee",
      title: "খাঁটি দানাদার গাওয়া ঘি",
      price: 1085,
      originalPrice: 1450,
      unit: "৯০০ গ্রাম জার",
      badge: "ফ্ল্যাশ সেল",
      image: doiUrl,
      soldCount: 15,
      totalStock: 20,
      isActive: true,
    },
  ];

  for (const d of flashDeals) {
    await prisma.flashDeal.upsert({
      where: { id: d.id },
      update: {
        slug: d.slug,
        title: d.title,
        price: d.price,
        originalPrice: d.originalPrice,
        unit: d.unit,
        badge: d.badge,
        image: d.image,
        soldCount: d.soldCount,
        totalStock: d.totalStock,
        isActive: d.isActive,
      },
      create: d,
    });
  }
  console.log(`✓ Upserted ${flashDeals.length} Flash Deals with Cloudinary CDN URLs`);

  // 4. Seed Campaign Settings with Cloudinary Banner URL
  console.log("\nSeeding Campaign Settings with Cloudinary Banner...");
  await prisma.campaignSetting.upsert({
    where: { id: "default" },
    update: {
      badge: "মেগা ডিসকাউন্ট উৎসব",
      title: "স্পেশাল",
      highlightText: "ধামাকা অফার",
      description: "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য। সর্বোচ্চ ছাড় ও আকর্ষণীয় ভাউচার কোড উপভোগ করুন।",
      campaignEnd: new Date("2026-11-15T23:59:59+06:00"),
      bannerActive: true,
      announcementText: "অফার চলাকালীন যেকোনো ২টি মিষ্টি আইটেমে বিশেষ উপহার!",
      bannerUrl: campaignBannerUrl,
    },
    create: {
      id: "default",
      badge: "মেগা ডিসকাউন্ট উৎসব",
      title: "স্পেশাল",
      highlightText: "ধামাকা অফার",
      description: "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য। সর্বোচ্চ ছাড় ও আকর্ষণীয় ভাউচার কোড উপভোগ করুন।",
      campaignEnd: new Date("2026-11-15T23:59:59+06:00"),
      bannerActive: true,
      announcementText: "অফার চলাকালীন যেকোনো ২টি মিষ্টি আইটেমে বিশেষ উপহার!",
      bannerUrl: campaignBannerUrl,
    },
  });
  console.log(`✓ Saved Campaign Settings`);

  console.log("\n=== Seeding & Cloudinary Upload Complete! ===");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
