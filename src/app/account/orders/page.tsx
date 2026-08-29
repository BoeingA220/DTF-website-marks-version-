import { redirect } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { getCurrentProfile } from "@/lib/auth";
import { getSafeUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export default async function OrdersPage() {
  const user = await getSafeUser();
  if (!user) redirect("/account/login");

  let profile;
  let orders: OrderWithItems[] = [];
  let dbError = false;

  try {
    profile = await getCurrentProfile();
    orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch (err) {
    console.error("Orders lookup failed:", err);
    dbError = true;
  }

  return (
    <AccountShell name={profile?.name ?? user.email}>
      <h1 className="font-display text-2xl font-bold text-ink">Your Orders</h1>

      {dbError && (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so past orders can't load." />
        </div>
      )}

      {!dbError && orders.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/15 py-16 text-center">
          <Package className="h-8 w-8 text-ink/30" aria-hidden="true" />
          <p className="text-sm text-ink/50">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="text-sm font-bold text-royal hover:underline">
            Start an order →
          </Link>
        </div>
      )}

      {!dbError && orders.length > 0 && (
        <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-black/[0.02]"
            >
              <div>
                <p className="font-display text-sm font-bold text-ink">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {order.createdAt.toLocaleDateString()} · {order.items.length} item
                  {order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="font-display text-sm font-bold text-ink">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
