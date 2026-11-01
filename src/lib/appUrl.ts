import { SITE } from "@/lib/site";

/**
 * Canonical public site origin for emails & invite/reset links.
 * Prefer NEXT_PUBLIC_APP_URL so production never falls back to localhost
 * when an API is hit from local/dev or a misconfigured proxy.
 */
export function getAppBaseUrl(req?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (req) {
    try {
      const origin = new URL(req.url).origin;
      if (origin && !/localhost|127\.0\.0\.1/i.test(origin)) {
        return origin;
      }
    } catch {
      /* ignore */
    }
  }

  return SITE.url.replace(/\/$/, "");
}
