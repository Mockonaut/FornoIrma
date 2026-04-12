import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <header
      className="sticky top-0 z-50 border-b bg-[var(--background)]/90 backdrop-blur-md"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/Logo.jpg"
            alt="Forno Irma"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <span className="text-base font-extrabold tracking-tight leading-tight hidden sm:block">
            Forno<br />
            <span style={{ color: "var(--accent)" }}>Irma</span>
          </span>
        </Link>

        {/* Nav links */}
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
              className="rounded-full px-4 py-2 text-sm font-semibold transition-all hover:bg-[var(--sand)]"
              style={{ color: "var(--foreground)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link href="/profilo" className="btn-ghost text-xs px-4 py-2">
                {user.name?.split(" ")[0] ?? "Profilo"}
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin/categorie" className="btn-ghost text-xs px-4 py-2">
                  Admin
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-xs px-4 py-2 hidden sm:inline-flex">
                Accedi
              </Link>
              <Link href="/register" className="btn-primary text-xs px-4 py-2">
                Registrati
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
