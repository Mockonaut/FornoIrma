import { requireAdmin } from "@/lib/session";
import { AdminNav } from "@/components/admin-nav";

export const metadata = { title: "Gestione — Forno Irma" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <AdminNav />
      <div className="container-shell py-10">
        {children}
      </div>
    </>
  );
}
