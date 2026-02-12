import { NextResponse } from "next/server";
import {
  createProduct,
  getAllProducts,
  getLatestProducts,
} from "@/models/products";
import { tryCatch } from "@/lib/tryCatch";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latest = searchParams.get("latest");
    const page = searchParams.get("page") || 1;
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    if (!latest) {
      const { data, error } = await tryCatch(() =>
        getAllProducts(Number(page), search, Number(categoryId)),
      );

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch products" },
          { status: 500 },
        );
      }

      return NextResponse.json(data);
    }

    const { data, error } = await tryCatch(() => getLatestProducts());

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
