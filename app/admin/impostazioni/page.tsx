import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  createPickupSlotAction,
  togglePickupSlotAction,
  deletePickupSlotAction,
  saveOpeningHoursAction,
  addClosureDateAction,
  removeClosureDateAction,
} from "@/lib/actions";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export const metadata = { title: "Impostazioni — Gestione" };

const OPENING_ROWS = [
  { label: "Lunedì",           key: "lunedì" },
  { label: "Martedì – Venerdì", key: "martedì_–_venerdì" },
  { label: "Sabato",           key: "sabato" },
  { label: "Domenica",         key: "domenica" },
];

function parseHours(hours: string): { closed: boolean; open: string; close: string } {
  if (hours.toLowerCase() === "chiuso") return { closed: true, open: "07:30", close: "18:30" };
  const parts = hours.split(/\s*[–-]\s*/);
  return { closed: false, open: parts[0]?.trim() ?? "07:30", close: parts[1]?.trim() ?? "18:30" };
}

export default async function AdminImpostazioniPage() {
  await requireAdmin();

  const [slots, settings, closures] = await Promise.all([
    prisma.pickupSlot.findMany({ orderBy: { startTime: "asc" } }),
    prisma.businessSettings.findFirst(),
    prisma.closureDate.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
    }),
  ]);

  const openingHours = (settings?.openingHours ?? []) as { day: string; hours: string }[];
  const ohMap = Object.fromEntries(openingHours.map((r) => [r.day, r.hours]));

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="section-label mb-1">Gestione</p>
        <h1 className="text-3xl font-extrabold">Impostazioni</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Fasce orarie di ritiro, orari di apertura e chiusure straordinarie.
        </p>
      </div>

      {/* ── 1. Fasce orarie ─────────────────────────────────────────────────── */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-extrabold text-lg">Fasce orarie di ritiro</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Le fasce disponibili per la scelta del ritiro durante la prenotazione.
          </p>
        </div>

        <form action={createPickupSlotAction} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="label">Etichetta</label>
            <input name="label" className="input py-2 text-sm" placeholder="es. Mattina" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label">Dalle</label>
            <input name="startTime" type="time" className="input py-2 text-sm" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label">Alle</label>
            <input name="endTime" type="time" className="input py-2 text-sm" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label">Max ordini</label>
            <input name="maxOrders" type="number" min="1" defaultValue="20" className="input py-2 text-sm w-24" required />
          </div>
          <button className="btn-primary text-sm py-2 px-5">+ Aggiungi</button>
        </form>

        {slots.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {slots.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 py-3 flex-wrap">
                <div>
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {s.startTime} – {s.endTime} · max {s.maxOrders} ordini
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    background: s.isActive ? "var(--sand)" : "var(--border)",
                    color: s.isActive ? "var(--foreground)" : "var(--muted)",
                  }}>
                    {s.isActive ? "Attiva" : "Disattiva"}
                  </span>
                  <form action={togglePickupSlotAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="btn-ghost text-xs py-1 px-3" style={{ color: "var(--muted)" }}>
                      {s.isActive ? "Disattiva" : "Attiva"}
                    </button>
                  </form>
                  <form action={deletePickupSlotAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="btn-ghost text-xs py-1 px-3" style={{ color: "var(--muted)" }}>✕</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm py-2" style={{ color: "var(--muted)" }}>Nessuna fascia oraria configurata.</p>
        )}
      </section>

      {/* ── 2. Orari di apertura ────────────────────────────────────────────── */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-extrabold text-lg">Orari di apertura</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Usati per bloccare prenotazioni nei giorni/orari di chiusura.
          </p>
        </div>

        <form action={saveOpeningHoursAction} className="space-y-3">
          {OPENING_ROWS.map(({ label, key }) => {
            const stored = ohMap[label] ?? "Chiuso";
            const { closed, open, close } = parseHours(stored);
            return (
              <div key={key} className="flex items-center gap-4 flex-wrap py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="w-36 font-semibold text-sm shrink-0">{label}</span>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name={`closed_${key}`} defaultChecked={closed} className="w-4 h-4" />
                  Chiuso
                </label>
                <div className="flex items-center gap-2">
                  <input type="time" name={`open_${key}`} defaultValue={open} className="input py-1.5 text-sm w-28" />
                  <span className="text-sm" style={{ color: "var(--muted)" }}>–</span>
                  <input type="time" name={`close_${key}`} defaultValue={close} className="input py-1.5 text-sm w-28" />
                </div>
              </div>
            );
          })}
          <button className="btn-primary text-sm py-2 px-5 mt-2">Salva orari</button>
        </form>
      </section>

      {/* ── 3. Chiusure straordinarie ────────────────────────────────────────── */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-extrabold text-lg">Chiusure straordinarie</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Festività, ferie o altre chiusure eccezionali. Bloccano le prenotazioni per quella data.
          </p>
        </div>

        <form action={addClosureDateAction} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="label">Data</label>
            <input type="date" name="date" className="input py-2 text-sm" required />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="label">Motivo <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opzionale)</span></label>
            <input name="reason" className="input py-2 text-sm" placeholder="es. Natale, ferie estive…" />
          </div>
          <button className="btn-primary text-sm py-2 px-5">+ Aggiungi</button>
        </form>

        {closures.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {closures.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold text-sm">
                    {format(new Date(c.date), "EEEE d MMMM yyyy", { locale: it })}
                  </p>
                  {c.reason && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{c.reason}</p>
                  )}
                </div>
                <form action={removeClosureDateAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="btn-ghost text-xs py-1 px-3" style={{ color: "var(--muted)" }}>✕</button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm py-2" style={{ color: "var(--muted)" }}>Nessuna chiusura straordinaria programmata.</p>
        )}
      </section>
    </div>
  );
}
