import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsImagesByIds,
} from "@/models/products";
import { getAllCategories } from "@/models/categories";
import { getAllBrands } from "@/models/brands";
import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const search = searchParams.get("search");
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const page = searchParams.get("page");

  const { data: products, error: productsError } = await tryCatch(() =>
    getAllProducts(Number(page), search, Number(categoryId), Number(brandId)),
  );

  if (productsError) {
    console.log(productsError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const { data: categories, error: categoriesError } = await tryCatch(() =>
    getAllCategories(null, {
      image: false,
      description: false,
      productCount: false,
    }),
  );

  if (categoriesError) {
    console.log(categoriesError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const { data: brands, error: brandsError } = await tryCatch(() =>
    getAllBrands(null, { onlyActive: false, includeDetails: false }),
  );

  if (brandsError) {
    console.log(brandsError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ products, categories, brands });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data: any = { ...body };

  const { data: _, error } = await tryCatch(() => createProduct(data));

  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({}, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const idsParam = searchParams.getAll("ids[]");

  console.log(idsParam);
  if (!idsParam) {
    return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
  }

  const ids = idsParam.map(Number);
  const { data: images, error: imagesError } = await tryCatch(() =>
    getProductsImagesByIds(ids),
  );

  if (imagesError) {
    console.log(imagesError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const publicIds = images
    ?.map((image: any) => image.imageUrl)
    .map(getPublicIdFromCloudinaryUrl)
    .filter((image) => image !== "")
    .filter(Boolean) as string[];

  if (publicIds.length > 0) {
    await cloudinary.api.delete_resources(publicIds);
  }
  const { data: _, error } = await tryCatch(() => deleteProduct(ids));

  if (error) {
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
