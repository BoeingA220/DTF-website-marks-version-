import { CheckCircle2, Clock } from "lucide-react";
import { QuoteRequestForm } from "@/components/quote/QuoteRequestForm";

export type ServicePageData = {
  category: string;
  eyebrow: string;
  title: string;
  heroDescription: string;
  intro: string;
  highlights: string[];
  turnaround: string;
  useCases: string[];
};

export function ServicePageContent({ data }: { data: ServicePageData }) {
  return (
    <section className="container-brand py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6 rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-ink/70">{data.intro}</p>

          <div>
            <h2 className="font-display text-lg font-bold text-ink">What&apos;s Included</h2>
            <ul className="mt-3 space-y-2.5">
              {data.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-royal/5 p-4 text-sm text-ink/70">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-royal" aria-hidden="true" />
            <span>{data.turnaround}</span>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-ink">Common Projects</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-semibold text-ink/70"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>

        <QuoteRequestForm category={data.category} />
      </div>
    </section>
  );
}
