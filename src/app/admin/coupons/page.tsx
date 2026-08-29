import { AdminShell } from "@/components/admin/AdminShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCoupon, deleteCoupon, toggleCouponActive } from "./actions";

export default async function AdminCouponsPage() {
  await requireAdminProfile();

  let coupons: Awaited<ReturnType<typeof prisma.coupon.findMany>> = [];
  let dbError = false;
  try {
    coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("Admin coupons lookup failed:", err);
    dbError = true;
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-ink">Coupons</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form action={createCoupon} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="font-display text-sm font-bold text-ink">New Coupon</h2>
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-semibold text-ink">Code</label>
            <input
              id="code"
              name="code"
              type="text"
              required
              placeholder="WELCOME10"
              className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="mb-1.5 block text-sm font-semibold text-ink">Type</label>
              <select
                id="type"
                name="type"
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              >
                <option value="PERCENT">Percent off</option>
                <option value="FIXED">Fixed amount off</option>
              </select>
            </div>
            <div>
              <label htmlFor="value" className="mb-1.5 block text-sm font-semibold text-ink">Value</label>
              <input
                id="value"
                name="value"
                type="number"
                min={0}
                step={0.01}
                required
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minOrderAmount" className="mb-1.5 block text-sm font-semibold text-ink">
                Min order ($)
              </label>
              <input
                id="minOrderAmount"
                name="minOrderAmount"
                type="number"
                min={0}
                step={0.01}
                placeholder="Optional"
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              />
            </div>
            <div>
              <label htmlFor="expiresAt" className="mb-1.5 block text-sm font-semibold text-ink">
                Expires
              </label>
              <input
                id="expiresAt"
                name="expiresAt"
                type="date"
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Create Coupon
          </button>
        </form>

        <div>
          {dbError ? (
            <SetupNotice message="The database isn't connected yet, so coupons can't load." />
          ) : coupons.length === 0 ? (
            <p className="text-sm text-ink/50">No coupons yet.</p>
          ) : (
            <div className="divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{coupon.code}</p>
                    <p className="text-xs text-ink/50">
                      {coupon.type === "PERCENT" ? `${Number(coupon.value)}% off` : `$${Number(coupon.value)} off`}
                      {coupon.minOrderAmount ? ` · min $${Number(coupon.minOrderAmount)}` : ""}
                      {coupon.expiresAt ? ` · expires ${coupon.expiresAt.toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={toggleCouponActive}>
                      <input type="hidden" name="id" value={coupon.id} />
                      <input type="hidden" name="active" value={String(coupon.active)} />
                      <button
                        type="submit"
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          coupon.active ? "bg-royal/10 text-royal" : "bg-black/5 text-ink/40"
                        }`}
                      >
                        {coupon.active ? "Active" : "Disabled"}
                      </button>
                    </form>
                    <form action={deleteCoupon}>
                      <input type="hidden" name="id" value={coupon.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/5"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
