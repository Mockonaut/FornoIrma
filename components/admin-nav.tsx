"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/pane-del-giorno", label: "Pane del giorno" },
  { href: "/admin/prenotazioni", label: "Prenotazioni" },
  { href: "/admin/prodotti", label: "Prodotti" },
  { href: "/admin/categorie", label: "Categorie" },
  { href: "/admin/utenti", label: "Utenti" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div
      className="border-b"
      style={{ background: "var(--sand)", borderColor: "var(--border)" }}
    >
      <div className="container-shell flex items-center gap-1 overflow-x-auto py-0 h-11">
        {links.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="shrink-0 px-3 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors"
              style={
                active
                  ? { background: "var(--warm-dark)", color: "var(--background)" }
                  : { color: "var(--muted)" }
              }
            >
              {label}
            </Link>
          );
        })}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <Link
            href="/profilo"
            className="shrink-0 text-xs px-3 py-2 rounded-full whitespace-nowrap transition-colors hover:text-[var(--foreground)]"
            style={{ color: "var(--muted)" }}
          >
            Profilo
          </Link>
          <Link
            href="/"
            className="shrink-0 text-xs px-3 py-2 rounded-full whitespace-nowrap transition-colors hover:text-[var(--foreground)]"
            style={{ color: "var(--muted)" }}
          >
            ← Sito
          </Link>
        </div>
      </div>
    </div>
  );
}
