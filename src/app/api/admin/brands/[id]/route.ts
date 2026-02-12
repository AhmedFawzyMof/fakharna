import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";
import { tryCatch } from "@/lib/tryCatch";
import { updateBrand } from "@/models/brands";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await req.json();

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (body.oldImageUrl !== "") {
    const public_id = getPublicIdFromCloudinaryUrl(body.oldImageUrl);

    if (!public_id) {
      return NextResponse.json(
        { error: "publicId is required" },
        { status: 400 },
      );
    }

    await cloudinary.uploader.destroy(public_id);
  }

  const { data, error } = await tryCatch(() => updateBrand(Number(id), body));

  if (error) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({}, { status: 201 });
}
