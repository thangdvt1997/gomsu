"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function markOrderPaidAction(id: string) {
  await prisma.order.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/admin/orders");
}

export async function cancelOrderAction(id: string) {
  await prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/admin/orders");
}
