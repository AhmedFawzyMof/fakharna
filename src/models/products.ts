import { db } from "@/db";
import {
  favorites,
  product_brands,
  product_subcategories,
  products,
  products_category,
} from "@/db/schema";
import { eq, and, like, or, sql, inArray, desc, is } from "drizzle-orm";
import { Session } from "next-auth";

export async function createProduct(data: typeof products.$inferInsert) {
  return await db.insert(products).values(data).returning();
}

export async function getAllProducts(
  page: number,
  search?: string | null,
  categoryId?: number | null,
  brandId?: number | null,
  favFilter?: { session?: Session | null },
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

  conditions.push(eq(products.isActive, true));

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

  const productsQuery = db
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
      isFav: favFilter?.session
        ? sql<boolean>`favorites.id IS NOT NULL`
        : sql<boolean>`false`,
    })
    .from(products);

  if (favFilter?.session) {
    productsQuery.leftJoin(
      favorites,
      and(
        eq(favorites.productId, products.id),
        eq(favorites.userId, Number(favFilter.session?.user.id)),
      ),
    );
  }

  const productsData = await productsQuery
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
    .execute();

  const productCount = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(and(...conditions))
    .get();

  return { products: productsData, count: productCount?.count };
}

export async function getLatestProducts(favFilter?: {
  session?: Session | null;
}) {
  const conditions: any[] = [];

  conditions.push(eq(products.isActive, true));

  const productQuery = db
    .select({
      id: products.id,
      nameAr: products.nameAr,
      category: products_category.nameAr,
      price: products.price,
      type: products.type,
      discountPrice: products.discountPrice,
      imageUrl: products.imageUrl,
      isFav: favFilter?.session
        ? sql<boolean>`favorites.id IS NOT NULL`
        : sql<boolean>`false`,
    })
    .from(products);

  if (favFilter?.session) {
    productQuery.leftJoin(
      favorites,
      and(
        eq(favorites.productId, products.id),
        eq(favorites.userId, Number(favFilter.session?.user.id)),
      ),
    );
  }

  return await productQuery
    .innerJoin(products_category, eq(products.categoryId, products_category.id))
    .where(and(...conditions))
    .orderBy(desc(products.id))
    .limit(12)
    .execute();
}

export async function getProductByCategory(
  category: number,
  page: number = 1,
  subcategory?: number,
  favFilter?: { session?: Session | null },
) {
  const conditions: any[] = [];

  const limit = 20;
  const offset = (page - 1) * limit || 0;

  if (subcategory) {
    conditions.push(eq(products.subcategoryId, subcategory));
  }

  conditions.push(eq(products.categoryId, category));
  conditions.push(eq(products.isActive, true));

  const productQuery = db
    .select({
      id: products.id,
      nameAr: products.nameAr,
      category: products_category.nameAr,
      price: products.price,
      type: products.type,
      discountPrice: products.discountPrice,
      imageUrl: products.imageUrl,
      isFav: favFilter?.session
        ? sql<boolean>`favorites.id IS NOT NULL`
        : sql<boolean>`false`,
    })
    .from(products);

  if (favFilter?.session) {
    productQuery.leftJoin(
      favorites,
      and(
        eq(favorites.productId, products.id),
        eq(favorites.userId, Number(favFilter.session?.user.id)),
      ),
    );
  }

  const productsData = await productQuery
    .innerJoin(products_category, eq(products.categoryId, products_category.id))
    .where(and(...conditions))
    .orderBy(desc(products.id))
    .limit(limit)
    .offset(offset)
    .execute();

  const productCount = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(products)
    .where(and(...conditions))
    .get();

  return { products: productsData, count: productCount?.count };
}

export async function getProductByBrand(
  brand: number,
  page: number = 1,
  favFilter?: { session?: Session | null },
) {
  const conditions: any[] = [];

  const limit = 20;
  const offset = (page - 1) * limit || 0;

  conditions.push(eq(products.brandId, brand));
  conditions.push(eq(products.isActive, true));

  const productQuery = db
    .select({
      id: products.id,
      nameAr: products.nameAr,
      category: products_category.nameAr,
      price: products.price,
      type: products.type,
      discountPrice: products.discountPrice,
      imageUrl: products.imageUrl,
      isFav: favFilter?.session
        ? sql<boolean>`favorites.id IS NOT NULL`
        : sql<boolean>`false`,
    })
    .from(products);

  if (favFilter?.session) {
    productQuery.leftJoin(
      favorites,
      and(
        eq(favorites.productId, products.id),
        eq(favorites.userId, Number(favFilter.session?.user.id)),
      ),
    );
  }

  const productsData = await productQuery
    .innerJoin(products_category, eq(products.categoryId, products_category.id))
    .where(and(...conditions))
    .orderBy(desc(products.id))
    .limit(limit)
    .offset(offset)
    .execute();

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

export async function getFavoriteProducts(session: Session) {
  return await db
    .select({
      product: products,
    })
    .from(favorites)
    .innerJoin(products, eq(favorites.productId, products.id))
    .where(
      and(
        eq(favorites.userId, Number(session.user.id)),
        eq(products.isActive, true),
      ),
    );
}
