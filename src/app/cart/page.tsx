"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  return (
    <>
      <PageHero eyebrow="Your Order" title="Shopping Cart" />

      <section className="container-brand py-10 sm:py-14">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/15 py-20 text-center">
            <ShoppingBag className="h-10 w-10 text-ink/30" aria-hidden="true" />
            <p className="font-display text-lg font-bold text-ink">Your cart is empty</p>
            <p className="text-sm text-ink/50">
              Start a DTF transfer, gang sheet, or apparel order to see it here.
            </p>
            <Link
              href="/shop"
              className="mt-2 inline-flex rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
            <CartSummary />
          </div>
        )}
      </section>
    </>
  );
}
