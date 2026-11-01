import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/orders",
          "/orders/",
          "/categories",
          "/categories/",
          "/customers",
          "/customers/",
          "/settings",
          "/settings/",
          "/team",
          "/team/",
          "/corporate",
          "/corporate/",
          "/packages",
          "/packages/",
          "/checkout",
          "/checkout/",
          "/profile",
          "/profile/",
          "/login",
          "/register",
          "/signup",
          "/accept-invite",
          "/reset-password",
          "/search",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/checkout/",
          "/profile/",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
