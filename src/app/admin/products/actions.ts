"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ProductCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminProfile } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  await requireAdminProfile();

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category")) as ProductCategory;
  const description = String(formData.get("description") ?? "");
  const inventoryCountRaw = String(formData.get("inventoryCount") ?? "");
  const seoTitle = String(formData.get("seoTitle") ?? "") || null;
  const seoDescription = String(formData.get("seoDescription") ?? "") || null;
  const active = formData.get("active") === "on";

  if (!name || !category) return;

  await prisma.product.create({
    data: {
      name,
      slug: slugify(name),
      category,
      description,
      inventoryCount: inventoryCountRaw ? Number(inventoryCountRaw) : null,
      seoTitle,
      seoDescription,
      active,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await requireAdminProfile();

  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category")) as ProductCategory;
  const description = String(formData.get("description") ?? "");
  const inventoryCountRaw = String(formData.get("inventoryCount") ?? "");
  const seoTitle = String(formData.get("seoTitle") ?? "") || null;
  const seoDescription = String(formData.get("seoDescription") ?? "") || null;
  const active = formData.get("active") === "on";

  if (!id || !name || !category) return;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      description,
      inventoryCount: inventoryCountRaw ? Number(inventoryCountRaw) : null,
      seoTitle,
      seoDescription,
      active,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdminProfile();
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdminProfile();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;
  await prisma.product.update({ where: { id }, data: { active: !active } });
  revalidatePath("/admin/products");
}
