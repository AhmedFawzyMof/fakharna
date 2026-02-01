import { db } from "@/db";
import { products, products_category } from "@/db/schema";
import { eq, and, like, or, sql } from "drizzle-orm";

export async function createProduct(data: typeof products.$inferInsert) {
  return await db.insert(products).values(data).returning();
}

export async function getAllProducts(
  limit: number = 10,
  offset: number = 0,
  categoryId?: number,
  search?: string,
) {
  const conditions: any[] = [];

  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId));
  }

  if (search) {
    if (!isNaN(Number(search))) {
      conditions.push(eq(products.price, Number(search)));
    } else {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`),
        ),
      );
    }
  }

  const productsData = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .all();

  const productCount = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(and(...conditions))
    .get();

  return { products: productsData, count: productCount?.count };
}

export async function getLatestProducts() {
  return await db
    .select({
      id: products.id,
      name: products.name,
      category: products_category.name,
      slug: products.slug,
      price: products.price,
      discountPrice: products.discountPrice,
      imageUrl: products.imageUrl,
    })
    .from(products)
    .innerJoin(products_category, eq(products.categoryId, products_category.id))
    .orderBy(sql`${products.id} DESC`)
    .where(eq(products.isActive, true))
    .limit(4);
}

export async function getProductBySlug(slug: string) {
  return await db.select().from(products).where(eq(products.slug, slug)).get();
}

export async function getProductByCategory(category: number) {
  return await db
    .select()
    .from(products)
    .where(eq(products.categoryId, category));
}

export async function updateProduct(
  id: number,
  data: Partial<typeof products.$inferInsert>,
) {
  return await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
}

export async function deleteProduct(id: number) {
  return await db.delete(products).where(eq(products.id, id));
}
