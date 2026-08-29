import type { Product } from "@prisma/client";

const CATEGORIES = ["DTF", "GANG_SHEET", "APPAREL", "WIDE_FORMAT", "BANNER"];

export function ProductForm({
  action,
  product,
}: {
  action: (formData: FormData) => void;
  product?: Product;
}) {
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
          Product Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-semibold text-ink">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={product?.category}
          className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-ink">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description}
          className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
        />
      </div>

      <div>
        <label htmlFor="inventoryCount" className="mb-1.5 block text-sm font-semibold text-ink">
          Inventory Count (optional)
        </label>
        <input
          id="inventoryCount"
          name="inventoryCount"
          type="number"
          min={0}
          defaultValue={product?.inventoryCount ?? undefined}
          placeholder="Leave blank for unlimited"
          className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="seoTitle" className="mb-1.5 block text-sm font-semibold text-ink">
            SEO Title
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            defaultValue={product?.seoTitle ?? undefined}
            className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
          />
        </div>
        <div>
          <label htmlFor="seoDescription" className="mb-1.5 block text-sm font-semibold text-ink">
            SEO Description
          </label>
          <input
            id="seoDescription"
            name="seoDescription"
            type="text"
            defaultValue={product?.seoDescription ?? undefined}
            className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-ink">
        <input
          type="checkbox"
          name="active"
          defaultChecked={product?.active ?? true}
          className="h-4 w-4 accent-royal"
        />
        Active (visible to customers)
      </label>

      <button
        type="submit"
        className="rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
      >
        {product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
