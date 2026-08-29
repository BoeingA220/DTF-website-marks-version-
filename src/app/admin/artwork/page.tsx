import { FileImage } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdminClient, ARTWORK_BUCKET, isSupabaseConfigured } from "@/lib/supabase/admin";

type ArtworkFileWithUser = Prisma.ArtworkFileGetPayload<{ include: { user: true } }>;

export default async function AdminArtworkPage() {
  await requireAdminProfile();

  let files: ArtworkFileWithUser[] = [];
  let dbError = false;
  try {
    files = await prisma.artworkFile.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
      take: 100,
    });
  } catch (err) {
    console.error("Admin artwork lookup failed:", err);
    dbError = true;
  }

  const previewUrls = new Map<string, string>();
  if (isSupabaseConfigured() && files.length > 0) {
    const admin = createAdminClient();
    await Promise.all(
      files.map(async (f) => {
        const { data } = await admin.storage
          .from(ARTWORK_BUCKET)
          .createSignedUrl(f.storagePath, 60 * 60);
        if (data?.signedUrl) previewUrls.set(f.id, data.signedUrl);
      })
    );
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-ink">Customer Artwork</h1>

      {dbError ? (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so uploaded artwork can't load." />
        </div>
      ) : files.length === 0 ? (
        <p className="mt-6 text-sm text-ink/50">No artwork uploaded yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {files.map((file) => {
            const url = previewUrls.get(file.id);
            const previewable = ["PNG", "SVG"].includes(file.fileType);
            return (
              <div key={file.id} className="rounded-xl border border-black/10 bg-white p-3">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-black/[0.02]">
                  {url && previewable ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={file.originalName} className="h-full w-full object-contain" />
                  ) : (
                    <FileImage className="h-8 w-8 text-ink/20" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-2 truncate text-xs font-semibold text-ink">{file.originalName}</p>
                <p className="truncate text-[11px] text-ink/40">{file.user?.email ?? "Guest"}</p>
                {file.lowResWarning && (
                  <p className="text-[11px] font-semibold text-accent">Low resolution</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
