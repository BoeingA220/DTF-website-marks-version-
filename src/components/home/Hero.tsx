import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, var(--color-royal) 0%, transparent 45%), radial-gradient(circle at 85% 80%, var(--color-cyan) 0%, transparent 45%)",
        }}
        aria-hidden="true"
      />

      <div className="container-brand relative flex flex-col items-center gap-10 py-16 text-center md:py-24 lg:py-28">
        <Image
          src="/logo/eye-mark.svg"
          alt="Royal Eye Candy logo — colorful eye mark"
          width={120}
          height={120}
          priority
          className="drop-shadow-[0_0_40px_rgba(0,184,255,0.35)] motion-safe:animate-spin-slow"
        />

        <div className="max-w-3xl space-y-5">
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Custom Printing <span className="text-gradient-brand">for Every Idea</span>
          </h1>
          <p className="text-lg font-semibold text-white/80 sm:text-xl">
            Vibrant Colors&nbsp;•&nbsp;Fast Turnaround&nbsp;•&nbsp;No Minimum Orders
          </p>
          <p className="mx-auto max-w-xl text-sm text-white/60 sm:text-base">
            DTF transfers, apparel, stickers, signage, vehicle wraps, sublimation,
            and more — designed and printed right here in Boise, Idaho.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-transform hover:scale-[1.03]"
          >
            Order Now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/gang-sheets"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
            Build a Gang Sheet
          </Link>
        </div>
      </div>
    </section>
  );
}
