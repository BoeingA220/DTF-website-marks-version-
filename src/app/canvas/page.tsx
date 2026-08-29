import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePageContent, type ServicePageData } from "@/components/services/ServicePageContent";

export const metadata: Metadata = {
  title: "Canvas Printing | Custom Gallery-Wrapped Canvas Prints",
  description:
    "Custom canvas printing in Boise, Idaho. Gallery-wrapped canvas prints for photos, artwork, and business decor, in any size. Request a quote.",
  alternates: { canonical: "/canvas" },
};

const data: ServicePageData = {
  category: "Canvas Printing",
  eyebrow: "Canvas",
  title: "Canvas Printing",
  heroDescription:
    "Gallery-wrapped canvas prints for photos, artwork, and business decor — printed on premium canvas and stretched over a solid wood frame.",
  intro:
    "Whether it's a family photo, original artwork, or branded decor for a lobby, we print and stretch canvas in-house so you get a ready-to-hang piece, not just a flat print.",
  highlights: [
    "Gallery-wrapped over solid wood frames",
    "Any custom size, single pieces or multi-panel sets",
    "Fade-resistant archival inks",
    "Fine art, photo, and business/branding prints",
    "Ready to hang — no framing needed",
  ],
  turnaround: "Canvas prints typically ship within 3-5 business days.",
  useCases: ["Family photos", "Fine art reproductions", "Office & lobby decor", "Event photo gifts"],
};

export default function CanvasPage() {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.heroDescription} />
      <ServicePageContent data={data} />
    </>
  );
}
