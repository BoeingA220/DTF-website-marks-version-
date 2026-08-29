import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TradeAudienceSection } from "@/components/home/TradeAudienceSection";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Custom Printing in Boise, Idaho | DTF, Signage, Vehicle Wraps & More",
  description:
    "Custom DTF transfers, apparel, stickers, signage, vehicle wraps, sublimation, canvas, and poster printing — all under one roof in Boise, Idaho. Vibrant color, fast turnaround, no minimum orders.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <WhyChooseUs />
      <TradeAudienceSection />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
