import { NextResponse } from "next/server";
import { createOrder } from "@/models/orders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderData, orderItems } = body;
    if (!orderData) {
      return NextResponse.json(
        { error: "Order data is required" },
        { status: 400 }
      );
    }
    const order = await createOrder(orderData, orderItems);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
