import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function Nav() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <header
      className="sticky top-0 z-50 border-b bg-[var(--background)]/90 backdrop-blur-md"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/Logo.jpg" alt="Forno Irma" width={38} height={38} className="rounded-lg" priority />
          <span className="text-base font-extrabold tracking-tight leading-tight hidden sm:block">
            Forno <span style={{ color: "var(--accent)" }}>Irma</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/prodotti", label: "Prodotti" },
            { href: "/prenotazioni", label: "Prenotazioni" },
            { href: "/chi-siamo", label: "Chi siamo" },
            { href: "/contatti", label: "Contatti" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--sand)]"
              style={{ color: "var(--foreground)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {isAdmin ? (
                /* Admin: solo link gestione + logout */
                <Link href="/admin" className="btn-ghost text-xs" style={{ color: "var(--accent)" }}>
                  ⚙ Gestione
                </Link>
              ) : (
                /* Utente normale: icona profilo (sempre visibile) */
                <Link
                  href="/profilo"
                  className="btn-ghost text-xs flex items-center gap-1.5"
                  aria-label="Il mio profilo"
                >
                  {/* Icona persona */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="hidden sm:inline">Il mio profilo</span>
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              {/* Accedi: sempre visibile (icona su mobile, testo su desktop) */}
              <Link href="/login" className="btn-ghost text-xs flex items-center gap-1.5" aria-label="Accedi">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="hidden sm:inline">Accedi</span>
              </Link>
              <Link href="/register" className="btn-primary text-xs">Registrati</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
