import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="container-shell py-8">
      <nav className="mb-6 flex flex-wrap gap-3">
        <Link href="/admin/categorie" className="btn-secondary text-xs">
          Categorie
        </Link>
        <Link href="/admin/prodotti" className="btn-secondary text-xs">
          Prodotti
        </Link>
        <Link href="/admin/prenotazioni" className="btn-secondary text-xs">
          Prenotazioni
        </Link>
      </nav>
      {children}
    </div>
  );
}
