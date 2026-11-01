import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryView from "@/components/category/CategoryView";
import { CATEGORY_LIST, CATEGORY_MAP } from "@/data/categories";
import { pageMetadata } from "@/lib/site";
import { getCategoryByIdOrSlug } from "@/lib/categoryService";

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
      title: `${category.name} (${category.englishName})`,
      description: category.subtitle,
      path: `/category/${category.slug}`,
      image: { url: category.image, alt: category.name },
    });
  }

  const dbCat = await getCategoryByIdOrSlug(slug).catch(() => null);
  if (dbCat) {
    return pageMetadata({
      title: `${dbCat.nameBn} (${dbCat.name})`,
      description: dbCat.subtitle,
      path: `/category/${dbCat.slug}`,
      image: { url: dbCat.image, alt: dbCat.nameBn },
    });
  }

  return {};
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!CATEGORY_MAP[slug]) {
    const dbCat = await getCategoryByIdOrSlug(slug).catch(() => null);
    if (!dbCat) notFound();
  }
  return <CategoryView key={slug} slug={slug} />;
}
