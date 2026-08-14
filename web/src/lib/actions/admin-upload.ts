"use server";

import path from "node:path";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const MEDIA_DIR = process.env.MEDIA_DIR ?? "/app/media-data";

export async function uploadProductImageAction(productId: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(MEDIA_DIR, "products");
  await mkdir(dir, { recursive: true });

  const filename = `${product.slug}-${Date.now()}`;
  await sharp(buffer).rotate().resize(1200, 1200, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toFile(path.join(dir, `${filename}.jpg`));
  await sharp(buffer).rotate().resize(400, 400, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(path.join(dir, `${filename}-thumb.jpg`));

  const maxSort = await prisma.productImage.aggregate({ where: { productId }, _max: { sortOrder: true } });
  await prisma.productImage.create({
    data: {
      productId,
      url: `/media/products/${filename}.jpg`,
      thumbUrl: `/media/products/${filename}-thumb.jpg`,
      alt: product.name,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/san-pham/${product.slug}`);
}
