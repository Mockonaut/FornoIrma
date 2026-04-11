import Link from "next/link";
import { getHomeContent, getVisibleProducts } from "@/lib/data";

export default async function HomePage() {
  const [content, products] = await Promise.all([
    getHomeContent(),
    getVisibleProducts(),
  ]);

  const hero = content.HOME_HERO;
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1920&q=80"
          alt="Pane artigianale"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="container-shell relative py-32 lg:py-44">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-400">Forno Irma</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-tight lg:text-6xl">
            {hero?.title ?? "Il pane di una volta, pronto quando vuoi tu"}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-stone-300">
            {hero?.body ?? "Prenota online, ritira in negozio. Farine selezionate, lievito madre, impasto a mano."}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/prodotti" className="btn-primary text-base px-8 py-3">
              Scopri i prodotti
            </Link>
            <Link
              href="/prenotazioni"
              className="btn-secondary border-white/30 text-white hover:bg-white/10 text-base px-8 py-3"
            >
              Come prenotare
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container-shell">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Dal forno</p>
            <h2 className="mt-2 text-3xl font-bold">Prodotti in evidenza</h2>
          </div>
          <Link href="/prodotti" className="text-sm font-semibold text-[var(--accent)]">
            Vedi tutto →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((product) => (
            <article key={product.id} className="card overflow-hidden">
              <img
                src={product.images[0]?.url ?? "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80"}
                alt={product.name}
                className="h-52 w-full object-cover"
              />
              <div className="p-5">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium">
                  {product.category.name}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{product.shortDescription}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-shell">
        <div className="card p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Semplice</p>
              <h2 className="mt-2 text-3xl font-bold">Come funziona</h2>
              <p className="mt-4 text-[var(--muted)]">
                Niente code, niente sorprese. Prenoti online, noi prepariamo, ritiri quando vuoi tu.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="btn-primary">Crea account</Link>
                <Link href="/login" className="btn-secondary">Accedi</Link>
              </div>
            </div>
            <ol className="space-y-5">
              {[
                ["1", "Registrazione", "Crea il tuo account in meno di un minuto."],
                ["2", "Scegli i prodotti", "Naviga il catalogo e seleziona quantità e tipologie."],
                ["3", "Scegli quando ritirare", "Indica la data e la fascia oraria preferita."],
                ["4", "Aspetta la conferma", "Ricevi aggiornamenti nell'area personale."],
                ["5", "Ritira in negozio", "Paga al ritiro, nessuna sorpresa online."],
              ].map(([num, title, desc]) => (
                <li key={num} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">
                    {num}
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-[var(--muted)]">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
