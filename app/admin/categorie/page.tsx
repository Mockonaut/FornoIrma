import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createCategoryAction } from "@/lib/actions";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="container-shell py-12">
      <div className="card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Admin</p>
        <h1 className="mt-2 text-4xl font-bold">Categorie</h1>
        <form action={createCategoryAction} className="mb-6 grid gap-4 rounded-2xl bg-stone-50 p-4 md:grid-cols-[1fr_2fr_auto]">
          <input name="name" className="input" placeholder="Nuova categoria" required />
          <input name="description" className="input" placeholder="Descrizione" />
          <button className="btn-primary">Aggiungi</button>
        </form>
        <div className="mt-6 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-4">
              <div>
                <h2 className="font-semibold">{category.name}</h2>
                <p className="text-sm text-[var(--muted)]">Slug: {category.slug}</p>
              </div>
              <span className="text-sm text-[var(--muted)]">{category._count.products} prodotti</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">Nel seed iniziale le categorie sono già create. Per l’MVP la modifica avviene via seed o Prisma Studio.</p>
      </div>
    </div>
  );
}
