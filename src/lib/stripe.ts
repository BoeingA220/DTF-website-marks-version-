import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Lazily-constructed Stripe client so builds don't fail before STRIPE_SECRET_KEY is set. */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your environment before using checkout."
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-07-29.dahlia",
    });
  }
  return stripeClient;
}
