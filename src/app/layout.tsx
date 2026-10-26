import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Hind_Siliguri } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartDrawer from "@/components/ui/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { SITE } from "@/lib/site";
import "./globals.css";

const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-anek-bangla",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

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
  formatDetection: { telephone: true, email: true, address: false },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: SITE.url,
    siteName: `${SITE.name} — ${SITE.englishName}`,
    title: defaultTitle,
    description: SITE.description,
    images: [{ ...SITE.ogImage, alt: `${SITE.name} — ${SITE.tagline}` }],
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
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: SITE.name,
  alternateName: SITE.englishName,
  url: SITE.url,
  logo: `${SITE.url}/Logo/logo.png`,
  image: `${SITE.url}${SITE.ogImage.url}`,
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  servesCuisine: "Bengali sweets and dairy",
  priceRange: "৳৳",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  sameAs: [...SITE.socials],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body
        className={`${anekBangla.variable} ${hindSiliguri.variable} font-bengali bg-doibrand-light text-doibrand-dark antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
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
