import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdminProfile } from "@/lib/auth";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  await requireAdminProfile();

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-ink">New Product</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} />
      </div>
    </AdminShell>
  );
}
