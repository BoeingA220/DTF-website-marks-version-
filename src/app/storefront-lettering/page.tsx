import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePageContent, type ServicePageData } from "@/components/services/ServicePageContent";

export const metadata: Metadata = {
  title: "Storefront Lettering & Signage | Boise, Idaho",
  description:
    "Custom storefront window lettering and signage for Boise businesses. Vinyl lettering, window graphics, and interior signs, professionally installed.",
  alternates: { canonical: "/storefront-lettering" },
};

const data: ServicePageData = {
  category: "Storefront Lettering & Signage",
  eyebrow: "Signage",
  title: "Storefront Lettering & Signage",
  heroDescription:
    "Window lettering, storefront graphics, and interior signage that make a Boise business easy to find and hard to forget.",
  intro:
    "We design and cut vinyl lettering and graphics for storefront windows, doors, and interior signage. Because every storefront is a different size and shape, pricing depends on measurements — send us photos and dimensions and we'll put together an accurate quote.",
  highlights: [
    "Window and door lettering",
    "Logo and brand graphics for storefronts",
    "Interior wayfinding and directory signs",
    "Frosted/privacy vinyl for windows",
    "Design help if you don't have print-ready art",
  ],
  turnaround: "Most signage projects quote within 1 business day and install within a week.",
  useCases: ["Storefront hours & logo", "Window graphics", "Office directory signs", "Menu boards"],
};

export default function StorefrontLetteringPage() {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.heroDescription} />
      <ServicePageContent data={data} />
    </>
  );
}
