import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "amore_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) env var must be set to use the admin panel.",
    );
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  return safeEqual(password, expected);
}

export async function createAdminSession(): Promise<void> {
  const payload = `admin:${Date.now()}`;
  const signature = sign(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const separatorIndex = raw.lastIndexOf(".");
  if (separatorIndex === -1) return false;

  const payload = raw.slice(0, separatorIndex);
  const signature = raw.slice(separatorIndex + 1);

  const [, timestampRaw] = payload.split(":");
  const timestamp = Number(timestampRaw);
  if (!timestamp || Date.now() - timestamp > SESSION_TTL_SECONDS * 1000) {
    return false;
  }

  try {
    return safeEqual(signature, sign(payload));
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}
