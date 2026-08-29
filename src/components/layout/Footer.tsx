import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { BUSINESS, SHOP_MENU_GROUPS } from "@/lib/constants";

export function Footer() {
  const [printGroup, largeFormatGroup, signsGroup] = SHOP_MENU_GROUPS;
  const specialtyItems = [...largeFormatGroup.items, ...signsGroup.items];

  return (
    <footer className="bg-ink text-white/80">
      <div className="container-brand grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Logo variant="light" size="sm" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Custom DTF transfers, signage, vehicle graphics, sublimation, and
            more — designed and printed in Boise, Idaho.
          </p>
          <SocialIcons className="mt-5" />
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            {printGroup.title}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {printGroup.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-cyan">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Signs &amp; Specialty
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {specialtyItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-cyan">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="hover:text-cyan">About</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-cyan">FAQ</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan">Contact</Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-cyan">My Account</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              <a href={BUSINESS.phoneHref} className="hover:text-cyan">{BUSINESS.phone}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-cyan">{BUSINESS.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              <span>{BUSINESS.addressLine}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              <span className="space-y-0.5">
                {BUSINESS.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-brand flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50 sm:max-w-xs">
            Get exclusive deals &amp; new product drops in your inbox.
          </p>
          <NewsletterForm dark />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-brand flex flex-col gap-2 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved. Veteran
            owned &amp; operated in {BUSINESS.addressLine}.
          </p>
          <p>DTF Transfers · Signage · Vehicle Wraps · Sublimation · Apparel</p>
        </div>
      </div>
    </footer>
  );
}
