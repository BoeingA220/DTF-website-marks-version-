import Link from "next/link";
import { FileImage, LayoutDashboard, Package } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const NAV = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/artwork", label: "Saved Artwork", icon: FileImage },
];

export function AccountShell({
  name,
  children,
}: {
  name?: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="container-brand grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
            Welcome back
          </p>
          <p className="font-display text-lg font-bold text-ink">{name || "Friend"}</p>
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink/70 hover:bg-black/5 hover:text-ink"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </aside>
      <div>{children}</div>
    </section>
  );
}
