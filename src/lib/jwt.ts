import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "doibilash-heritage-sweets-secret-key-2026-bogra";

export interface TokenPayload {
  userId: string;
  phone: string;
  email?: string | null;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

