/** Edge-safe HS256 JWT verify (for proxy / middleware). Node `jsonwebtoken` is not Edge-compatible. */

export type EdgeTokenPayload = {
  userId: string;
  phone: string;
  email?: string | null;
  role: string;
  exp?: number;
  iat?: number;
};

function b64urlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToB64url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function verifyTokenEdge(
  token: string,
  secret: string
): Promise<EdgeTokenPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const expected = await crypto.subtle.sign("HMAC", key, data);
    if (bytesToB64url(expected) !== signatureB64) return null;

    const json = new TextDecoder().decode(b64urlToBytes(payloadB64));
    const payload = JSON.parse(json) as EdgeTokenPayload;
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    if (!payload.userId || !payload.role) return null;
    return payload;
  } catch {
    return null;
  }
}
