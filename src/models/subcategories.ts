import { db } from "@/db";
import {
  product_subcategories,
  products,
  products_category,
} from "@/db/schema";
import { eq, and, like, or, sql, inArray } from "drizzle-orm";

export async function createSubcategories(
  data: typeof product_subcategories.$inferInsert,
) {
  return await db.insert(product_subcategories).values(data).returning();
}

export async function getAllSubCategories(
  page: number,
  search: string | null,
  filters?: {
    description?: boolean;
    productCount?: boolean;
    onlyActive?: boolean;
  },
) {
  const selectFields: any = {
    id: product_subcategories.id,
    name: product_subcategories.name,
    nameAr: product_subcategories.nameAr,
    isActive: product_subcategories.isActive,
    category: products_category.nameAr,
  };

  const limit = 20;
  const offset = (page - 1) * limit || 0;
  const conditions: any[] = [];

  if (filters?.description) {
    selectFields.description = product_subcategories.description;
    selectFields.descriptionAr = product_subcategories.descriptionAr;
  }

  if (filters?.productCount) {
    selectFields.productCount = sql<number>`count(${products.id})`;
  }

  if (filters?.onlyActive) {
    conditions.push(eq(product_subcategories.isActive, true));
  }

  if (search) {
    conditions.push(
      or(
        like(product_subcategories.name, `%${search}%`),
        like(product_subcategories.nameAr, `%${search}%`),
        like(product_subcategories.description, `%${search}%`),
        like(product_subcategories.descriptionAr, `%${search}%`),
      ),
    );
  }

  const query = db
    .select(selectFields)
    .from(product_subcategories)
    .innerJoin(
      products_category,
      eq(product_subcategories.categoryId, products_category.id),
    );

  if (filters?.productCount) {
    query.leftJoin(
      products,
      eq(products.subcategoryId, product_subcategories.id),
    );
  }

  const subcategories = await query
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(product_subcategories.id, products_category.nameAr)
    .limit(limit)
    .offset(offset)
    .all();

  const total = await db
    .select({
      count: sql<number>`COUNT(${product_subcategories.id})`,
    })
    .from(product_subcategories)
    .leftJoin(
      products,
      filters?.productCount
        ? eq(products.subcategoryId, product_subcategories.id)
        : sql`false`,
    )
    .innerJoin(products_category, eq(products.categoryId, products_category.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(product_subcategories.id)
    .get();

  return {
    subcategories,
    count: total?.count || 0,
  };
}

export async function getSubcategoryById(id: number) {
  const result = await db
    .select()
    .from(product_subcategories)
    .where(eq(product_subcategories.id, id))
    .get();
  return result || null;
}

export async function getSubcategoryByCategory(category: number) {
  return await db
    .select({
      id: product_subcategories.id,
      name: product_subcategories.name,
      nameAr: product_subcategories.nameAr,
      productCount: sql<number>`count(case when ${products.isActive} = true then 1 end)`,
    })
    .from(product_subcategories)
    .innerJoin(products, eq(products.subcategoryId, product_subcategories.id))
    .where(
      and(
        eq(product_subcategories.categoryId, category),
        eq(products.categoryId, category),
        eq(products.isActive, true),
      ),
    );
}

export async function updateSubCategory(
  id: number,
  data: Partial<typeof product_subcategories.$inferInsert>,
) {
  await db
    .update(products)
    .set({ isActive: data.isActive })
    .where(eq(products.subcategoryId, id));

  return await db
    .update(product_subcategories)
    .set(data)
    .where(eq(product_subcategories.id, id))
    .returning();
}

export async function deleteSubCategory(ids: number[]) {
  return await db
    .delete(product_subcategories)
    .where(inArray(product_subcategories.id, ids))
    .returning();
}
