import { tryCatch } from "@/lib/tryCatch";
import {
  deleteOrderProducts,
  getOrderById,
  updateOrder,
} from "@/models/orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 });
  }

  const { data, error } = await tryCatch(() => getOrderById(orderId));

  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await req.json();

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const orderData = {
    id: body.id,
    userId: body.userId,
    status: body.status,
    paymentStatus: body.paymentStatus,
    paymentMethod: body.paymentMethod,
    createdAt: body.createdAt,
  };

  const orderItems = body.items;

  const addressData = {
    id: body.address.id,
    userId: body.address.userId,
    orderId: body.address.orderId,
    fullName: body.address.fullName,
    phone: body.address.phone,
    street: body.address.street,
    city: body.address.city,
    building: body.address.building,
    floor: body.address.floor,
  };

  const payment = {
    id: body.payment.id,
    orderId: body.payment.orderId,
    amount: body.payment.amount,
    method: body.paymentMethod,
    status: body.paymentStatus,
    deliveryCost: body.payment.deliveryCost,
    transactionId: body.payment.transactionId,
    createdAt: body.payment.createdAt,
  };

  const { data: _, error } = await tryCatch(() =>
    updateOrder(Number(id), orderData, orderItems, addressData, payment),
  );

  if (error) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({}, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const queryParams = req.nextUrl.searchParams;
  const orderItemId = queryParams.get("id");

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { data: _, error } = await tryCatch(() =>
    deleteOrderProducts(Number(id), Number(orderItemId)),
  );

  if (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  return NextResponse.json({}, { status: 200 });
}
