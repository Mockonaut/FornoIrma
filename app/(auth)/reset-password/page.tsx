"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, isPending] = useActionState(resetPasswordAction, null);

  if (state?.success) {
    return (
      <div
        className="mt-6 rounded-xl p-4 text-sm"
        style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
      >
        <p className="font-semibold">Password aggiornata ✓</p>
        <p className="mt-1 opacity-80">Puoi ora accedere con la nuova password.</p>
        <Link href="/login" className="mt-3 inline-block font-semibold" style={{ color: "#166534" }}>
          Vai al login →
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <p className="mt-6 text-sm" style={{ color: "#991b1b" }}>
        Link non valido. <Link href="/forgot-password" style={{ color: "var(--accent)" }}>Richiedine uno nuovo.</Link>
      </p>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1">
        <label className="label">Nuova password</label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          className="input py-2.5"
          minLength={8}
          required
        />
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Minimo 8 caratteri</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="label">Conferma password</label>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="input py-2.5"
          minLength={8}
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm" style={{ color: "#991b1b" }}>{state.error}</p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
        {isPending ? "Salvataggio…" : "Salva nuova password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container-shell py-12">
      <div className="card mx-auto max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
          Account
        </p>
        <h1 className="mt-3 text-3xl font-bold">Nuova password</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Scegli una nuova password per il tuo account.
        </p>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
