import { NextResponse } from "next/server";
import { createUserOrder } from "@/models/orders";
import { getAuthSession } from "@/lib/auth-session";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      address,
      paymentMethod,
      items,
      promoCodeId,
      totalAmount,
      deliveryCost,
    } = body;

    // 1. Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // 2. Format data for the model
    // We pass the userId from the session to ensure security
    const orderPayload = {
      order: {
        userId: parseInt(session.user.id), // Ensure this matches your ID type
        paymentMethod: paymentMethod,
        status: "pending",
        paymentStatus: paymentMethod === "cash" ? "unpaid" : "paid",
      },
      items: items, // Array of { productId, quantity, price }
      address: {
        ...address,
        userId: parseInt(session.user.id),
      },
      payment: {
        amount: totalAmount,
        method: paymentMethod,
        deliveryCost: deliveryCost,
      },
      promoCodeId: promoCodeId, // This is the string code or ID from frontend
    };

    const result = await createUserOrder(orderPayload);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}
