"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function approveReviewAction(id: string) {
  const review = await prisma.review.update({
    where: { id },
    data: { status: "APPROVED" },
    include: { product: { select: { slug: true } } },
  });
  revalidatePath("/admin/reviews");
  revalidatePath(`/san-pham/${review.product.slug}`);
}

export async function rejectReviewAction(id: string) {
  const review = await prisma.review.update({
    where: { id },
    data: { status: "REJECTED" },
    include: { product: { select: { slug: true } } },
  });
  revalidatePath("/admin/reviews");
  revalidatePath(`/san-pham/${review.product.slug}`);
}

export async function deleteReviewAction(id: string) {
  const review = await prisma.review.delete({ where: { id }, include: { product: { select: { slug: true } } } });
  revalidatePath("/admin/reviews");
  revalidatePath(`/san-pham/${review.product.slug}`);
}
