import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createOrder(
  data: typeof orders.$inferInsert,
  items: (typeof orderItems.$inferInsert)[]
) {
  const order = await db
    .insert(orders)
    .values(data)
    .returning({ id: orders.id });
  const orderId = order[0].id;

  if (items && items.length > 0) {
    await db.insert(orderItems).values(items.map((i) => ({ ...i, orderId })));
  }

  return order;
}

export async function getOrderById(id: number) {
  const order = await db.select().from(orders).where(eq(orders.id, id)).get();
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))
    .all();
  return { ...order, items };
}

export async function updateOrder(
  id: number,
  data: Partial<typeof orders.$inferInsert>
) {
  return await db.update(orders).set(data).where(eq(orders.id, id)).returning();
}

export async function deleteOrder(id: number) {
  await db.delete(orderItems).where(eq(orderItems.orderId, id));
  return await db.delete(orders).where(eq(orders.id, id));
}
