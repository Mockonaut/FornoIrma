"use client";

import { useActionState, useState, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions";

interface Props {
  initialName: string;
  initialPhone: string | null;
}

export function ProfileForm({ initialName, initialPhone }: Props) {
  const [editing, setEditing] = useState(false);
  const [state, action, isPending] = useActionState(updateProfileAction, null);

  const nameParts = initialName.split(" ");
  const defaultFirst = nameParts[0] ?? "";
  const defaultLast  = nameParts.slice(1).join(" ");

  useEffect(() => {
    if (state?.success) setEditing(false);
  }, [state?.success]);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="btn-ghost text-xs py-1.5 px-4 mt-4"
        style={{ color: "var(--accent)" }}
      >
        Modifica dati
      </button>
    );
  }

  return (
    <form action={action} className="mt-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="label">Nome</label>
          <input name="firstName" defaultValue={defaultFirst} className="input py-2 text-sm" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label">Cognome</label>
          <input name="lastName" defaultValue={defaultLast} className="input py-2 text-sm" required />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="label">
          Telefono{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opzionale)</span>
        </label>
        <input
          name="phone"
          type="tel"
          defaultValue={initialPhone ?? ""}
          className="input py-2 text-sm"
          placeholder="es. +39 333 1234567"
        />
      </div>

      {state?.error && (
        <p className="text-sm" style={{ color: "#991b1b" }}>{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm" style={{ color: "#166534" }}>Dati aggiornati ✓</p>
      )}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={isPending} className="btn-primary text-sm py-2 px-5">
          {isPending ? "Salvataggio…" : "Salva"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="btn-ghost text-sm py-2 px-4"
          style={{ color: "var(--muted)" }}
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
