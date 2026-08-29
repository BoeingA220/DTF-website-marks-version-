import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePageContent, type ServicePageData } from "@/components/services/ServicePageContent";

export const metadata: Metadata = {
  title: "Custom Vinyl Printing & Cutting | Boise, Idaho",
  description:
    "Custom vinyl printing and cutting in Boise, Idaho — decals, wall graphics, floor graphics, and cut vinyl lettering for business and personal use.",
  alternates: { canonical: "/vinyl-printing" },
};

const data: ServicePageData = {
  category: "Vinyl Printing",
  eyebrow: "Vinyl",
  title: "Vinyl Printing & Cutting",
  heroDescription:
    "Printed and cut vinyl for decals, wall graphics, floor graphics, and lettering — indoor or outdoor, any color, any shape.",
  intro:
    "Vinyl is one of the most flexible materials we work with — decals for equipment and cars, full wall murals, floor graphics for retail, or precision-cut lettering for signs. Tell us the surface and size and we'll spec the right material and adhesive.",
  highlights: [
    "Printed full-color vinyl or single-color cut vinyl",
    "Wall murals and floor graphics",
    "Equipment, cooler, and product decals",
    "Indoor and outdoor-rated adhesives",
    "Removable and permanent options",
  ],
  turnaround: "Most vinyl projects quote within 1 business day.",
  useCases: ["Wall murals", "Floor decals", "Equipment labels", "Trailer graphics", "Window clings"],
};

export default function VinylPrintingPage() {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.heroDescription} />
      <ServicePageContent data={data} />
    </>
  );
}
