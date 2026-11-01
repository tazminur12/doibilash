import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryView from "@/components/category/CategoryView";
import {
  ALL_TAG,
  CATEGORY_LIST,
  CATEGORY_MAP,
  type CategoryInfo,
} from "@/data/categories";
import { pageMetadata } from "@/lib/site";
import { getCategoryByIdOrSlug } from "@/lib/categoryService";
import { getPublicProducts } from "@/lib/productService";
import { storedProductToCategoryProduct } from "@/lib/catalogMap";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return CATEGORY_LIST.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_MAP[slug];
  if (category) {
    return pageMetadata({
      title: `${category.name} অনলাইন কিনুন — ${category.englishName}`,
      description:
        category.subtitle ||
        `${category.name} (${category.englishName}) — দই বিলাস থেকে খাঁটি পণ্য অনলাইনে অর্ডার করুন, হোম ডেলিভারি সারা বাংলাদেশে।`,
      path: `/category/${category.slug}`,
      image: { url: category.image, alt: category.name },
      keywords: [
        category.name,
        category.englishName,
        "দই বিলাস",
        "অনলাইন অর্ডার",
      ],
    });
  }

  const dbCat = await getCategoryByIdOrSlug(slug).catch(() => null);
  if (dbCat) {
    return pageMetadata({
      title: `${dbCat.nameBn} অনলাইন কিনুন — ${dbCat.name}`,
      description:
        dbCat.subtitle ||
        dbCat.description ||
        `${dbCat.nameBn} — দই বিলাস থেকে অর্ডার করুন।`,
      path: `/category/${dbCat.slug}`,
      image: { url: dbCat.image, alt: dbCat.nameBn },
      keywords: [dbCat.nameBn, dbCat.name, "দই বিলাস"],
    });
  }

  return {};
}

async function resolveCategory(slug: string): Promise<CategoryInfo | null> {
  const dbCat = await getCategoryByIdOrSlug(slug).catch(() => null);
  const products = await getPublicProducts().catch(() => []);

  if (dbCat && dbCat.status === "active") {
    const slugSet = new Set(dbCat.productSlugs || []);
    const matched = products.filter(
      (p) =>
        p.category === dbCat.slug ||
        slugSet.has(p.slug) ||
        p.category === dbCat.id
    );
    const productCards = matched.map(storedProductToCategoryProduct);
    const tags = [
      ALL_TAG,
      ...((dbCat.tags || []).filter((t) => t && t !== ALL_TAG) as string[]),
    ];
    return {
      slug: dbCat.slug,
      name: dbCat.nameBn || dbCat.name,
      englishName: dbCat.name,
      subtitle: dbCat.subtitle || "",
      image: dbCat.image || "/Product/doi.jpg",
      highlights:
        dbCat.highlights?.length > 0
          ? dbCat.highlights
          : ["খাঁটি উপাদান", "প্রিজারভেটিভমুক্ত"],
      tags,
      products: productCards,
    };
  }

  const staticCat = CATEGORY_MAP[slug];
  if (!staticCat) return null;

  // Enrich static category with live products when category slug matches
  const live = products
    .filter((p) => p.category === slug)
    .map(storedProductToCategoryProduct);
  if (live.length > 0) {
    return { ...staticCat, products: live };
  }
  return staticCat;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await resolveCategory(slug);
  if (!category) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "হোম", path: "/" },
          { name: "ক্যাটাগরি", path: "/category" },
          { name: category.name, path: `/category/${category.slug}` },
        ])}
      />
      <CategoryView key={slug} slug={slug} initialCategory={category} />
    </>
  );
}
