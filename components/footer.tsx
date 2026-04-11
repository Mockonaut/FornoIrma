import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-10" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
      <div className="container-shell grid gap-8 text-sm sm:grid-cols-3">
        <div>
          <p className="font-bold text-[var(--foreground)]">Forno Irma</p>
          <p className="mt-2">Artigiani del pane dal 1978.</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--foreground)]">Navigazione</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/prodotti" className="hover:text-[var(--foreground)]">Prodotti</Link></li>
            <li><Link href="/prenotazioni" className="hover:text-[var(--foreground)]">Prenotazioni</Link></li>
            <li><Link href="/chi-siamo" className="hover:text-[var(--foreground)]">Chi siamo</Link></li>
            <li><Link href="/contatti" className="hover:text-[var(--foreground)]">Contatti</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-[var(--foreground)]">Account</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/login" className="hover:text-[var(--foreground)]">Accedi</Link></li>
            <li><Link href="/register" className="hover:text-[var(--foreground)]">Registrati</Link></li>
            <li><Link href="/area-clienti/prenotazioni" className="hover:text-[var(--foreground)]">Le mie prenotazioni</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-shell mt-8 border-t pt-6 text-xs" style={{ borderColor: "var(--border)" }}>
        <p>© {new Date().getFullYear()} Forno Irma. Tutti i diritti riservati.</p>
      </div>
    </footer>
  );
}
