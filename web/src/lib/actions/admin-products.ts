"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const COMBINING_MARKS = /[̀-ͯ]/g;
export const MAX_SIZE_ROWS = 6;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function readSizesFromForm(formData: FormData) {
  const sizes: { label: string | null; heightCm: number | null; mouthCm: number | null; priceVnd: number | null }[] = [];
  for (let i = 0; i < MAX_SIZE_ROWS; i++) {
    const label = String(formData.get(`size_label_${i}`) ?? "").trim() || null;
    const heightCm = numOrNull(formData.get(`size_height_${i}`));
    const mouthCm = numOrNull(formData.get(`size_mouth_${i}`));
    const priceRaw = String(formData.get(`size_price_${i}`) ?? "").trim();
    const priceVnd = priceRaw ? numOrNull(formData.get(`size_price_${i}`)) : null;
    // Skip fully-empty rows.
    if (!label && heightCm === null && mouthCm === null && !priceRaw) continue;
    sizes.push({ label, heightCm, mouthCm, priceVnd });
  }
  return sizes;
}

function readColorsFromForm(formData: FormData) {
  return formData.getAll("colors").map((v) => String(v));
}

export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const tag = String(formData.get("tag") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const isDraft = formData.get("isDraft") === "on";
  const metaTitle = String(formData.get("metaTitle") ?? "").trim() || null;
  const metaDescription = String(formData.get("metaDescription") ?? "").trim() || null;

  if (!name || !code || !categoryId) return;
  const slug = slugify(name);

  const glazeKeys = readColorsFromForm(formData);
  const glazes = await prisma.glaze.findMany({ where: { key: { in: glazeKeys } } });

  const product = await prisma.product.create({
    data: {
      name,
      code,
      slug,
      categoryId,
      tag,
      description,
      featured,
      isDraft,
      metaTitle,
      metaDescription,
      sizes: { create: readSizesFromForm(formData) },
      colors: { create: glazes.map((g, i) => ({ glazeId: g.id, sortOrder: i })) },
    },
  });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProductAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const tag = String(formData.get("tag") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const isDraft = formData.get("isDraft") === "on";
  const metaTitle = String(formData.get("metaTitle") ?? "").trim() || null;
  const metaDescription = String(formData.get("metaDescription") ?? "").trim() || null;

  if (!name || !code || !categoryId) return;

  const glazeKeys = readColorsFromForm(formData);
  const glazes = await prisma.glaze.findMany({ where: { key: { in: glazeKeys } } });

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: { name, code, categoryId, tag, description, featured, isDraft, metaTitle, metaDescription },
    }),
    prisma.productSize.deleteMany({ where: { productId: id } }),
    prisma.productColor.deleteMany({ where: { productId: id } }),
  ]);

  const sizes = readSizesFromForm(formData);
  await prisma.$transaction([
    ...(sizes.length
      ? [
          prisma.productSize.createMany({
            data: sizes.map((s, i) => ({ ...s, productId: id, sortOrder: i })),
          }),
        ]
      : []),
    ...(glazes.length
      ? [
          prisma.productColor.createMany({
            data: glazes.map((g, i) => ({ productId: id, glazeId: g.id, sortOrder: i })),
          }),
        ]
      : []),
  ]);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/san-pham`);
}

export async function deleteProductAction(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductImageAction(productId: string, imageId: string) {
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${productId}`);
}
