"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types";

type ReorderItem = Omit<CartItem, "id">;

export function ReorderButton({ items }: { items: ReorderItem[] }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  function handleReorder() {
    items.forEach((item) => addItem(item));
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={handleReorder}
      className="inline-flex items-center gap-1.5 rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      Reorder
    </button>
  );
}
