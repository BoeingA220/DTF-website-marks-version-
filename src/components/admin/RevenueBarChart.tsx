"use client";

import { useId, useState } from "react";

type Point = { label: string; value: number };

const WIDTH = 720;
const HEIGHT = 220;
const PADDING_LEFT = 48;
const PADDING_BOTTOM = 24;
const PADDING_TOP = 12;
const BAR_MAX_THICKNESS = 24;

export function RevenueBarChart({ data }: { data: Point[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const gradientId = useId();

  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const niceMax = niceCeiling(maxValue);
  const plotWidth = WIDTH - PADDING_LEFT - 12;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const bandWidth = plotWidth / data.length;
  const barWidth = Math.min(BAR_MAX_THICKNESS, bandWidth * 0.55);

  const ticks = [0, niceMax * 0.5, niceMax];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Revenue by day">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-royal)" />
            <stop offset="100%" stopColor="var(--color-royal-light)" />
          </linearGradient>
        </defs>

        {ticks.map((t) => {
          const y = PADDING_TOP + plotHeight - (t / niceMax) * plotHeight;
          return (
            <g key={t}>
              <line
                x1={PADDING_LEFT}
                x2={WIDTH - 12}
                y1={y}
                y2={y}
                stroke="rgba(17,17,17,0.08)"
                strokeWidth={1}
              />
              <text x={PADDING_LEFT - 8} y={y + 3} textAnchor="end" fontSize={10} fill="rgba(17,17,17,0.4)">
                ${Math.round(t).toLocaleString()}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const x = PADDING_LEFT + i * bandWidth + (bandWidth - barWidth) / 2;
          const barHeight = niceMax > 0 ? (d.value / niceMax) * plotHeight : 0;
          const y = PADDING_TOP + plotHeight - barHeight;
          const isHovered = hovered === i;

          return (
            <g key={d.label}>
              <rect
                x={x}
                y={barHeight > 0 ? y : y - 1}
                width={barWidth}
                height={Math.max(barHeight, 1)}
                rx={4}
                fill={isHovered ? "var(--color-cyan)" : `url(#${gradientId})`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", transition: "fill 120ms ease" }}
              />
              <rect
                x={PADDING_LEFT + i * bandWidth}
                y={PADDING_TOP}
                width={bandWidth}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={x + barWidth / 2}
                y={HEIGHT - PADDING_BOTTOM + 14}
                textAnchor="middle"
                fontSize={10}
                fill="rgba(17,17,17,0.4)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg"
          style={{
            left: `${((PADDING_LEFT + hovered * bandWidth + bandWidth / 2) / WIDTH) * 100}%`,
            top: `${((PADDING_TOP + plotHeight - (data[hovered].value / niceMax) * plotHeight - 8) / HEIGHT) * 100}%`,
          }}
        >
          {data[hovered].label}: ${data[hovered].value.toFixed(2)}
        </div>
      )}
    </div>
  );
}

function niceCeiling(value: number): number {
  if (value <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}
