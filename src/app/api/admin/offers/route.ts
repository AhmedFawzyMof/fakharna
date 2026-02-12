import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import {
  createOffer,
  getAllOffers,
  deleteOffer,
  getOffersImagesByIds,
} from "@/models/offers";
import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";
import { getAllBrands } from "@/models/brands";
import { getAllCategories } from "@/models/categories";

export async function GET(_req: NextRequest) {
  const { data: offers, error: offersError } = await tryCatch(() =>
    getAllOffers(),
  );

  if (offersError) {
    return NextResponse.json(
      { message: "Something went wrong" },
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
  return NextResponse.json({ offers, brands, categories });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await tryCatch(() => createOffer(body));

  if (error) {
    console.log(error);
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

  const { data: images, error: imagesError } = await tryCatch(() =>
    getOffersImagesByIds(ids),
  );

  if (imagesError)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );

  const publicIds = images!
    .map((item: any) => item.image)
    .map(getPublicIdFromCloudinaryUrl)
    .filter(Boolean) as string[];

  if (publicIds.length > 0) {
    await cloudinary.api.delete_resources(publicIds);
  }

  const { data: _, error } = await tryCatch(() => deleteOffer(ids));

  if (error) {
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
