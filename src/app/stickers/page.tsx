import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePageContent, type ServicePageData } from "@/components/services/ServicePageContent";

export const metadata: Metadata = {
  title: "Custom Sticker Printing | Die-Cut & Kiss-Cut Stickers",
  description:
    "Custom sticker printing in Boise, Idaho — die-cut, kiss-cut, and sheet stickers for brands, packaging, and events. Request a fast, no-obligation quote.",
  alternates: { canonical: "/stickers" },
};

const data: ServicePageData = {
  category: "Sticker Printing",
  eyebrow: "Stickers",
  title: "Custom Sticker Printing",
  heroDescription:
    "Die-cut, kiss-cut, and sheet stickers in any shape, printed with the same vibrant color and durability as our transfers.",
  intro:
    "From product packaging to event swag, we print custom stickers in the shape, finish, and quantity your project needs — glossy, matte, holographic, or clear, cut to any custom shape.",
  highlights: [
    "Die-cut (any custom shape) or kiss-cut sheets",
    "Glossy, matte, holographic, and clear vinyl options",
    "Water- and UV-resistant for outdoor use",
    "Individual stickers or full sheets",
    "No minimum order",
  ],
  turnaround: "Most sticker orders are printed and ready within 2-3 business days.",
  useCases: ["Product labels", "Laptop stickers", "Packaging", "Event swag", "Brand merch"],
};

export default function StickersPage() {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.heroDescription} />
      <ServicePageContent data={data} />
    </>
  );
}
