import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { markNotificationsReadAction, deleteNotificationAction } from "@/lib/actions";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifiche" };

const TYPE_ICON: Record<string, string> = {
  NEW_RESERVATION:       "📋",
  RESERVATION_CONFIRMED: "✓",
  RESERVATION_READY:     "🎉",
  RESERVATION_CANCELLED: "✕",
};

const TYPE_LABEL: Record<string, string> = {
  NEW_RESERVATION:       "Nuova prenotazione",
  RESERVATION_CONFIRMED: "Confermata",
  RESERVATION_READY:     "Pronta",
  RESERVATION_CANCELLED: "Annullata",
};

const TABS = [
  { key: "all",    label: "Tutte" },
  { key: "unread", label: "Non lette" },
  { key: "read",   label: "Lette" },
];

export default async function NotifichePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const tab = params.tab ?? "all";

  const where = {
    userId: session.user.id,
    ...(tab === "unread" ? { isRead: false } : tab === "read" ? { isRead: true } : {}),
  };

  const [notifications, totalUnread] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
  ]);

  return (
    <div className="container-shell py-10 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Notifiche</h1>
          {totalUnread > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              {totalUnread} non {totalUnread === 1 ? "letta" : "lette"}
            </p>
          )}
        </div>
        {totalUnread > 0 && (
          <form action={markNotificationsReadAction}>
            <button className="btn-ghost text-xs py-1.5 px-4" style={{ color: "var(--muted)" }}>
              Segna tutte come lette
            </button>
          </form>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <Link
              key={t.key}
              href={`/notifiche?tab=${t.key}`}
              className="px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap"
              style={isActive
                ? { color: "var(--foreground)", borderBottom: "2px solid var(--accent)" }
                : { color: "var(--muted)" }}
            >
              {t.label}
              {t.key === "unread" && totalUnread > 0 && (
                <span
                  className="ml-1.5 text-xs font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--accent)", color: "var(--background)" }}
                >
                  {totalUnread}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Lista */}
      {notifications.length === 0 ? (
        <div className="card p-10 text-center" style={{ color: "var(--muted)" }}>
          <p className="text-3xl mb-3">🔔</p>
          <p className="font-semibold">
            {tab === "unread" ? "Nessuna notifica non letta" : "Nessuna notifica"}
          </p>
        </div>
      ) : (
        <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 px-4 py-3.5 group"
              style={!n.isRead ? { background: "var(--sand)" } : undefined}
            >
              {/* Icona tipo */}
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-0.5"
                style={{ background: "var(--warm-dark)", color: "var(--background)" }}
              >
                {TYPE_ICON[n.type] ?? "🔔"}
              </div>

              {/* Contenuto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{n.title}</p>
                      {!n.isRead && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "var(--accent)" }}
                        />
                      )}
                    </div>
                    {n.body && (
                      <p className="text-sm mt-0.5 leading-snug" style={{ color: "var(--muted)" }}>
                        {n.body}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {TYPE_LABEL[n.type] ?? n.type}
                      </span>
                      <span className="text-xs" style={{ color: "var(--border)" }}>·</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: it })}
                      </span>
                      {n.linkUrl && (
                        <>
                          <span className="text-xs" style={{ color: "var(--border)" }}>·</span>
                          <Link href={n.linkUrl} className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                            Vedi →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Cancella */}
                  <form action={deleteNotificationAction} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input type="hidden" name="id" value={n.id} />
                    <button
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-[var(--border)]"
                      style={{ color: "var(--muted)" }}
                      aria-label="Elimina notifica"
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
