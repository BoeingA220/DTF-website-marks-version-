"use server";

import { revalidatePath } from "next/cache";
import type { CouponType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminProfile } from "@/lib/auth";

export async function createCoupon(formData: FormData) {
  await requireAdminProfile();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type")) as CouponType;
  const value = Number(formData.get("value"));
  const minOrderAmountRaw = String(formData.get("minOrderAmount") ?? "");
  const expiresAtRaw = String(formData.get("expiresAt") ?? "");

  if (!code || !type || Number.isNaN(value)) return;

  await prisma.coupon.create({
    data: {
      code,
      type,
      value,
      minOrderAmount: minOrderAmountRaw ? Number(minOrderAmountRaw) : null,
      expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
      active: true,
    },
  });

  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(formData: FormData) {
  await requireAdminProfile();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;
  await prisma.coupon.update({ where: { id }, data: { active: !active } });
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
  await requireAdminProfile();
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}
