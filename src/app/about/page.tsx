import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Cpu, MapPin, Palette } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Veteran-Owned Print Shop in Boise, Idaho",
  description:
    "Royal Eye Candy is a veteran-owned custom print shop based in Boise, Idaho — DTF transfers, apparel, signage, vehicle wraps, and more, delivered fast on commercial equipment.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={`Meet ${BUSINESS.name}`}
        description={`Founded by ${BUSINESS.owner}, ${BUSINESS.name} is a veteran-owned print shop proudly based in ${BUSINESS.addressLine}.`}
      />

      <section className="container-brand grid grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4 text-ink/70">
          <p>
            {BUSINESS.name} started with DTF transfers and has grown into a
            full-service print shop — apparel, stickers, signage, vehicle
            wraps, sublimation, and more — without losing the fast turnaround
            and no-minimums approach we started with. Everything is produced
            in-house on commercial equipment, so you get sharp detail and
            brilliant, durable color on every order.
          </p>
          <p>
            As a veteran-owned small business, we care about doing things
            right — that means real people answering the phone, honest
            pricing, and artwork checked by hand before it ever hits the
            press.
          </p>
          <p>
            We also work behind the scenes with graphic designers handling
            client production, and with other commercial print shops as
            overflow or backup capacity when they&apos;re running behind.
            Whether you&apos;re ordering a one-off gift or a fleet of truck
            wraps, we treat every order — big or small — the same way: fast,
            careful, and vibrant.
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Get in Touch
          </Link>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-gradient-brand p-10">
          <Image
            src="/logo/eye-mark.svg"
            alt="Royal Eye Candy eye mark logo"
            width={220}
            height={220}
          />
        </div>
      </section>

      <section className="bg-black/[0.02] py-14">
        <div className="container-brand grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AboutStat icon={Award} label="Veteran Owned" />
          <AboutStat icon={Cpu} label="Commercial Equipment" />
          <AboutStat icon={Palette} label="Brilliant, Lasting Color" />
          <AboutStat icon={MapPin} label={`Made in ${BUSINESS.addressLine}`} />
        </div>
      </section>
    </>
  );
}

function AboutStat({
  icon: Icon,
  label,
}: {
  icon: typeof Award;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-royal/10 text-royal">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="font-display text-sm font-bold text-ink">{label}</p>
    </div>
  );
}
