import Link from "next/link";
import { LoginForm } from "@/components/forms/auth-forms";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  const justRegistered = params.registered === "1";

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
            <p className="font-semibold">Account creato con successo ✓</p>
            <p className="mt-1 opacity-80">
              Ti abbiamo inviato un'email di benvenuto. Accedi qui sotto per iniziare.
            </p>
          </div>
        )}

        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Non hai un account?{" "}
          <Link href="/register" className="font-semibold" style={{ color: "var(--accent)" }}>Registrati</Link>
        </p>
      </div>
    </div>
  );
}
