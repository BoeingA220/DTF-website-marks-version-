"use client";

import { useMemo, useState } from "react";
import { ArtworkUploader } from "./ArtworkUploader";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/store/cart-store";
import { DTF_MAX_INCHES, DTF_MIN_INCHES, quoteDtfTransfer } from "@/lib/pricing";
import type { UploadedArtwork } from "@/types";

export function DtfCalculator() {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [artwork, setArtwork] = useState<UploadedArtwork | null>(null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const breakdown = useMemo(
    () => quoteDtfTransfer(width, height, quantity),
    [width, height, quantity]
  );

  function handleAddToCart() {
    addItem({
      productSlug: "dtf-transfer",
      category: "DTF",
      name: "Custom DTF Transfer",
      description: `${width}" × ${height}"`,
      quantity,
      unitPrice: breakdown.unitPrice,
      lineTotal: breakdown.total,
      widthIn: width,
      heightIn: height,
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
          <h2 className="font-display text-lg font-bold text-ink">1. Choose Your Size</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dtf-width" className="mb-1.5 block text-sm font-semibold text-ink">
                Width (inches)
              </label>
              <input
                id="dtf-width"
                type="number"
                min={DTF_MIN_INCHES}
                max={DTF_MAX_INCHES}
                step={0.25}
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || DTF_MIN_INCHES)}
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              />
            </div>
            <div>
              <label htmlFor="dtf-height" className="mb-1.5 block text-sm font-semibold text-ink">
                Height (inches)
              </label>
              <input
                id="dtf-height"
                type="number"
                min={DTF_MIN_INCHES}
                max={DTF_MAX_INCHES}
                step={0.25}
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || DTF_MIN_INCHES)}
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-ink/50">
            Max size {DTF_MAX_INCHES}&quot; × {DTF_MAX_INCHES}&quot; per transfer.
          </p>
        </div>

        <div>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-ink">2. Upload Your Artwork</h2>
          <p className="mt-1 text-sm text-ink/50">
            We accept PNG, JPG, AI, PDF, SVG, PSD, and EPS files.
          </p>
          <div className="mt-3">
            <ArtworkUploader printWidthIn={width} printHeightIn={height} onChange={setArtwork} />
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
