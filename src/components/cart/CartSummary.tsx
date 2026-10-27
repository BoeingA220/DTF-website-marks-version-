"use client";

import { useMemo, useState } from "react";
import { Loader2, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { getShippingOptions, round2 } from "@/lib/pricing";

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  const shippingOptions = useMemo(() => getShippingOptions(subtotal), [subtotal]);
  const [shippingOptionId, setShippingOptionId] = useState(shippingOptions[1]?.id ?? shippingOptions[0].id);
  const shippingCost = shippingOptions.find((o) => o.id === shippingOptionId)?.cost ?? 0;

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const discount = coupon?.discountAmount ?? 0;
  const total = round2(Math.max(0, subtotal + shippingCost - discount));

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupon({ code: data.code, discountAmount: data.discountAmount });
      } else {
        setCoupon(null);
        setCouponError(data.error ?? "Invalid coupon");
      }
    } catch {
      setCouponError("Couldn't validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleCheckout() {
    if (!email.trim()) {
      setCheckoutError("Enter your email to continue.");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingOptionId,
          couponCode: coupon?.code,
          guestEmail: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="space-y-5 rounded-2xl border border-black/10 bg-white p-6">
      <div>
        <h2 className="font-display text-base font-bold text-ink">Shipping</h2>
        <div className="mt-3 space-y-2">
          {shippingOptions.map((opt) => (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                shippingOptionId === opt.id ? "border-royal bg-royal/5" : "border-black/10"
              }`}
            >
              <input
                type="radio"
                name="shipping"
                value={opt.id}
                checked={shippingOptionId === opt.id}
                onChange={() => setShippingOptionId(opt.id)}
                className="mt-1 accent-royal"
              />
              <span className="flex-1">
                <span className="block font-semibold text-ink">{opt.label}</span>
                <span className="block text-xs text-ink/50">{opt.description}</span>
              </span>
              <span className="font-semibold text-ink">
                {opt.cost === 0 ? "Free" : `$${opt.cost.toFixed(2)}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-base font-bold text-ink">Coupon Code</h2>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter code"
            className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-royal"
          />
          <button
            type="button"
            onClick={applyCoupon}
            disabled={couponLoading}
            className="shrink-0 rounded-lg border border-royal px-3 py-2 text-sm font-semibold text-royal hover:bg-royal/5 disabled:opacity-50"
          >
            {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </button>
        </div>
        {coupon && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-royal">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            {coupon.code} applied — ${coupon.discountAmount.toFixed(2)} off
          </p>
        )}
        {couponError && <p className="mt-1.5 text-xs font-semibold text-accent">{couponError}</p>}
      </div>

      <div>
        <label htmlFor="cart-email" className="mb-1.5 block text-sm font-semibold text-ink">
          Email
        </label>
        <input
          id="cart-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-royal"
        />
        <p className="mt-1 text-xs text-ink/50">
          We&apos;ll send your order confirmation and tracking here. Have an account?{" "}
          <a href="/account/login" className="font-semibold text-royal hover:underline">
            Sign in
          </a>{" "}
          to save it to your order history.
        </p>
      </div>

      <div className="space-y-1.5 border-t border-black/10 pt-4 text-sm">
        <div className="flex justify-between text-ink/70">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-ink/70">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-royal">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-black/10 pt-2 font-display text-base font-bold text-ink">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={checkoutLoading || items.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {checkoutLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {checkoutLoading ? "Redirecting to checkout…" : "Proceed to Checkout"}
      </button>
      {checkoutError && (
        <p className="text-center text-xs font-semibold text-accent">{checkoutError}</p>
      )}
      <p className="text-center text-xs text-ink/40">
        Secure checkout powered by Square — Card, Apple Pay, Google Pay &amp; Cash App Pay accepted.
      </p>
    </div>
  );
}
