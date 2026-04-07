import Link from "next/link";
import { getBusinessSettings } from "@/lib/data";

export default async function BookingInfoPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="container-shell py-12">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="card p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Prenotazioni</p>
          <h1 className="mt-3 text-4xl font-bold">Prenota online, ritira in negozio</h1>
          <div className="mt-6 space-y-4 text-[var(--muted)]">
            <p>Per prenotare serve un account cliente. Una volta effettuato l’accesso puoi selezionare i prodotti, indicare quantità, data e fascia oraria di ritiro.</p>
            <p>Il team del forno gestisce lo stato dell’ordine e tu puoi controllarlo nell’area personale.</p>
            <p>{settings?.pickupInstructions ?? "Ritiro in negozio nelle fasce orarie disponibili. Nessun pagamento online in questa versione."}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="btn-primary">Crea account</Link>
            <Link href="/login" className="btn-secondary">Accedi</Link>
          </div>
        </section>
        <aside className="card p-8">
          <h2 className="text-xl font-semibold">Come funziona</h2>
          <ol className="mt-4 space-y-4 text-sm text-[var(--muted)]">
            <li>1. Registrazione cliente</li>
            <li>2. Scelta prodotti e quantità</li>
            <li>3. Selezione data e fascia di ritiro</li>
            <li>4. Attesa conferma</li>
            <li>5. Ritiro in negozio</li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
