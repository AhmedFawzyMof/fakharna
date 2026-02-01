import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createAdmin(userId: number, permissions = "full") {
  return await db.insert(admins).values({ userId, permissions }).returning();
}

export async function getAllAdmins() {
  return await db.select().from(admins).all();
}

export async function updateAdmin(
  id: number,
  data: Partial<typeof admins.$inferInsert>
) {
  return await db.update(admins).set(data).where(eq(admins.id, id)).returning();
}

export async function deleteAdmin(id: number) {
  return await db.delete(admins).where(eq(admins.id, id));
}
