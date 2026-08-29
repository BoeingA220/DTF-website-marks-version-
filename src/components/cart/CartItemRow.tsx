"use client";

import { Paperclip, X } from "lucide-react";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex flex-col gap-4 border-b border-black/10 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-ink">{item.name}</p>
        <p className="mt-0.5 text-sm text-ink/60">{item.description}</p>
        {item.variant && <p className="text-xs text-ink/50">{item.variant}</p>}
        {item.artworkFileName && (
          <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
            <Paperclip className="h-3 w-3" aria-hidden="true" />
            {item.artworkFileName}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <QuantityStepper
          value={item.quantity}
          onChange={(q) => updateQuantity(item.id, q)}
          label=""
        />
        <p className="w-20 shrink-0 text-right font-display text-sm font-bold text-ink">
          ${item.lineTotal.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="shrink-0 rounded-full p-1.5 text-ink/40 hover:bg-black/5 hover:text-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
