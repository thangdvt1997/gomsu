"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(200),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ").max(20),
  email: z.string().trim().email().optional().or(z.literal("")),
  categoryInterest: z.string().trim().max(200).optional().or(z.literal("")),
  expectedQty: z.string().trim().max(200).optional().or(z.literal("")),
  note: z.string().trim().max(4000).optional().or(z.literal("")),
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
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ" };
  }

  const { name, phone, email, categoryInterest, expectedQty, note } = parsed.data;
  const messageParts = [
    categoryInterest && `Mẫu quan tâm: ${categoryInterest}`,
    expectedQty && `Số lượng dự kiến: ${expectedQty}`,
    note,
  ].filter(Boolean);

  await prisma.lead.create({
    data: {
      kind: "CONTACT_MESSAGE",
      name,
      phone,
      email: email || null,
      message: messageParts.join("\n") || null,
    },
  });

  return { ok: true };
}
