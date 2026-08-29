"use client";

import { useMemo, useState } from "react";
import { ArtworkUploader } from "./ArtworkUploader";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/store/cart-store";
import {
  GANG_SHEET_CUSTOM_MAX_IN,
  GANG_SHEET_CUSTOM_MIN_IN,
  GANG_SHEET_LENGTHS,
  GANG_SHEET_WIDTH_IN,
  quoteGangSheet,
} from "@/lib/pricing";
import type { UploadedArtwork } from "@/types";

export function GangSheetBuilder() {
  const [lengthIn, setLengthIn] = useState<number>(GANG_SHEET_LENGTHS[1].lengthIn);
  const [isCustom, setIsCustom] = useState(false);
  const [customLength, setCustomLength] = useState(48);
  const [quantity, setQuantity] = useState(1);
  const [artwork, setArtwork] = useState<UploadedArtwork | null>(null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const activeLength = isCustom ? customLength : lengthIn;

  const breakdown = useMemo(
    () => quoteGangSheet(activeLength, quantity, isCustom),
    [activeLength, quantity, isCustom]
  );

  function handleAddToCart() {
    addItem({
      productSlug: "gang-sheet",
      category: "GANG_SHEET",
      name: "Custom Gang Sheet",
      description: `${GANG_SHEET_WIDTH_IN}" × ${activeLength}"`,
      quantity,
      unitPrice: breakdown.unitPrice,
      lineTotal: breakdown.total,
      widthIn: GANG_SHEET_WIDTH_IN,
      heightIn: activeLength,
      artworkFileName: artwork?.fileName,
      artworkFileId: artwork?.artworkFileId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  // Live preview: scale the sheet to a fixed pixel width per inch.
  const previewScale = 4; // px per inch
  const previewHeight = Math.min(activeLength * previewScale, 420);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6 rounded-2xl border border-black/10 bg-white p-6">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">1. Choose Your Length</h2>
          <p className="mt-1 text-sm text-ink/50">
            All gang sheets are {GANG_SHEET_WIDTH_IN}&quot; wide. Pick a standard length or
            enter a custom size.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {GANG_SHEET_LENGTHS.map((l) => (
              <button
                key={l.lengthIn}
                type="button"
                onClick={() => {
                  setIsCustom(false);
                  setLengthIn(l.lengthIn);
                }}
                className={`rounded-lg border px-2 py-3 text-center text-sm font-semibold transition-colors ${
                  !isCustom && lengthIn === l.lengthIn
                    ? "border-royal bg-royal text-white"
                    : "border-black/15 text-ink hover:border-royal"
                }`}
              >
                {l.lengthIn}&quot;
                <span className="mt-0.5 block text-xs font-normal opacity-80">
                  ${l.price}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`col-span-3 rounded-lg border px-2 py-3 text-center text-sm font-semibold transition-colors sm:col-span-6 ${
                isCustom
                  ? "border-royal bg-royal text-white"
                  : "border-black/15 text-ink hover:border-royal"
              }`}
            >
              Custom Length
            </button>
          </div>

          {isCustom && (
            <div className="mt-4">
              <label htmlFor="custom-length" className="mb-1.5 block text-sm font-semibold text-ink">
                Custom length (inches): {customLength}&quot;
              </label>
              <input
                id="custom-length"
                type="range"
                min={GANG_SHEET_CUSTOM_MIN_IN}
                max={GANG_SHEET_CUSTOM_MAX_IN}
                value={customLength}
                onChange={(e) => setCustomLength(parseInt(e.target.value, 10))}
                className="w-full accent-royal"
              />
              <div className="flex justify-between text-xs text-ink/50">
                <span>{GANG_SHEET_CUSTOM_MIN_IN}&quot;</span>
                <span>{GANG_SHEET_CUSTOM_MAX_IN}&quot;</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <QuantityStepper value={quantity} onChange={setQuantity} label="Number of Sheets" />
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-ink">2. Upload Your Artwork</h2>
          <p className="mt-1 text-sm text-ink/50">
            Upload one file with all your designs arranged, or send us individual
            designs and our team will lay out the sheet for you.
          </p>
          <div className="mt-3">
            <ArtworkUploader onChange={setArtwork} />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="self-start font-display text-base font-bold text-ink">
            Live Preview
          </h2>
          <div
            className="relative w-24 overflow-hidden rounded-lg border-2 border-dashed border-royal/40 bg-royal/5"
            style={{ height: previewHeight }}
          >
            {artwork?.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artwork.previewUrl}
                alt="Gang sheet artwork preview"
                className="h-full w-full object-cover opacity-90"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-2 text-center text-[11px] font-semibold text-royal/60">
                Your artwork will appear here
              </div>
            )}
          </div>
          <p className="text-center text-xs text-ink/50">
            {GANG_SHEET_WIDTH_IN}&quot; × {activeLength}&quot; sheet (not to scale)
          </p>
        </div>

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
