import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/account/PrintButton";
import { getSafeUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { BUSINESS, SITE_NAME } from "@/lib/constants";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSafeUser();
  if (!user) redirect("/account/login");

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="container-brand max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink">Invoice</h1>
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-8">
        <div className="flex items-start justify-between border-b border-black/10 pb-6">
          <div>
            <p className="font-display text-lg font-extrabold text-ink">{SITE_NAME}</p>
            <p className="text-sm text-ink/60">{BUSINESS.addressLine}</p>
            <p className="text-sm text-ink/60">{BUSINESS.phone}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-sm font-bold text-ink">
              Invoice #{order.id.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-ink/60">{order.createdAt.toLocaleDateString()}</p>
            <p className="text-sm text-ink/60">Status: {order.status.replace("_", " ")}</p>
          </div>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-ink/50">
              <th className="py-2 font-semibold">Item</th>
              <th className="py-2 text-right font-semibold">Qty</th>
              <th className="py-2 text-right font-semibold">Unit Price</th>
              <th className="py-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5">
                  {item.name}
                  {item.variant && <span className="text-ink/50"> — {item.variant}</span>}
                </td>
                <td className="py-2.5 text-right">{item.quantity}</td>
                <td className="py-2.5 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                <td className="py-2.5 text-right">${Number(item.lineTotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

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
            <span>Total Paid</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
