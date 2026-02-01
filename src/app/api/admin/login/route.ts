import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.name, username),
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const admin = await db.query.admins.findFirst({
      where: eq(admins.userId, user.id),
    });

    if (!admin) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: "admin",
        permissions: admin.permissions,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "1d" },
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      admin: {
        permissions: admin.permissions,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!);
  } catch {
    return null;
  }
}
