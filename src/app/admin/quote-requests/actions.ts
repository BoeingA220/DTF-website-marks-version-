"use server";

import { revalidatePath } from "next/cache";
import type { QuoteRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminProfile } from "@/lib/auth";

const STATUSES: QuoteRequestStatus[] = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

export async function updateQuoteRequestStatus(formData: FormData) {
  await requireAdminProfile();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!id || !STATUSES.includes(status as QuoteRequestStatus)) return;

  await prisma.quoteRequest.update({
    where: { id },
    data: { status: status as QuoteRequestStatus },
  });

  revalidatePath("/admin/quote-requests");
}
