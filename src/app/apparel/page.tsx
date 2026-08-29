import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ApparelCalculator } from "@/components/product/ApparelCalculator";
import { JsonLd, productJsonLd } from "@/lib/seo";
import { APPAREL_STYLES } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Custom Apparel Printing | Tees, Hoodies, Sweatshirts & Polos",
  description:
    "Custom apparel printing in Boise, Idaho. Choose a t-shirt, hoodie, sweatshirt, or polo, upload your artwork, and get instant pricing.",
  alternates: { canonical: "/apparel" },
};

const lowestPrice = Math.min(...APPAREL_STYLES.map((s) => s.basePrice));

export default function ApparelPage() {
  return (
    <>
      <JsonLd
        data={productJsonLd({
          name: "Custom Apparel Printing",
          description: "Custom-printed t-shirts, hoodies, sweatshirts, and polos, printed in Boise, Idaho.",
          lowPrice: lowestPrice,
          path: "/apparel",
        })}
      />
      <PageHero
        eyebrow="Apparel Printing"
        title="Custom Apparel Printing"
        description="T-shirts, hoodies, sweatshirts, and polos — printed with premium DTF transfers for a soft feel and vibrant color that lasts."
      />
      <section className="container-brand py-10 sm:py-14">
        <ApparelCalculator />
      </section>
    </>
  );
}
