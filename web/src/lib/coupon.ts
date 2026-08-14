import { prisma } from "@/lib/db";

export type CouponValidationResult =
  | { valid: true; couponId: string; discountVnd: number }
  | { valid: false; error: string };

/**
 * Single source of truth for applying a coupon, used by both the
 * "áp dụng mã" live-preview endpoint and the real checkout action --
 * so the discount a customer sees before paying always matches what
 * actually gets charged.
 */
export async function validateCoupon(code: string, subtotalVnd: number): Promise<CouponValidationResult> {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!coupon || !coupon.isActive) return { valid: false, error: "Mã giảm giá không tồn tại hoặc đã bị tắt." };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, error: "Mã giảm giá đã hết hạn." };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: "Mã giảm giá đã hết lượt sử dụng." };
  }
  if (coupon.minOrderVnd !== null && subtotalVnd < coupon.minOrderVnd) {
    return {
      valid: false,
      error: `Đơn hàng cần tối thiểu ${coupon.minOrderVnd.toLocaleString("vi-VN")}đ để dùng mã này.`,
    };
  }

  const rawDiscount = coupon.type === "PERCENT" ? Math.round((subtotalVnd * coupon.value) / 100) : coupon.value;
  const discountVnd = Math.min(rawDiscount, subtotalVnd);

  return { valid: true, couponId: coupon.id, discountVnd };
}
