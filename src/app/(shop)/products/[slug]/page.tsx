import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/product/ProductDetailView";
import { getProductDetail, getRelatedProducts } from "@/data/products";
import { SITE, pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetail(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.title,
    description: product.description,
    path: `/products/${product.slug}`,
    image: { url: product.images[0], alt: product.title },
  });
}

const absoluteUrl = (src: string) => (src.startsWith("http") ? src : `${SITE.url}${src}`);

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductDetail(slug);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    alternateName: product.englishTitle,
    description: product.description,
    image: product.images.filter((src) => !src.endsWith(".svg")).map(absoluteUrl),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE.name },
    },
    ...(product.rating && product.reviewsCount
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewsCount } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailView key={slug} product={product} related={getRelatedProducts(product)} />
    </>
  );
}
