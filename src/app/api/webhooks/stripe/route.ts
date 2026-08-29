import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { orderConfirmationEmailHtml, sendEmail } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const payload = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await handleOrderPaid(orderId, session);
    }
  }

  return NextResponse.json({ received: true });
}

async function handleOrderPaid(orderId: string, session: Stripe.Checkout.Session) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        shippingAddress: session.customer_details
          ? JSON.parse(JSON.stringify(session.customer_details))
          : undefined,
      },
      include: { items: true },
    });

    const itemsHtml = order.items
      .map(
        (item) => `
          <tr>
            <td style="padding: 8px 0;">${item.name} (${item.quantity}×)</td>
            <td style="padding: 8px 0; text-align: right;">$${Number(item.lineTotal).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const customerEmail = session.customer_details?.email ?? session.customer_email;
    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: `Your Royal Eye Candy order is confirmed (#${order.id.slice(-8)})`,
        html: orderConfirmationEmailHtml({
          orderId: order.id.slice(-8),
          customerName: session.customer_details?.name ?? "there",
          itemsHtml,
          total: `$${Number(order.total).toFixed(2)}`,
        }),
      });
    }
  } catch (err) {
    console.error(`Failed to mark order ${orderId} as paid:`, err);
  }
}
