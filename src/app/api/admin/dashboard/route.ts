import { tryCatch } from "@/lib/tryCatch";
import { getDashboardData } from "@/models/dashboard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const { data: dashboardData, error } = await tryCatch(() =>
    getDashboardData(),
  );

  if (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "somthing went wrong",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    ...dashboardData,
  });
}
