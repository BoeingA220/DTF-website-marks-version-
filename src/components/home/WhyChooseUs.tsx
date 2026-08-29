import {
  Award,
  Clock,
  Cpu,
  Gem,
  MapPin,
  Palette,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { WHY_CHOOSE_US } from "@/lib/constants";

const ICONS: LucideIcon[] = [ShieldCheck, Cpu, Palette, Clock, MapPin, Gem, Award];

export function WhyChooseUs() {
  return (
    <section className="bg-royal py-16 text-white sm:py-20">
      <div className="container-brand">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Why Choose Royal Eye Candy
          </h2>
          <p className="mt-3 text-white/70">
            A local, veteran-owned print shop built for quality, speed, and
            no-hassle ordering.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/20 text-cyan">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/65">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
