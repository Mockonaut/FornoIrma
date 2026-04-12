import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Gestione — Forno Irma" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/pane-del-giorno", label: "★ Pane del giorno" },
    { href: "/admin/prenotazioni", label: "Prenotazioni" },
    { href: "/admin/categorie", label: "Categorie" },
    { href: "/admin/prodotti", label: "Prodotti" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Barra admin */}
      <div
        className="border-b px-5 sm:px-8 py-3 flex items-center gap-6 overflow-x-auto"
        style={{ background: "var(--sand)", borderColor: "var(--border)" }}
      >
        <span className="text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: "var(--muted)" }}>
          Gestione
        </span>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xs font-semibold whitespace-nowrap transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--foreground)" }}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/"
          className="ml-auto text-xs shrink-0"
          style={{ color: "var(--muted)" }}
        >
          ← Torna al sito
        </Link>
      </div>

      <div className="container-shell py-10">
        {children}
      </div>
    </div>
  );
}
