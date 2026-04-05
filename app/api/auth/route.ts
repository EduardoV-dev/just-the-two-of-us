import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const UNLOCK_DATE = new Date(
  process.env.NEXT_PUBLIC_UNLOCK_DATE || "2026-04-26T02:00:00.000Z",
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const correctPassword = process.env.ACCESS_PASSWORD;

    if (!correctPassword) {
      console.error("ACCESS_PASSWORD environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Determine redirect destination based on countdown lock state
    const isProduction = process.env.NODE_ENV === "production";
    const isBeforeUnlock = new Date() < UNLOCK_DATE;

    // Parse preview cookie from the raw request headers
    const cookieHeader = request.headers.get("cookie") || "";
    const hasPreviewCookie = cookieHeader
      .split(";")
      .some((c) => c.trim() === "preview=true");

    const redirectTo =
      isProduction && !hasPreviewCookie && isBeforeUnlock
        ? "/countdown"
        : "/home";

    return NextResponse.json({ success: true, redirectTo });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
