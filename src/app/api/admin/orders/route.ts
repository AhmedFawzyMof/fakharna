import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";

import { deleteOrder, getAllOrders, getOrdersCount } from "@/models/orders";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const search = searchParams.get("search");
  const page = searchParams.get("page");

  if (search && search === "lateset") {
    const { data, error } = await tryCatch(() => getOrdersCount());

    if (error) {
      return NextResponse.json(
        { message: "somthing went wrong" },
        { status: 500 },
      );
    }

    return NextResponse.json({ orders: data });
  }

  const { data: orders, error } = await tryCatch(() =>
    getAllOrders(Number(page), search),
  );

  if (error) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ...orders });
}

export async function POST(req: NextRequest) {
  // const body = await req.json();

  // const data: any = { ...body };

  // console.log(data);

  // const { data: _, error } = await tryCatch(() => createProduct(data));

  // if (error) {
  //   console.log(error);
  //   return NextResponse.json(
  //     { message: "somthing went wrong" },
  //     { status: 500 },
  //   );
  // }

  return NextResponse.json({}, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const idsParam = searchParams.getAll("ids[]");

  if (!idsParam) {
    return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
  }

  const ids = idsParam.map(Number);
  const { data: _, error } = await tryCatch(() => deleteOrder(ids));

  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200 },
  );
}
