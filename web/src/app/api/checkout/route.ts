import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { validateCoupon } from "@/lib/coupon";
import { sendNotificationEmail } from "@/lib/mailer";

const ORDER_EXPIRY_HOURS = 24;

const utmField = z.string().trim().max(200).optional().or(z.literal(""));

const checkoutSchema = z.object({
  customerName: z.string().trim().min(1).max(200),
  customerPhone: z.string().trim().min(8).max(20),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  shippingAddress: z.string().trim().min(1).max(500),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
  couponCode: z.string().trim().max(60).optional().or(z.literal("")),
  items: z
    .array(z.object({ productId: z.string(), sizeId: z.string(), qty: z.number().int().min(1).max(9999) }))
    .min(1),
  utmSource: utmField,
  utmMedium: utmField,
  utmCampaign: utmField,
  utmTerm: utmField,
  utmContent: utmField,
  gclid: utmField,
  fbclid: utmField,
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Thông tin đơn hàng không hợp lệ." }, { status: 400 });
  }
  const {
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    note,
    couponCode,
    items,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    gclid,
    fbclid,
  } = parsed.data;

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
    if (size.stockQty !== null && size.stockQty < item.qty) {
      return NextResponse.json(
        {
          error:
            size.stockQty === 0
              ? `${size.product.name} hiện đã hết hàng.`
              : `${size.product.name} chỉ còn ${size.stockQty} sản phẩm.`,
        },
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

  const subtotalVnd = orderItemsData.reduce((sum, i) => sum + i.lineTotalVnd, 0);

  let couponId: string | null = null;
  let discountVnd = 0;
  if (couponCode) {
    const result = await validateCoupon(couponCode, subtotalVnd);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    couponId = result.couponId;
    discountVnd = result.discountVnd;
  }

  const totalVnd = subtotalVnd - discountVnd;
  const orderNumber = `GSM-${Date.now()}`;
  const expiresAt = new Date(Date.now() + ORDER_EXPIRY_HOURS * 60 * 60 * 1000);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        paymentMethod: "VIETQR",
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        shippingAddress,
        note: note || null,
        subtotalVnd,
        discountVnd,
        totalVnd,
        couponId,
        expiresAt,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmTerm: utmTerm || null,
        utmContent: utmContent || null,
        gclid: gclid || null,
        fbclid: fbclid || null,
        items: { create: orderItemsData },
      },
    });

    // Reserve stock at order placement (not at payment confirmation) since
    // VietQR confirmation is manual and can take hours -- stock is restored
    // if the order is later cancelled or auto-expires unpaid.
    for (const item of items) {
      const size = sizeById.get(item.sizeId)!;
      if (size.stockQty !== null) {
        await tx.productSize.update({
          where: { id: item.sizeId },
          data: { stockQty: { decrement: item.qty } },
        });
      }
    }

    if (couponId) {
      await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
    }

    return created;
  });

  sendNotificationEmail(`Đơn hàng mới: ${orderNumber}`, [
    `Khách hàng: ${customerName} - ${customerPhone}`,
    `Tổng tiền: ${totalVnd.toLocaleString("vi-VN")}đ`,
    `Địa chỉ: ${shippingAddress}`,
    `Xem chi tiết: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com"}/admin/orders/${order.id}`,
  ]).catch((err) => console.error("Failed to send order notification email:", err));

  // VietQR is a static bank-transfer QR, not a hosted payment page -- send
  // the customer to our own confirmation page (which renders the QR code)
  // rather than an external redirect URL like the VNPay flow used.
  return NextResponse.json({
    orderId: order.id,
    orderNumber,
    redirectUrl: `/thanh-toan/vietqr/${order.id}`,
  });
}
