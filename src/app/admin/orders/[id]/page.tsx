import { notFound } from "next/navigation";
import Link from "next/link";
import { FileImage, Printer } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdminClient, ARTWORK_BUCKET, isSupabaseConfigured } from "@/lib/supabase/admin";
import { updateOrderStatus, updateTracking } from "./actions";

const STATUS_OPTIONS = ["PENDING_PAYMENT", "PAID", "IN_PRODUCTION", "SHIPPED", "COMPLETED", "CANCELLED"];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminProfile();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { artworkFile: true } } },
  });
  if (!order) notFound();

  const previewUrls = new Map<string, string>();
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    await Promise.all(
      order.items.map(async (item) => {
        if (!item.artworkFile) return;
        const { data } = await admin.storage
          .from(ARTWORK_BUCKET)
          .createSignedUrl(item.artworkFile.storagePath, 60 * 60);
        if (data?.signedUrl) previewUrls.set(item.artworkFile.id, data.signedUrl);
      })
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-ink/50">
            {order.user?.email ?? order.guestEmail} · {order.createdAt.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Link
            href={`/admin/orders/${order.id}/packing-slip`}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/5"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Packing Slip
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-black/[0.02]">
                {item.artworkFile && previewUrls.has(item.artworkFile.id) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrls.get(item.artworkFile.id)}
                    alt={item.artworkFile.originalName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <FileImage className="h-6 w-6 text-ink/20" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-ink">{item.name}</p>
                <p className="text-sm text-ink/60">{item.description}</p>
                {item.variant && <p className="text-xs text-ink/50">{item.variant}</p>}
                <p className="text-xs text-ink/40">
                  Qty {item.quantity} · ${Number(item.lineTotal).toFixed(2)}
                </p>
                {item.artworkFile && (
                  <p className="mt-1 truncate text-xs text-ink/40">
                    {item.artworkFile.originalName}
                    {item.artworkFile.lowResWarning && (
                      <span className="ml-1.5 font-semibold text-accent">Low resolution</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="font-display text-sm font-bold text-ink">Order Status</h2>
            <form action={updateOrderStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-royal"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white"
              >
                Update
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="font-display text-sm font-bold text-ink">Shipping &amp; Tracking</h2>
            {order.shippingOption && (
              <p className="mt-1 text-xs text-ink/50">Method: {order.shippingOption}</p>
            )}
            {order.trackingNumber && (
              <p className="mt-1 text-xs text-royal">
                Current: {order.trackingNumber} ({order.trackingCarrier})
              </p>
            )}
            <form action={updateTracking} className="mt-3 space-y-2">
              <input type="hidden" name="orderId" value={order.id} />
              <input
                type="text"
                name="trackingNumber"
                placeholder="Tracking number"
                required
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-royal"
              />
              <input
                type="text"
                name="trackingCarrier"
                placeholder="Carrier (USPS, UPS, FedEx…)"
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-royal"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white"
              >
                Send Tracking Email
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm">
            <h2 className="font-display text-sm font-bold text-ink">Totals</h2>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Shipping</span>
                <span>${Number(order.shipping).toFixed(2)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-royal">
                  <span>Discount ({order.couponCode})</span>
                  <span>-${Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-black/10 pt-2 font-display font-bold text-ink">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
