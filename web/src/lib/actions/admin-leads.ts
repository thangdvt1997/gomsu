"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function updateLeadStatusAction(id: string, status: "NEW" | "CONTACTED" | "CLOSED") {
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}
