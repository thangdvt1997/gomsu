"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const COMBINING_MARKS = /[̀-ͯ]/g;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategoryAction(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;
  const slug = slugify(label);
  const count = await prisma.category.count();
  await prisma.category.create({ data: { slug, label, sortOrder: count } });
  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!label) return;
  await prisma.category.update({ where: { id }, data: { label, sortOrder } });
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    // Referenced by existing products (onDelete: Restrict) -- ignore, keep it.
  }
  revalidatePath("/admin/categories");
}
