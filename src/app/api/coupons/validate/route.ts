import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateCoupon } from "@/lib/coupons";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ valid: false, error: "Invalid request" }, { status: 400 });
  }

  try {
    const result = await validateCoupon(parsed.data.code, parsed.data.subtotal);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Coupon validation failed (is the database configured?):", err);
    return NextResponse.json(
      { valid: false, error: "Coupons aren't available right now" },
      { status: 503 }
    );
  }
}
