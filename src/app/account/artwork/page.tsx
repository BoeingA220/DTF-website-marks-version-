import { redirect } from "next/navigation";
import { FileImage } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getCurrentProfile } from "@/lib/auth";
import { getSafeUser } from "@/lib/supabase/server";
import { createAdminClient, ARTWORK_BUCKET, isSupabaseConfigured } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

export default async function ArtworkPage() {
  const user = await getSafeUser();
  if (!user) redirect("/account/login");

  const profile = await getCurrentProfile();

  let artworkFiles: Awaited<ReturnType<typeof prisma.artworkFile.findMany>> = [];
  let dbError = false;
  try {
    artworkFiles = await prisma.artworkFile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Artwork lookup failed:", err);
    dbError = true;
  }

  const previewUrls = new Map<string, string>();
  if (isSupabaseConfigured() && artworkFiles.length > 0) {
    const admin = createAdminClient();
    await Promise.all(
      artworkFiles.map(async (f) => {
        const { data } = await admin.storage
          .from(ARTWORK_BUCKET)
          .createSignedUrl(f.storagePath, 60 * 60);
        if (data?.signedUrl) previewUrls.set(f.id, data.signedUrl);
      })
    );
  }

  return (
    <AccountShell name={profile?.name ?? user.email}>
      <h1 className="font-display text-2xl font-bold text-ink">Saved Artwork</h1>

      {dbError && (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so saved artwork can't load." />
        </div>
      )}

      {!dbError && artworkFiles.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/15 py-16 text-center">
          <FileImage className="h-8 w-8 text-ink/30" aria-hidden="true" />
          <p className="text-sm text-ink/50">
            Artwork you upload during checkout will be saved here for easy reordering.
          </p>
        </div>
      )}

      {!dbError && artworkFiles.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {artworkFiles.map((file) => {
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
                <p className="text-[11px] text-ink/40">
                  {file.fileType}
                  {file.widthPx && file.heightPx ? ` · ${file.widthPx}×${file.heightPx}px` : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </AccountShell>
  );
}
