import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePageContent, type ServicePageData } from "@/components/services/ServicePageContent";

export const metadata: Metadata = {
  title: "Vehicle & Truck Wraps | Boise, Idaho",
  description:
    "Custom vehicle and truck wraps, decals, and fleet lettering in Boise, Idaho. Full wraps, partial wraps, and lettering for cars, trucks, and trailers.",
  alternates: { canonical: "/vehicle-wraps" },
};

const data: ServicePageData = {
  category: "Vehicle & Truck Wraps",
  eyebrow: "Vehicle Graphics",
  title: "Vehicle & Truck Wraps",
  heroDescription:
    "Full wraps, partial wraps, and lettering that turn a vehicle into a moving billboard — for a single car or a whole fleet.",
  intro:
    "Vehicle wraps are priced by vehicle size, wrap coverage, and design complexity, so an accurate quote takes a few details from you first — vehicle make/model, how much coverage you want (full wrap, partial, or lettering only), and your logo/design files if you have them. Send us photos of the vehicle and we'll get you an estimate fast.",
  highlights: [
    "Full, partial, and spot wraps",
    "Fleet lettering and consistent branding across multiple vehicles",
    "Cars, trucks, vans, and trailers",
    "Design help available if you don't have print-ready art",
    "Professional installation",
  ],
  turnaround: "Most wrap quotes turn around within 1-2 business days; installation scheduled after design approval.",
  useCases: ["Box truck wraps", "Fleet lettering", "Trailer graphics", "Food truck wraps", "Partial/spot graphics"],
};

export default function VehicleWrapsPage() {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.heroDescription} />
      <ServicePageContent data={data} />
    </>
  );
}
