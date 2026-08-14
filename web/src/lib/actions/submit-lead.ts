"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendNotificationEmail } from "@/lib/mailer";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(200),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ").max(20),
  email: z.string().trim().email().optional().or(z.literal("")),
  categoryInterest: z.string().trim().max(200).optional().or(z.literal("")),
  expectedQty: z.string().trim().max(200).optional().or(z.literal("")),
  note: z.string().trim().max(4000).optional().or(z.literal("")),
  productId: z.string().trim().max(100).optional().or(z.literal("")),
});

export type SubmitLeadState = { ok: boolean; error?: string };

export async function submitLeadAction(
  _prevState: SubmitLeadState,
  formData: FormData,
): Promise<SubmitLeadState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    categoryInterest: formData.get("categoryInterest"),
    expectedQty: formData.get("expectedQty"),
    note: formData.get("note"),
    productId: formData.get("productId"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ" };
  }

  const { name, phone, email, categoryInterest, expectedQty, note, productId } = parsed.data;
  const messageParts = [
    categoryInterest && `Mẫu quan tâm: ${categoryInterest}`,
    expectedQty && `Số lượng dự kiến: ${expectedQty}`,
    note,
  ].filter(Boolean);

  const kind = productId ? "QUOTE_REQUEST" : "CONTACT_MESSAGE";
  await prisma.lead.create({
    data: {
      kind,
      name,
      phone,
      email: email || null,
      message: messageParts.join("\n") || null,
      productId: productId || null,
    },
  });

  sendNotificationEmail(kind === "QUOTE_REQUEST" ? "Yêu cầu báo giá mới" : "Liên hệ mới", [
    `Họ tên: ${name} - ${phone}`,
    email ? `Email: ${email}` : "",
    messageParts.length ? `Nội dung: ${messageParts.join(" | ")}` : "",
    `Xem trong CMS: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomceramic.com"}/admin/leads`,
  ].filter(Boolean)).catch((err) => console.error("Failed to send lead notification email:", err));

  return { ok: true };
}
