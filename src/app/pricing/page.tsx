import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { GANG_SHEET_LENGTHS, GANG_SHEET_WIDTH_IN } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing | DTF Transfers, Gang Sheets, Signage & More",
  description:
    "Transparent pricing for custom DTF transfers, gang sheets, and apparel printing, plus custom quotes for stickers, signage, vehicle wraps, and more. No minimum orders.",
  alternates: { canonical: "/pricing" },
};

const CUSTOM_QUOTE_ITEMS = [
  { label: "Sublimation Printing", href: "/sublimation", description: "Mugs, tumblers, ornaments & blanks" },
  { label: "Stickers", href: "/stickers", description: "Die-cut & kiss-cut, any shape" },
  { label: "Posters & Wide Format", href: "/posters", description: "Event & retail display graphics" },
  { label: "Canvas Prints", href: "/canvas", description: "Gallery-wrapped photo & art prints" },
  { label: "Storefront Lettering & Signage", href: "/storefront-lettering", description: "Window & interior signs" },
  { label: "Vinyl Printing", href: "/vinyl-printing", description: "Decals, walls & floor graphics" },
  { label: "Vehicle & Truck Wraps", href: "/vehicle-wraps", description: "Full wraps & fleet lettering" },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple, Transparent Pricing"
        description="No minimum orders, no hidden fees. Bigger orders unlock automatic volume pricing."
      />

      <section className="container-brand space-y-14 py-10 sm:py-14">
        <PricingBlock
          title="DTF Transfers"
          description="Priced per square inch — the more you order, the lower your rate per transfer."
          href="/shop"
          cta="Get an Instant Quote"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-ink/50">
                <th className="py-2 font-semibold">Total Order Size</th>
                <th className="py-2 font-semibold">Rate per sq. in.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr><td className="py-2.5">Up to 100 sq in</td><td className="py-2.5">$0.20</td></tr>
              <tr><td className="py-2.5">100 – 300 sq in</td><td className="py-2.5">$0.16</td></tr>
              <tr><td className="py-2.5">300 – 600 sq in</td><td className="py-2.5">$0.13</td></tr>
              <tr><td className="py-2.5">600 – 1,200 sq in</td><td className="py-2.5">$0.10</td></tr>
              <tr><td className="py-2.5">1,200+ sq in</td><td className="py-2.5">$0.08</td></tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-ink/50">$6 minimum per order.</p>
        </PricingBlock>

        <PricingBlock
          title="Gang Sheets"
          description={`All sheets are ${GANG_SHEET_WIDTH_IN}" wide. Choose a standard length or go custom.`}
          href="/gang-sheets"
          cta="Build a Gang Sheet"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-ink/50">
                <th className="py-2 font-semibold">Length</th>
                <th className="py-2 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {GANG_SHEET_LENGTHS.map((l) => (
                <tr key={l.lengthIn}>
                  <td className="py-2.5">{GANG_SHEET_WIDTH_IN}&quot; × {l.lengthIn}&quot;</td>
                  <td className="py-2.5">${l.price.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2.5">Custom (12&quot; – 120&quot;)</td>
                <td className="py-2.5">~$1.02 / linear in.</td>
              </tr>
            </tbody>
          </table>
        </PricingBlock>

        <PricingBlock
          title="Apparel Printing"
          description="Garment cost + print area. Choose your style and size at checkout."
          href="/apparel"
          cta="Design Your Apparel"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-ink/50">
                <th className="py-2 font-semibold">Style</th>
                <th className="py-2 font-semibold">Starting at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr><td className="py-2.5">T-Shirt</td><td className="py-2.5">$12</td></tr>
              <tr><td className="py-2.5">Polo Shirt</td><td className="py-2.5">$18</td></tr>
              <tr><td className="py-2.5">Sweatshirt</td><td className="py-2.5">$22</td></tr>
              <tr><td className="py-2.5">Hoodie</td><td className="py-2.5">$28</td></tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-ink/50">
            Plus $0.12 per square inch of print area.
          </p>
        </PricingBlock>

        <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-ink">
            Custom &amp; Large-Format Printing
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Sublimation, stickers, signage, vehicle wraps, and other large-format
            work is priced based on size, material, and coverage — request a
            quote and we&apos;ll get back to you within one business day.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CUSTOM_QUOTE_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-black/10 p-4 transition-colors hover:border-royal hover:bg-royal/5"
              >
                <p className="text-sm font-bold text-ink">{item.label}</p>
                <p className="mt-1 text-xs text-ink/50">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PricingBlock({
  title,
  description,
  href,
  cta,
  children,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-black/10 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm text-ink/60">{description}</p>
        <Link
          href={href}
          className="mt-4 inline-flex rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
        >
          {cta}
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
