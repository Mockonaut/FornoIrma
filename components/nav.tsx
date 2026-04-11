import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm" style={{ borderColor: "var(--border)" }}>
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Forno Irma
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" style={{ color: "var(--muted)" }}>
          <Link href="/prodotti" className="hover:text-[var(--foreground)] transition-colors">Prodotti</Link>
          <Link href="/prenotazioni" className="hover:text-[var(--foreground)] transition-colors">Prenotazioni</Link>
          <Link href="/chi-siamo" className="hover:text-[var(--foreground)] transition-colors">Chi siamo</Link>
          <Link href="/contatti" className="hover:text-[var(--foreground)] transition-colors">Contatti</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profilo" className="btn-secondary text-xs px-4 py-2">
                {user.name?.split(" ")[0] ?? "Profilo"}
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin/categorie" className="btn-secondary text-xs px-4 py-2">
                  Admin
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-xs px-4 py-2">Accedi</Link>
              <Link href="/register" className="btn-primary text-xs px-4 py-2">Registrati</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
