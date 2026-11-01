import React from "react";
import { SITE } from "@/lib/site";

/** Absolute URL for schema / OG (handles Cloudinary + local paths). */
export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE.url;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE.url}${path}`;
}

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Organization + online store identity for Google Knowledge / rich results */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore", "FoodEstablishment"],
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: SITE.englishName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/Logo/logo.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl(SITE.ogImage.url),
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: "2024",
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    servesCuisine: ["Bengali", "Dairy", "Sweets"],
    priceRange: "৳৳",
    currenciesAccepted: "BDT",
    paymentAccepted: "Cash, bKash, Nagad, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "customer service",
        areaServed: "BD",
        availableLanguage: ["bn", "en"],
      },
    ],
    sameAs: [...SITE.socials],
  };
}

/** Enables Google sitelinks search box */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.englishName,
    description: SITE.description,
    inLanguage: "bn-BD",
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function productSchema(input: {
  name: string;
  alternateName?: string;
  description: string;
  images: string[];
  slug: string;
  price: number;
  inStock: boolean;
  sku?: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
}) {
  const images = input.images
    .filter((src) => src && !src.endsWith(".svg"))
    .map(absoluteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    ...(input.alternateName ? { alternateName: input.alternateName } : {}),
    description: input.description,
    image: images.length > 0 ? images : [absoluteUrl(SITE.ogImage.url)],
    sku: input.sku || input.slug,
    mpn: input.slug,
    category: input.category,
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${input.slug}`),
      priceCurrency: "BDT",
      price: Number(input.price) || 0,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      availability: input.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
      },
    },
    ...(input.rating && input.reviewsCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.rating,
            reviewCount: input.reviewsCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
