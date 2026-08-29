import { Star } from "lucide-react";
import { SEED_REVIEWS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-brand">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            What Customers Are Saying
          </h2>
          <p className="mt-3 text-ink/60">
            Real feedback from real Royal Eye Candy customers.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {SEED_REVIEWS.map((review) => (
            <figure
              key={review.author}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-0.5 text-accent" aria-hidden="true">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm text-ink/75">
                &ldquo;{review.body}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-bold text-ink">
                {review.author}
              </figcaption>
            </figure>
          ))}
        </div>

        {/*
          Google Reviews live embed: once the business's Google Place ID is
          available, replace this block with the Google Places widget (or an
          embed service) pointed at that Place ID.
        */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-ink/50">
          <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          <span>Live Google Reviews will appear here once connected.</span>
        </div>
      </div>
    </section>
  );
}
