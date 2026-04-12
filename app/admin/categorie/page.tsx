import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createCategoryAction } from "@/lib/actions";

export const metadata = { title: "Categorie — Gestione" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <p className="section-label mb-1">Gestione</p>
      <h1 className="text-3xl font-extrabold mb-8">Categorie</h1>

      {/* Form aggiunta */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold mb-4">Aggiungi categoria</h2>
        <form action={createCategoryAction} className="flex flex-col sm:flex-row gap-3">
          <input
            name="name"
            className="input flex-1"
            placeholder="Nome categoria (es. Focacce)"
            required
          />
          <input
            name="description"
            className="input flex-1"
            placeholder="Descrizione breve (opzionale)"
          />
          <button className="btn-primary shrink-0">Aggiungi</button>
        </form>
      </div>

      {/* Lista categorie */}
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {categories.length === 0 && (
          <p className="p-6 text-sm" style={{ color: "var(--muted)" }}>Nessuna categoria presente.</p>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-semibold">{cat.name}</p>
              {cat.description && (
                <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{cat.description}</p>
              )}
            </div>
            <span className="tag">{cat._count.products} prodotti</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
        Le categorie aggiunte qui saranno visibili sul sito. Per modificare o eliminare una categoria contatta l'amministratore di sistema.
      </p>
    </div>
  );
}
