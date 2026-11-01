const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CATEGORIES = [
  {
    id: "cat-1",
    slug: "premium-doi",
    name: "Premium Doi",
    nameBn: "প্রিমিয়াম দই",
    subtitle: "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের মাটির সরার সেরা দই",
    description: "বগুড়ার ঐতিহ্যবাহী সরা ও মাটির হাঁড়ির মিষ্টি এবং টক দই। খাঁটি গাভীর দুধ থেকে প্রাকৃতিক উপায়ে তৈরি।",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515853/doibilash/offers/doi_special.jpg",
    totalProducts: 8,
    highlights: ["মাটির সরায় তৈরি", "খাঁটি গরুর দুধ", "প্রিজারভেটিভমুক্ত", "১০০% প্রাকৃতিক"],
    tags: ["মিষ্টি দই", "টক দই", "ক্ষীরসা দই", "চিনিমুক্ত"],
    productSlugs: ["bogra-special-doi", "shahjadpur-tok-doi", "nawabi-zafrani-kheer-doi", "clay-pot-kheersha-doi", "ghee-mini-cup-doi"],
    isFeatured: true,
    status: "active",
    order: 1,
  },
  {
    id: "cat-2",
    slug: "laddu",
    name: "Laddu",
    nameBn: "ঐতিহ্যবাহী লাড্ডু",
    subtitle: "খাঁটি গাওয়া ঘি ও উন্নতমানের উপাদানে প্রস্তুত মুখরোচক লাড্ডুর সমাহার",
    description: "খাঁটি ঘিয়ে ভাজা মতিচুর ও বেসনের স্পেশাল লাড্ডু। প্রতিটি কামড়ে পাবেন অতুলনীয় স্বাদ ও ঘ্রাণ।",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515856/doibilash/offers/mini_doi.png",
    totalProducts: 8,
    highlights: ["খাঁটি গাওয়া ঘি", "হাতে তৈরি", "প্রিমিয়াম গিফট বক্স", "উৎকৃষ্ট বাদাম"],
    tags: ["গাওয়া ঘি", "মতিচুর", "ড্রাই ফ্রুটস", "ঐতিহ্যবাহী"],
    productSlugs: ["shahi-ghee-motichoor-laddu", "pure-besan-nut-laddu", "almond-cashew-dry-fruit-laddu"],
    isFeatured: true,
    status: "active",
    order: 2,
  },
  {
    id: "cat-3",
    slug: "pure-ghee",
    name: "Pure Ghee",
    nameBn: "খাঁটি গাওয়া ঘি",
    subtitle: "ঘরোয়া প্রক্রিয়ায় প্রস্তুতকৃত দানাদার সুগন্ধি গাওয়া ঘি",
    description: "দেশি গাভীর ননী থেকে বিলোনী পদ্ধতিতে প্রস্তুত যা আপনার খাবারের স্বাদ বাড়াবে শতগুণ।",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515853/doibilash/offers/doi_special.jpg",
    totalProducts: 5,
    highlights: ["১০০% খাঁটি মাখন", "দানাদার টেক্সচার", "প্রাকৃতিক সুবাস"],
    tags: ["দানাদার ঘি", "দেশি গাওয়া ঘি", "অর্গানিক"],
    productSlugs: ["pure-ghee"],
    isFeatured: false,
    status: "active",
    order: 3,
  },
  {
    id: "cat-4",
    slug: "laccha-semai",
    name: "Laccha Semai",
    nameBn: "প্রিমিয়াম লাচ্ছা সেমাই",
    subtitle: "উৎসব ও ঘরোয়া আয়োজনের সেরা পছন্দ, খাঁটি ঘিয়ে ভাজা মুচমুচে লাচ্ছা সেমাই",
    description: "ঘিয়ে ভাজা মচমচে প্রিমিয়াম কোয়ালিটির লাচ্ছা সেমাই। কোনো কৃত্রিম প্রিজারভেটিভ নেই।",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515855/doibilash/offers/laccha_semai.jpg",
    totalProducts: 8,
    highlights: ["ঘিয়ে ভাজা", "মুচমুচে স্বাদ", "উৎসব স্পেশাল", "ফ্যামিলি প্যাক"],
    tags: ["গাওয়া ঘি ভাজা", "জাফরানি", "ড্রাই ফ্রুটস"],
    productSlugs: ["special-ghee-roasted-laccha-semai", "shahi-zafrani-laccha-semai"],
    isFeatured: true,
    status: "active",
    order: 4,
  },
  {
    id: "cat-5",
    slug: "traditional-sweets",
    name: "Traditional Sweets",
    nameBn: "ঐতিহ্যবাহী মিষ্টি",
    subtitle: "রসগোল্লা, চমচম, কালোজাম এবং খাঁটি ছানার সুস্বাদু মিষ্টির সম্ভার",
    description: "রসগোল্লা, চমচম, কালোজাম এবং ছানার মিষ্টির সম্ভার যা বিশেষ কারিগরদের দ্বারা নিপুণভাবে প্রস্তুত।",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515855/doibilash/offers/mango_doi.jpg",
    totalProducts: 14,
    highlights: ["খাঁটি ছানা", "কম মিষ্টি", "দৈনিক ফ্রেশ তৈরি"],
    tags: ["রসগোল্লা", "চমচম", "কালোজাম", "ছানার সন্দেশ"],
    productSlugs: ["traditional-sponge-rosogolla", "bogra-chamcham-sweet"],
    isFeatured: false,
    status: "active",
    order: 5,
  },
];

async function main() {
  console.log("Seeding Categories into Supabase PostgreSQL...");

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameBn: cat.nameBn,
        subtitle: cat.subtitle,
        description: cat.description,
        image: cat.image,
        totalProducts: cat.totalProducts,
        highlights: cat.highlights,
        tags: cat.tags,
        productSlugs: cat.productSlugs,
        isFeatured: cat.isFeatured,
        status: cat.status,
        order: cat.order,
      },
      create: cat,
    });
  }

  const count = await prisma.category.count();
  console.log(`✓ Successfully seeded ${count} Categories in Supabase!`);
}

main()
  .catch((e) => {
    console.error("Failed to seed categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

