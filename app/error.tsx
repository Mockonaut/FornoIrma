"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-shell flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Errore</p>
      <h1 className="text-3xl font-bold">Qualcosa è andato storto</h1>
      <p style={{ color: "var(--muted)" }}>Si è verificato un problema imprevisto. Riprova tra qualche istante.</p>
      <button onClick={reset} className="btn-primary mt-2">Riprova</button>
    </div>
  );
}
