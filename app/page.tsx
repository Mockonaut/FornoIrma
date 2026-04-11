import Link from "next/link";
import Image from "next/image";
import { getHomeContent, getVisibleProducts } from "@/lib/data";

export default async function HomePage() {
  const [content, products] = await Promise.all([
    getHomeContent(),
    getVisibleProducts(),
  ]);

  const hero = content.HOME_HERO;
  const featured = products.slice(0, 3);

  return (
    <div className="pb-24">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--foreground)" }}
      >
        {/* Decorative grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div className="container-shell relative flex flex-col items-center py-20 text-center lg:py-32">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/Logo.jpg"
              alt="Forno Irma"
              width={140}
              height={140}
              className="drop-shadow-2xl"
              priority
            />
          </div>

          {/* Headline */}
          <h1
            className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ color: "var(--background)" }}
          >
            {hero?.title ?? "Il pane di una volta,\npronti quando vuoi tu"}
          </h1>

          {/* Subline */}
          <p
            className="mt-6 max-w-lg text-base sm:text-lg"
            style={{ color: "color-mix(in srgb, var(--background) 65%, transparent)" }}
          >
            {hero?.body ?? "Prenota online, ritira in negozio. Farine selezionate, lievito madre, impasto a mano ogni giorno."}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/prodotti" className="btn-primary text-sm px-8 py-3.5">
              Scopri i prodotti
            </Link>
            <Link
              href="/prenotazioni"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold tracking-wide transition-all"
              style={{
                border: "2px solid color-mix(in srgb, var(--background) 30%, transparent)",
                color: "var(--background)",
              }}
            >
              Come prenotare →
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="mt-16 flex flex-col items-center gap-2 opacity-40">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--background)" }}>
              Dal forno
            </span>
            <div className="h-8 w-px" style={{ background: "var(--background)" }} />
          </div>
        </div>
      </section>

      {/* ── STRIP ────────────────────────────────────────────── */}
      <div
        className="border-y-2 py-3 overflow-hidden"
        style={{ background: "var(--accent)", borderColor: "var(--accent-hover)" }}
      >
        <div className="flex gap-12 whitespace-nowrap animate-[scroll_20s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-[0.3em] text-white opacity-80">
              Pane artigianale&nbsp;&nbsp;★&nbsp;&nbsp;Lievito madre&nbsp;&nbsp;★&nbsp;&nbsp;Impasto a mano&nbsp;&nbsp;★&nbsp;&nbsp;Prenota online
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="container-shell mt-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-label">Dal forno</p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight">In evidenza</h2>
          </div>
          <Link
            href="/prodotti"
            className="text-sm font-bold underline underline-offset-4 transition-opacity hover:opacity-60"
            style={{ color: "var(--accent)" }}
          >
            Vedi tutto →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, idx) => (
            <article
              key={product.id}
              className="card overflow-hidden group"
              style={idx === 0 ? { borderColor: "var(--accent)", borderWidth: "2px" } : {}}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.images[0]?.url ?? "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {idx === 0 && (
                  <div
                    className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white uppercase tracking-widest"
                    style={{ background: "var(--accent)" }}
                  >
                    ★ In evidenza
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="tag">{product.category.name}</span>
                  {product.isSpecial && <span className="tag-accent">Speciale</span>}
                  {product.isSeasonal && <span className="tag-accent">Stagionale</span>}
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">{product.name}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {product.shortDescription}
                </p>
                <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    Disponibile
                  </span>
                  <Link href="/register" className="text-xs font-bold underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    Prenota →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="container-shell mt-24">
        <div
          className="rounded-2xl p-8 lg:p-14"
          style={{ background: "var(--sand)", border: "2px solid var(--border)" }}
        >
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col justify-between">
              <div>
                <p className="section-label">Semplice</p>
                <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
                  Prenota online,<br />ritira quando<br />vuoi tu.
                </h2>
                <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                  Niente code, niente sorprese. Scegli i prodotti, indica data e fascia oraria, e il tuo ordine sarà pronto ad aspettarti.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="btn-primary">Crea account</Link>
                <Link href="/login" className="btn-secondary">Accedi</Link>
              </div>
            </div>

            <ol className="space-y-0 divide-y-2" style={{ borderColor: "var(--border)" }}>
              {[
                ["01", "Registrati", "Crea il tuo account in meno di un minuto."],
                ["02", "Scegli i prodotti", "Naviga il catalogo e seleziona quantità e tipologie."],
                ["03", "Indica quando venire", "Scegli data e fascia oraria di ritiro."],
                ["04", "Aspetta la conferma", "Ti aggiorniamo nell'area personale."],
                ["05", "Ritira e paga", "Vieni in negozio, ritiri e paghi lì. Fine."],
              ].map(([num, title, desc]) => (
                <li key={num} className="flex items-start gap-5 py-4 first:pt-0 last:pb-0">
                  <span
                    className="text-3xl font-black leading-none mt-1 shrink-0"
                    style={{ color: "color-mix(in srgb, var(--foreground) 20%, transparent)" }}
                  >
                    {num}
                  </span>
                  <div>
                    <p className="font-extrabold tracking-tight">{title}</p>
                    <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM CTA ────────────────────────────────────── */}
      <section className="container-shell mt-16">
        <a
          href="https://www.instagram.com/forno_irma/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl p-8 transition-all hover:scale-[1.01]"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-50">Seguici su</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">@forno_irma</h2>
            <p className="mt-1 text-sm opacity-60">Foto, novità e specialità del giorno su Instagram.</p>
          </div>
          <span
            className="rounded-full px-7 py-3.5 text-sm font-bold shrink-0"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Vai al profilo →
          </span>
        </a>
      </section>
    </div>
  );
}
