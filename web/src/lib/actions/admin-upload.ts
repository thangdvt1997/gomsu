"use server";

import path from "node:path";
import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
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

export async function uploadPostCoverAction(postId: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return;

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(MEDIA_DIR, "posts");
  await mkdir(dir, { recursive: true });

  // One size (not a separate thumb) used both as the full-width hero
  // background and, downscaled by CSS, as the blog-index card image --
  // downscaling a large image is always safe, only upscaling a small one
  // blurs, which is exactly the bug this replaces (the hero used to be
  // stretched from a 700px product/site thumbnail meant for small cards).
  const filename = `${post.slug}-${Date.now()}`;
  await sharp(buffer)
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(path.join(dir, `${filename}.jpg`));

  await prisma.post.update({
    where: { id: postId },
    data: { coverImage: `/media/posts/${filename}.jpg` },
  });

  revalidatePath(`/admin/posts/${postId}`);
  revalidatePath("/tin-tuc");
  revalidatePath(`/tin-tuc/${post.slug}`);
}

// Used by the rich-text editor toolbar to insert an image inline in the
// post body. Not tied to a specific Post row (the post may not be saved
// yet on the "new post" screen), so it just returns a URL to embed.
export async function uploadPostContentImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Không có ảnh" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(MEDIA_DIR, "posts", "inline");
  await mkdir(dir, { recursive: true });

  const filename = randomUUID();
  await sharp(buffer)
    .rotate()
    .resize(1400, 1400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(path.join(dir, `${filename}.jpg`));

  return { url: `/media/posts/inline/${filename}.jpg` };
}
