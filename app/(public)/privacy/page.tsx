import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sul trattamento dei dati personali di Forno Irma.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container-shell py-12">
      <div className="card mx-auto max-w-3xl p-8 space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Informativa</p>
          <h1 className="mt-3 text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Ultimo aggiornamento: aprile 2025
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Titolare del trattamento</h2>
          <p style={{ color: "var(--muted)" }}>
            Il titolare del trattamento è <strong style={{ color: "var(--foreground)" }}>Forno Irma</strong>,
            con sede a Magenta (MI). Per qualsiasi richiesta relativa ai dati personali puoi contattarci
            all'indirizzo email indicato nella pagina Contatti.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Dati raccolti</h2>
          <p style={{ color: "var(--muted)" }}>
            In fase di registrazione raccogliamo: nome e cognome, indirizzo email, numero di cellulare
            (opzionale). Durante la prenotazione raccogliamo: prodotti scelti, data e fascia di ritiro,
            eventuali note libere. Le password vengono conservate esclusivamente in forma cifrata (bcrypt).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Finalità e base giuridica</h2>
          <ul className="list-disc pl-5 space-y-2" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Gestione dell'account e delle prenotazioni</strong>
              {" "}— base giuridica: esecuzione del contratto (art. 6, co. 1, lett. b GDPR).
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Comunicazioni relative all'ordine</strong>
              {" "}— base giuridica: legittimo interesse (art. 6, co. 1, lett. f GDPR).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Conservazione dei dati</h2>
          <p style={{ color: "var(--muted)" }}>
            I dati vengono conservati per il tempo necessario all'erogazione del servizio e per adempiere
            agli obblighi di legge. Puoi richiedere la cancellazione del tuo account in qualsiasi momento
            dalla sezione <em>Profilo</em> dell'area clienti: tutti i tuoi dati personali e le prenotazioni
            associate saranno eliminati entro 30 giorni.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Cookie</h2>
          <p style={{ color: "var(--muted)" }}>
            Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento del servizio
            (sessione di autenticazione). Non vengono utilizzati cookie di profilazione o strumenti di
            analisi di terze parti.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Diritti dell'interessato</h2>
          <p style={{ color: "var(--muted)" }}>
            Ai sensi degli artt. 15–22 GDPR hai diritto di: accedere ai tuoi dati, rettificarli,
            cancellarli, limitarne il trattamento, opporti al trattamento, ricevere i dati in formato
            portabile. Per esercitare questi diritti scrivi all'indirizzo indicato nella pagina Contatti.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">7. Reclami</h2>
          <p style={{ color: "var(--muted)" }}>
            Hai il diritto di proporre reclamo al Garante per la protezione dei dati personali
            (www.garanteprivacy.it).
          </p>
        </section>
      </div>
    </div>
  );
}
