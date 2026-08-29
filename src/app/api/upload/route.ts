import { NextRequest, NextResponse } from "next/server";
import { ARTWORK_BUCKET, createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { MAX_ARTWORK_BYTES, detectArtworkFileType } from "@/lib/artwork";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!formData || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_ARTWORK_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const fileType = detectArtworkFileType(file.name);
  if (!fileType) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  // Artwork storage isn't set up yet (no real Supabase project configured) —
  // let the calculator flow continue without blocking on file persistence.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ id: null, storagePath: null, stored: false });
  }

  const widthPx = numberOrUndefined(formData.get("widthPx"));
  const heightPx = numberOrUndefined(formData.get("heightPx"));
  const lowResWarning = formData.get("lowResWarning") === "true";

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const storagePath = `uploads/${crypto.randomUUID()}.${ext}`;

  try {
    const admin = createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from(ARTWORK_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload failed:", uploadError);
      return NextResponse.json({ id: null, storagePath: null, stored: false });
    }

    let userId: string | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch {
      // Guest upload — no signed-in user, that's fine.
    }

    const artwork = await prisma.artworkFile.create({
      data: {
        userId,
        storagePath,
        originalName: file.name,
        fileType,
        widthPx,
        heightPx,
        lowResWarning,
      },
    });

    return NextResponse.json({ id: artwork.id, storagePath, stored: true });
  } catch (err) {
    console.error("Artwork upload failed:", err);
    return NextResponse.json({ id: null, storagePath: null, stored: false });
  }
}

function numberOrUndefined(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string" || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
