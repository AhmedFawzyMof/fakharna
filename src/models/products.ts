import { db } from "@/db";
import {
  product_brands,
  product_subcategories,
  products,
  products_category,
} from "@/db/schema";
import { eq, and, like, or, sql, inArray, desc } from "drizzle-orm";

export async function createProduct(data: typeof products.$inferInsert) {
  return await db.insert(products).values(data).returning();
}

export async function getAllProducts(
  page: number,
  search?: string | null,
  categoryId?: number | null,
  brandId?: number | null,
) {
  const limit = 20;
  const offset = (page - 1) * limit || 0;
  const conditions: any[] = [];

  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId));
  }

  if (brandId) {
    conditions.push(eq(products.brandId, brandId));
  }

  if (search) {
    if (!isNaN(Number(search))) {
      conditions.push(eq(products.price, Number(search)));
    } else {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.nameAr, `%${search}%`),
          like(products.description, `%${search}%`),
          like(products.descriptionAr, `%${search}%`),
        ),
      );
    }
  }

  const productsData = await db
    .select({
      id: products.id,
      name: products.name,
      nameAr: products.nameAr,
      description: products.description,
      descriptionAr: products.descriptionAr,
      imageUrl: products.imageUrl,
      images: products.images,
      price: products.price,
      discountPrice: products.discountPrice,
      category: products_category.name,
      categoryAr: products_category.nameAr,
      categoryId: products.categoryId,
      type: products.type,
      brand: product_brands.name,
      brandAr: product_brands.nameAr,
      brandId: products.brandId,
      subcategory: product_subcategories.name,
      subcategoryAr: product_subcategories.nameAr,
      subcategoryId: products.subcategoryId,
      stockQuantity: products.stockQuantity,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .innerJoin(products_category, eq(products.categoryId, products_category.id))
    .leftJoin(
      product_subcategories,
      eq(products.subcategoryId, product_subcategories.id),
    )
    .leftJoin(product_brands, eq(products.brandId, product_brands.id))
    .where(and(...conditions))
    .orderBy(desc(products.id))
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
      nameAr: products.nameAr,
      category: products_category.nameAr,
      price: products.price,
      discountPrice: products.discountPrice,
      imageUrl: products.imageUrl,
    })
    .from(products)
    .innerJoin(products_category, eq(products.categoryId, products_category.id))
    .orderBy(desc(products.id))
    .where(eq(products.isActive, true))
    .limit(12);
}

export async function getProductByCategory(
  category: number,
  subcategory?: number,
  page: number = 1,
) {
  const conditions: any[] = [];

  const limit = 20;
  const offset = (page - 1) * limit || 0;

  if (subcategory) {
    conditions.push(eq(products.subcategoryId, subcategory));
  }

  conditions.push(eq(products.categoryId, category));
  conditions.push(eq(products.isActive, false));

  const productsData = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);

  const productCount = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(and(...conditions))
    .get();

  return { products: productsData, count: productCount?.count };
}

export async function getProductByBrand(brand: number, page: number = 1) {
  const conditions: any[] = [];

  const limit = 20;
  const offset = (page - 1) * limit || 0;

  conditions.push(eq(products.brandId, brand));
  conditions.push(eq(products.isActive, false));

  const productsData = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);

  const productCount = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(and(...conditions))
    .get();

  return { products: productsData, count: productCount?.count };
}

export async function getProductsImagesByIds(ids: number[]) {
  return await db
    .select({ imageUrl: products.imageUrl })
    .from(products)
    .where(inArray(products.id, ids));
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

export async function deleteProduct(ids: number[]) {
  return await db.delete(products).where(inArray(products.id, ids));
}
