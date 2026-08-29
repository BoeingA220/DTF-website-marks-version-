import { Mail } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="bg-gradient-brand py-16 text-white sm:py-20">
      <div className="container-brand flex flex-col items-center gap-5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
          Get 10% Off Your First Order
        </h2>
        <p className="max-w-md text-white/85">
          Join our list for exclusive deals, new product drops, and printing
          tips from the Royal Eye Candy team.
        </p>
        <NewsletterForm dark />
      </div>
    </section>
  );
}
