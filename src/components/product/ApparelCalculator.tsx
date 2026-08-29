"use client";

import { useMemo, useState } from "react";
import { ArtworkUploader } from "./ArtworkUploader";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/store/cart-store";
import { APPAREL_STYLES, quoteApparel } from "@/lib/pricing";
import type { UploadedArtwork } from "@/types";

export function ApparelCalculator() {
  const [styleSlug, setStyleSlug] = useState(APPAREL_STYLES[0].slug);
  const style = APPAREL_STYLES.find((s) => s.slug === styleSlug)!;
  const [size, setSize] = useState(style.sizes[2]);
  const [color, setColor] = useState(style.colors[0]);
  const [printWidth, setPrintWidth] = useState(10);
  const [printHeight, setPrintHeight] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const [artwork, setArtwork] = useState<UploadedArtwork | null>(null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const breakdown = useMemo(
    () => quoteApparel(styleSlug, printWidth, printHeight, quantity)!,
    [styleSlug, printWidth, printHeight, quantity]
  );

  function selectStyle(slug: string) {
    setStyleSlug(slug);
    const next = APPAREL_STYLES.find((s) => s.slug === slug)!;
    setSize(next.sizes[Math.min(2, next.sizes.length - 1)]);
    setColor(next.colors[0]);
  }

  function handleAddToCart() {
    addItem({
      productSlug: styleSlug,
      category: "APPAREL",
      name: style.name,
      description: `${color}, size ${size}, print ${printWidth}"×${printHeight}"`,
      quantity,
      unitPrice: breakdown.unitPrice,
      lineTotal: breakdown.total,
      variant: `${color} / ${size}`,
      artworkFileName: artwork?.fileName,
      artworkFileId: artwork?.artworkFileId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6 rounded-2xl border border-black/10 bg-white p-6">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">1. Choose a Style</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {APPAREL_STYLES.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => selectStyle(s.slug)}
                className={`rounded-lg border px-3 py-3 text-center text-sm font-semibold transition-colors ${
                  styleSlug === s.slug
                    ? "border-royal bg-royal text-white"
                    : "border-black/15 text-ink hover:border-royal"
                }`}
              >
                {s.name}
                <span className="mt-0.5 block text-xs font-normal opacity-80">
                  from ${s.basePrice}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
            >
              {style.sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
            >
              {style.colors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-ink">2. Print Size</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="print-w" className="mb-1.5 block text-sm font-semibold text-ink">
                Width (in)
              </label>
              <input
                id="print-w"
                type="number"
                min={1}
                max={14}
                step={0.5}
                value={printWidth}
                onChange={(e) => setPrintWidth(parseFloat(e.target.value) || 1)}
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              />
            </div>
            <div>
              <label htmlFor="print-h" className="mb-1.5 block text-sm font-semibold text-ink">
                Height (in)
              </label>
              <input
                id="print-h"
                type="number"
                min={1}
                max={16}
                step={0.5}
                value={printHeight}
                onChange={(e) => setPrintHeight(parseFloat(e.target.value) || 1)}
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              />
            </div>
          </div>
        </div>

        <QuantityStepper value={quantity} onChange={setQuantity} />

        <div>
          <h2 className="font-display text-lg font-bold text-ink">3. Upload Your Artwork</h2>
          <div className="mt-3">
            <ArtworkUploader
              printWidthIn={printWidth}
              printHeightIn={printHeight}
              onChange={setArtwork}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <PriceSummaryCard
          breakdown={breakdown}
          quantity={quantity}
          onAddToCart={handleAddToCart}
        />
        {added && (
          <p className="rounded-lg bg-royal/10 px-4 py-2.5 text-center text-sm font-semibold text-royal">
            Added to cart!
          </p>
        )}
      </div>
    </div>
  );
}
