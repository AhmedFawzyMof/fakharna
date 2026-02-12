import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import {
  createDelivery,
  getAllDeliveries,
  deleteDeliveries,
} from "@/models/delivery";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const search = searchParams.get("search");

  const { data: deliveriesData, error } = await tryCatch(() =>
    getAllDeliveries(search),
  );
  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(deliveriesData);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await tryCatch(() => createDelivery(body));

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const idsParam = searchParams.getAll("ids[]");

  if (!idsParam || idsParam.length === 0) {
    return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
  }

  const ids = idsParam.map(Number);

  const { error } = await tryCatch(() => deleteDeliveries(ids));

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200 },
  );
}
