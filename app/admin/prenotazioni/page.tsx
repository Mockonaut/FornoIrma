import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { format, isToday, isTomorrow, isPast, startOfDay } from "date-fns";
import { it } from "date-fns/locale";
import { formatReservationStatus, RESERVATION_TRANSITIONS } from "@/lib/utils";
import { updateReservationStatusAction } from "@/lib/actions";
import Link from "next/link";
import { ReservationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prenotazioni — Gestione" };

const STATUS_DOT: Record<string, string> = {
  PENDING:   "bg-amber-400",
  CONFIRMED: "bg-blue-400",
  READY:     "bg-emerald-400",
  COMPLETED: "bg-stone-300",
  CANCELLED: "bg-rose-300",
};

const TABS = [
  { key: "pending",   label: "In attesa",    statuses: ["PENDING"] as ReservationStatus[] },
  { key: "active",    label: "In lavorazione", statuses: ["CONFIRMED", "READY"] as ReservationStatus[] },
  { key: "archive",   label: "Archivio",     statuses: ["COMPLETED", "CANCELLED"] as ReservationStatus[] },
];

function dateLabel(date: Date): string {
  if (isToday(date)) return "Oggi";
  if (isTomorrow(date)) return "Domani";
  return format(date, "EEEE d MMMM", { locale: it });
}

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const activeTab = TABS.find((t) => t.key === params.tab) ?? TABS[0];

  // Contatori per i badge delle tab
  const counts = await prisma.reservation.groupBy({
    by: ["status"],
    _count: true,
    where: {
      pickupDate: { gte: startOfDay(new Date()) },
    },
  });
  const countMap: Partial<Record<string, number>> = {};
  counts.forEach((c) => { countMap[c.status] = c._count; });
  const tabCounts: Record<string, number> = {
    pending: countMap["PENDING"] ?? 0,
    active:  (countMap["CONFIRMED"] ?? 0) + (countMap["READY"] ?? 0),
    archive: 0,
  };

  // Prenotazioni per la tab attiva
  const reservations = await prisma.reservation.findMany({
    where: { status: { in: activeTab.statuses } },
    include: { user: true, pickupSlot: true, items: true },
    orderBy: [{ pickupDate: "asc" }, { createdAt: "asc" }],
    take: activeTab.key === "archive" ? 100 : 200,
  });

  // Raggruppa per data di ritiro
  const grouped = new Map<string, typeof reservations>();
  for (const r of reservations) {
    const key = format(r.pickupDate, "yyyy-MM-dd");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(r);
  }

  const totalPending = tabCounts.pending;

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="section-label mb-1">Gestione</p>
          <h1 className="text-3xl font-extrabold">Prenotazioni</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {totalPending > 0 && (
            <div
              className="rounded-2xl px-4 py-2 text-sm font-semibold"
              style={{ background: "#fef3c7", color: "#92400e" }}
            >
              ⚠ {totalPending} in attesa di conferma
            </div>
          )}
          <a
            href={`/api/admin/export-reservations?date=${format(new Date(), "yyyy-MM-dd")}`}
            className="btn-ghost text-sm py-2 px-4"
            download
          >
            ↓ Esporta oggi (.csv)
          </a>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab.key;
          const count = tabCounts[tab.key];
          return (
            <Link
              key={tab.key}
              href={`/admin/prenotazioni?tab=${tab.key}`}
              className="relative px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap"
              style={isActive
                ? { color: "var(--foreground)", borderBottom: "2px solid var(--accent)" }
                : { color: "var(--muted)" }
              }
            >
              {tab.label}
              {count > 0 && tab.key !== "archive" && (
                <span
                  className="ml-1.5 text-xs font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--accent)", color: "var(--background)" }}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Contenuto */}
      {grouped.size === 0 ? (
        <div className="card p-10 text-center" style={{ color: "var(--muted)" }}>
          <p className="text-2xl mb-2">
            {activeTab.key === "pending" ? "✓" : activeTab.key === "active" ? "📋" : "🗂"}
          </p>
          <p className="font-semibold">
            {activeTab.key === "pending"
              ? "Nessuna prenotazione in attesa"
              : activeTab.key === "active"
              ? "Nessun ordine in lavorazione"
              : "Archivio vuoto"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([dateKey, rList]) => {
            const date = new Date(dateKey + "T12:00:00");
            const past = isPast(date) && !isToday(date);
            return (
              <div key={dateKey}>
                {/* Intestazione giorno */}
                <div className="flex items-center gap-3 mb-2">
                  <h2
                    className="font-extrabold text-base"
                    style={{ color: past ? "var(--muted)" : "var(--foreground)" }}
                  >
                    {dateLabel(date)}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--sand)", color: "var(--muted)" }}>
                    {rList.length} {rList.length === 1 ? "ordine" : "ordini"}
                  </span>
                  {!past && <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {format(date, "d MMMM yyyy", { locale: it })}
                  </span>}
                </div>

                {/* Card prenotazioni */}
                <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
                  {rList.map((r) => {
                    const transitions = RESERVATION_TRANSITIONS[r.status] ?? [];
                    return (
                      <div key={r.id} className="flex items-start justify-between gap-4 px-5 py-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          {/* Riga 1: codice + stato + slot */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[r.status]}`} />
                            <span className="font-black text-sm tracking-wide">{r.code}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--border)", color: "var(--foreground)" }}>
                              {formatReservationStatus(r.status)}
                            </span>
                            <span className="text-xs" style={{ color: "var(--muted)" }}>
                              {r.pickupSlot.label} ({r.pickupSlot.startTime}–{r.pickupSlot.endTime})
                            </span>
                          </div>
                          {/* Riga 2: cliente */}
                          <p className="text-sm font-semibold">{r.user.name}
                            <span className="font-normal ml-2" style={{ color: "var(--muted)" }}>{r.user.email}</span>
                          </p>
                          {/* Riga 3: prodotti */}
                          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                            {r.items.map((item) => `${item.productName} ×${item.quantity}`).join(" · ")}
                          </p>
                          {r.notes && (
                            <p className="text-xs mt-1 italic" style={{ color: "var(--muted)" }}>
                              Note: {r.notes}
                            </p>
                          )}
                        </div>

                        {/* Azioni */}
                        {transitions.length > 0 && (
                          <div className="flex flex-row gap-2 shrink-0 flex-wrap">
                            {transitions.map((t) => (
                              <form key={t.next ?? "cancel"} action={updateReservationStatusAction}>
                                <input type="hidden" name="reservationId" value={r.id} />
                                <input type="hidden" name="status" value={t.next} />
                                <button
                                  className={t.style === "primary" ? "btn-primary text-xs py-1.5 px-3" : "btn-ghost text-xs py-1.5 px-3"}
                                  style={t.style === "ghost" ? { color: "var(--muted)" } : undefined}
                                >
                                  {t.label}
                                </button>
                              </form>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
