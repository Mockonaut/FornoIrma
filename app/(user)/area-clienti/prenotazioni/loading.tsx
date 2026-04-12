export default function Loading() {
  return (
    <div className="container-shell space-y-4 py-12">
      <div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: "var(--border)" }} />
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-6">
          <div className="space-y-3">
            <div className="h-4 w-32 rounded animate-pulse" style={{ background: "var(--border)" }} />
            <div className="h-6 w-64 rounded animate-pulse" style={{ background: "var(--border)" }} />
            <div className="h-4 w-48 rounded animate-pulse" style={{ background: "var(--border)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
