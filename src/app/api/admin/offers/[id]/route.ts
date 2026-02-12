import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { updateOffer } from "@/models/offers";
import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);

  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await req.json();

  if (body.oldImageUrl) {
    const public_id = getPublicIdFromCloudinaryUrl(body.oldImageUrl);
    if (public_id) await cloudinary.uploader.destroy(public_id);
  }

  const { data: _, error } = await tryCatch(() => updateOffer(id, body));

  if (error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  return NextResponse.json(
    { message: "Updated successfully" },
    { status: 200 },
  );
}
