"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminProfile } from "@/lib/auth";
import { sendEmail } from "@/lib/resend";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "IN_PRODUCTION",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

export async function updateTracking(formData: FormData) {
  await requireAdminProfile();
  const orderId = String(formData.get("orderId"));
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();
  const trackingCarrier = String(formData.get("trackingCarrier") ?? "").trim();
  if (!orderId || !trackingNumber) return;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { trackingNumber, trackingCarrier, status: "SHIPPED" },
    include: { user: true },
  });

  const email = order.guestEmail ?? order.user?.email;
  if (email) {
    await sendEmail({
      to: email,
      subject: `Your order has shipped! (#${order.id.slice(-8).toUpperCase()})`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111;">
          <h1 style="color: #0057B8;">Your order is on its way!</h1>
          <p>Order #${order.id.slice(-8).toUpperCase()} has shipped.</p>
          <p><strong>Tracking Number:</strong> ${escapeHtml(trackingNumber)}</p>
          ${trackingCarrier ? `<p><strong>Carrier:</strong> ${escapeHtml(trackingCarrier)}</p>` : ""}
        </div>
      `,
    });
  }

  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdminProfile();
  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status"));
  if (!orderId || !ORDER_STATUSES.includes(status as OrderStatus)) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  revalidatePath(`/admin/orders/${orderId}`);
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
