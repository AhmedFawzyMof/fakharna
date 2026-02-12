import { db } from "@/db";
import { products, products_category } from "@/db/schema";
import { and, eq, inArray, like, or, sql } from "drizzle-orm";

export async function createCategory(
  data: typeof products_category.$inferInsert,
) {
  return await db.insert(products_category).values(data);
}

export async function getAllCategories(
  search: string | null,
  filters?: {
    image?: boolean;
    description?: boolean;
    productCount?: boolean;
    productCountActive?: boolean;
    onlyActive?: boolean;
  },
) {
  const selectFields: any = {
    id: products_category.id,
    name: products_category.name,
    nameAr: products_category.nameAr,
    isActive: products_category.isActive,
  };

  const conditions: any[] = [];

  if (filters?.image) {
    selectFields.image = products_category.image;
  }

  if (filters?.description) {
    selectFields.description = products_category.description;
    selectFields.descriptionAr = products_category.descriptionAr;
  }

  if (filters?.productCount) {
    selectFields.productCount = sql<number>`count(${products.id})`;
  }

  if (filters?.productCountActive) {
    selectFields.productCount = sql<number>`
    count(case when ${products.isActive} = true then 1 end)
  `;
  }

  if (search) {
    conditions.push(
      or(
        like(products_category.name, `%${search}%`),
        like(products_category.nameAr, `%${search}%`),
      ),
    );
  }

  if (filters?.onlyActive) {
    conditions.push(eq(products_category.isActive, true));
  }

  return db
    .select(selectFields)
    .from(products_category)
    .leftJoin(
      products,
      filters?.productCount || filters?.productCountActive
        ? eq(products.categoryId, products_category.id)
        : sql`false`,
    )
    .where(and(...conditions))
    .groupBy(products_category.id)
    .all();
}

export async function getCategoriesImagesByIds(ids: number[]) {
  return await db
    .select({ image: products_category.image })
    .from(products_category)
    .where(inArray(products_category.id, ids));
}

export async function getCategoryById(categoryId: number) {
  return await db
    .select()
    .from(products_category)
    .where(
      and(
        eq(products_category.id, categoryId),
        eq(products_category.isActive, true),
      ),
    )
    .get();
}

export async function updateCategory(
  id: number,
  data: Partial<typeof products_category.$inferInsert>,
) {
  await db
    .update(products)
    .set({ isActive: data.isActive })
    .where(eq(products.categoryId, id));

  return await db
    .update(products_category)
    .set(data)
    .where(eq(products_category.id, id))
    .returning();
}

export async function deleteCategory(ids: number[]) {
  return await db
    .delete(products_category)
    .where(inArray(products_category.id, ids));
}
