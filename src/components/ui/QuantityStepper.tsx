"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
  label = "Quantity",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      )}
      <div className="inline-flex items-center rounded-full border border-black/15">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          className="w-14 border-x border-black/10 bg-transparent py-2 text-center text-sm font-semibold outline-none"
          aria-label={label || "Quantity"}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
