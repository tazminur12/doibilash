import type { ProductItem } from "@/components/ui/ProductCard";
import type { CategoryProduct } from "@/data/categories";
import type { ProductDetail } from "@/data/products";
import type { StoredProduct } from "@/lib/productStorage";

export function formatTakaLabel(n: number): string {
  return `৳ ${n.toLocaleString("en-US")}`;
}

/** Map DB product → ProductCard item */
export function storedProductToCardItem(p: StoredProduct): ProductItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: formatTakaLabel(p.price),
    originalPrice: p.originalPrice ? formatTakaLabel(p.originalPrice) : undefined,
    image: p.image || "/Product/placeholder.svg",
    badge: p.badge,
    unit: p.unit,
  };
}

/** Map DB product → category grid product */
export function storedProductToCategoryProduct(p: StoredProduct): CategoryProduct {
  return {
    ...storedProductToCardItem(p),
    numericPrice: p.price,
    tag: undefined,
  };
}

/** Map DB product → product detail page shape */
export function storedProductToDetail(p: StoredProduct): ProductDetail {
  const gallery = Array.isArray(p.galleryImages) ? p.galleryImages.filter(Boolean) : [];
  const images = [p.image, ...gallery].filter(
    (img, i, arr) => Boolean(img) && arr.indexOf(img) === i
  );
  return {
    slug: p.slug,
    title: p.name,
    englishTitle: p.nameEn || p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? p.price,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    inStock: p.stockStatus !== "Out of Stock",
    unit: p.unit,
    description: p.description || "",
    features: Array.isArray(p.features) ? p.features : [],
    images: images.length > 0 ? images : ["/Product/placeholder.svg"],
    categorySlug: p.category,
  };
}

export function relatedFromProducts(
  current: StoredProduct,
  all: StoredProduct[],
  limit = 4
): CategoryProduct[] {
  return all
    .filter((p) => p.slug !== current.slug && p.category === current.category)
    .slice(0, limit)
    .map(storedProductToCategoryProduct);
}
