import { db } from "@/db";
import { orders, orderItems, users, products, payments } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export async function getDashboardData() {
  const totals = await db
    .select({
      totalRevenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      totalRevenueLastMonth: sql<number>`
        SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN ${orderItems.price} * ${orderItems.quantity} 
        END)
      `,
      totalOrdersLastMonth: sql<number>`
        COUNT(CASE WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') THEN 1 END)
      `,
      activeUsers: sql<number>`COUNT(DISTINCT ${orders.userId})`,
      activeUsersLastMonth: sql<number>`
        COUNT(DISTINCT CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN ${orders.userId} 
        END)
      `,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .get();

  const total = totals;

  const [latestOrders, topProducts] = await Promise.all([
    db
      .select({
        orderId: orders.id,
        userId: orders.userId,
        totalAmount: payments.amount,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
        totalOrders: sql<number>`COUNT(${orders.id})`,
      })
      .from(orders)
      .innerJoin(payments, eq(orders.id, payments.orderId))
      .orderBy(desc(orders.createdAt))
      .limit(5)
      .execute(),

    db
      .select({
        productId: products.id,
        name: products.name,
        soldQuantity: sql<number>`SUM(${orderItems.quantity})`,
        revenue: sql<number>`SUM(${orderItems.price})`,
      })
      .from(orderItems)
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(sql`${orders.createdAt} >= date('now','-30 day')`)
      .groupBy(products.id)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(5)
      .execute(),
  ]);

  return {
    order: {
      totalRevenue: {
        total_revenue: total?.totalRevenue || 0,
        total_revenue_lastmonth: total?.totalRevenueLastMonth || 0,
      },
      numberOfOrders: {
        total_orders: latestOrders[0].totalOrders || 0,
        total_orders_lastmonth: total?.totalOrdersLastMonth || 0,
      },
    },
    activeCustomers: {
      total_user: total?.activeUsers || 0,
      total_users_lastmonth: total?.activeUsersLastMonth || 0,
    },
    latestOrders,
    topProducts,
  };
}
