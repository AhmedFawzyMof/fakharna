// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ALLOWED_ORIGIN = "https://admin-app-tjbd.vercel.app";
const PUBLIC_ROUTES = ["/api/admin/login"];

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS") {
    return withCors(new NextResponse(null, { status: 204 }));
  }

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return withCors(NextResponse.next());
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return withCors(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    );
  }

  try {
    jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return withCors(NextResponse.next());
  } catch {
    return withCors(
      NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    );
  }
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
