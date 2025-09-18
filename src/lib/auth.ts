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

export function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export function getSessionToken() {
  return cookies().get(COOKIE_NAME)?.value;
}
