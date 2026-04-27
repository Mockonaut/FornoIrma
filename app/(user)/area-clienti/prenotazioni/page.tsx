import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { formatReservationStatus, RESERVATION_STEPS } from "@/lib/utils";
import { ReservationStatus } from "@prisma/client";
import { CancelReservationButton } from "@/components/reservations/cancel-reservation-button";

function StatusProgress({ status }: { status: ReservationStatus }) {
  if (status === "CANCELLED") {
    return (
      <span
        className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: "#fee2e2", color: "#b91c1c" }}
      >
        Annullata
      </span>
    );
  }

  const currentIdx = RESERVATION_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {RESERVATION_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isLast = idx === RESERVATION_STEPS.length - 1;
        return (
          <div key={step} className="flex items-center">
            {/* Dot */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-3 h-3 rounded-full border-2 transition-colors"
                style={{
                  borderColor: done ? "var(--accent)" : "var(--border)",
                  background: done ? "var(--accent)" : "transparent",
                }}
              />
              <span
                className="text-[10px] leading-none whitespace-nowrap"
                style={{ color: done ? "var(--accent)" : "var(--muted)", fontWeight: done ? 600 : 400 }}
              >
                {formatReservationStatus(step)}
              </span>
            </div>
            {/* Connector */}
            {!isLast && (
              <div
                className="h-0.5 w-6 mx-1 mb-4 rounded"
                style={{ background: idx < currentIdx ? "var(--accent)" : "var(--border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function UserReservationsPage() {
  const session = await requireAuth();
  const reservations = await prisma.reservation.findMany({
    where: { userId: session.user.id },
    include: { pickupSlot: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-shell space-y-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Area clienti</p>
          <h1 className="mt-2 text-4xl font-bold">Le tue prenotazioni</h1>
        </div>
        <Link href="/area-clienti/prenotazioni/nuova" className="btn-primary">Nuova prenotazione</Link>
      </div>

      {reservations.length === 0 ? (
        <div className="card p-8" style={{ color: "var(--muted)" }}>
          Nessuna prenotazione ancora. Il primo impasto aspetta solo un clic.
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="card p-6">
              <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>
                      {reservation.code}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Ritiro {format(reservation.pickupDate, "EEEE d MMMM yyyy", { locale: it })}
                    </h2>
                    <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                      Fascia: {reservation.pickupSlot.label}
                    </p>
                  </div>
                  {/* Progress bar */}
                  <div className="shrink-0">
                    <StatusProgress status={reservation.status} />
                  </div>
                </div>

                {/* Prodotti */}
                <div className="flex flex-wrap gap-2">
                  {reservation.items.map((item) => (
                    <span
                      key={item.id}
                      className="text-sm px-3 py-1 rounded-full"
                      style={{ background: "var(--warm-light, #faf6f1)", color: "var(--foreground)" }}
                    >
                      {item.productName} × {item.quantity}
                    </span>
                  ))}
                </div>

                {/* Azione annullamento */}
                {(reservation.status === "PENDING" || reservation.status === "CONFIRMED") &&
                  reservation.pickupDate > new Date() && (
                    <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                      <CancelReservationButton
                        reservationId={reservation.id}
                        code={reservation.code}
                      />
                    </div>
                  )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
