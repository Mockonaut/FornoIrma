import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Gestione sito" };

export default async function AdminDashboard() {
  await requireAdmin();

  const [categoryCount, productCount, reservationCount, pendingCount] = await Promise.all([
    prisma.category.count({ where: { isVisible: true } }),
    prisma.product.count({ where: { isVisible: true } }),
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "PENDING" } }),
  ]);

  const tiles = [
    { label: "Categorie", value: categoryCount, href: "/admin/categorie", desc: "Gestisci le categorie del catalogo" },
    { label: "Prodotti", value: productCount, href: "/admin/prodotti", desc: "Elenco prodotti visibili" },
    { label: "Prenotazioni totali", value: reservationCount, href: "/admin/prenotazioni", desc: "Storico ordini" },
    { label: "In attesa", value: pendingCount, href: "/admin/prenotazioni", desc: "Prenotazioni da confermare", accent: pendingCount > 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="section-label mb-1">Pannello di controllo</p>
        <h1 className="text-3xl font-extrabold">Benvenuto</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="card p-5 hover:shadow-md transition-all group"
            style={t.accent ? { borderColor: "var(--accent)" } : {}}
          >
            <p
              className="text-4xl font-black"
              style={{ color: t.accent ? "var(--accent)" : "var(--foreground)" }}
            >
              {t.value}
            </p>
            <p className="mt-1 text-sm font-bold">{t.label}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{t.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-bold mb-4">Azioni rapide</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/categorie" className="btn-secondary text-sm">Gestisci categorie</Link>
          <Link href="/admin/prodotti" className="btn-secondary text-sm">Gestisci prodotti</Link>
          <Link href="/admin/prenotazioni" className="btn-secondary text-sm">Vedi prenotazioni</Link>
          <Link href="/admin/pane-del-giorno" className="btn-primary text-sm">★ Aggiorna pane del giorno</Link>
        </div>
      </div>
    </div>
  );
}
