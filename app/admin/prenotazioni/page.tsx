import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { formatReservationStatus, RESERVATION_TRANSITIONS } from "@/lib/utils";
import { updateReservationStatusAction } from "@/lib/actions";

export const metadata = { title: "Prenotazioni — Gestione" };

const STATUS_DOT: Record<string, string> = {
  PENDING:   "bg-amber-400",
  CONFIRMED: "bg-blue-400",
  READY:     "bg-emerald-400",
  COMPLETED: "bg-stone-400",
  CANCELLED: "bg-rose-400",
};

export default async function AdminReservationsPage() {
  await requireAdmin();

  const reservations = await prisma.reservation.findMany({
    include: { user: true, pickupSlot: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <p className="section-label mb-1">Gestione</p>
      <h1 className="text-3xl font-extrabold mb-8">Prenotazioni</h1>

      {reservations.length === 0 ? (
        <div className="card p-8 text-center" style={{ color: "var(--muted)" }}>
          Nessuna prenotazione ancora.
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => {
            const transitions = RESERVATION_TRANSITIONS[r.status] ?? [];
            return (
              <div key={r.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Info prenotazione */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_DOT[r.status]}`}
                      />
                      <span className="font-black text-sm tracking-wide">{r.code}</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "var(--border)", color: "var(--foreground)" }}
                      >
                        {formatReservationStatus(r.status)}
                      </span>
                    </div>
                    <p className="font-semibold truncate">{r.user.name} — {r.user.email}</p>
                    <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                      Ritiro: {format(r.pickupDate, "EEEE d MMMM yyyy", { locale: it })} · {r.pickupSlot.label}
                    </p>
                    <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      {r.items.map((item) => (
                        <span key={item.id} className="mr-3">{item.productName} ×{item.quantity}</span>
                      ))}
                    </div>
                    {r.notes && (
                      <p className="mt-1 text-xs italic" style={{ color: "var(--muted)" }}>Note: {r.notes}</p>
                    )}
                  </div>

                  {/* Azioni contestuali */}
                  {transitions.length > 0 && (
                    <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                      {transitions.map((t) => (
                        <form key={t.next} action={updateReservationStatusAction}>
                          <input type="hidden" name="reservationId" value={r.id} />
                          <input type="hidden" name="status" value={t.next} />
                          <button
                            className={
                              t.style === "primary"
                                ? "btn-primary text-xs py-2 px-4 w-full"
                                : "btn-ghost text-xs py-2 px-4 w-full"
                            }
                            style={
                              t.style === "ghost"
                                ? { color: "var(--muted)", borderColor: "var(--border)" }
                                : undefined
                            }
                          >
                            {t.label}
                          </button>
                        </form>
                      ))}
                    </div>
                  )}

                  {/* Stato terminale */}
                  {transitions.length === 0 && (
                    <div
                      className="text-xs px-3 py-2 rounded-xl shrink-0 self-start"
                      style={{ background: "var(--border)", color: "var(--muted)" }}
                    >
                      {r.status === "COMPLETED" ? "Completata" : "Annullata"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
