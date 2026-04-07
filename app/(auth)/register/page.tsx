import Link from "next/link";
import { RegisterForm } from "@/components/forms/auth-forms";

export default function RegisterPage() {
  return (
    <div className="container-shell py-12">
      <div className="card mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Nuovo cliente</p>
        <h1 className="mt-3 text-3xl font-bold">Crea il tuo account</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Ti servirà per prenotare prodotti e gestire i ritiri.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">Hai già un account? <Link href="/login" className="font-semibold text-[var(--accent)]">Accedi</Link></p>
      </div>
    </div>
  );
}
