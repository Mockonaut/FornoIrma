import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import {
  toggleProductVisibilityAction,
  createProductAction,
} from "@/lib/actions";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const metadata = { title: "Prodotti — Gestione" };

export default async function AdminProductsPage() {
  await requireAdmin();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <p className="section-label mb-1">Gestione</p>
      <h1 className="text-3xl font-extrabold mb-2">Prodotti</h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Aggiungi nuovi prodotti, carica foto e gestisci visibilità e disponibilità.
      </p>

      {/* Form aggiunta prodotto */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold mb-4">Aggiungi prodotto</h2>
        <form action={createProductAction} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              name="name"
              className="input flex-1"
              placeholder="Nome prodotto (es. Focaccia alle olive)"
              required
            />
            <input
              name="shortDescription"
              className="input flex-1"
              placeholder="Descrizione breve (opzionale)"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <select name="categoryId" className="input flex-1" required>
              <option value="">— Seleziona categoria —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="isSeasonal" className="w-4 h-4" />
              Stagionale
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="isSpecial" className="w-4 h-4" />
              Speciale
            </label>
            <button className="btn-primary shrink-0">Aggiungi</button>
          </div>
        </form>
      </div>

      {/* Lista prodotti */}
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {products.length === 0 && (
          <p className="p-6 text-sm" style={{ color: "var(--muted)" }}>
            Nessun prodotto presente. Aggiungine uno sopra.
          </p>
        )}
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-6 px-6 py-4 flex-wrap">
            {/* Upload immagine */}
            <ProductImageUpload
              productId={p.id}
              currentImageUrl={p.images[0]?.url ?? null}
              productName={p.name}
            />

            {/* Info prodotto */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                {p.category.name}
                {p.shortDescription ? ` — ${p.shortDescription}` : ""}
              </p>
            </div>

            {/* Badge stato + toggle visibilità + elimina */}
            <div className="flex items-center gap-2 shrink-0">
              {p.isSpecial && <span className="tag-accent">Speciale</span>}
              {p.isSeasonal && <span className="tag-amber">Stagionale</span>}
              <form action={toggleProductVisibilityAction}>
                <input type="hidden" name="productId" value={p.id} />
                <button
                  className="btn-ghost text-xs py-1 px-3"
                  style={p.isVisible ? { color: "var(--muted)" } : { color: "var(--accent)" }}
                >
                  {p.isVisible ? "Nascondi" : "Mostra"}
                </button>
              </form>
              <DeleteProductButton productId={p.id} productName={p.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
