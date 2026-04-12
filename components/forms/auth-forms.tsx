"use client";

import { useActionState, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/actions";

// ─── Login ────────────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      identifier: fd.get("identifier"),
      password: fd.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Credenziali non valide. Controlla email (o cellulare) e password.");
    } else {
      router.push("/profilo");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="identifier">Email o numero di cellulare</label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          className="input"
          placeholder="nome@esempio.it oppure +39 333 1234567"
          required
          autoComplete="username"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? "Accesso in corso…" : "Accedi"}
      </button>
    </form>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <form action={action} className="space-y-4">
      {/* Nome e cognome affiancati */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="firstName">Nome</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="input"
            placeholder="Mario"
            required
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className="label" htmlFor="lastName">Cognome</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="input"
            placeholder="Rossi"
            required
            autoComplete="family-name"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          placeholder="nome@esempio.it"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className="label" htmlFor="phone">
          Numero di cellulare <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opzionale — puoi usarlo per accedere)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="input"
          placeholder="+39 333 1234567"
          autoComplete="tel"
        />
      </div>

      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="Minimo 8 caratteri"
          required
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="label" htmlFor="confirmPassword">Conferma password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="input"
          placeholder="Ripeti la password"
          required
          autoComplete="new-password"
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          id="privacyConsent"
          name="privacyConsent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <label htmlFor="privacyConsent" className="text-sm" style={{ color: "var(--muted)" }}>
          Ho letto e accetto la{" "}
          <a href="/privacy" target="_blank" className="underline" style={{ color: "var(--accent)" }}>
            Privacy Policy
          </a>
          . Acconsento al trattamento dei miei dati per la gestione delle prenotazioni.
        </label>
      </div>

      {state?.error && (
        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
          {state.error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
        {pending ? "Registrazione in corso…" : "Crea account"}
      </button>
    </form>
  );
}
