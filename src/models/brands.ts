import { db } from "@/db";
import { product_brands, products } from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

export async function createBrand(data: typeof product_brands.$inferInsert) {
  return await db.insert(product_brands).values(data).returning();
}

export async function getAllBrands(
  search: string | null,
  options?: {
    onlyActive?: boolean;
    includeDetails?: boolean;
    productCount?: boolean;
    productCountActive?: boolean;
  },
) {
  const selectFields: any = {
    id: product_brands.id,
    name: product_brands.name,
    nameAr: product_brands.nameAr,
  };

  const conditions: any[] = [];

  if (options?.includeDetails) {
    selectFields.description = product_brands.description;
    selectFields.descriptionAr = product_brands.descriptionAr;
    selectFields.image = product_brands.image;
  }

  if (options?.productCount) {
    selectFields.productCount = sql<number>`count(${products.id})`;
  }

  if (options?.productCountActive) {
    selectFields.productCount = sql<number>`
    count(case when ${products.isActive} = true then 1 end)
  `;
  }

  if (options?.onlyActive) {
    conditions.push(eq(product_brands.isActive, true));
  }

  if (search) {
    conditions.push(eq(product_brands.name, search));
  }

  return db
    .select(selectFields)
    .from(product_brands)
    .leftJoin(
      products,
      options?.productCount || options?.productCountActive
        ? eq(products.brandId, product_brands.id)
        : sql`false`,
    )
    .where(and(...conditions))
    .groupBy(product_brands.id)
    .all();
}

export async function getBrandById(id: number) {
  return db
    .select()
    .from(product_brands)
    .where(and(eq(product_brands.id, id), eq(product_brands.isActive, true)))
    .get();
}

export async function getBrandsImagesByIds(ids: number[]) {
  return db
    .select({
      image: product_brands.image,
    })
    .from(product_brands)
    .where(inArray(product_brands.id, ids));
}

export async function updateBrand(
  id: number,
  data: Partial<typeof product_brands.$inferInsert>,
) {
  await db
    .update(products)
    .set({ isActive: false })
    .where(eq(products.brandId, id));

  return await db
    .update(product_brands)
    .set(data)
    .where(eq(product_brands.id, id))
    .returning();
}

export async function deleteBrand(ids: number[]) {
  return await db
    .delete(product_brands)
    .where(inArray(product_brands.id, ids))
    .returning();
}
