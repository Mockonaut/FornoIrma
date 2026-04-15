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
  const recurringMap = new Map(
    schedules.filter((s) => s.dayOfWeek != null).map((s) => [s.dayOfWeek!, s])
  );
  const specificDates = schedules
    .filter((s) => s.date != null)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const hasBreads = activeBreads.length > 0;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="section-label mb-1">Gestione</p>
        <h1 className="text-3xl font-extrabold">Pane del giorno</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Prima aggiungi i tuoi pani speciali alla libreria, poi assegnali al calendario.
        </p>
      </div>

      {/* ── 1. Libreria pani ────────────────────────────────────────────── */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-extrabold text-lg">Libreria pani speciali</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Il repertorio dei pani del giorno — aggiungine quanti vuoi e riusali nel calendario.
          </p>
        </div>

        {/* Form aggiungi */}
        <form action={createBreadTypeAction} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="label">Nome</label>
            <input name="name" className="input py-2 text-sm" placeholder="es. Pane alle noci e miele" required />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="label">
              Descrizione{" "}
              <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opzionale)</span>
            </label>
            <input name="description" className="input py-2 text-sm" placeholder="Breve nota sul pane…" />
          </div>
          <button className="btn-primary text-sm py-2 px-5">+ Aggiungi</button>
        </form>

        {/* Lista attivi */}
        {activeBreads.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {activeBreads.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold text-sm">{b.name}</p>
                  {b.description && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{b.description}</p>
                  )}
                </div>
                <form action={toggleBreadTypeAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="btn-ghost text-xs py-1 px-3" style={{ color: "var(--muted)" }}>
                    Archivia
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm py-2" style={{ color: "var(--muted)" }}>
            Nessun pane in libreria. Aggiungine uno qui sopra per iniziare a programmare il calendario.
          </p>
        )}

        {/* Archiviati */}
        {archivedBreads.length > 0 && (
          <div className="pt-2">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
              Archiviati
            </p>
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

      {/* ── 2. Programmazione settimanale ───────────────────────────────── */}
      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-extrabold text-lg">Programmazione settimanale</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Assegna un pane ricorrente per ogni giorno. Le date specifiche lo sovrascrivono.
          </p>
        </div>

        {!hasBreads ? (
          <p className="text-sm py-2" style={{ color: "var(--muted)" }}>
            ↑ Aggiungi prima almeno un pane alla libreria.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
              const existing = recurringMap.get(dow);
              return (
                <div key={dow} className="flex items-center gap-3 py-3 flex-wrap">
                  <span className="w-24 font-semibold text-sm shrink-0">{DOW_LABELS[dow]}</span>
                  {existing ? (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className="flex-1 text-sm px-3 py-1.5 rounded-xl truncate"
                        style={{ background: "var(--sand)" }}
                      >
                        {existing.breadType.name}
                      </span>
                      <form action={removeDailyScheduleAction}>
                        <input type="hidden" name="id" value={existing.id} />
                        <button
                          className="btn-ghost text-xs py-1.5 px-3 shrink-0"
                          style={{ color: "var(--muted)" }}
                        >
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
                      <button className="btn-primary text-xs py-1.5 px-3 shrink-0">Assegna</button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 3. Date specifiche ──────────────────────────────────────────── */}
      <section className="card p-6 space-y-4">
        <div>
          <h2 className="font-extrabold text-lg">Date specifiche</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Sovrascrivono il ricorrente per quel giorno esatto.
          </p>
        </div>

        {!hasBreads ? (
          <p className="text-sm py-2" style={{ color: "var(--muted)" }}>
            ↑ Aggiungi prima almeno un pane alla libreria.
          </p>
        ) : (
          <form action={setDailyScheduleAction} className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="label">Data</label>
              <input type="date" name="date" className="input py-2 text-sm" required />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <label className="label">Pane</label>
              <select name="breadTypeId" className="input py-2 text-sm" required>
                <option value="">— scegli —</option>
                {activeBreads.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <button className="btn-primary text-sm py-2 px-5">Aggiungi</button>
          </form>
        )}

        {specificDates.length > 0 && (
          <div className="divide-y mt-2" style={{ borderColor: "var(--border)" }}>
            {specificDates.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 py-3 flex-wrap">
                <span className="text-sm font-semibold">
                  {new Date(s.date!).toLocaleDateString("it-IT", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
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
    </div>
  );
}
