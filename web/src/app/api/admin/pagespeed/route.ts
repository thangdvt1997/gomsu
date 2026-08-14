import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkPageSpeed } from "@/lib/pagespeed";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Thiếu tham số url" }, { status: 400 });

  try {
    const result = await checkPageSpeed(url);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Lỗi không xác định" }, { status: 500 });
  }
}
