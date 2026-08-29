import { AdminShell } from "@/components/admin/AdminShell";
import { StatTile } from "@/components/admin/StatTile";
import { RevenueBarChart } from "@/components/admin/RevenueBarChart";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAID_STATUSES = ["PAID", "IN_PRODUCTION", "SHIPPED", "COMPLETED"] as const;

export default async function AdminDashboardPage() {
  await requireAdminProfile();

  let stats: {
    totalRevenue: number;
    orderCount: number;
    avgOrderValue: number;
    dailyRevenue: { label: string; value: number }[];
  } | null = null;
  let dbError = false;

  try {
    const paidOrders = await prisma.order.findMany({
      where: { status: { in: [...PAID_STATUSES] } },
      select: { total: true, createdAt: true },
    });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const orderCount = paidOrders.length;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    const days = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const dailyRevenue = days.map((day) => {
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const value = paidOrders
        .filter((o) => o.createdAt >= day && o.createdAt < next)
        .reduce((sum, o) => sum + Number(o.total), 0);
      return {
        label: day.toLocaleDateString(undefined, { month: "numeric", day: "numeric" }),
        value,
      };
    });

    stats = { totalRevenue, orderCount, avgOrderValue, dailyRevenue };
  } catch (err) {
    console.error("Admin dashboard stats failed:", err);
    dbError = true;
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/50">Sales overview for the last 14 days.</p>

      {dbError || !stats ? (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so sales reports can't load. Set DATABASE_URL and run migrations — see README." />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Total revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
            <StatTile label="Paid orders" value={String(stats.orderCount)} />
            <StatTile label="Average order value" value={`$${stats.avgOrderValue.toFixed(2)}`} />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="font-display text-sm font-bold text-ink">Revenue, last 14 days</h2>
            <div className="mt-4">
              <RevenueBarChart data={stats.dailyRevenue} />
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
