import { getBusinessSettings } from "@/lib/data";

export default async function ContactsPage() {
  const settings = await getBusinessSettings();
  const openingHours = (settings?.openingHours as Array<{ day: string; hours: string }> | null) ?? [];

  return (
    <div className="container-shell grid gap-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Contatti</p>
        <h1 className="mt-3 text-4xl font-bold">Passa a trovarci</h1>
        <div className="mt-6 space-y-4 text-[var(--muted)]">
          <p><strong className="text-[var(--foreground)]">Indirizzo:</strong> {settings?.address}</p>
          <p><strong className="text-[var(--foreground)]">Telefono:</strong> {settings?.phone}</p>
          <p><strong className="text-[var(--foreground)]">Email:</strong> {settings?.email}</p>
          <p><strong className="text-[var(--foreground)]">Instagram:</strong> <a className="text-[var(--accent)]" href={settings?.instagramUrl ?? "https://instagram.com"}>Profilo ufficiale</a></p>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Orari</h2>
          <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {openingHours.map((row) => (
              <div key={row.day} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
                <span>{row.day}</span>
                <span>{row.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="card p-3">
        {settings?.mapEmbedUrl ? (
          <iframe src={settings.mapEmbedUrl} className="h-[520px] w-full rounded-[1.5rem] border-0" loading="lazy" />
        ) : (
          <div className="flex h-[520px] items-center justify-center rounded-[1.5rem] bg-stone-100 text-[var(--muted)]">
            Placeholder mappa configurabile
          </div>
        )}
      </section>
    </div>
  );
}
