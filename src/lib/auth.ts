import { cookies } from "next/headers";
import crypto from "crypto";

export const COOKIE_NAME = "admin_session";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

export function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(password + SECRET)
    .digest("hex");
}

export function createSession(userId: string) {
  const token = crypto
    .createHmac("sha256", SECRET)
    .update(userId + Date.now())
    .digest("hex");
  // Return token; set cookie in the route response for reliability
  return token;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}
