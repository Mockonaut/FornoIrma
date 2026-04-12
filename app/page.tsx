import Link from "next/link";
import Image from "next/image";
import { getDailySpecial, getVisibleProducts } from "@/lib/data";

export default async function HomePage() {
  const [daily, products] = await Promise.all([
    getDailySpecial(),
    getVisibleProducts(),
  ]);

  // Fissi: pane bianco, integrale, pan bauletto — tutto tranne "speciale"
  const regulars = products.filter((p) => !p.isSpecial).slice(0, 3);

  return (
    <div style={{ background: "var(--background)" }}>

      {/* ══════════════════════════════════════════════
          HERO — poster tipografico
      ══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex flex-col border-b-2"
        style={{ borderColor: "var(--foreground)" }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5 border-b-2 shrink-0"
          style={{ borderColor: "var(--foreground)" }}
        >
          <div className="flex items-center gap-3">
            <Image src="/Logo.jpg" alt="Forno Irma" width={36} height={36} className="rounded" priority />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Magenta</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/prodotti" className="btn-ghost">Catalogo</Link>
            <Link href="/register" className="btn-primary">Prenota</Link>
          </div>
        </div>

        {/* Headline */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-12 py-10 relative overflow-hidden">
          {/* Ghost text */}
          <div
            aria-hidden
            className="absolute right-[-4vw] top-1/2 -translate-y-1/2 select-none pointer-events-none font-black"
            style={{
              fontSize: "clamp(12rem, 35vw, 38rem)",
              color: "transparent",
              WebkitTextStroke: "2px var(--border)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            PANE
          </div>

          <div className="relative z-10 max-w-5xl">
            <p className="section-label mb-6">Forno artigianale · Magenta</p>
            <h1 className="display-huge" style={{ color: "var(--foreground)" }}>
              Il pane<br />
              <span style={{ color: "var(--accent)", fontStyle: "italic" }}>di una</span><br />
              volta.
            </h1>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-6">
              <p className="max-w-xs text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Lievito madre, farine selezionate, impasto a mano ogni giorno. Prenota online, ritira in negozio.
              </p>
              <div className="flex gap-3 shrink-0">
                <Link href="/prodotti" className="btn-primary">Scopri tutto</Link>
                <Link href="/prenotazioni" className="btn-secondary">Come prenoto?</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div
          className="border-t-2 py-3 overflow-hidden shrink-0"
          style={{ background: "var(--accent)", borderColor: "var(--accent-hover)" }}
        >
          <div className="marquee-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-xs font-black uppercase tracking-[0.25em] text-white px-8 shrink-0">
                Pane artigianale&nbsp;·&nbsp;Lievito madre&nbsp;·&nbsp;Impasto a mano&nbsp;·&nbsp;Prenota online&nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          PANE DEL GIORNO — la notizia del giorno
      ══════════════════════════════════════════════ */}
      {daily && (
        <section className="border-b-2" style={{ borderColor: "var(--foreground)" }}>
          {/* Label */}
          <div
            className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 border-b-2"
            style={{ borderColor: "var(--foreground)", background: "var(--accent)" }}
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white">
              ★ Pane speciale di oggi
            </span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white opacity-60">
              Cambia ogni giorno · Fino ad esaurimento
            </span>
          </div>

          {/* Corpo */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end px-5 sm:px-8 lg:px-12 py-10 lg:py-16 gap-8"
            style={{ background: "var(--foreground)" }}
          >
            <div>
              <p className="section-label mb-4" style={{ color: "rgba(253,250,243,0.4)" }}>
                Oggi al forno
              </p>
              <h2
                className="font-black tracking-tight leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 7rem)",
                  color: "var(--background)",
                }}
              >
                {daily.title ?? "Pane speciale"}
              </h2>
              {daily.body && (
                <p
                  className="mt-5 max-w-xl text-base leading-relaxed"
                  style={{ color: "rgba(253,250,243,0.55)" }}
                >
                  {daily.body}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <Link href="/register" className="btn-primary text-base px-10 py-4">
                Prenota →
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════
          SEMPRE DISPONIBILI — i prodotti fissi
      ══════════════════════════════════════════════ */}
      <section className="border-b-2" style={{ borderColor: "var(--foreground)" }}>
        {/* Header */}
        <div
          className="flex items-end justify-between px-5 sm:px-8 lg:px-12 py-6 border-b-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-baseline gap-5">
            <span className="display-large" style={{ color: "var(--accent)" }}>02</span>
            <h2 className="text-2xl font-black uppercase tracking-tight">Sempre qui</h2>
          </div>
          <Link
            href="/prodotti"
            className="text-xs font-black uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-40 transition-opacity"
          >
            Vedi tutto →
          </Link>
        </div>

        {/* Prodotti in riga orizzontale */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 divide-y-2 sm:divide-y-0 sm:divide-x-2"
          style={{ borderColor: "var(--border)" }}
        >
          {regulars.map((product) => (
            <article key={product.id} className="group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.images[0]?.url ?? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div
                className="p-6 border-t-2"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="tag">{product.category.name}</span>
                <h3 className="mt-3 text-xl font-black tracking-tight">{product.name}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {product.shortDescription}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          INSTAGRAM — full-bleed
      ══════════════════════════════════════════════ */}
      <section>
        <a
          href="https://www.instagram.com/forno_irma/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row"
          style={{ minHeight: "160px" }}
        >
          <div
            className="flex items-center justify-center px-10 py-10 sm:w-72 shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 transition-colors duration-300 group-hover:bg-[var(--sand)]"
            style={{ borderColor: "var(--foreground)" }}
          >
            <div className="text-center">
              <p className="section-label mb-2">Seguici su</p>
              <p className="text-3xl font-black tracking-tight">@forno_irma</p>
            </div>
          </div>
          <div
            className="flex-1 flex items-center justify-between px-10 py-10 transition-colors duration-300 group-hover:bg-[var(--accent)]"
            style={{ background: "var(--sand)" }}
          >
            <p className="text-sm max-w-xs" style={{ color: "var(--muted)" }}>
              Il pane speciale del giorno, le novità e le foto dal forno ogni mattina.
            </p>
            <span className="text-6xl font-black leading-none shrink-0 ml-8 transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </div>
        </a>
      </section>

    </div>
  );
}
