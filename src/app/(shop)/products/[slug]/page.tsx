import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/product/ProductDetailView";
import {
  getProductByIdOrSlugDb,
  getPublicProducts,
} from "@/lib/productService";
import {
  relatedFromProducts,
  storedProductToDetail,
} from "@/lib/catalogMap";
import { getProductDetail, getRelatedProducts } from "@/data/products";
import { pageMetadata } from "@/lib/site";
import {
  JsonLd,
  breadcrumbSchema,
  productSchema,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dbProduct = await getProductByIdOrSlugDb(slug, {
    activeOnly: true,
  }).catch(() => null);
  const product = dbProduct
    ? storedProductToDetail(dbProduct)
    : getProductDetail(slug);
  if (!product) return { robots: { index: false, follow: false } };

  const desc =
    product.description?.slice(0, 155) ||
    `${product.title} — দই বিলাস থেকে অনলাইনে অর্ডার করুন। খাঁটি উপাদান, হোম ডেলিভারি।`;

  return pageMetadata({
    title: `${product.title}${product.englishTitle ? ` (${product.englishTitle})` : ""}`,
    description: desc,
    path: `/products/${product.slug}`,
    image: {
      url: product.images[0],
      alt: product.title,
    },
    keywords: [
      product.title,
      product.englishTitle,
      "দই বিলাস",
      "অনলাইন অর্ডার",
      "হোম ডেলিভারি",
    ].filter(Boolean) as string[],
  });
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbProduct = await getProductByIdOrSlugDb(slug, {
    activeOnly: true,
  }).catch(() => null);

  const product = dbProduct
    ? storedProductToDetail(dbProduct)
    : getProductDetail(slug);

  if (!product) notFound();

  const allProducts = dbProduct
    ? await getPublicProducts().catch(() => [])
    : [];
  const related = dbProduct
    ? relatedFromProducts(dbProduct, allProducts)
    : getRelatedProducts(product);

  return (
    <>
      <JsonLd
        data={[
          productSchema({
            name: product.title,
            alternateName: product.englishTitle,
            description: product.description,
            images: product.images,
            slug: product.slug,
            price: product.price,
            inStock: product.inStock,
            category: product.categorySlug,
            rating: product.rating,
            reviewsCount: product.reviewsCount,
          }),
          breadcrumbSchema([
            { name: "হোম", path: "/" },
            { name: "সব পণ্য", path: "/shop" },
            {
              name: product.title,
              path: `/products/${product.slug}`,
            },
          ]),
        ]}
      />
      <ProductDetailView key={slug} product={product} related={related} />
    </>
  );
}
