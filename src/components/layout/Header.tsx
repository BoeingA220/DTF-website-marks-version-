"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Phone, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { CartLink } from "./CartLink";
import { ShopMegaMenu } from "./ShopMegaMenu";
import { BUSINESS, NAV_LINKS, SHOP_MENU_GROUPS } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);
  const [shopOpenMobile, setShopOpenMobile] = useState(false);

  const [homeLink, ...restLinks] = NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur supports-backdrop-blur:bg-white/80">
      <div className="hidden bg-ink text-white md:block">
        <div className="container-brand flex h-9 items-center justify-between text-xs">
          <p>{BUSINESS.hours[0].days}: {BUSINESS.hours[0].time} · Boise, Idaho</p>
          <a
            href={BUSINESS.phoneHref}
            className="flex items-center gap-1.5 font-semibold text-cyan hover:text-white"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {BUSINESS.phone}
          </a>
        </div>
      </div>

      <div className="container-brand flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo size="md" />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <Link
            href={homeLink.href}
            className="text-sm font-semibold text-ink/80 transition-colors hover:text-royal"
          >
            {homeLink.label}
          </Link>
          <ShopMegaMenu />
          {restLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink/80 transition-colors hover:text-royal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Link
            href="/account"
            aria-label="My account"
            className="hidden rounded-full p-2 text-ink transition-colors hover:bg-black/5 md:inline-flex"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>
          <CartLink />
          <Link
            href="/gang-sheets"
            className="hidden rounded-full bg-gradient-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] md:inline-flex"
          >
            Build a Gang Sheet
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-full p-2 text-ink hover:bg-black/5 lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-black/5 bg-white lg:hidden"
        >
          <ul className="container-brand flex flex-col divide-y divide-black/5 py-2">
            <li>
              <Link
                href={homeLink.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-semibold text-ink"
              >
                {homeLink.label}
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setShopOpenMobile((v) => !v)}
                aria-expanded={shopOpenMobile}
                className="flex w-full items-center justify-between py-3 text-base font-semibold text-ink"
              >
                Shop
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${shopOpenMobile ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {shopOpenMobile && (
                <div className="pb-3">
                  {SHOP_MENU_GROUPS.map((group) => (
                    <div key={group.title} className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-ink/40">
                        {group.title}
                      </p>
                      <ul className="mt-1.5 space-y-2">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className="block py-1 text-sm font-semibold text-ink/80"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>

            {restLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-semibold text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-semibold text-ink"
              >
                My Account
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
