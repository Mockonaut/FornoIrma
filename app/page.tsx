import Link from "next/link";
import Image from "next/image";
import { getVisibleProducts } from "@/lib/data";

export default async function HomePage() {
  const products = await getVisibleProducts();
  const featured = products.slice(0, 4);

  return (
    <div style={{ background: "var(--background)" }}>

      {/* ══════════════════════════════════════════════
          HERO — poster tipografico, full viewport
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
            <span className="text-xs font-black uppercase tracking-[0.2em]">Est. 1978</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/prodotti" className="btn-ghost">Catalogo</Link>
            <Link href="/register" className="btn-primary">Prenota</Link>
          </div>
        </div>

        {/* Body del hero */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-12 py-10 relative overflow-hidden">
          {/* Ghost text background */}
          <div
            aria-hidden
            className="absolute right-[-4vw] top-1/2 -translate-y-1/2 select-none pointer-events-none font-black leading-none"
            style={{
              fontSize: "clamp(12rem, 35vw, 38rem)",
              color: "transparent",
              WebkitTextStroke: "2px var(--border)",
              letterSpacing: "-0.05em",
            }}
          >
            PANE
          </div>

          {/* Headline */}
          <div className="relative z-10 max-w-5xl">
            <p className="section-label mb-6">Forno artigianale · Roma</p>
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
          PRODOTTI — griglia editoriale asimmetrica
      ══════════════════════════════════════════════ */}
      <section className="border-b-2" style={{ borderColor: "var(--foreground)" }}>
        {/* Header */}
        <div
          className="flex items-end justify-between px-5 sm:px-8 lg:px-12 py-6 border-b-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-baseline gap-5">
            <span className="display-large" style={{ color: "var(--accent)" }}>01</span>
            <h2 className="text-2xl font-black uppercase tracking-tight">Dal forno</h2>
          </div>
          <Link
            href="/prodotti"
            className="text-xs font-black uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-40 transition-opacity"
          >
            Vedi tutto →
          </Link>
        </div>

        {/* Grid: 1 grande (sx) + 3 stack (dx) */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
            {/* Card grande */}
            <article
              className="relative overflow-hidden group border-b-2 lg:border-b-0 lg:border-r-2"
              style={{ borderColor: "var(--foreground)", minHeight: "520px" }}
            >
              <img
                src={featured[0]?.images[0]?.url ?? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80"}
                alt={featured[0]?.name ?? "Prodotto"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(22,15,6,0.88) 0%, rgba(22,15,6,0.08) 55%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="tag-accent">{featured[0]?.category.name}</span>
                <h3
                  className="mt-3 text-4xl font-black tracking-tight leading-none"
                  style={{ color: "#FDFAF3" }}
                >
                  {featured[0]?.name}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "rgba(253,250,243,0.65)" }}>
                  {featured[0]?.shortDescription}
                </p>
                <Link
                  href="/register"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-60 transition-opacity"
                  style={{ color: "#FDFAF3" }}
                >
                  Prenota →
                </Link>
              </div>
            </article>

            {/* Stack 3 card */}
            <div className="divide-y-2" style={{ borderColor: "var(--foreground)" }}>
              {featured.slice(1, 4).map((product) => (
                <article
                  key={product.id}
                  className="flex group overflow-hidden"
                  style={{ minHeight: "calc(520px / 3)" }}
                >
                  <div className="relative w-28 sm:w-36 shrink-0 overflow-hidden">
                    <img
                      src={product.images[0]?.url ?? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80"}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div
                    className="flex flex-col justify-center px-5 py-5 flex-1 border-l-2"
                    style={{ borderColor: "var(--foreground)" }}
                  >
                    <span className="tag mb-2">{product.category.name}</span>
                    <h3 className="text-lg font-black tracking-tight leading-tight">{product.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      {product.shortDescription}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>


      {/* ══════════════════════════════════════════════
          MANIFESTO — una frase, nient'altro
      ══════════════════════════════════════════════ */}
      <section
        className="px-5 sm:px-8 lg:px-12 py-16 lg:py-24 border-b-2"
        style={{ borderColor: "var(--foreground)" }}
      >
        <blockquote
          className="font-black leading-tight tracking-tight"
          style={{
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            color: "var(--foreground)",
            maxWidth: "22ch",
          }}
        >
          "Forniamo lo stesso pane dal 1978.
          <span style={{ color: "var(--accent)", fontStyle: "italic" }}> Niente di più."</span>
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <Image src="/Logo.jpg" alt="" width={32} height={32} className="rounded opacity-60" />
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Forno Irma · Roma
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          INSTAGRAM — full-bleed link a due pannelli
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
              Foto, novità del giorno e specialità stagionali su Instagram.
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
