import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { DtfCalculator } from "@/components/product/DtfCalculator";
import { JsonLd, productJsonLd } from "@/lib/seo";
import { DTF_MIN_ORDER_PRICE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Custom DTF Transfers | Order Online",
  description:
    "Build your custom DTF transfer: choose a size, upload your artwork, and get instant pricing. No minimum orders, printed in Boise, Idaho.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: "Custom DTF Transfer",
          description: "Custom DTF (Direct-to-Film) heat transfers, printed to order in Boise, Idaho.",
          lowPrice: DTF_MIN_ORDER_PRICE,
          path: "/shop",
        })}
      />
      <PageHero
        eyebrow="DTF Transfers"
        title="Custom DTF Transfers"
        description="Choose your size, upload your artwork, and get instant pricing. Ready to heat press onto cotton, poly, and blends."
      />
      <section className="container-brand py-10 sm:py-14">
        <DtfCalculator />
      </section>
    </>
  );
}
