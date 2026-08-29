import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GangSheetBuilder } from "@/components/product/GangSheetBuilder";
import { JsonLd, productJsonLd } from "@/lib/seo";
import { GANG_SHEET_LENGTHS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Build a Custom Gang Sheet | DTF Gang Sheets",
  description:
    "Build your own DTF gang sheet: 24 inch wide, choose a standard or custom length, upload your artwork, and see a live preview with instant pricing.",
  alternates: { canonical: "/gang-sheets" },
};

export default function GangSheetsPage() {
  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: "Custom DTF Gang Sheet",
          description: "24 inch wide DTF gang sheets, printed to order in Boise, Idaho.",
          lowPrice: GANG_SHEET_LENGTHS[0].price,
          path: "/gang-sheets",
        })}
      />
      <PageHero
        eyebrow="Gang Sheets"
        title="Build a Gang Sheet"
        description="Fill a 24 inch wide sheet with as many designs as you'd like. Choose a standard length or go custom, up to 120 inches."
      />
      <section className="container-brand py-10 sm:py-14">
        <GangSheetBuilder />
      </section>
    </>
  );
}
