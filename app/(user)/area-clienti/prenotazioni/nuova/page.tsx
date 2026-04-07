import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NewReservationForm } from "@/components/reservations/new-reservation-form";

export default async function NewReservationPage() {
  await requireAuth();
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }]
  });
  const pickupSlots = await prisma.pickupSlot.findMany({ where: { isActive: true }, orderBy: { startTime: "asc" } });

  return (
    <div className="container-shell space-y-6 py-12">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Nuova prenotazione</p>
        <h1 className="mt-2 text-4xl font-bold">Scegli i prodotti</h1>
        <p className="mt-3 text-[var(--muted)]">Seleziona quantità, data e fascia oraria di ritiro. Esperienza semplice, crosta croccante.</p>
      </div>
      <NewReservationForm products={products} pickupSlots={pickupSlots} />
    </div>
  );
}
