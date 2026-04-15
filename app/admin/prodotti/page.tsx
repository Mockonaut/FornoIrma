import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { toggleProductVisibilityAction } from "@/lib/actions";

export const metadata = { title: "Prodotti — Gestione" };

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <p className="section-label mb-1">Gestione</p>
      <h1 className="text-3xl font-extrabold mb-2">Prodotti</h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Carica o sostituisci la foto di ogni prodotto. Le modifiche sono subito visibili sul sito.
      </p>

      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
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

            {/* Badge stato + toggle visibilità */}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
