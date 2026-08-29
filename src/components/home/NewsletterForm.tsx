"use client";

import { useState } from "react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-sm font-semibold ${dark ? "text-cyan" : "text-royal"}`}>
        You&apos;re on the list! Watch your inbox for deals from Royal Eye Candy.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={`w-full flex-1 rounded-full border px-4 py-2.5 text-sm outline-none ${
          dark
            ? "border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-cyan"
            : "border-black/10 bg-white text-ink placeholder:text-ink/40 focus:border-royal"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Sign Up"}
      </button>
      {status === "error" && (
        <p className="text-xs text-accent sm:absolute">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
