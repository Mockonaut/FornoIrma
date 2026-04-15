import Link from "next/link";
import Image from "next/image";
import { getBusinessSettings } from "@/lib/data";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prenota" };

export default async function BookingInfoPage() {
  const [settings, session] = await Promise.all([getBusinessSettings(), auth()]);
  const isLoggedIn = !!session?.user;

  const guestSteps = [
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
      body: settings?.pickupInstructions ?? "Nessun pagamento online. Ritiri in negozio e paghi lì.",
      cta: null,
    },
  ];

  const userSteps = [
    {
      n: "01",
      title: "Scegli i prodotti",
      body: "Naviga il catalogo, seleziona quello che vuoi e indica le quantità.",
      cta: { label: "Vedi il catalogo", href: "/prodotti" },
    },
    {
      n: "02",
      title: "Indica quando vieni",
      body: "Scegli la data e la fascia oraria di ritiro tra quelle disponibili.",
      cta: null,
    },
    {
      n: "03",
      title: "Vieni, ritiri, paghi",
      body: settings?.pickupInstructions ?? "Nessun pagamento online. Ritiri in negozio e paghi lì.",
      cta: null,
    },
  ];

  const steps = isLoggedIn ? userSteps : guestSteps;

  return (
    <div style={{ background: "var(--background)" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center">
          <div className="star-divider w-full max-w-xs mb-8">
            <span style={{ color: "var(--accent)" }}>★</span>
          </div>
          <h1
            className="font-extrabold leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "var(--foreground)" }}
          >
            Prenota online,{" "}
            <em className="not-italic" style={{ color: "var(--accent)" }}>
              ritira quando vuoi.
            </em>
          </h1>
          <p className="mt-5 text-base leading-relaxed max-w-sm" style={{ color: "var(--muted)" }}>
            Scegli i prodotti, indica data e ora di ritiro. Il forno prepara tutto —
            tu passi, ritiri e paghi in negozio.
          </p>
          <div className="star-divider w-full max-w-xs mt-10">
            <span style={{ color: "var(--border)" }}>★</span>
          </div>
        </div>
      </section>

      {/* ── STEPS ─────────────────────────────────────────── */}
      <section className="px-5 pb-16 sm:pb-20">
        <div className="mx-auto max-w-2xl space-y-4">
          {steps.map((step) => (
            <div key={step.n} className="card p-6 flex gap-5 items-start">
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: "var(--warm-dark)", color: "var(--background)" }}
              >
                {step.n}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{step.title}</h2>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {step.body}
                </p>
                {step.cta && (
                  <Link href={step.cta.href} className="btn-primary mt-4 inline-flex text-sm">
                    {step.cta.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="px-5 pb-20">
        <div
          className="mx-auto max-w-2xl rounded-3xl overflow-hidden"
          style={{ background: "var(--warm-dark)" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 px-8 py-10">
            <Image src="/Logo.jpg" alt="Forno Irma" width={64} height={64} className="rounded-xl shrink-0 opacity-90" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(253,250,243,0.45)" }}>
                Forno Irma · Magenta
              </p>
              <p className="text-xl font-extrabold" style={{ color: "var(--background)" }}>
                {isLoggedIn ? "Pronto quando lo sei tu." : "Inizia subito, è gratuito."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {isLoggedIn ? (
                <Link href="/area-clienti/prenotazioni/nuova" className="btn-primary whitespace-nowrap">
                  Nuova prenotazione
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary whitespace-nowrap">
                    Crea account
                  </Link>
                  <Link
                    href="/login"
                    className="btn-ghost whitespace-nowrap text-sm"
                    style={{ color: "rgba(253,250,243,0.7)", borderColor: "rgba(253,250,243,0.2)" }}
                  >
                    Accedi
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
