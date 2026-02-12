import { db } from "@/db"; // Path to your drizzle db initialization
import { delivery } from "@/db/schema";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const deliveryOptions = await db
      .select({
        city: delivery.city,
        cost: delivery.deliveryCost,
      })
      .from(delivery)
      .orderBy(asc(delivery.city));

    return NextResponse.json(deliveryOptions);
  } catch (error) {
    console.error("Error fetching delivery data:", error);
    return NextResponse.json(
      { error: "Failed to fetch delivery options" },
      { status: 500 },
    );
  }
}
