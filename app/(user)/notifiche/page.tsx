import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { markNotificationsReadAction } from "@/lib/actions";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifiche" };

const TYPE_ICON: Record<string, string> = {
  NEW_RESERVATION: "📋",
  RESERVATION_CONFIRMED: "✓",
  RESERVATION_READY: "🎉",
  RESERVATION_CANCELLED: "✕",
};

export default async function NotifichePage() {
  const session = await requireAuth();

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container-shell py-10 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Notifiche</h1>
          {unreadCount > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              {unreadCount} non {unreadCount === 1 ? "letta" : "lette"}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action={markNotificationsReadAction}>
            <button className="btn-ghost text-xs py-1.5 px-4" style={{ color: "var(--muted)" }}>
              Segna tutte come lette
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-10 text-center" style={{ color: "var(--muted)" }}>
          <p className="text-3xl mb-3">🔔</p>
          <p className="font-semibold">Nessuna notifica</p>
          <p className="text-sm mt-1">Le notifiche appariranno qui quando ci sono aggiornamenti.</p>
        </div>
      ) : (
        <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-4 px-5 py-4"
              style={!n.isRead ? { background: "var(--sand)" } : undefined}
            >
              <div
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base"
                style={{ background: "var(--warm-dark)", color: "var(--background)" }}
              >
                {TYPE_ICON[n.type] ?? "🔔"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm">{n.title}</p>
                  {!n.isRead && (
                    <span
                      className="shrink-0 w-2 h-2 rounded-full mt-1.5"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </div>
                {n.body && (
                  <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{n.body}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: it })}
                  </p>
                  {n.linkUrl && (
                    <Link
                      href={n.linkUrl}
                      className="text-xs font-semibold"
                      style={{ color: "var(--accent)" }}
                    >
                      Vedi →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
