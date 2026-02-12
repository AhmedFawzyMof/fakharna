import { db } from "@/db";
import { delivery } from "@/db/schema";
import { and, eq, inArray, desc, like } from "drizzle-orm";

export async function createDelivery(data: typeof delivery.$inferInsert) {
  return await db.insert(delivery).values(data).returning();
}

export async function getAllDeliveries(search: string | null) {
  const conditions: any[] = [];

  if (search) {
    conditions.push(like(delivery.city, `%${search}%`));
  }

  return await db
    .select()
    .from(delivery)
    .where(and(...conditions))
    .orderBy(desc(delivery.id))
    .all();
}

export async function updateDelivery(
  id: number,
  data: Partial<typeof delivery.$inferInsert>,
) {
  return await db
    .update(delivery)
    .set(data)
    .where(eq(delivery.id, id))
    .returning();
}

export async function deleteDeliveries(ids: number[]) {
  return await db.delete(delivery).where(inArray(delivery.id, ids)).returning();
}

export async function getDeliveryByCity(city: string) {
  return await db.select().from(delivery).where(eq(delivery.city, city)).get();
}
