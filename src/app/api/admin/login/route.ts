import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { createSession, hashPassword, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }
    const db = await getDb();
    const admins = db.collection("admins");
    const admin = await admins.findOne({ email });
    if (!admin)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    // Compare against hashed password
    const attempt = hashPassword(password);
    if (admin.password !== attempt) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const token = createSession(String(admin._id));
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 1, // 1 hour
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
