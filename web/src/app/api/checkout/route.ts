import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(1).max(200),
  customerPhone: z.string().trim().min(8).max(20),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  shippingAddress: z.string().trim().min(1).max(500),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
  items: z
    .array(z.object({ productId: z.string(), sizeId: z.string(), qty: z.number().int().min(1).max(9999) }))
    .min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Thông tin đơn hàng không hợp lệ." }, { status: 400 });
  }
  const { customerName, customerPhone, customerEmail, shippingAddress, note, items } = parsed.data;

  // Never trust client-sent prices -- re-fetch every size from the DB.
  const sizeIds = items.map((i) => i.sizeId);
  const sizes = await prisma.productSize.findMany({
    where: { id: { in: sizeIds } },
    include: { product: { select: { id: true, name: true, isDraft: true } } },
  });
  const sizeById = new Map(sizes.map((s) => [s.id, s]));

  const orderItemsData: {
    productId: string;
    productName: string;
    sizeLabel: string | null;
    unitPriceVnd: number;
    quantity: number;
    lineTotalVnd: number;
  }[] = [];

  for (const item of items) {
    const size = sizeById.get(item.sizeId);
    if (!size || size.productId !== item.productId || size.product.isDraft) {
      return NextResponse.json({ error: "Một sản phẩm trong giỏ hàng không còn khả dụng." }, { status: 400 });
    }
    if (size.priceVnd === null) {
      return NextResponse.json(
        { error: `${size.product.name} chỉ nhận báo giá liên hệ, không thể thanh toán online.` },
        { status: 400 },
      );
    }
    orderItemsData.push({
      productId: size.productId,
      productName: size.product.name,
      sizeLabel: size.label,
      unitPriceVnd: size.priceVnd,
      quantity: item.qty,
      lineTotalVnd: size.priceVnd * item.qty,
    });
  }

  const totalVnd = orderItemsData.reduce((sum, i) => sum + i.lineTotalVnd, 0);
  const orderNumber = `GSM-${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: "PENDING",
      paymentMethod: "VIETQR",
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      shippingAddress,
      note: note || null,
      subtotalVnd: totalVnd,
      totalVnd,
      items: { create: orderItemsData },
    },
  });

  // VietQR is a static bank-transfer QR, not a hosted payment page -- send
  // the customer to our own confirmation page (which renders the QR code)
  // rather than an external redirect URL like the VNPay flow used.
  return NextResponse.json({
    orderId: order.id,
    orderNumber,
    redirectUrl: `/thanh-toan/vietqr/${order.id}`,
  });
}
