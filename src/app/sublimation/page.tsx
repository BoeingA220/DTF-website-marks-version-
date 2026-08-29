import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePageContent, type ServicePageData } from "@/components/services/ServicePageContent";

export const metadata: Metadata = {
  title: "Sublimation Printing | Mugs, Tumblers & Custom Blanks",
  description:
    "Custom sublimation printing in Boise, Idaho for mugs, tumblers, ornaments, and apparel blanks. Vivid, permanent color that won't peel or crack.",
  alternates: { canonical: "/sublimation" },
};

const data: ServicePageData = {
  category: "Sublimation Printing",
  eyebrow: "Sublimation",
  title: "Sublimation Printing",
  heroDescription:
    "Full-color, edge-to-edge designs dyed directly into mugs, tumblers, ornaments, and polyester blanks — permanent color that won't peel, crack, or fade.",
  intro:
    "Sublimation bonds ink directly into the surface of specially coated blanks, so the design becomes part of the material instead of sitting on top of it. Great for photo gifts, drinkware, and all-over apparel prints.",
  highlights: [
    "Mugs, tumblers, and drinkware",
    "Ornaments, coasters, and photo panels",
    "All-over sublimated apparel on poly blanks",
    "Full-color, edge-to-edge, no white halo",
    "Dishwasher- and scratch-resistant results",
  ],
  turnaround: "Most sublimation orders ship within 2-4 business days.",
  useCases: ["Photo mugs", "Team tumblers", "Custom ornaments", "All-over tees", "Gift sets"],
};

export default function SublimationPage() {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.heroDescription} />
      <ServicePageContent data={data} />
    </>
  );
}
