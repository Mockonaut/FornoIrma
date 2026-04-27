"use client";

import { useState } from "react";
import { cancelReservationAction } from "@/lib/actions";

export function CancelReservationButton({ reservationId, code }: { reservationId: string; code: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm(`Annullare la prenotazione ${code}? L'operazione non è reversibile.`)) return;
    setLoading(true);
    const formData = new FormData();
    formData.set("reservationId", reservationId);
    const result = await cancelReservationAction(formData);
    setLoading(false);
    if (result.error) setError(result.error);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={loading}
          className="btn-ghost text-xs py-1.5 px-3"
          style={{ color: "var(--error, #dc2626)" }}
        >
          {loading ? "Annullamento…" : "Annulla prenotazione"}
        </button>
      </form>
      {error && <p className="mt-1 text-xs" style={{ color: "var(--error, #dc2626)" }}>{error}</p>}
    </div>
  );
}
