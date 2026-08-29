import type { ArtworkFileType } from "@/types";

export async function uploadArtworkFile(
  file: File,
  meta: { fileType: ArtworkFileType; widthPx?: number; heightPx?: number; lowResWarning?: boolean }
): Promise<{ id: string | null; storagePath: string | null; stored: boolean }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", meta.fileType);
  if (meta.widthPx) formData.append("widthPx", String(meta.widthPx));
  if (meta.heightPx) formData.append("heightPx", String(meta.heightPx));
  formData.append("lowResWarning", String(Boolean(meta.lowResWarning)));

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
