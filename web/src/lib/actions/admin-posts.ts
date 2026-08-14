"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

// coverImage is deliberately NOT read here -- it's managed exclusively by
// uploadPostCoverAction (admin-upload.ts) via the upload widget on the post
// edit page, so saving this form never overwrites/clears an uploaded cover.
function readPostFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const contentHtml = String(formData.get("contentHtml") ?? "").trim();
  const publishNow = formData.get("published") === "on";
  const metaTitle = String(formData.get("metaTitle") ?? "").trim() || null;
  const metaDescription = String(formData.get("metaDescription") ?? "").trim() || null;
  return { title, excerpt, contentHtml, publishNow, metaTitle, metaDescription };
}

export async function createPostAction(formData: FormData) {
  const { title, excerpt, contentHtml, publishNow, metaTitle, metaDescription } = readPostFields(formData);
  if (!title || !contentHtml) return;

  const post = await prisma.post.create({
    data: {
      title,
      slug: slugify(title),
      excerpt,
      contentHtml,
      publishedAt: publishNow ? new Date() : null,
      metaTitle,
      metaDescription,
    },
  });
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${post.id}`);
}

export async function updatePostAction(id: string, formData: FormData) {
  const { title, excerpt, contentHtml, publishNow, metaTitle, metaDescription } = readPostFields(formData);
  if (!title || !contentHtml) return;

  const existing = await prisma.post.findUnique({ where: { id } });
  await prisma.post.update({
    where: { id },
    data: {
      title,
      excerpt,
      contentHtml,
      publishedAt: publishNow ? (existing?.publishedAt ?? new Date()) : null,
      metaTitle,
      metaDescription,
    },
  });
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath("/tin-tuc");
}

export async function deletePostAction(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
