import { SITE_URL } from "@/lib/constants";

export function productJsonLd(opts: {
  name: string;
  description: string;
  lowPrice: number;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    brand: { "@type": "Brand", name: "Royal Eye Candy" },
    url: `${SITE_URL}${opts.path}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: opts.lowPrice,
      offerCount: 1,
      availability: "https://schema.org/InStock",
      areaServed: "US",
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
