import { NextResponse } from "next/server";
import { createOrder } from "@/models/orders";
import { tryCatch } from "@/lib/tryCatch";
import { createAddress } from "@/models/addresses";
import { createPayment } from "@/models/payments";

export async function POST(req: Request) {
  const body = await req.json();

  const { items, address, deliveryCost, total } = body;

  const orderData = {
    paymentStatus: "unpaid",
    paymentMethod: "cash",
  };

  const { data: order, error: orderError } = await tryCatch(() =>
    createOrder(orderData, items),
  );

  if (orderError) {
    return NextResponse.json(
      { message: "Internal Server Error", error: String(orderError) },
      { status: 500 },
    );
  }

  if (!order) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }

  const addressData = {
    orderId: order!.id,
    fullName: address.fullName,
    phone: address.phone,
    street: address.street,
    city: address.city,
    building: address.building,
    floor: address.floor,
  };

  const { data: __, error: addressError } = await tryCatch(() =>
    createAddress(addressData),
  );

  if (addressError) {
    return NextResponse.json(
      { message: "Internal Server Error", error: String(addressError) },
      { status: 500 },
    );
  }

  const paymentData = {
    orderId: order!.id,
    amount: total,
    method: "cash",
    status: "pending",
    deliveryCost: deliveryCost,
  };

  const { data: _, error: paymentError } = await tryCatch(() =>
    createPayment(paymentData),
  );

  if (paymentError) {
    return NextResponse.json(
      { message: "Internal Server Error", error: String(paymentError) },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Order created successfully" },
    { status: 201 },
  );
}
