import Link from "next/link";
import Image from "next/image";
import { getHomeContent, getVisibleProducts } from "@/lib/data";

export default async function HomePage() {
  const [content, products] = await Promise.all([
    getHomeContent(),
    getVisibleProducts(),
  ]);

  const featured = products.slice(0, 4);

  return (
    <div style={{ background: "var(--background)" }}>

      {/* ══════════════════════════════════════════════
          HERO — tipografia poster, full viewport
      ══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b-2"
        style={{ borderColor: "var(--foreground)" }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5 border-b-2"
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

        {/* Display type */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-12 py-10">
          {/* Ghost text background */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none font-black"
            style={{
              fontSize: "clamp(10rem, 30vw, 32rem)",
              color: "transparent",
              WebkitTextStroke: "2px var(--border)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
            aria-hidden
          >
            PANE
          </div>

          {/* Main headline */}
          <div className="relative z-10 max-w-4xl">
            <p className="section-label mb-6">Forno artigianale · Roma</p>
            <h1 className="display-huge" style={{ color: "var(--foreground)" }}>
              Il pane<br />
              <span style={{ color: "var(--accent)", fontStyle: "italic" }}>di una</span><br />
              volta.
            </h1>
            <div
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <p
                className="max-w-xs text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                Lievito madre, farine selezionate, impasto a mano ogni giorno dal 1978. Prenota online, ritira in negozio.
              </p>
              <div className="flex gap-3 shrink-0">
                <Link href="/prodotti" className="btn-primary">Scopri tutto</Link>
                <Link href="/prenotazioni" className="btn-secondary">Come funziona</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip — marquee */}
        <div
          className="border-t-2 py-3 overflow-hidden"
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
          PRODOTTI — griglia asimmetrica editoriale
      ══════════════════════════════════════════════ */}
      <section className="border-b-2" style={{ borderColor: "var(--foreground)" }}>
        {/* Header sezione */}
        <div
          className="flex items-end justify-between px-5 sm:px-8 lg:px-12 py-6 border-b-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-baseline gap-6">
            <span className="display-large" style={{ color: "var(--accent)" }}>01</span>
            <h2 className="text-2xl font-black uppercase tracking-tight">Dal forno</h2>
          </div>
          <Link
            href="/prodotti"
            className="text-xs font-black uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-40"
          >
            Vedi tutto →
          </Link>
        </div>

        {/* Griglia: 1 grande + 3 piccoli */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]" style={{ borderBottom: "none" }}>
            {/* Card grande */}
            <article
              className="relative overflow-hidden group border-b-2 lg:border-b-0 lg:border-r-2"
              style={{ borderColor: "var(--foreground)", minHeight: "520px" }}
            >
              <img
                src={featured[0]?.images[0]?.url ?? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80"}
                alt={featured[0]?.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(22,15,6,0.85) 0%, rgba(22,15,6,0.1) 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="tag-accent mb-3">{featured[0]?.category.name}</span>
                <h3
                  className="mt-2 text-4xl font-black tracking-tight leading-none"
                  style={{ color: "#FDFAF3" }}
                >
                  {featured[0]?.name}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "rgba(253,250,243,0.7)" }}>
                  {featured[0]?.shortDescription}
                </p>
                <Link href="/register" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-60" style={{ color: "#FDFAF3" }}>
                  Prenota →
                </Link>
              </div>
            </article>

            {/* Stack 3 card piccole */}
            <div className="divide-y-2" style={{ borderColor: "var(--foreground)" }}>
              {featured.slice(1, 4).map((product) => (
                <article key={product.id} className="flex gap-0 group overflow-hidden" style={{ minHeight: "calc(520px / 3)" }}>
                  <div className="relative w-32 shrink-0 overflow-hidden">
                    <img
                      src={product.images[0]?.url ?? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80"}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div
                    className="flex flex-col justify-center px-6 py-5 flex-1 border-l-2"
                    style={{ borderColor: "var(--foreground)" }}
                  >
                    <span className="tag mb-2">{product.category.name}</span>
                    <h3 className="text-lg font-black tracking-tight leading-tight">{product.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{product.shortDescription}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>


      {/* ══════════════════════════════════════════════
          PRENOTA — sezione 3 colonne, no spiegazione
          A differenza di prima: solo l'azione, diretta
      ══════════════════════════════════════════════ */}
      <section
        className="border-b-2"
        style={{ borderColor: "var(--foreground)", background: "var(--foreground)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y-2 lg:divide-y-0 lg:divide-x-2" style={{ borderColor: "rgba(253,250,243,0.15)" }}>
          {/* Col 1 — headline */}
          <div className="px-8 py-14 lg:py-20 flex flex-col justify-between">
            <p className="section-label" style={{ color: "rgba(253,250,243,0.4)" }}>Prenota online</p>
            <div>
              <h2
                className="display-large mt-4"
                style={{ color: "var(--background)" }}
              >
                Scegli.<br />
                <span style={{ color: "var(--accent)" }}>Prenota.</span><br />
                Ritira.
              </h2>
              <p className="mt-6 text-sm leading-relaxed" style={{ color: "rgba(253,250,243,0.5)" }}>
                Paga al ritiro in negozio. Nessuna carta, nessuna sorpresa.
              </p>
            </div>
          </div>

          {/* Col 2 — steps ridotti all'essenziale */}
          <div className="px-8 py-14 lg:py-20">
            <p className="section-label mb-8" style={{ color: "rgba(253,250,243,0.4)" }}>Come funziona</p>
            <ol className="space-y-6">
              {[
                ["Registrati", "Un account, gratis, in 30 secondi."],
                ["Scegli i prodotti", "Pane, focacce, dolci — quello che vuoi."],
                ["Indica data e ora", "Scegli quando vieni a ritirare."],
                ["Vieni e paghi", "Tutto pronto ad aspettarti."],
              ].map(([title, desc], i) => (
                <li key={i} className="flex gap-5">
                  <span
                    className="text-4xl font-black leading-none shrink-0 w-10 text-right"
                    style={{ color: "rgba(253,250,243,0.15)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <p className="text-sm font-black uppercase tracking-wide" style={{ color: "var(--background)" }}>{title}</p>
                    <p className="mt-1 text-xs" style={{ color: "rgba(253,250,243,0.45)" }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Col 3 — CTA */}
          <div
            className="px-8 py-14 lg:py-20 flex flex-col justify-between"
            style={{ background: "var(--accent)" }}
          >
            <Image src="/Logo.jpg" alt="" width={56} height={56} className="rounded-md opacity-80" />
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white opacity-70 mb-4">Inizia adesso</p>
              <Link
                href="/register"
                className="block text-center py-4 text-sm font-black uppercase tracking-widest transition-all hover:opacity-80"
                style={{ background: "var(--background)", color: "var(--accent)", borderRadius: "2px" }}
              >
                Crea account →
              </Link>
              <Link
                href="/login"
                className="block text-center py-4 mt-3 text-sm font-black uppercase tracking-widest transition-all"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", borderRadius: "2px" }}
              >
                Hai già un account
              </Link>
              <p className="mt-6 text-xs opacity-50 text-white">
                Nessun pagamento online. Si paga sempre al ritiro in negozio.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          INSTAGRAM — full bleed
      ══════════════════════════════════════════════ */}
      <section>
        <a
          href="https://www.instagram.com/forno_irma/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row items-stretch"
          style={{ minHeight: "200px" }}
        >
          {/* Label */}
          <div
            className="flex items-center justify-center px-10 py-10 sm:w-72 shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 transition-colors group-hover:bg-[var(--sand)]"
            style={{ borderColor: "var(--foreground)" }}
          >
            <div className="text-center">
              <p className="section-label mb-2">Seguici su</p>
              <p className="text-3xl font-black tracking-tight">@forno_irma</p>
            </div>
          </div>
          {/* Arrow CTA */}
          <div
            className="flex-1 flex items-center justify-between px-10 py-10 transition-colors group-hover:bg-[var(--accent)]"
            style={{ background: "var(--sand)" }}
          >
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Foto, novità del giorno e specialità stagionali — ogni mattina su Instagram.
            </p>
            <span
              className="text-6xl font-black leading-none shrink-0 ml-8 transition-transform group-hover:translate-x-2"
            >
              →
            </span>
          </div>
        </a>
      </section>

    </div>
  );
}
