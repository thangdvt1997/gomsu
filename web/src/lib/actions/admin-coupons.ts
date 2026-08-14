"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function createCouponAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PERCENT") === "FIXED" ? "FIXED" : "PERCENT";
  const value = numOrNull(formData.get("value"));
  const minOrderVnd = numOrNull(formData.get("minOrderVnd"));
  const maxUses = numOrNull(formData.get("maxUses"));
  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();
  const expiresAt = expiresRaw ? new Date(expiresRaw) : null;

  if (!code || value === null || value <= 0) return;

  await prisma.coupon.create({
    data: { code, type, value, minOrderVnd, maxUses, expiresAt },
  });
  revalidatePath("/admin/coupons");
}

export async function toggleCouponActiveAction(id: string) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return;
  await prisma.coupon.update({ where: { id }, data: { isActive: !coupon.isActive } });
  revalidatePath("/admin/coupons");
}

export async function deleteCouponAction(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}
