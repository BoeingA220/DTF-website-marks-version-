import type { ArtworkFileType } from "@/types";

export const ACCEPTED_ARTWORK_EXTENSIONS: Record<string, ArtworkFileType> = {
  ".png": "PNG",
  ".svg": "SVG",
  ".pdf": "PDF",
  ".ai": "AI",
  ".psd": "PSD",
  ".eps": "EPS",
  ".jpg": "JPG",
  ".jpeg": "JPG",
  ".webp": "WEBP",
};

export const ACCEPTED_ARTWORK_ACCEPT = Object.keys(ACCEPTED_ARTWORK_EXTENSIONS).join(",");

export const MAX_ARTWORK_BYTES = 100 * 1024 * 1024; // 100MB

export const RECOMMENDED_DPI = 300;
export const MIN_ACCEPTABLE_DPI = 150;

export function detectArtworkFileType(fileName: string): ArtworkFileType | null {
  const lower = fileName.toLowerCase();
  const ext = Object.keys(ACCEPTED_ARTWORK_EXTENSIONS).find((e) => lower.endsWith(e));
  return ext ? ACCEPTED_ARTWORK_EXTENSIONS[ext] : null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Effective DPI a raster image would print at, given its physical print size. */
export function effectiveDpi(pixelDimension: number, printInches: number): number {
  if (!printInches || printInches <= 0) return Infinity;
  return pixelDimension / printInches;
}
