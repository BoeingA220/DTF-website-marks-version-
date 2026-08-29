import { prisma } from "@/lib/prisma";
import { round2 } from "@/lib/pricing";

export type CouponValidation =
  | { valid: true; code: string; type: "PERCENT" | "FIXED"; value: number; discountAmount: number }
  | { valid: false; error: string };

export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidation> {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.active) return { valid: false, error: "Coupon not found" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, error: "Coupon has expired" };
  }

  const minOrder = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
  if (subtotal < minOrder) {
    return { valid: false, error: `Coupon requires a minimum order of $${minOrder.toFixed(2)}` };
  }

  const value = Number(coupon.value);
  const discountAmount =
    coupon.type === "PERCENT" ? round2((subtotal * value) / 100) : round2(Math.min(value, subtotal));

  return { valid: true, code: coupon.code, type: coupon.type, value, discountAmount };
}
