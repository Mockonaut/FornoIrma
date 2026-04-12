import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublicCategories, getVisibleProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Prodotti",
  description: "Scopri il catalogo di Forno Irma: pane bianco, integrale, pan bauletto, dolci e specialità artigianali disponibili per prenotazione.",
  openGraph: {
    title: "Prodotti | Forno Irma",
    description: "Scopri il catalogo di Forno Irma: pane, dolci e specialità artigianali disponibili per prenotazione.",
  },
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const categories = await getPublicCategories();
  const products = await getVisibleProducts(params.category);

  return (
    <div className="container-shell space-y-8 py-12">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Catalogo</p>
        <h1 className="mt-2 text-4xl font-bold">Prodotti del forno</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">Pane, focacce, dolci e specialità artigianali disponibili per prenotazione e ritiro in negozio.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/prodotti" className={`btn-secondary ${!params.category ? "border-[var(--accent)]" : ""}`}>Tutti</Link>
        {categories.map((category) => (
          <Link key={category.id} href={`/prodotti?category=${category.slug}`} className={`btn-secondary ${params.category === category.slug ? "border-[var(--accent)]" : ""}`}>
            {category.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="card overflow-hidden">
            <div className="relative h-56 w-full">
              <Image
                src={product.images[0]?.url ?? FALLBACK_IMG}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium">{product.category.name}</span>
                {product.isSeasonal && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Stagionale</span>}
                {product.isSpecial && <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800">Speciale</span>}
              </div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-[var(--muted)]">{product.shortDescription}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-emerald-700">Disponibile</span>
                <Link href="/prenotazioni" className="text-sm font-semibold text-[var(--accent)]">Prenota</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
