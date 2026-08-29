import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "FAQ | DTF Transfers & Gang Sheets",
  description:
    "Answers to common questions about DTF transfers, gang sheets, artwork requirements, turnaround time, and shipping from Royal Eye Candy in Boise, Idaho.",
  alternates: { canonical: "/faq" },
};

const FAQ_ITEMS = [
  {
    question: "What is a DTF transfer?",
    answer:
      "DTF (Direct-to-Film) transfers are custom designs printed onto a special film with vibrant, durable inks and a powder adhesive, then heat pressed onto fabric. They work on cotton, polyester, blends, and more.",
  },
  {
    question: "What file formats do you accept?",
    answer:
      "We accept PNG, JPG, AI, PDF, SVG, PSD, and EPS files. For the best print quality, upload artwork at 300 DPI or higher at your intended print size.",
  },
  {
    question: "Is there a minimum order?",
    answer:
      "No minimums. Order a single transfer or a full gang sheet — whatever your project needs.",
  },
  {
    question: "What is a gang sheet?",
    answer:
      "A gang sheet is a single 24-inch-wide film sheet packed with multiple designs, letting you print many transfers at once for a lower cost per piece. Choose a standard length or a custom size up to 120 inches.",
  },
  {
    question: "How long does an order take?",
    answer:
      "Most orders are printed and ready within 2-3 business days. Rush processing is available at checkout for next-business-day production.",
  },
  {
    question: "How do I apply a DTF transfer?",
    answer:
      "Using a heat press, apply at approximately 300°F for 10-15 seconds with firm, even pressure, then peel the film while warm. We include care instructions with every order.",
  },
  {
    question: "Do you ship outside of Boise?",
    answer:
      "Yes — we ship nationwide. Local pickup is also available in Boise, Idaho at no charge.",
  },
  {
    question: "What if my artwork resolution is too low?",
    answer:
      "Our uploader automatically checks raster image resolution against your chosen print size and will warn you if the image may print blurry, so you can fix it before ordering.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Everything you need to know about ordering DTF transfers, gang sheets, and custom apparel."
      />
      <section className="container-brand max-w-3xl py-10 sm:py-14">
        <Accordion items={FAQ_ITEMS} />
      </section>
    </>
  );
}
