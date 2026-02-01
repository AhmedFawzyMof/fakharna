import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  admins,
  products_category,
  products,
  stockMovements,
  orderItems,
  orders,
  addresses,
  payments,
  promoCodeUsages,
  promoCodes,
  users,
} from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Admin = InferSelectModel<typeof admins>;
export type NewAdmin = InferInsertModel<typeof admins>;

export type Category = InferSelectModel<typeof products_category>;
export type NewCategory = InferInsertModel<typeof products_category>;

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type StockMovement = InferSelectModel<typeof stockMovements>;
export type NewStockMovement = InferInsertModel<typeof stockMovements>;

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

export type OrderItem = InferSelectModel<typeof orderItems>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;

export type Address = InferSelectModel<typeof addresses>;
export type NewAddress = InferInsertModel<typeof addresses>;

export type Payment = InferSelectModel<typeof payments>;
export type NewPayment = InferInsertModel<typeof payments>;

export type PromoCode = InferSelectModel<typeof promoCodes>;
export type NewPromoCode = InferInsertModel<typeof promoCodes>;

export type PromoCodeUsage = InferSelectModel<typeof promoCodeUsages>;
export type NewPromoCodeUsage = InferInsertModel<typeof promoCodeUsages>;
