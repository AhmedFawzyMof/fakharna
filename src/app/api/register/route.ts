import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { tryCatch } from "@/lib/tryCatch";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const { data: existing, error } = await tryCatch(() =>
    db.query.users.findFirst({
      where: eq(users.email, email),
    }),
  );

  if (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }

  if (existing) {
    return Response.json({ error: "Email already exists" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: passwordHash,
    provider: "credentials",
  });

  return Response.json({ success: true });
}
