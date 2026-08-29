export type ProductCategory =
  | "DTF"
  | "GANG_SHEET"
  | "APPAREL"
  | "WIDE_FORMAT"
  | "BANNER";

export type ArtworkFileType = "PNG" | "SVG" | "PDF" | "AI" | "PSD" | "EPS" | "JPG" | "WEBP";

export type ArtworkUploadStatus = "idle" | "uploading" | "done" | "error" | "skipped";

export type UploadedArtwork = {
  id: string;
  file: File;
  fileName: string;
  fileType: ArtworkFileType;
  previewUrl?: string;
  widthPx?: number;
  heightPx?: number;
  lowResWarning?: boolean;
  unsupportedPreview?: boolean;
  uploadStatus: ArtworkUploadStatus;
  /** Prisma ArtworkFile.id once persisted server-side (null until upload completes). */
  artworkFileId?: string | null;
};

export type CartItem = {
  id: string;
  productSlug: string;
  category: ProductCategory;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  widthIn?: number;
  heightIn?: number;
  variant?: string;
  artworkFileName?: string;
  /** Prisma ArtworkFile.id — links this line item to its stored artwork at checkout. */
  artworkFileId?: string | null;
};

export type PricingBreakdown = {
  unitPrice: number;
  subtotal: number;
  discountLabel?: string;
  discountAmount?: number;
  total: number;
};

export type ApparelStyle = {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  sizes: string[];
  colors: string[];
};
