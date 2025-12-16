import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "./env";

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Sign a JWT token for a user
 */
export function signToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "30d" });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract user ID from request headers (Bearer token or user-id header)
 */
export function getUserIdFromReq(req: {
  headers: Record<string, string | undefined>;
}): string | undefined {
  // Try Bearer token first
  const auth =
    req.headers["authorization"] || req.headers["Authorization"];
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.slice(7);
    const payload = verifyToken(token);
    if (payload?.userId) return payload.userId;
  }

  // Fallback to user-id header (for legacy support)
  const uid = req.headers["user-id"];
  return typeof uid === "string" ? uid : undefined;
}

