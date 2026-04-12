import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Prodotti — Gestione" };

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <p className="section-label mb-1">Gestione</p>
      <h1 className="text-3xl font-extrabold mb-2">Prodotti</h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        I prodotti sono configurati tramite seed. Contatta l'amministratore per aggiungere o modificare prodotti.
      </p>

      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                {p.category.name}
                {p.shortDescription ? ` — ${p.shortDescription}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {p.isSpecial && <span className="tag-accent">Speciale</span>}
              {p.isSeasonal && <span className="tag-amber">Stagionale</span>}
              {!p.isVisible && <span className="tag">Nascosto</span>}
              {p.isVisible && !p.isSpecial && !p.isSeasonal && <span className="tag">Visibile</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
