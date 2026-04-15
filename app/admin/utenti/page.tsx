import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { toggleUserRoleAction } from "@/lib/actions";

export const metadata = { title: "Utenti — Gestione" };

export default async function AdminUsersPage() {
  await requireAdmin();
  const session = await auth();

  const users = await prisma.user.findMany({
    include: { _count: { select: { reservations: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <p className="section-label mb-1">Gestione</p>
      <h1 className="text-3xl font-extrabold mb-2">Utenti</h1>
      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
        {users.length} account registrati. Puoi promuovere un utente ad admin o rimuovergli i permessi.
      </p>
      <div className="rounded-xl px-4 py-3 mb-8 text-sm" style={{ background: "var(--sand)", color: "var(--muted)", borderLeft: "3px solid var(--accent)" }}>
        <strong style={{ color: "var(--foreground)" }}>Nota:</strong> dopo la promozione, l&apos;utente deve uscire e rientrare per accedere all&apos;area di gestione. Il ruolo diventa attivo alla sessione successiva.
      </div>

      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {users.map((u) => {
          const isSelf = u.id === session?.user?.id;
          const isAdmin = u.role === "ADMIN";
          return (
            <div key={u.id} className="flex items-center justify-between gap-4 px-6 py-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold truncate">{u.name}</p>
                  {isAdmin && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                      Admin
                    </span>
                  )}
                  {isSelf && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--border)", color: "var(--muted)" }}>
                      Tu
                    </span>
                  )}
                </div>
                <p className="text-sm mt-0.5 truncate" style={{ color: "var(--muted)" }}>{u.email}</p>
                {u.phone && <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{u.phone}</p>}
                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Registrato il {format(u.createdAt, "d MMM yyyy", { locale: it })} · {u._count.reservations} prenotazioni
                </p>
              </div>

              {!isSelf && (
                <form action={toggleUserRoleAction}>
                  <input type="hidden" name="userId" value={u.id} />
                  <button
                    className="btn-ghost text-xs py-1.5 px-4 shrink-0"
                    style={isAdmin ? { color: "var(--muted)" } : { color: "var(--accent)" }}
                  >
                    {isAdmin ? "Rimuovi admin" : "Promuovi ad admin"}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
