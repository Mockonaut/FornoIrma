import Link from "next/link";
import Image from "next/image";
import { getDailySpecial, getVisibleProducts } from "@/lib/data";

export default async function HomePage() {
  const [daily, products] = await Promise.all([
    getDailySpecial(),
    getVisibleProducts(),
  ]);

  const regulars = products.filter((p) => !p.isSpecial).slice(0, 3);

  return (
    <div style={{ background: "var(--background)" }}>

      {/* ════════════════════════════════════════
          HERO — cartello di bottega, centrato
      ════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-5">
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center">

          {/* Logo */}
          <Image
            src="/Logo.jpg"
            alt="Forno Irma"
            width={130}
            height={130}
            className="rounded-2xl mb-8"
            style={{ boxShadow: "var(--shadow-md)" }}
            priority
          />

          {/* Separatore con stella */}
          <div className="star-divider w-full max-w-xs mb-8">
            <span style={{ color: "var(--accent)" }}>★</span>
          </div>

          {/* Titolo */}
          <h1
            className="font-extrabold leading-tight"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", color: "var(--foreground)" }}
          >
            Pane come si deve,{" "}
            <em className="not-italic" style={{ color: "var(--accent)" }}>
              ogni giorno.
            </em>
          </h1>

          <p className="mt-5 text-base leading-relaxed max-w-sm" style={{ color: "var(--muted)" }}>
            Lievito madre, farine selezionate, impasto a mano. Prenota online e ritira quando vuoi tu — a Magenta.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/prodotti" className="btn-primary">
              Scopri il catalogo
            </Link>
            <Link href="/prenotazioni" className="btn-secondary">
              Come prenoto?
            </Link>
          </div>

          {/* Separatore con stella */}
          <div className="star-divider w-full max-w-xs mt-12">
            <span style={{ color: "var(--border)" }}>★</span>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          PANE DEL GIORNO — menu board caldo
      ════════════════════════════════════════ */}
      {daily && (
        <section className="px-5 pb-16 sm:pb-24">
          <div
            className="mx-auto max-w-5xl rounded-3xl overflow-hidden"
            style={{ background: "var(--warm-dark)", boxShadow: "var(--shadow-md)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-center gap-3 py-4 px-6"
              style={{ background: "color-mix(in srgb, var(--accent) 90%, black)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-white text-sm">★</span>
              <span className="text-white text-xs font-semibold uppercase tracking-[0.25em]">
                Pane speciale di oggi
              </span>
              <span className="text-white text-sm">★</span>
            </div>

            {/* Corpo */}
            <div className="px-8 py-12 sm:px-14 sm:py-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                  style={{ color: "rgba(253,250,243,0.4)" }}
                >
                  Oggi al forno · Fino ad esaurimento
                </p>
                <h2
                  className="font-extrabold leading-tight"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    color: "var(--background)",
                  }}
                >
                  {daily.title}
                </h2>
                {daily.body && (
                  <p
                    className="mt-5 text-base leading-relaxed max-w-lg"
                    style={{ color: "rgba(253,250,243,0.55)" }}
                  >
                    {daily.body}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <Link
                  href="/register"
                  className="btn-primary text-base px-9 py-4"
                >
                  Prenota questo pane
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ════════════════════════════════════════
          SEMPRE QUI — prodotti fissi
      ════════════════════════════════════════ */}
      <section className="px-5 pb-16 sm:pb-24">
        <div className="mx-auto max-w-5xl">

          {/* Header sezione */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="section-label mb-1">Ogni giorno</p>
              <h2 className="text-2xl font-extrabold">Sempre qui</h2>
            </div>
            <Link
              href="/prodotti"
              className="text-sm font-semibold underline underline-offset-4 hover:opacity-60 transition-opacity"
              style={{ color: "var(--accent)" }}
            >
              Vedi tutto
            </Link>
          </div>

          {/* Card prodotti */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {regulars.map((product) => (
              <article key={product.id} className="card overflow-hidden group">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={product.images[0]?.url ?? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="tag">{product.category.name}</span>
                  <h3 className="mt-3 text-lg font-bold">{product.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {product.shortDescription}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          INSTAGRAM — caldo, non aggressivo
      ════════════════════════════════════════ */}
      <section className="px-5 pb-16 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          <a
            href="https://www.instagram.com/forno_irma/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-sand flex flex-col sm:flex-row items-center gap-6 p-8 sm:p-10 group hover:shadow-md transition-all"
            style={{ borderRadius: "var(--radius)" }}
          >
            {/* Icona IG */}
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl shrink-0 transition-transform group-hover:scale-105"
              style={{ background: "var(--accent)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            {/* Testo */}
            <div className="flex-1 text-center sm:text-left">
              <p className="section-label mb-1">Seguici su Instagram</p>
              <p className="text-xl font-bold">@forno_irma</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Il pane speciale del giorno, le foto dal forno e le novità — ogni mattina.
              </p>
            </div>
            {/* Freccia */}
            <span
              className="text-2xl font-bold shrink-0 transition-transform group-hover:translate-x-1"
              style={{ color: "var(--accent)" }}
            >
              →
            </span>
          </a>
        </div>
      </section>

    </div>
  );
}
