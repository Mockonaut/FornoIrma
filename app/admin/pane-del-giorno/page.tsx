import { requireAdmin } from "@/lib/session";
import { getBreadLibrary, getDailySchedule } from "@/lib/data";
import {
  createBreadTypeAction,
  toggleBreadTypeAction,
  setDailyScheduleAction,
  removeDailyScheduleAction,
} from "@/lib/actions";

export const metadata = { title: "Pane del giorno — Gestione" };

const DOW_LABELS = ["", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

export default async function AdminDailySpecialPage() {
  await requireAdmin();
  const [library, schedules] = await Promise.all([getBreadLibrary(), getDailySchedule()]);

  const activeBreads = library.filter((b) => b.isActive);
  const archivedBreads = library.filter((b) => !b.isActive);

  // Split schedules
  const recurringMap = new Map(schedules.filter((s) => s.dayOfWeek != null).map((s) => [s.dayOfWeek!, s]));
  const specificDates = schedules.filter((s) => s.date != null);

  return (
    <div className="space-y-10">
      <div>
        <p className="section-label mb-1">Gestione</p>
        <h1 className="text-3xl font-extrabold">Pane del giorno</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Gestisci la libreria dei pani speciali e programma il calendario.
        </p>
      </div>

      {/* ── Programmazione settimanale ─────────────────────────────────── */}
      <section className="card p-6 space-y-4">
        <h2 className="font-extrabold text-lg">Programmazione settimanale</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Assegna un pane ricorrente a ogni giorno. Puoi sempre sovrascriverlo con una data specifica.
        </p>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
            const existing = recurringMap.get(dow);
            return (
              <div key={dow} className="flex items-center justify-between gap-4 py-3 flex-wrap">
                <span className="w-28 font-semibold text-sm">{DOW_LABELS[dow]}</span>
                {existing ? (
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className="flex-1 text-sm px-3 py-1.5 rounded-xl"
                      style={{ background: "var(--warm-light, #faf6f1)" }}
                    >
                      {existing.breadType.name}
                    </span>
                    <form action={removeDailyScheduleAction}>
                      <input type="hidden" name="id" value={existing.id} />
                      <button className="btn-ghost text-xs py-1.5 px-3" style={{ color: "var(--muted)" }}>
                        Rimuovi
                      </button>
                    </form>
                  </div>
                ) : (
                  <form action={setDailyScheduleAction} className="flex items-center gap-2 flex-1">
                    <input type="hidden" name="dayOfWeek" value={dow} />
                    <select name="breadTypeId" className="input flex-1 text-sm py-1.5" required>
                      <option value="">— nessuno —</option>
                      {activeBreads.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <button className="btn-primary text-xs py-1.5 px-3">Assegna</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Date specifiche ────────────────────────────────────────────── */}
      <section className="card p-6 space-y-4">
        <h2 className="font-extrabold text-lg">Date specifiche</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Sovrascrivono il ricorrente per quel giorno preciso.
        </p>

        {/* Form aggiungi data specifica */}
        <form action={setDailyScheduleAction} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="label">Data</label>
            <input type="date" name="date" className="input py-1.5 text-sm" required />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
            <label className="label">Pane</label>
            <select name="breadTypeId" className="input py-1.5 text-sm" required>
              <option value="">— scegli —</option>
              {activeBreads.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <button className="btn-primary text-sm py-2 px-4">Aggiungi</button>
        </form>

        {specificDates.length > 0 && (
          <div className="divide-y mt-2" style={{ borderColor: "var(--border)" }}>
            {specificDates.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm font-semibold">
                  {new Date(s.date!).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{s.breadType.name}</span>
                  <form action={removeDailyScheduleAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="btn-ghost text-xs py-1 px-3" style={{ color: "var(--muted)" }}>✕</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Libreria pani ─────────────────────────────────────────────── */}
      <section className="card p-6 space-y-4">
        <h2 className="font-extrabold text-lg">Libreria pani</h2>

        {/* Aggiungi nuovo */}
        <form action={createBreadTypeAction} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="label">Nome pane</label>
            <input name="name" className="input py-1.5 text-sm" placeholder="es. Pane alle noci" required />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="label">Descrizione <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opzionale)</span></label>
            <input name="description" className="input py-1.5 text-sm" placeholder="Breve nota…" />
          </div>
          <button className="btn-primary text-sm py-2 px-4">+ Aggiungi</button>
        </form>

        {/* Lista attivi */}
        {activeBreads.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Attivi</p>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {activeBreads.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-semibold text-sm">{b.name}</p>
                    {b.description && <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{b.description}</p>}
                  </div>
                  <form action={toggleBreadTypeAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="btn-ghost text-xs py-1 px-3" style={{ color: "var(--muted)" }}>Archivia</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista archiviati */}
        {archivedBreads.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-2 mt-4" style={{ color: "var(--muted)" }}>Archiviati</p>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {archivedBreads.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-4 py-3 opacity-50">
                  <p className="text-sm line-through">{b.name}</p>
                  <form action={toggleBreadTypeAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <button className="btn-ghost text-xs py-1 px-3">Ripristina</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
