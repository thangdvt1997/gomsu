"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const reviewSchema = z.object({
  productId: z.string().trim().min(1),
  productSlug: z.string().trim().min(1),
  customerName: z.string().trim().min(1, "Vui lòng nhập họ tên").max(200),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(200).optional().or(z.literal("")),
  comment: z.string().trim().min(1, "Vui lòng nhập nội dung đánh giá").max(2000),
});

export type SubmitReviewState = { ok: boolean; error?: string };

// Reviews always start PENDING -- they only appear on the site (and count
// toward the product's public rating) after an admin approves them in
// /admin/reviews. This is real-customer-only content, never seeded.
export async function submitReviewAction(
  _prevState: SubmitReviewState,
  formData: FormData,
): Promise<SubmitReviewState> {
  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    productSlug: formData.get("productSlug"),
    customerName: formData.get("customerName"),
    rating: formData.get("rating"),
    title: formData.get("title"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ" };
  }

  const { productId, productSlug, customerName, rating, title, comment } = parsed.data;

  await prisma.review.create({
    data: {
      productId,
      customerName,
      rating,
      title: title || null,
      comment,
    },
  });

  revalidatePath(`/san-pham/${productSlug}`);
  return { ok: true };
}
