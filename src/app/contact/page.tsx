import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us | DTF Printing in Boise, Idaho",
  description:
    "Contact Royal Eye Candy for custom DTF transfers, gang sheets, and apparel printing in Boise, Idaho. Call 208-813-5543 or send us a message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get In Touch"
        description="Questions about an order, artwork, or turnaround time? We're happy to help."
      />

      <section className="container-brand grid grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-2">
        <div className="space-y-6">
          <ContactInfoRow icon={Phone} label="Phone">
            <a href={BUSINESS.phoneHref} className="font-semibold text-royal hover:underline">
              {BUSINESS.phone}
            </a>
          </ContactInfoRow>
          <ContactInfoRow icon={Mail} label="Email">
            <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-royal hover:underline">
              {BUSINESS.email}
            </a>
          </ContactInfoRow>
          <ContactInfoRow icon={MapPin} label="Location">
            <span>{BUSINESS.addressLine} · Local pickup available</span>
          </ContactInfoRow>
          <ContactInfoRow icon={Clock} label="Business Hours">
            <div className="space-y-1">
              {BUSINESS.hours.map((h) => (
                <p key={h.days}>
                  {h.days}: <span className="font-semibold">{h.time}</span>
                </p>
              ))}
            </div>
          </ContactInfoRow>
        </div>

        <ContactForm />
      </section>
    </>
  );
}

function ContactInfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-royal/10 text-royal">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink/40">{label}</p>
        <div className="mt-1 text-sm text-ink/80">{children}</div>
      </div>
    </div>
  );
}
