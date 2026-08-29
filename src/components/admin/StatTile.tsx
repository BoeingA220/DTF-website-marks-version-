export function StatTile({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: { text: string; positive: boolean };
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-sm text-ink/50">{label}</p>
      <p className="mt-1.5 font-display text-3xl font-semibold text-ink">{value}</p>
      {delta && (
        <p className={`mt-1 text-xs font-semibold ${delta.positive ? "text-royal" : "text-accent"}`}>
          {delta.text}
        </p>
      )}
    </div>
  );
}
