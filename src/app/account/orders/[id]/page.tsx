import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Printer, Truck } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { ReorderButton } from "@/components/account/ReorderButton";
import { getCurrentProfile } from "@/lib/auth";
import { getSafeUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSafeUser();
  if (!user) redirect("/account/login");

  const profile = await getCurrentProfile();

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: { include: { artworkFile: true } } },
  });

  if (!order) notFound();

  return (
    <AccountShell name={profile?.name ?? user.email}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-ink/50">{order.createdAt.toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Link
            href={`/account/orders/${order.id}/invoice`}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/5"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Invoice
          </Link>
          <ReorderButton
            items={order.items.map((item) => ({
              productSlug: item.productSlug,
              category: item.category,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice),
              lineTotal: Number(item.lineTotal),
              widthIn: item.widthIn ? Number(item.widthIn) : undefined,
              heightIn: item.heightIn ? Number(item.heightIn) : undefined,
              variant: item.variant ?? undefined,
              artworkFileId: item.artworkFileId,
              artworkFileName: item.artworkFile?.originalName,
            }))}
          />
        </div>
      </div>

      {order.trackingNumber && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-royal/20 bg-royal/5 p-4">
          <Truck className="h-5 w-5 shrink-0 text-royal" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-ink">
              Tracking: {order.trackingNumber} {order.trackingCarrier ? `(${order.trackingCarrier})` : ""}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-display text-sm font-bold text-ink">{item.name}</p>
              <p className="text-sm text-ink/60">{item.description}</p>
              {item.variant && <p className="text-xs text-ink/50">{item.variant}</p>}
              <p className="text-xs text-ink/40">Qty {item.quantity}</p>
            </div>
            <p className="font-display text-sm font-bold text-ink">
              ${Number(item.lineTotal).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 ml-auto max-w-xs space-y-1.5 text-sm">
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
            <span>Discount</span>
            <span>-${Number(order.discount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-black/10 pt-2 font-display font-bold text-ink">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </AccountShell>
  );
}
