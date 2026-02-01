import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  provider?: string;
  providerId?: string;
}) {
  return await db.insert(users).values(data).returning();
}

export async function getUserById(id: number) {
  return await db.select().from(users).where(eq(users.id, id)).get();
}

export async function getAllUsers() {
  return await db.select().from(users).all();
}

export async function updateUser(
  id: number,
  data: Partial<typeof users.$inferInsert>
) {
  return await db.update(users).set(data).where(eq(users.id, id)).returning();
}

export async function deleteUser(id: number) {
  return await db.delete(users).where(eq(users.id, id));
}
