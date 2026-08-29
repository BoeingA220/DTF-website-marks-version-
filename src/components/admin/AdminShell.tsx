import Link from "next/link";
import {
  FileImage,
  LayoutDashboard,
  MessageSquareText,
  Package,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { SignOutButton } from "@/components/account/SignOutButton";
import { Logo } from "@/components/layout/Logo";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/quote-requests", label: "Quote Requests", icon: MessageSquareText },
  { href: "/admin/products", label: "Products & Inventory", icon: Package },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/artwork", label: "Artwork", icon: FileImage },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] bg-black/[0.02]">
      <div className="container-brand grid grid-cols-1 gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-4">
          <Logo size="sm" />
          <p className="text-xs font-bold uppercase tracking-wide text-ink/40">
            Admin
          </p>
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
      </div>
    </div>
  );
}
