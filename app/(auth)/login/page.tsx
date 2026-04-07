import Link from "next/link";
import { LoginForm } from "@/components/forms/auth-forms";

export default function LoginPage() {
  return (
    <div className="container-shell py-12">
      <div className="card mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Area clienti</p>
        <h1 className="mt-3 text-3xl font-bold">Accedi</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Entra per prenotare e controllare lo storico ritiri.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">Non hai un account? <Link href="/register" className="font-semibold text-[var(--accent)]">Registrati</Link></p>
      </div>
    </div>
  );
}
