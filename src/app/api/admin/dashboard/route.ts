import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("hi from dashboard");
  return NextResponse.json({
    message: "done",
  });
}
