import type { MetadataRoute } from "next";
import { CATEGORY_LIST } from "@/data/categories";
import { getAllProductSlugs } from "@/data/products";
import { SITE } from "@/lib/site";
import { getPublicProducts } from "@/lib/productService";
import { getPublicCategories } from "@/lib/categoryService";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/shop", priority: 0.95, changeFrequency: "daily" },
  { path: "/offers", priority: 0.9, changeFrequency: "daily" },
  { path: "/category", priority: 0.85, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.65, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/delivery", priority: 0.55, changeFrequency: "monthly" },
  { path: "/track-order", priority: 0.4, changeFrequency: "monthly" },
  { path: "/return-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  let productSlugs: string[] = [];
  let categorySlugs: string[] = [];

  try {
    const [products, categories] = await Promise.all([
      getPublicProducts(),
      getPublicCategories(),
    ]);
    productSlugs = products.map((p) => p.slug).filter(Boolean);
    categorySlugs = categories.map((c) => c.slug).filter(Boolean);
  } catch {
    productSlugs = getAllProductSlugs();
    categorySlugs = CATEGORY_LIST.map((c) => c.slug);
  }

  if (productSlugs.length === 0) {
    productSlugs = getAllProductSlugs();
  }
  if (categorySlugs.length === 0) {
    categorySlugs = CATEGORY_LIST.map((c) => c.slug);
  }

  // Deduplicate
  productSlugs = [...new Set(productSlugs)];
  categorySlugs = [...new Set(categorySlugs)];

  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE.url}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...categorySlugs.map((slug) => ({
      url: `${SITE.url}/category/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${SITE.url}/products/${slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
  ];
}
