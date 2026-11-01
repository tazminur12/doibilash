import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartDrawer from "@/components/ui/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { SITE } from "@/lib/site";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/seo";
import "@/styles/fonts.css";
import "./globals.css";

const defaultTitle = `${SITE.name} | ${SITE.tagline} — ${SITE.englishName}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.englishName,
  authors: [{ name: SITE.englishName, url: SITE.url }],
  creator: SITE.englishName,
  publisher: SITE.englishName,
  category: "food",
  classification: "E-commerce, Food & Grocery, Bengali Sweets",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, email: true, address: false },
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: SITE.url,
    siteName: `${SITE.name} — ${SITE.englishName}`,
    title: defaultTitle,
    description: SITE.description,
    images: [
      {
        ...SITE.ogImage,
        alt: `${SITE.name} — ${SITE.tagline}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE.description,
    images: [SITE.ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
  },
  other: {
    "geo.region": "BD-13",
    "geo.placename": "Dhaka",
    "content-language": "bn",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE.themeColor },
    { media: "(prefers-color-scheme: dark)", color: SITE.themeColor },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="font-bengali bg-doibrand-light text-doibrand-dark antialiased min-h-screen flex flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <CartProvider>
          <Header />
          <div className="flex-1 pb-16 md:pb-0">{children}</div>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
