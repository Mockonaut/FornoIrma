"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "@/lib/actions";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(requestPasswordResetAction, null);

  return (
    <div className="container-shell py-12">
      <div className="card mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
          Account
        </p>
        <h1 className="mt-3 text-3xl font-bold">Password dimenticata?</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Inserisci la tua email e ti mandiamo un link per reimpostare la password.
        </p>

        {state?.success ? (
          <div
            className="mt-6 rounded-xl p-4 text-sm"
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
          >
            <p className="font-semibold">Email inviata ✓</p>
            <p className="mt-1 opacity-80">
              Se l&apos;indirizzo è registrato, riceverai un link entro pochi minuti. Controlla anche la cartella spam.
            </p>
          </div>
        ) : (
          <form action={action} className="mt-6 space-y-4">
            <div className="flex flex-col gap-1">
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="input py-2.5"
                placeholder="la-tua@email.it"
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm" style={{ color: "#991b1b" }}>{state.error}</p>
            )}

            <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
              {isPending ? "Invio in corso…" : "Invia link di reset"}
            </button>
          </form>
        )}

        <p className="mt-5 text-sm" style={{ color: "var(--muted)" }}>
          Ricordi la password?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--accent)" }}>
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
