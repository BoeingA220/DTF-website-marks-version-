"use client";

import { ShoppingCart } from "lucide-react";
import type { PricingBreakdown } from "@/types";

export function PriceSummaryCard({
  breakdown,
  quantity,
  onAddToCart,
  disabled,
  disabledReason,
}: {
  breakdown: PricingBreakdown;
  quantity: number;
  onAddToCart: () => void;
  disabled?: boolean;
  disabledReason?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ink/60">Price per unit</span>
        <span className="font-display text-lg font-bold text-ink">
          ${breakdown.unitPrice.toFixed(2)}
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between">
        <span className="text-sm text-ink/60">Quantity</span>
        <span className="text-sm font-semibold text-ink">{quantity}</span>
      </div>
      {breakdown.discountLabel && (
        <p className="mt-2 text-xs font-semibold text-royal">{breakdown.discountLabel}</p>
      )}
      <div className="mt-3 flex items-baseline justify-between border-t border-black/10 pt-3">
        <span className="font-display text-base font-bold text-ink">Total</span>
        <span className="font-display text-2xl font-extrabold text-gradient-brand">
          ${breakdown.total.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={disabled}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        Add to Cart
      </button>
      {disabled && disabledReason && (
        <p className="mt-2 text-center text-xs text-ink/50">{disabledReason}</p>
      )}
    </div>
  );
}
