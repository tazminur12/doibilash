import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/jwtEdge";

const JWT_SECRET =
  process.env.JWT_SECRET || "doibilash-heritage-sweets-secret-key-2026-bogra";

function isProtectedAdminPath(pathname: string): boolean {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  if (pathname.startsWith("/api/admin")) return true;

  // Legacy admin routes outside /admin (same (admin) layout group)
  const bareExact = new Set([
    "/orders",
    "/products",
    "/categories",
    "/customers",
    "/settings",
    "/team",
    "/corporate",
    "/packages",
  ]);
  if (bareExact.has(pathname)) return true;

  const barePrefixes = [
    "/orders/",
    "/categories/",
    "/customers/",
    "/settings/",
    "/team/",
    "/corporate/",
    "/packages/",
    "/products/new",
  ];
  return barePrefixes.some((p) => pathname === p || pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("doibilash_session")?.value;
  const payload = token ? await verifyTokenEdge(token, JWT_SECRET) : null;
  const isAdmin = Boolean(payload && payload.role === "ADMIN" && payload.userId);

  if (isAdmin) {
    return NextResponse.next();
  }

  // API: JSON 401 (do not redirect browsers following fetch)
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      {
        ok: false,
        error: "অনুমোদিত নয়। অ্যাডমিন হিসেবে লগইন করুন।",
        needsLogin: true,
      },
      { status: 401 }
    );
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  loginUrl.searchParams.set("reason", "admin");
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/orders",
    "/orders/:path*",
    "/categories",
    "/categories/:path*",
    "/customers",
    "/customers/:path*",
    "/settings",
    "/settings/:path*",
    "/team",
    "/team/:path*",
    "/corporate",
    "/corporate/:path*",
    "/packages",
    "/packages/:path*",
    "/products",
    "/products/new",
  ],
};
