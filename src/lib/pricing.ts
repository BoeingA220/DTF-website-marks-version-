import type { ApparelStyle, CartItem, PricingBreakdown } from "@/types";

/**
 * All pricing functions here are pure so they can run identically on the
 * client (instant quote UI) and the server (checkout price re-validation
 * in /api/pricing/quote) — the server is always the source of truth.
 */

// ---------------------------------------------------------------------------
// DTF Transfers — priced per total square inch, with volume-based rate tiers
// ---------------------------------------------------------------------------

export const DTF_MIN_INCHES = 1;
export const DTF_MAX_INCHES = 22; // max single transfer dimension
export const DTF_MIN_ORDER_PRICE = 6;

const DTF_AREA_RATE_TIERS = [
  { maxSqIn: 100, rate: 0.2 },
  { maxSqIn: 300, rate: 0.16 },
  { maxSqIn: 600, rate: 0.13 },
  { maxSqIn: 1200, rate: 0.1 },
  { maxSqIn: Infinity, rate: 0.08 },
];

function ratePerSqInForArea(totalSqIn: number): number {
  const tier = DTF_AREA_RATE_TIERS.find((t) => totalSqIn <= t.maxSqIn);
  return tier ? tier.rate : DTF_AREA_RATE_TIERS[DTF_AREA_RATE_TIERS.length - 1].rate;
}

export function quoteDtfTransfer(
  widthIn: number,
  heightIn: number,
  quantity: number
): PricingBreakdown {
  const w = clamp(widthIn, DTF_MIN_INCHES, DTF_MAX_INCHES);
  const h = clamp(heightIn, DTF_MIN_INCHES, DTF_MAX_INCHES);
  const qty = Math.max(1, Math.floor(quantity));

  const totalSqIn = w * h * qty;
  const rate = ratePerSqInForArea(totalSqIn);
  const rawSubtotal = totalSqIn * rate;
  const subtotal = Math.max(rawSubtotal, DTF_MIN_ORDER_PRICE);
  const unitPrice = subtotal / qty;

  return {
    unitPrice: round2(unitPrice),
    subtotal: round2(subtotal),
    total: round2(subtotal),
    discountLabel: rate < DTF_AREA_RATE_TIERS[0].rate ? "Volume pricing applied" : undefined,
  };
}

// ---------------------------------------------------------------------------
// Gang Sheets — fixed 24" width, standard lengths + custom
// ---------------------------------------------------------------------------

export const GANG_SHEET_WIDTH_IN = 24;

export const GANG_SHEET_LENGTHS: { lengthIn: number; price: number }[] = [
  { lengthIn: 24, price: 30 },
  { lengthIn: 36, price: 42 },
  { lengthIn: 48, price: 54 },
  { lengthIn: 60, price: 65 },
  { lengthIn: 72, price: 75 },
  { lengthIn: 84, price: 85 },
];

export const GANG_SHEET_CUSTOM_MIN_IN = 12;
export const GANG_SHEET_CUSTOM_MAX_IN = 120;
const GANG_SHEET_PER_INCH_RATE = 1.02; // used for custom lengths

export function quoteGangSheet(
  lengthIn: number,
  quantity: number,
  isCustom = false
): PricingBreakdown {
  const qty = Math.max(1, Math.floor(quantity));
  let unitPrice: number;

  if (isCustom) {
    const len = clamp(lengthIn, GANG_SHEET_CUSTOM_MIN_IN, GANG_SHEET_CUSTOM_MAX_IN);
    unitPrice = len * GANG_SHEET_PER_INCH_RATE;
  } else {
    const match = GANG_SHEET_LENGTHS.find((l) => l.lengthIn === lengthIn);
    unitPrice = match ? match.price : GANG_SHEET_LENGTHS[0].price;
  }

  const subtotal = unitPrice * qty;

  return {
    unitPrice: round2(unitPrice),
    subtotal: round2(subtotal),
    total: round2(subtotal),
  };
}

// ---------------------------------------------------------------------------
// Apparel
// ---------------------------------------------------------------------------

