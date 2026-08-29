import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getShippingOptions, revalidateCartItem, round2 } from "@/lib/pricing";
import { validateCoupon } from "@/lib/coupons";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

const cartItemSchema = z.object({
  id: z.string(),
  productSlug: z.string(),
  category: z.enum(["DTF", "GANG_SHEET", "APPAREL", "WIDE_FORMAT", "BANNER"]),
  name: z.string(),
  description: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  widthIn: z.number().optional(),
  heightIn: z.number().optional(),
  variant: z.string().optional(),
  artworkFileName: z.string().optional(),
  artworkFileId: z.string().nullable().optional(),
});

const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  shippingOptionId: z.string(),
  couponCode: z.string().optional(),
  guestEmail: z.email().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request" }, { status: 400 });
  }
  const { items, shippingOptionId, couponCode, guestEmail } = parsed.data;

  // --- Re-price every line server-side. The client-sent unitPrice/lineTotal
  // are never trusted — they're display-only until this point. ---
  const validated = items.map((item) => {
    const breakdown = revalidateCartItem(item);
    if (!breakdown) {
      throw new Error(`Could not price item "${item.name}" — missing required fields`);
    }
    return { item, breakdown };
  });

  let subtotal = 0;
  for (const { breakdown } of validated) subtotal = round2(subtotal + breakdown.total);

  const shippingOptions = getShippingOptions(subtotal);
  const shippingOption = shippingOptions.find((o) => o.id === shippingOptionId);
  if (!shippingOption) {
    return NextResponse.json({ error: "Invalid shipping option" }, { status: 400 });
  }

  let discountAmount = 0;
  let appliedCouponCode: string | null = null;
  if (couponCode) {
    try {
      const result = await validateCoupon(couponCode, subtotal);
      if (result.valid) {
        discountAmount = result.discountAmount;
        appliedCouponCode = result.code;
      }
    } catch (err) {
      console.error("Coupon lookup failed during checkout:", err);
    }
  }

  const total = round2(Math.max(0, subtotal + shippingOption.cost - discountAmount));

  // --- Identify the customer (signed-in user or guest) ---
  let userId: string | null = null;
  let customerEmail = guestEmail;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      userId = data.user.id;
      customerEmail = data.user.email ?? customerEmail;
    }
  } catch {
    // Not signed in / Supabase not configured — proceed as guest.
  }

  if (!customerEmail) {
    return NextResponse.json({ error: "Email is required to check out" }, { status: 400 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        guestEmail: userId ? null : customerEmail,
        status: "PENDING_PAYMENT",
        subtotal,
        shipping: shippingOption.cost,
        discount: discountAmount,
        total,
        couponCode: appliedCouponCode,
        shippingOption: shippingOption.label,
        items: {
          create: validated.map(({ item, breakdown }) => ({
            category: item.category,
            productSlug: item.productSlug,
            name: item.name,
            description: item.description,
            variant: item.variant,
            widthIn: item.widthIn,
            heightIn: item.heightIn,
            quantity: item.quantity,
            unitPrice: breakdown.unitPrice,
            lineTotal: breakdown.total,
            artworkFileId: item.artworkFileId ?? undefined,
          })),
        },
      },
    });

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const lineItems = validated.map(({ item, breakdown }) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(breakdown.unitPrice * 100),
        product_data: {
          name: item.name,
          description: `${item.description}${item.variant ? ` — ${item.variant}` : ""}`,
        },
      },
    }));

    if (shippingOption.cost > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(shippingOption.cost * 100),
          product_data: { name: shippingOption.label, description: "" },
        },
      });
    }

    let discounts: { coupon: string }[] | undefined;
    if (discountAmount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: "usd",
        duration: "once",
        name: appliedCouponCode ?? "Discount",
      });
      discounts = [{ coupon: stripeCoupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      discounts,
      customer_email: customerEmail,
      shipping_address_collection:
        shippingOption.id === "local-pickup" ? undefined : { allowed_countries: ["US"] },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout failed:", err);
    const message =
      err instanceof Error && err.message.includes("STRIPE_SECRET_KEY")
        ? "Online checkout isn't fully configured yet — please call us to complete your order."
        : "Checkout failed. Please try again or contact us.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
