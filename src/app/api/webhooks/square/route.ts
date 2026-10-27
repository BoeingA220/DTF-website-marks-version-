import { NextRequest, NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { prisma } from "@/lib/prisma";
import { getSquareClient } from "@/lib/square";
import { orderConfirmationEmailHtml, sendEmail } from "@/lib/resend";

export const runtime = "nodejs";

type SquareWebhookBody = {
  type?: string;
  data?: {
    type?: string;
    id?: string;
    object?: {
      payment?: {
        id?: string;
        status?: string;
        orderId?: string;
      };
    };
  };
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-square-hmacsha256-signature");
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!signature || !signatureKey || !siteUrl) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await req.text();

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: rawBody,
    signatureHeader: signature,
    signatureKey,
    notificationUrl: `${siteUrl}/api/webhooks/square`,
  });

  if (!isValid) {
    console.error("Square webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event: SquareWebhookBody = JSON.parse(rawBody);
  const payment = event.data?.object?.payment;

  if (event.type === "payment.updated" && payment?.status === "COMPLETED" && payment.orderId) {
    await handleOrderPaid(payment.orderId);
  }

  return NextResponse.json({ received: true });
}

async function handleOrderPaid(squareOrderId: string) {
  try {
    const existing = await prisma.order.findUnique({ where: { squareOrderId } });
    // Avoid re-processing (and re-emailing) if Square retries the webhook.
    if (!existing || existing.status !== "PENDING_PAYMENT") return;

    let shippingAddress: unknown = undefined;
    try {
      const square = getSquareClient();
      const { order: squareOrder } = await square.orders.get({ orderId: squareOrderId });
      const recipient = squareOrder?.fulfillments?.[0]?.shipmentDetails?.recipient;
      if (recipient) {
        shippingAddress = {
          name: recipient.displayName,
          address: {
            line1: recipient.address?.addressLine1,
            line2: recipient.address?.addressLine2,
            city: recipient.address?.locality,
            state: recipient.address?.administrativeDistrictLevel1,
            postal_code: recipient.address?.postalCode,
          },
        };
      }
    } catch (err) {
      console.error(`Could not fetch Square order ${squareOrderId} for shipping address:`, err);
    }

    const order = await prisma.order.update({
      where: { squareOrderId },
      data: { status: "PAID", shippingAddress: shippingAddress ?? undefined },
      include: { items: true, user: true },
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

    const customerEmail = order.guestEmail ?? order.user?.email;
    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: `Your Royal Eye Candy order is confirmed (#${order.id.slice(-8)})`,
        html: orderConfirmationEmailHtml({
          orderId: order.id.slice(-8),
          customerName: order.user?.name ?? "there",
          itemsHtml,
          total: `$${Number(order.total).toFixed(2)}`,
        }),
      });
    }
  } catch (err) {
    console.error(`Failed to mark Square order ${squareOrderId} as paid:`, err);
  }
}
