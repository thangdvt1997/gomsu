import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateCoupon } from "@/lib/coupon";

const schema = z.object({ code: z.string().trim().min(1), subtotalVnd: z.number().int().min(0) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ valid: false, error: "Yêu cầu không hợp lệ." }, { status: 400 });

  const result = await validateCoupon(parsed.data.code, parsed.data.subtotalVnd);
  return NextResponse.json(result);
}
