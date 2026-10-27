"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { BUSINESS } from "@/lib/constants";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="container-brand flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-royal/10 text-royal">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </div>
      <h1 className="font-display text-3xl font-extrabold text-ink">Order Confirmed!</h1>
      <p className="max-w-md text-ink/60">
        Thanks for your order — a confirmation email is on its way. We&apos;ll
        notify you again once it ships.
      </p>
      {orderId && (
        <p className="text-xs text-ink/40">Reference: {orderId.slice(-12).toUpperCase()}</p>
      )}
      <p className="text-sm text-ink/50">
        Questions? Call us at{" "}
        <a href={BUSINESS.phoneHref} className="font-semibold text-royal hover:underline">
          {BUSINESS.phone}
        </a>
        .
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/account/orders"
          className="rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
        >
          View My Orders
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-black/5"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
