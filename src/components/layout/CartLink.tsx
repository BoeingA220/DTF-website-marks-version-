"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

export function CartLink({ light = false }: { light?: boolean }) {
  const itemCount = useCartStore((s) => s.itemCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${mounted ? itemCount : 0} items`}
      className={`relative inline-flex items-center justify-center rounded-full p-2 transition-colors ${
        light ? "text-white hover:bg-white/10" : "text-ink hover:bg-black/5"
      }`}
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
