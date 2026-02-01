import { db } from "@/db";
import { stockMovements, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function addStock(
  productId: number,
  change: number,
  reason = "manual"
) {
  await db.insert(stockMovements).values({ productId, change, reason });
  await db.run(
    sql`UPDATE products SET stock_quantity = stock_quantity + ${change} WHERE id = ${productId}`
  );
}

export async function getStockHistory(productId: number) {
  return await db
    .select()
    .from(stockMovements)
    .where(eq(stockMovements.productId, productId))
    .all();
}
