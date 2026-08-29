const STYLES: Record<string, string> = {
  PENDING_PAYMENT: "bg-black/5 text-ink/60",
  PAID: "bg-royal/10 text-royal",
  IN_PRODUCTION: "bg-cyan/15 text-cyan-dark",
  SHIPPED: "bg-royal/10 text-royal",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-accent/10 text-accent",
};

const LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  IN_PRODUCTION: "In Production",
  SHIPPED: "Shipped",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${
        STYLES[status] ?? "bg-black/5 text-ink/60"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
