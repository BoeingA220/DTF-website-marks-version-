"use client";

import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, File, Loader2, Upload, X } from "lucide-react";
import type { UploadedArtwork } from "@/types";
import {
  ACCEPTED_ARTWORK_ACCEPT,
  MAX_ARTWORK_BYTES,
  MIN_ACCEPTABLE_DPI,
  detectArtworkFileType,
  effectiveDpi,
  formatBytes,
} from "@/lib/artwork";
import { uploadArtworkFile } from "@/lib/upload-artwork";

type Props = {
  printWidthIn?: number;
  printHeightIn?: number;
  onChange: (artwork: UploadedArtwork | null) => void;
  dropzoneLabel?: string;
  dropzoneHint?: string;
};

export function ArtworkUploader({
  printWidthIn,
  printHeightIn,
  onChange,
  dropzoneLabel = "Click to upload or drag & drop your artwork",
  dropzoneHint = `PNG, JPG, AI, PDF, SVG, PSD, or EPS — up to ${formatBytes(MAX_ARTWORK_BYTES)}`,
}: Props) {
  const [artwork, setArtwork] = useState<UploadedArtwork | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(next: UploadedArtwork) {
    setArtwork(next);
    onChange(next);
  }

  async function persistArtwork(current: UploadedArtwork) {
    try {
      const result = await uploadArtworkFile(current.file, {
        fileType: current.fileType,
        widthPx: current.widthPx,
        heightPx: current.heightPx,
        lowResWarning: current.lowResWarning,
      });
      commit({
        ...current,
        uploadStatus: result.stored ? "done" : "skipped",
        artworkFileId: result.id,
      });
    } catch {
      commit({ ...current, uploadStatus: "error" });
    }
  }

  async function handleFile(file: File) {
    setError(null);

    if (file.size > MAX_ARTWORK_BYTES) {
      setError(`File is too large (${formatBytes(file.size)}). Max size is ${formatBytes(MAX_ARTWORK_BYTES)}.`);
      return;
    }

    const fileType = detectArtworkFileType(file.name);
    if (!fileType) {
      setError("Unsupported file type. Please upload PNG, JPG, AI, PDF, SVG, PSD, or EPS.");
      return;
    }

    const rasterTypes: typeof fileType[] = ["PNG", "JPG", "WEBP"];
    const previewable =
      rasterTypes.includes(fileType) || fileType === "SVG" || fileType === "PDF";
    const previewUrl = previewable ? URL.createObjectURL(file) : undefined;

    const base: UploadedArtwork = {
      id: crypto.randomUUID(),
      file,
      fileName: file.name,
      fileType,
      previewUrl,
      unsupportedPreview: !previewable,
      uploadStatus: "uploading",
    };

    if (rasterTypes.includes(fileType) && previewUrl) {
      const img = new Image();
      img.onload = () => {
        const widthDpi = printWidthIn ? effectiveDpi(img.width, printWidthIn) : Infinity;
        const heightDpi = printHeightIn ? effectiveDpi(img.height, printHeightIn) : Infinity;
        const lowResWarning = Math.min(widthDpi, heightDpi) < MIN_ACCEPTABLE_DPI;
        const resolved: UploadedArtwork = {
          ...base,
          widthPx: img.width,
          heightPx: img.height,
          lowResWarning,
        };
        commit(resolved);
        persistArtwork(resolved);
      };
      img.src = previewUrl;
    } else {
      commit(base);
      persistArtwork(base);
    }
  }

  function handleRemove() {
    if (artwork?.previewUrl) URL.revokeObjectURL(artwork.previewUrl);
    setArtwork(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_ARTWORK_ACCEPT}
        className="sr-only"
        id="artwork-upload-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {!artwork ? (
        <label
          htmlFor="artwork-upload-input"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 bg-black/[0.02] px-4 py-8 text-center transition-colors hover:border-royal hover:bg-royal/5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
        >
          <Upload className="h-6 w-6 text-royal" aria-hidden="true" />
          <span className="text-sm font-semibold text-ink">{dropzoneLabel}</span>
          <span className="text-xs text-ink/50">{dropzoneHint}</span>
        </label>
      ) : (
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-start gap-3">
            {artwork.previewUrl ? (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white">
                {artwork.fileType === "PDF" ? (
                  <embed
                    src={artwork.previewUrl}
                    type="application/pdf"
                    className="h-16 w-16"
                    aria-label={`Preview of ${artwork.fileName}`}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artwork.previewUrl}
                    alt={`Preview of ${artwork.fileName}`}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-royal/10 text-royal">
                <File className="h-6 w-6" aria-hidden="true" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{artwork.fileName}</p>
              <p className="text-xs text-ink/50">
                {artwork.fileType} · {formatBytes(artwork.file.size)}
                {artwork.widthPx && artwork.heightPx
                  ? ` · ${artwork.widthPx}×${artwork.heightPx}px`
                  : ""}
              </p>

              {artwork.unsupportedPreview && (
                <p className="mt-1.5 text-xs text-ink/50">
                  Preview isn&apos;t available for {artwork.fileType} files — our team
                  will review it before printing.
                </p>
              )}

              {artwork.lowResWarning && (
                <p className="mt-1.5 flex items-start gap-1 text-xs font-semibold text-accent">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Low resolution for this print size — image may look blurry.
                  We recommend at least {MIN_ACCEPTABLE_DPI} DPI.
                </p>
              )}

              {!artwork.lowResWarning && !artwork.unsupportedPreview && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-royal">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Looks good for printing.
                </p>
              )}

              {artwork.uploadStatus === "uploading" && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-ink/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Saving your file…
                </p>
              )}
              {artwork.uploadStatus === "error" && (
                <p className="mt-1.5 text-xs font-semibold text-accent">
                  Couldn&apos;t save this file. You can still continue — please email
                  it to us as a backup just in case.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove artwork"
              className="shrink-0 rounded-full p-1.5 text-ink/40 hover:bg-black/5 hover:text-accent"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs font-semibold text-accent">{error}</p>}
    </div>
  );
}
