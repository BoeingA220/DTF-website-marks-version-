import type { Prisma } from "@prisma/client";
import { MessageSquareText } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdminClient, ARTWORK_BUCKET, isSupabaseConfigured } from "@/lib/supabase/admin";
import { updateQuoteRequestStatus } from "./actions";

const STATUS_OPTIONS = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

type QuoteRequestWithArtwork = Prisma.QuoteRequestGetPayload<{
  include: { artworkFile: true };
}>;

export default async function AdminQuoteRequestsPage() {
  await requireAdminProfile();

  let requests: QuoteRequestWithArtwork[] = [];
  let dbError = false;
  try {
    requests = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { artworkFile: true },
      take: 100,
    });
  } catch (err) {
    console.error("Admin quote requests lookup failed:", err);
    dbError = true;
  }

  const previewUrls = new Map<string, string>();
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    await Promise.all(
      requests.map(async (r) => {
        if (!r.artworkFile) return;
        const { data } = await admin.storage
          .from(ARTWORK_BUCKET)
          .createSignedUrl(r.artworkFile.storagePath, 60 * 60);
        if (data?.signedUrl) previewUrls.set(r.artworkFile.id, data.signedUrl);
      })
    );
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-ink">Quote Requests</h1>
      <p className="mt-1 text-sm text-ink/50">
        Leads from sublimation, stickers, signage, vehicle wraps, and other custom-quote pages.
      </p>

      {dbError ? (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so quote requests can't load. New requests still arrive by email in the meantime." />
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/15 py-16 text-center">
          <MessageSquareText className="h-8 w-8 text-ink/30" aria-hidden="true" />
          <p className="text-sm text-ink/50">No quote requests yet.</p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-royal">{r.category}</p>
                <p className="mt-1 font-display text-sm font-bold text-ink">{r.name}</p>
                <p className="text-xs text-ink/50">
                  {r.email}
                  {r.phone ? ` · ${r.phone}` : ""} · {r.createdAt.toLocaleDateString()}
                </p>
                <p className="mt-2 max-w-xl text-sm text-ink/70">{r.projectDetails}</p>
                {r.artworkFile && previewUrls.has(r.artworkFile.id) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrls.get(r.artworkFile.id)}
                    alt={r.artworkFile.originalName}
                    className="mt-3 h-20 w-20 rounded-lg border border-black/10 object-contain"
                  />
                )}
              </div>

              <form action={updateQuoteRequestStatus} className="flex shrink-0 items-center gap-2">
                <input type="hidden" name="id" value={r.id} />
                <select
                  name="status"
                  defaultValue={r.status}
                  className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-royal"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-royal px-3 py-2 text-sm font-semibold text-white"
                >
                  Update
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
