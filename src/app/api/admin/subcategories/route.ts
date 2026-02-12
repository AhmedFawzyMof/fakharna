import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";

import {
  createSubcategories,
  deleteSubCategory,
  getAllSubCategories,
} from "@/models/subcategories";
import { getAllCategories } from "@/models/categories";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const search = searchParams.get("search");
  const page = searchParams.get("page");

  const { data: subcategories, error } = await tryCatch(() =>
    getAllSubCategories(Number(page), search, {
      description: true,
      productCount: true,
    }),
  );

  if (error) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const { data, error: categoriesError } = await tryCatch(() =>
    getAllCategories(null, {
      image: false,
      description: false,
      productCount: false,
    }),
  );

  if (categoriesError) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ...subcategories, categories: data },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data: any = { ...body };

  const { data: _, error } = await tryCatch(() =>
    createSubcategories({
      name: data.name,
      nameAr: data.nameAr,
      description: data.description,
      descriptionAr: data.descriptionAr,
      isActive: data.isActive,
      categoryId: data.categoryId,
    }),
  );

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

  if (!idsParam) {
    return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
  }

  const ids = idsParam.map(Number);
  const { data: _, error } = await tryCatch(() => deleteSubCategory(ids));

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
