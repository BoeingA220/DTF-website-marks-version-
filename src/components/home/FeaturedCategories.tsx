import Link from "next/link";
import {
  Flame,
  Frame,
  GalleryVertical,
  LayoutGrid,
  Scissors,
  Shirt,
  Sparkles,
  Sticker,
  Store,
  Truck,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { FEATURED_CATEGORIES } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  "shirt-transfer": Layers,
  "layout-grid": LayoutGrid,
  shirt: Shirt,
  sticker: Sticker,
  flame: Flame,
  frame: Frame,
  "gallery-vertical": GalleryVertical,
  store: Store,
  scissors: Scissors,
  truck: Truck,
};

export function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-brand">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-3 text-ink/60">
            Everything you need to bring your designs to life, printed on
            commercial equipment right here in Boise.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? Sparkles;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-125"
                  style={{ background: "var(--color-royal)" }}
                  aria-hidden="true"
                />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="relative mt-4 font-display text-lg font-bold text-ink">
                  {cat.title}
                </h3>
                <p className="relative mt-1.5 text-sm text-ink/60">
                  {cat.description}
                </p>
                <span className="relative mt-4 inline-block text-sm font-bold text-royal group-hover:text-accent">
                  Shop now →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
