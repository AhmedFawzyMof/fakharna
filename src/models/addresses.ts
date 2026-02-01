import { db } from "@/db";
import { addresses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createAddress(data: typeof addresses.$inferInsert) {
  return await db.insert(addresses).values(data).returning();
}

export async function getUserAddresses(userId: number) {
  return await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .all();
}

export async function updateAddress(
  id: number,
  data: Partial<typeof addresses.$inferInsert>
) {
  return await db
    .update(addresses)
    .set(data)
    .where(eq(addresses.id, id))
    .returning();
}

export async function deleteAddress(id: number) {
  return await db.delete(addresses).where(eq(addresses.id, id));
}
