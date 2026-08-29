import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminProfile();
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-ink">Edit Product</h1>
      <div className="mt-6">
        <ProductForm action={updateProduct} product={product} />
      </div>
    </AdminShell>
  );
}
