import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { formatReservationStatus } from "@/lib/utils";

export default async function UserReservationsPage() {
  const session = await requireAuth();
  const reservations = await prisma.reservation.findMany({
    where: { userId: session.user.id },
    include: { pickupSlot: true, items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container-shell space-y-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Area clienti</p>
          <h1 className="mt-2 text-4xl font-bold">Le tue prenotazioni</h1>
        </div>
        <Link href="/area-clienti/prenotazioni/nuova" className="btn-primary">Nuova prenotazione</Link>
      </div>

      {reservations.length === 0 ? (
        <div className="card p-8 text-[var(--muted)]">Nessuna prenotazione ancora. Il primo impasto aspetta solo un clic.</div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="card p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">{reservation.code}</p>
                  <h2 className="mt-1 text-xl font-semibold">Ritiro {format(reservation.pickupDate, "EEEE d MMMM yyyy", { locale: it })}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">Fascia: {reservation.pickupSlot.label}</p>
                </div>
                <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium">{formatReservationStatus(reservation.status)}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                {reservation.items.map((item) => <p key={item.id}>{item.productName} × {item.quantity}</p>)}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
