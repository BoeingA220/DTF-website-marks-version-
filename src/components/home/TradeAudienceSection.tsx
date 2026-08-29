import Link from "next/link";
import { Factory, Palette } from "lucide-react";

export function TradeAudienceSection() {
  return (
    <section className="border-y border-black/5 bg-black/[0.02] py-14">
      <div className="container-brand">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Also Serving Designers &amp; Print Shops
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Not just a retail storefront — we work behind the scenes too.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-royal/10 text-royal">
              <Palette className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-ink">
              For Graphic Designers
            </h3>
            <p className="mt-1.5 text-sm text-ink/60">
              Hand off a client project and we&apos;ll handle production — fast
              turnaround so you never miss a deadline.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan/10 text-cyan-dark">
              <Factory className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-ink">
              For Print Shops
            </h3>
            <p className="mt-1.5 text-sm text-ink/60">
              Overflow capacity when you&apos;re slammed — we print backup and
              white-label orders for other shops, no questions asked.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/contact"
            className="inline-flex rounded-full border border-royal px-5 py-2.5 text-sm font-bold text-royal transition-colors hover:bg-royal hover:text-white"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
