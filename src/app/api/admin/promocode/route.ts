import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import {
  createPromoCode,
  getAllPromoCodes,
  deletePromoCodes,
} from "@/models/promo_codes";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const search = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;

  const { data: promoCodes, error } = await tryCatch(() =>
    getAllPromoCodes(search, page),
  );

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ promoCodes });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await tryCatch(() => createPromoCode(body));

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

  const { data: _, error } = await tryCatch(() => deletePromoCodes(ids));

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
