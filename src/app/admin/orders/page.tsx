import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  await requireAdminProfile();

  let orders: Awaited<ReturnType<typeof fetchOrders>> = [];
  let dbError = false;
  try {
    orders = await fetchOrders();
  } catch (err) {
    console.error("Admin orders lookup failed:", err);
    dbError = true;
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-ink">Orders</h1>

      {dbError ? (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so orders can't load." />
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-sm text-ink/50">No orders yet.</p>
      ) : (
        <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-black/[0.02]"
            >
              <div>
                <p className="font-display text-sm font-bold text-ink">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-ink/50">
                  {order.user?.email ?? order.guestEmail} · {order.createdAt.toLocaleDateString()}
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
    </AdminShell>
  );
}

function fetchOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 100,
  });
}
