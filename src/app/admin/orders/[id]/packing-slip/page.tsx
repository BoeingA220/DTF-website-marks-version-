import { notFound } from "next/navigation";
import { PrintButton } from "@/components/account/PrintButton";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BUSINESS, SITE_NAME } from "@/lib/constants";

export default async function PackingSlipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminProfile();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: true },
  });
  if (!order) notFound();

  const address = order.shippingAddress as {
    name?: string;
    address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string };
  } | null;

  return (
    <div className="container-brand max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-ink">Packing Slip</h1>
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-8">
        <div className="flex items-start justify-between border-b border-black/10 pb-6">
          <div>
            <p className="font-display text-lg font-extrabold text-ink">{SITE_NAME}</p>
            <p className="text-sm text-ink/60">{BUSINESS.addressLine}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-sm font-bold text-ink">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-ink/60">{order.createdAt.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 border-b border-black/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Ship To</p>
          <p className="mt-1 text-sm text-ink/80">
            {address?.name ?? order.user?.name ?? "—"}
            <br />
            {address?.address?.line1}
            {address?.address?.line2 ? `, ${address.address.line2}` : ""}
            <br />
            {address?.address?.city ? `${address.address.city}, ` : ""}
            {address?.address?.state} {address?.address?.postal_code}
          </p>
          <p className="mt-1 text-xs text-ink/50">Method: {order.shippingOption ?? "—"}</p>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-ink/50">
              <th className="py-2 font-semibold">Item</th>
              <th className="py-2 text-right font-semibold">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5">
                  {item.name}
                  {item.variant && <span className="text-ink/50"> — {item.variant}</span>}
                  <br />
                  <span className="text-xs text-ink/50">{item.description}</span>
                </td>
                <td className="py-2.5 text-right">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
