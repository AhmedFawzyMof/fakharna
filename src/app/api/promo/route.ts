import { NextResponse } from "next/server";
import { db } from "@/db";
import { promoCodes, promoCodeUsages } from "@/db/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const code = body.code.toUpperCase() as string | undefined;

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 },
      );
    }

    const promo = await db
      .select({
        id: promoCodes.id,
        code: promoCodes.code,
        discountValue: promoCodes.discountValue,
        discountType: promoCodes.discountType,
        canUse: sql<boolean>`COUNT(${promoCodeUsages.id}) < ${promoCodes.maxUses}`,
      })
      .from(promoCodes)
      .leftJoin(promoCodeUsages, eq(promoCodeUsages.promoCodeId, promoCodes.id))
      .where(
        and(
          eq(promoCodes.code, code),
          eq(promoCodes.isActive, true),
          sql`(${promoCodes.expiresAt} IS NULL OR ${promoCodes.expiresAt} > CURRENT_TIMESTAMP)`,
        ),
      )
      .groupBy(promoCodes.id)
      .get();

    if (!promo) {
      return NextResponse.json(
        { error: "Invalid or expired promo code" },
        { status: 404 },
      );
    }

    if (!promo.canUse) {
      return NextResponse.json(
        { error: "Promo code usage limit reached" },
        { status: 400 },
      );
    }

    if (userId) {
      const used = await db.query.promoCodeUsages.findFirst({
        where: and(
          eq(promoCodeUsages.promoCodeId, promo.id),
          eq(promoCodeUsages.userId, parseInt(userId)),
        ),
      });

      if (used) {
        return NextResponse.json(
          { error: "You already used this promo code" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (error) {
    console.error("Error applying promo code:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
