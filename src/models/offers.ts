import { db } from "@/db";
import { offers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function createOffer(data: typeof offers.$inferInsert) {
  const result = await db.insert(offers).values(data);
  return result;
}

export async function getAllOffers() {
  return db.select().from(offers);
}

export async function getOfferById(id: number) {
  const result = await db.select().from(offers).where(eq(offers.id, id));
  return result[0] || null;
}

export async function updateOffer(
  id: number,
  data: Partial<typeof offers.$inferInsert>,
) {
  const result = await db.update(offers).set(data).where(eq(offers.id, id));
  return result;
}

export async function getOffersImagesByIds(ids: number[]) {
  return db
    .select({ id: offers.id, image: offers.image })
    .from(offers)
    .where(inArray(offers.id, ids));
}

export async function deleteOffer(ids: number | number[]) {
  if (!Array.isArray(ids)) ids = [ids];
  const result = await db.delete(offers).where(inArray(offers.id, ids));
  return result;
}
