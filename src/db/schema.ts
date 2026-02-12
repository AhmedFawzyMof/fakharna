import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  provider: text("provider").default("credentials"),
  providerId: text("provider_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  permissions: text("permissions").default("full"),
});

export const products_category = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  nameAr: text("name_ar").notNull().unique(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  image: text("image"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const product_subcategories = sqliteTable("subcategories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => products_category.id),
  name: text("name"),
  nameAr: text("name_ar").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const product_brands = sqliteTable("brands", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  nameAr: text("name_ar").notNull().unique(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  image: text("image"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  nameAr: text("name_ar").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  imageUrl: text("image_url"),
  images: text("images", { mode: "json" }),
  price: real("price").notNull(),
  discountPrice: real("discount_price"),
  categoryId: integer("category_id").references(() => products_category.id),
  brandId: integer("brand_id").references(() => product_brands.id),
  subcategoryId: integer("subcategory_id").references(
    () => product_subcategories.id,
  ),
  stockQuantity: integer("stock_quantity").default(0),
  type: text("type").default("unit"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const stockMovements = sqliteTable("stock_movements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id),
  change: integer("change").notNull(),
  reason: text("reason").default("manual"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  status: text("status").default("pending"),
  paymentStatus: text("payment_status").default("unpaid"),
  paymentMethod: text("payment_method"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const addresses = sqliteTable("addresses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  orderId: integer("order_id").references(() => orders.id),
  fullName: text("full_name"),
  phone: text("phone").notNull(),
  street: text("street"),
  city: text("city"),
  building: text("building"),
  floor: text("floor"),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.id),
  amount: real("amount").notNull(),
  method: text("method").notNull().default("cash"),
  status: text("status").default("pending"),
  deliveryCost: real("delivery_cost"),
  transactionId: text("transaction_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const promoCodes = sqliteTable("promo_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(),
  discountValue: real("discount_value").notNull(),
  maxUses: integer("max_uses"),
  expiresAt: text("expires_at"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const promoCodeUsages = sqliteTable("promo_code_usages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  promoCodeId: integer("promo_code_id")
    .notNull()
    .references(() => promoCodes.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  orderId: integer("order_id").references(() => orders.id),
  usedAt: text("used_at").default(sql`CURRENT_TIMESTAMP`),
});

export const offers = sqliteTable("offers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  image: text("image"),
  productId: integer("product_id").references(() => products.id),
  categoryId: integer("category_id").references(() => products_category.id),
  brandId: integer("brand_id").references(() => product_brands.id),
});

export const delivery = sqliteTable("delivery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  city: text("city"),
  deliveryCost: real("delivery_cost"),
});

export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
});
