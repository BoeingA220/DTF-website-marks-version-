import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toggleProductActive, deleteProduct } from "./actions";

export default async function AdminProductsPage() {
  await requireAdminProfile();

  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let dbError = false;
  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("Admin products lookup failed:", err);
    dbError = true;
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Products &amp; Inventory</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-royal px-4 py-2 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Product
        </Link>
      </div>

      <p className="mt-2 max-w-2xl text-sm text-ink/50">
        Base pricing for DTF transfers, gang sheets, and apparel lives in{" "}
        <code className="rounded bg-black/5 px-1 py-0.5 text-xs">src/lib/pricing.ts</code> —
        edit the rate tables there to change what customers are quoted. This list is for
        catalog entries, inventory counts, and SEO metadata.
      </p>

      {dbError ? (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so products can't load." />
        </div>
      ) : products.length === 0 ? (
        <p className="mt-6 text-sm text-ink/50">No products yet — add your first one.</p>
      ) : (
        <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-sm font-bold text-ink">{product.name}</p>
                <p className="text-xs text-ink/50">
                  {product.category.replace("_", " ")} · /{product.slug}
                  {product.inventoryCount !== null ? ` · ${product.inventoryCount} in stock` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <form action={toggleProductActive}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="active" value={String(product.active)} />
                  <button
                    type="submit"
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      product.active ? "bg-royal/10 text-royal" : "bg-black/5 text-ink/40"
                    }`}
                  >
                    {product.active ? "Active" : "Hidden"}
                  </button>
                </form>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/5"
                >
                  Edit
                </Link>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/5"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
