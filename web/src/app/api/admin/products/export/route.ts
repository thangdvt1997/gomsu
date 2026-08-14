import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productsToCsv } from "@/lib/product-csv";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    include: {
      category: { select: { slug: true } },
      sizes: { orderBy: { sortOrder: "asc" } },
      colors: { include: { glaze: true }, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { code: "asc" },
  });

  const csv = productsToCsv(products);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="san-pham-${date}.csv"`,
    },
  });
}
