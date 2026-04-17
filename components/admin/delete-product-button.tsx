"use client";

import { deleteProductAction } from "@/lib/actions";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`Eliminare il prodotto «${productName}»?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="btn-ghost text-xs py-1 px-3"
        style={{ color: "var(--error, #dc2626)" }}
      >
        Elimina
      </button>
    </form>
  );
}
