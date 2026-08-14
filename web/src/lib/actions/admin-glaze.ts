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

export async function createGlazeAction(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const hex = String(formData.get("hex") ?? "#CCCCCC").trim();
  if (!label) return;
  await prisma.glaze.create({ data: { key: slugify(label), label, hex } });
  revalidatePath("/admin/glaze");
}

export async function updateGlazeAction(id: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const hex = String(formData.get("hex") ?? "").trim();
  if (!label || !hex) return;
  await prisma.glaze.update({ where: { id }, data: { label, hex } });
  revalidatePath("/admin/glaze");
}

export async function deleteGlazeAction(id: string) {
  try {
    await prisma.glaze.delete({ where: { id } });
  } catch {
    // Referenced by existing products -- ignore, keep it.
  }
  revalidatePath("/admin/glaze");
}
