import { AlertTriangle } from "lucide-react";

export function SetupNotice({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-5">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      <div>
        <p className="font-display text-sm font-bold text-ink">Setup needed</p>
        <p className="mt-1 text-sm text-ink/60">{message}</p>
      </div>
    </div>
  );
}
