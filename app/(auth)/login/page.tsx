import Link from "next/link";
import { LoginForm } from "@/components/forms/auth-forms";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; verified?: string; error?: string }>;
}) {
  const params = await searchParams;
  const justRegistered = params.registered === "1";
  const justVerified = params.verified === "1";
  const tokenError = params.error;

  return (
    <div className="container-shell py-12">
      <div className="card mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Area clienti</p>
        <h1 className="mt-3 text-3xl font-bold">Accedi</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Entra per prenotare e controllare lo storico ritiri.</p>

        {justRegistered && (
          <div
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
          >
            <p className="font-semibold">Registrazione completata ✓</p>
            <p className="mt-1 opacity-80">
              Ti abbiamo inviato un'email di conferma. Clicca il link nell'email per attivare il tuo account.
            </p>
          </div>
        )}

        {justVerified && (
          <div
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
          >
            <p className="font-semibold">Email confermata ✓</p>
            <p className="mt-1 opacity-80">Il tuo account è attivo. Accedi qui sotto.</p>
          </div>
        )}

        {tokenError && (
          <div
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}
          >
            <p className="font-semibold">
              {tokenError === "token_scaduto"
                ? "Link scaduto"
                : "Link non valido"}
            </p>
            <p className="mt-1 opacity-80">
              {tokenError === "token_scaduto"
                ? "Il link di conferma è scaduto (valido 24h). Registrati di nuovo per riceverne uno nuovo."
                : "Il link di conferma non è valido o è già stato usato."}
            </p>
          </div>
        )}

        <div className="mt-6">
          <LoginForm />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
          <span>
            Non hai un account?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "var(--accent)" }}>Registrati</Link>
          </span>
          <Link href="/forgot-password" className="font-semibold" style={{ color: "var(--accent)" }}>
            Password dimenticata?
          </Link>
        </div>
      </div>
    </div>
  );
}