export const APPAREL_STYLES: ApparelStyle[] = [
  {
    slug: "t-shirt",
    name: "T-Shirt",
    description: "Classic soft-style cotton/poly blend tee.",
    basePrice: 12,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["White", "Black", "Royal Blue", "Heather Gray", "Red"],
  },
  {
    slug: "hoodie",
    name: "Hoodie",
    description: "Heavyweight fleece pullover hoodie.",
    basePrice: 28,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["White", "Black", "Royal Blue", "Heather Gray"],
  },
  {
    slug: "sweatshirt",
    name: "Sweatshirt",
    description: "Crewneck fleece sweatshirt.",
    basePrice: 22,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["White", "Black", "Royal Blue", "Heather Gray"],
  },
  {
    slug: "polo",
    name: "Polo Shirt",
    description: "Performance pique polo, great for teams and business wear.",
    basePrice: 18,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["White", "Black", "Royal Blue", "Navy"],
  },
];

const APPAREL_PRINT_ADDON_PER_SQIN = 0.12;

export function quoteApparel(
  styleSlug: string,
  printWidthIn: number,
  printHeightIn: number,
  quantity: number
): PricingBreakdown | null {
  const style = APPAREL_STYLES.find((s) => s.slug === styleSlug);
  if (!style) return null;

  const qty = Math.max(1, Math.floor(quantity));
  const printAreaSqIn = clamp(printWidthIn, 1, 14) * clamp(printHeightIn, 1, 16);
  const printAddon = printAreaSqIn * APPAREL_PRINT_ADDON_PER_SQIN;
  const unitPrice = style.basePrice + printAddon;
  const subtotal = unitPrice * qty;

  return {
    unitPrice: round2(unitPrice),
    subtotal: round2(subtotal),
    total: round2(subtotal),
  };
}

// ---------------------------------------------------------------------------
// Shipping (flat-rate table)
// ---------------------------------------------------------------------------

export type ShippingOption = {
  id: string;
  label: string;
  description: string;
  cost: number;
};

export const FREE_SHIPPING_THRESHOLD = 50;

export function getShippingOptions(subtotal: number): ShippingOption[] {
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const options: ShippingOption[] = [
    {
      id: "local-pickup",
      label: "Local Pickup (Boise, ID)",
      description: "Ready in 1-3 business days, no shipping charge.",
      cost: 0,
    },
    {
      id: "usps",
      label: "USPS Ground Advantage",
      description: qualifiesForFreeShipping
        ? "3-5 business days — free on orders over $50."
        : "3-5 business days via USPS.",
      cost: qualifiesForFreeShipping ? 0 : 7.99,
    },
    {
      id: "ups",
      label: "UPS Ground",
      description: qualifiesForFreeShipping
        ? "2-4 business days — free on orders over $50."
        : "2-4 business days via UPS.",
      cost: qualifiesForFreeShipping ? 0 : 11.99,
    },
    {
      id: "rush",
      label: "Rush Processing + UPS 2-Day Air",
      description: "Next-business-day production, 2-day shipping via UPS.",
      cost: 24.99,
    },
  ];
  return options;
}

// ---------------------------------------------------------------------------
// Server-side re-validation — recomputes a cart line's price from scratch so
// a tampered client-side unitPrice/lineTotal can never reach Square.
// ---------------------------------------------------------------------------

export function revalidateCartItem(item: CartItem): PricingBreakdown | null {
  switch (item.category) {
    case "DTF": {
      if (!item.widthIn || !item.heightIn) return null;
      return quoteDtfTransfer(item.widthIn, item.heightIn, item.quantity);
    }
    case "GANG_SHEET": {
      if (!item.heightIn) return null;
      const isCustom = !GANG_SHEET_LENGTHS.some((l) => l.lengthIn === item.heightIn);
      return quoteGangSheet(item.heightIn, item.quantity, isCustom);
    }
    case "APPAREL": {
      if (!item.widthIn || !item.heightIn) return null;
      return quoteApparel(item.productSlug, item.widthIn, item.heightIn, item.quantity);
    }
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}
