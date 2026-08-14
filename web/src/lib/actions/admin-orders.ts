"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

// OrderItem doesn't keep a direct sizeId FK (only a snapshot label), so
// restoring stock matches back via productId + sizeLabel -- fine for this
// small a catalog, and stock is advisory (never blocks a sale outright).
async function restoreStockForOrder(orderId: string) {
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    select: { productId: true, sizeLabel: true, quantity: true },
  });
  for (const item of items) {
    await prisma.productSize.updateMany({
      where: { productId: item.productId, label: item.sizeLabel, stockQty: { not: null } },
      data: { stockQty: { increment: item.quantity } },
    });
  }
}

export async function markOrderPaidAction(id: string) {
  await prisma.order.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/admin/orders");
}

export async function cancelOrderAction(id: string) {
  const order = await prisma.order.findUnique({ where: { id }, select: { status: true } });
  if (!order || order.status === "CANCELLED") return;

  await prisma.order.update({ where: { id }, data: { status: "CANCELLED" } });
  await restoreStockForOrder(id);
  revalidatePath("/admin/orders");
}

export async function updateOrderInternalNoteAction(id: string, formData: FormData) {
  const internalNote = String(formData.get("internalNote") ?? "").trim() || null;
  await prisma.order.update({ where: { id }, data: { internalNote } });
  revalidatePath(`/admin/orders/${id}`);
}

/**
 * Lazily cancels PENDING VietQR orders past their payment window and
 * restores their reserved stock -- called from the admin orders list on
 * every load instead of requiring a real cron daemon on the VPS.
 */
export async function expireStalePendingOrders() {
  const stale = await prisma.order.findMany({
    where: { status: "PENDING", expiresAt: { lt: new Date() } },
    select: { id: true },
  });
  if (!stale.length) return;

  for (const { id } of stale) {
    await prisma.order.update({ where: { id }, data: { status: "CANCELLED" } });
    await restoreStockForOrder(id);
  }
}
