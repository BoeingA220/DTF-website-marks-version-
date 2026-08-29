import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePageContent, type ServicePageData } from "@/components/services/ServicePageContent";

export const metadata: Metadata = {
  title: "Poster & Wide Format Printing | Large-Format Prints Boise, ID",
  description:
    "Custom poster and wide-format printing in Boise, Idaho — posters, banners, and large-format graphics for events, retail, and displays.",
  alternates: { canonical: "/posters" },
};

const data: ServicePageData = {
  category: "Posters & Wide Format",
  eyebrow: "Posters & Wide Format",
  title: "Posters & Wide Format Printing",
  heroDescription:
    "Large-format posters, banners, and display graphics for events, retail, and trade shows — printed sharp at any size.",
  intro:
    "From a single event poster to a full trade show display, we handle large-format printing on paper, vinyl banner material, and foam board, with mounting and finishing options available.",
  highlights: [
    "Posters on photo paper, matte, or vinyl",
    "Indoor and outdoor vinyl banners",
    "Foam board and rigid substrate mounting",
    "Grommets, pole pockets, and hemming available",
    "Any custom size up to large-format widths",
  ],
  turnaround: "Standard posters and banners ship within 2-4 business days; rush available.",
  useCases: ["Event posters", "Retail displays", "Trade show graphics", "Menu boards", "Yard signs"],
};

export default function PostersPage() {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.heroDescription} />
      <ServicePageContent data={data} />
    </>
  );
}
