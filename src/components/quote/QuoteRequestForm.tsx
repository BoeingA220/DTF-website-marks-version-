"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ArtworkUploader } from "@/components/product/ArtworkUploader";
import type { UploadedArtwork } from "@/types";
import { BUSINESS } from "@/lib/constants";

export function QuoteRequestForm({ category }: { category: string }) {
  const [artwork, setArtwork] = useState<UploadedArtwork | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          category,
          artworkFileId: artwork?.artworkFileId ?? null,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
      setArtwork(null);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-royal/20 bg-royal/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-royal" aria-hidden="true" />
        <p className="mt-2 font-display text-lg font-bold text-royal">Request received!</p>
        <p className="mt-1 text-sm text-ink/60">
          We&apos;ll follow up within one business day with pricing and next steps. Need it
          faster? Call us at{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold text-royal hover:underline">
            {BUSINESS.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-black/10 bg-white p-6"
    >
      <h2 className="font-display text-lg font-bold text-ink">Request a Quote</h2>
      <p className="text-sm text-ink/50">
        Tell us about your project and we&apos;ll get back to you with pricing —
        usually within one business day.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Phone" name="phone" type="tel" />
      <Field
        label="Project Details"
        name="projectDetails"
        as="textarea"
        required
        placeholder="Sizes, quantities, vehicle/storefront details, timeline — whatever you know so far."
      />

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Reference Photo or Artwork (optional)
        </label>
        <ArtworkUploader
          onChange={setArtwork}
          dropzoneLabel="Click to upload or drag & drop a photo or file"
          dropzoneHint="PNG, JPG, AI, PDF, SVG, PSD, or EPS"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Request a Quote"}
      </button>
      {status === "error" && (
        <p className="text-center text-xs font-semibold text-accent">
          Something went wrong. Please try again or call us directly.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  as = "input",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  placeholder?: string;
}) {
  const id = `quote-${name}`;
  const commonProps = {
    id,
    name,
    required,
    placeholder,
    className:
      "w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal",
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea rows={4} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
}
