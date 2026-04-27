import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getReservationConstraints } from "@/lib/data";
import { NewReservationForm } from "@/components/reservations/new-reservation-form";

export default async function NewReservationPage() {
  await requireAuth();
  const [products, pickupSlots, constraints] = await Promise.all([
    prisma.product.findMany({
      where: { isVisible: true },
      select: {
        id: true,
        name: true,
        shortDescription: true,
        availableDays: true,
        maxQtyPerOrder: true,
        category: true,
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
    }),
    prisma.pickupSlot.findMany({ where: { isActive: true }, orderBy: { startTime: "asc" } }),
    getReservationConstraints(),
  ]);

  return (
    <div className="container-shell space-y-6 py-12">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Nuova prenotazione</p>
        <h1 className="mt-2 text-4xl font-bold">Prenota i tuoi prodotti</h1>
        <p className="mt-3 text-[var(--muted)]">Scegli prima la data di ritiro: vedrai i prodotti disponibili in quel giorno.</p>
      </div>
      <NewReservationForm
        products={products}
        pickupSlots={pickupSlots}
        closureDates={constraints.closureDates}
        openingHours={constraints.openingHours}
      />
    </div>
  );
}
