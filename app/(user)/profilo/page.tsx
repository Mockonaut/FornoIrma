import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DeleteAccountButton } from "@/components/forms/delete-account-button";

export const metadata = { title: "Il mio profilo" };

export default async function ProfilePage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { reservations: true },
  });

  return (
    <div className="container-shell grid gap-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Profilo</p>
        <h1 className="mt-3 text-3xl font-bold">Ciao, {user?.name}</h1>
        <div className="mt-6 space-y-3 text-[var(--muted)]">
          <p><strong className="text-[var(--foreground)]">Email:</strong> {user?.email}</p>
          <p><strong className="text-[var(--foreground)]">Telefono:</strong> {user?.phone || "Non inserito"}</p>
          <p><strong className="text-[var(--foreground)]">Prenotazioni totali:</strong> {user?.reservations.length ?? 0}</p>
        </div>

        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
            Vuoi eliminare il tuo account? Tutti i dati e le prenotazioni associate saranno rimossi definitivamente.
          </p>
          <DeleteAccountButton />
        </div>
      </section>

      <section className="card p-8">
        <h2 className="text-xl font-semibold">Azioni rapide</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link href="/area-clienti/prenotazioni/nuova" className="card p-5 hover:bg-stone-50">
            <h3 className="font-semibold">Nuova prenotazione</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Scegli prodotti, data e fascia di ritiro.</p>
          </Link>
          <Link href="/area-clienti/prenotazioni" className="card p-5 hover:bg-stone-50">
            <h3 className="font-semibold">Storico prenotazioni</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Controlla stato e dettagli dei tuoi ritiri.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
