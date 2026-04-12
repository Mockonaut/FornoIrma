"use client";

import { useState } from "react";
import { deleteAccountAction } from "@/lib/actions";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!confirm) {
    return (
      <button
        type="button"
        onClick={() => setConfirm(true)}
        className="btn-ghost text-xs py-2 px-4"
        style={{ color: "var(--muted)", borderColor: "var(--border)" }}
      >
        Elimina account
      </button>
    );
  }

  const handleDelete = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    await deleteAccountAction();
  };

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: "#fff5f5", border: "1px solid #fecaca" }}>
      <p className="text-sm font-semibold" style={{ color: "#991b1b" }}>Sei sicuro? L'azione è irreversibile.</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="btn-primary text-xs py-2 px-4"
          style={{ background: "#dc2626" }}
        >
          {loading ? "Eliminazione…" : "Sì, elimina tutto"}
        </button>
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="btn-ghost text-xs py-2 px-4"
        >
          Annulla
        </button>
      </div>
    </div>
  );
}
