import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createPayment(data: typeof payments.$inferInsert) {
  return await db.insert(payments).values(data).returning();
}

export async function getPaymentsByOrder(orderId: number) {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .all();
}

export async function updatePayment(
  id: number,
  data: Partial<typeof payments.$inferInsert>
) {
  return await db
    .update(payments)
    .set(data)
    .where(eq(payments.id, id))
    .returning();
}

export async function deletePayment(id: number) {
  return await db.delete(payments).where(eq(payments.id, id));
}
