import Link from "next/link";
import Image from "next/image";
import { getBusinessSettings } from "@/lib/data";

export const metadata = { title: "Prenota" };

export default async function BookingInfoPage() {
  const settings = await getBusinessSettings();

  const steps = [
    {
      n: "01",
      title: "Crea il tuo account",
      body: "Registrazione gratuita, meno di un minuto. Ti serve solo email e password.",
      cta: { label: "Registrati", href: "/register" },
    },
    {
      n: "02",
      title: "Scegli i prodotti",
      body: "Naviga il catalogo, seleziona quello che vuoi e indica le quantità.",
      cta: { label: "Vedi il catalogo", href: "/prodotti" },
    },
    {
      n: "03",
      title: "Indica quando vieni",
      body: "Scegli la data e la fascia oraria di ritiro tra quelle disponibili.",
      cta: null,
    },
    {
      n: "04",
      title: "Vieni, ritiri, paghi",
      body: settings?.pickupInstructions ?? "Nessun pagamento online. Ritiri in negozio e paghi lì. Fine.",
      cta: null,
    },
  ];

  return (
    <div style={{ background: "var(--background)" }}>

      {/* ── HEADER SEZIONE ─────────────────────────────────── */}
      <div
        className="border-b-2 px-5 sm:px-8 lg:px-12 py-10"
        style={{ borderColor: "var(--foreground)" }}
      >
        <p className="section-label mb-3">Prenotazioni</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <h1
            className="display-large"
            style={{ color: "var(--foreground)", maxWidth: "16ch" }}
          >
            Prenota online,<br />
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>ritira quando vuoi.</span>
          </h1>
          <p className="max-w-sm text-sm leading-relaxed lg:pb-2" style={{ color: "var(--muted)" }}>
            Scegli i prodotti, indica data e ora di ritiro. Il forno prepara tutto, tu passi e paghi in negozio.
          </p>
        </div>
      </div>

      {/* ── STEPS ──────────────────────────────────────────── */}
      <div className="divide-y-2" style={{ borderColor: "var(--border)" }}>
        {steps.map((step, i) => (
          <div
            key={step.n}
            className="grid grid-cols-1 lg:grid-cols-[280px_1fr_auto] items-center gap-0"
            style={{ borderBottom: i === steps.length - 1 ? `2px solid var(--foreground)` : undefined }}
          >
            {/* Numero */}
            <div
              className="px-5 sm:px-8 lg:px-12 py-8 lg:py-10 lg:border-r-2 flex items-center gap-4"
              style={{ borderColor: "var(--foreground)" }}
            >
              <span
                className="font-black leading-none"
                style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "var(--border)" }}
              >
                {step.n}
              </span>
            </div>

            {/* Testo */}
            <div className="px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
              <h2 className="text-xl font-black uppercase tracking-tight">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed max-w-lg" style={{ color: "var(--muted)" }}>
                {step.body}
              </p>
            </div>

            {/* CTA opzionale */}
            <div className="px-5 sm:px-8 lg:px-12 pb-8 lg:py-10 lg:border-l-2" style={{ borderColor: "var(--border)" }}>
              {step.cta ? (
                <Link href={step.cta.href} className="btn-primary whitespace-nowrap">
                  {step.cta.label}
                </Link>
              ) : (
                <div className="w-36" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA FINALE ─────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 border-t-2"
        style={{ borderColor: "var(--foreground)", background: "var(--foreground)" }}
      >
        {/* Sinistra: logo + messaggio */}
        <div
          className="flex items-center gap-6 px-5 sm:px-8 lg:px-12 py-12 border-b-2 lg:border-b-0 lg:border-r-2"
          style={{ borderColor: "rgba(253,250,243,0.12)" }}
        >
          <Image src="/Logo.jpg" alt="Forno Irma" width={64} height={64} className="rounded-md shrink-0 opacity-80" />
          <div>
            <p className="text-sm font-black uppercase tracking-widest" style={{ color: "rgba(253,250,243,0.4)" }}>
              Forno Irma · Est. 1978
            </p>
            <p className="mt-1 text-lg font-black" style={{ color: "var(--background)" }}>
              Pronto quando lo sei tu.
            </p>
          </div>
        </div>

        {/* Destra: bottoni */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 px-5 sm:px-8 lg:px-12 py-12">
          <Link href="/register" className="btn-primary flex-1 text-center py-5 text-base">
            Crea account →
          </Link>
          <Link
            href="/login"
            className="flex-1 text-center py-5 text-sm font-black uppercase tracking-widest transition-all"
            style={{
              border: "2px solid rgba(253,250,243,0.2)",
              color: "rgba(253,250,243,0.7)",
              borderRadius: "2px",
            }}
          >
            Accedi
          </Link>
        </div>
      </div>
    </div>
  );
}
