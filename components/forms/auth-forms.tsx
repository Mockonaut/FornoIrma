"use client";

import { useActionState, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/actions";

// ─── Eye icon ─────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordInput({ id, name, placeholder, autoComplete }: {
  id: string; name: string; placeholder: string; autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        className="input pr-10"
        placeholder={placeholder}
        required
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--muted)" }}
        tabIndex={-1}
        aria-label={show ? "Nascondi password" : "Mostra password"}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

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
      // Redirect based on role — session is refreshed server-side
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/profilo");
      }
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
        <PasswordInput id="password" name="password" placeholder="••••••••" autoComplete="current-password" />
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
          <input id="firstName" name="firstName" type="text" className="input" placeholder="Mario" required autoComplete="given-name" />
        </div>
        <div>
          <label className="label" htmlFor="lastName">Cognome</label>
          <input id="lastName" name="lastName" type="text" className="input" placeholder="Rossi" required autoComplete="family-name" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="email">Email <span style={{ color: "var(--muted)", fontWeight: 400 }}>(obbligatoria)</span></label>
        <input id="email" name="email" type="email" className="input" placeholder="nome@esempio.it" required autoComplete="email" />
      </div>

      <div>
        <label className="label" htmlFor="phone">
          Numero di cellulare{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opzionale — puoi usarlo al posto dell'email per accedere)</span>
        </label>
        <input id="phone" name="phone" type="tel" className="input" placeholder="+39 333 1234567" autoComplete="tel" />
      </div>

      <div>
        <label className="label" htmlFor="password">Password</label>
        <PasswordInput id="password" name="password" placeholder="Minimo 8 caratteri" autoComplete="new-password" />
      </div>

      <div>
        <label className="label" htmlFor="confirmPassword">Conferma password</label>
        <PasswordInput id="confirmPassword" name="confirmPassword" placeholder="Ripeti la password" autoComplete="new-password" />
      </div>

      <div className="flex items-start gap-2">
        <input id="privacyConsent" name="privacyConsent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]" />
        <label htmlFor="privacyConsent" className="text-sm" style={{ color: "var(--muted)" }}>
          Ho letto e accetto la{" "}
          <a href="/privacy" target="_blank" className="underline" style={{ color: "var(--accent)" }}>Privacy Policy</a>
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
