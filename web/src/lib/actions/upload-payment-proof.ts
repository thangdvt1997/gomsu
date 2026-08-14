"use server";

import path from "node:path";
import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const MEDIA_DIR = process.env.MEDIA_DIR ?? "/app/media-data";

// Lets a customer upload a screenshot of their bank transfer right on the
// VietQR confirmation page, so the admin can reconcile payments without
// having to open the banking app for every single order.
export async function uploadPaymentProofAction(orderId: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(MEDIA_DIR, "orders");
  await mkdir(dir, { recursive: true });

  const filename = randomUUID();
  await sharp(buffer)
    .rotate()
    .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(path.join(dir, `${filename}.jpg`));

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentProofUrl: `/media/orders/${filename}.jpg` },
  });

  revalidatePath(`/thanh-toan/vietqr/${orderId}`);
  revalidatePath(`/admin/orders/${orderId}`);
}
