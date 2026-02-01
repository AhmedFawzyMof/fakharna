import { NextResponse } from "next/server";
import {
  createProduct,
  getAllProducts,
  getLatestProducts,
} from "@/models/products";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latest = searchParams.get("latest");
    const page = searchParams.get("page");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const limit = 24;
    let offset = 0;

    if (Number(page) > 1) {
      offset = limit / (Number(page) - 1);
    }

    let data;

    if (latest) {
      data = await getLatestProducts();
    } else {
      data = await getAllProducts(
        limit,
        offset ? Number(offset) : undefined,
        categoryId ? Number(categoryId) : undefined,
        search ? search : undefined,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
