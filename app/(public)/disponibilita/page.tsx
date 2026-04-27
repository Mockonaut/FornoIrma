import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Disponibilità settimanale — Forno Irma" };

const DOW_LABELS = ["", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

export default async function DisponibilitaPage() {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      availableDays: true,
      category: { select: { name: true, sortOrder: true } },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  // Raggruppa per categoria
  const byCategory = products.reduce<Record<string, typeof products>>((acc, p) => {
    const cat = p.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const todayDow = new Date().getDay() === 0 ? 7 : new Date().getDay();

  return (
    <div className="container-shell py-16 space-y-12">
      <div>
        <p className="section-label mb-1">Catalogo</p>
        <h1 className="text-4xl font-extrabold mb-3">Disponibilità settimanale</h1>
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          Scopri quali prodotti trovi ogni giorno. I prodotti senza giorni indicati sono sempre disponibili.
        </p>
      </div>

      {/* Griglia giorni × prodotti */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-3 pr-6 font-semibold" style={{ color: "var(--muted)" }}>
                Prodotto
              </th>
              {[1, 2, 3, 4, 5, 6, 7].map((dow) => (
                <th
                  key={dow}
                  className="py-3 px-3 text-center font-semibold whitespace-nowrap"
                  style={{
                    color: dow === todayDow ? "var(--accent)" : "var(--muted)",
                    borderBottom: dow === todayDow ? "2px solid var(--accent)" : "1px solid var(--border)",
                  }}
                >
                  {DOW_LABELS[dow].slice(0, 3)}
                  {dow === todayDow && (
                    <span className="block text-xs font-normal">oggi</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(byCategory).map(([cat, prods]) => (
              <>
                <tr key={`cat-${cat}`}>
                  <td
                    colSpan={8}
                    className="pt-6 pb-2 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--muted)" }}
                  >
                    {cat}
                  </td>
                </tr>
                {prods.map((p) => {
                  const alwaysAvailable = p.availableDays.length === 0;
                  return (
                    <tr
                      key={p.id}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="py-3 pr-6">
                        <p className="font-medium">{p.name}</p>
                        {p.shortDescription && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                            {p.shortDescription}
                          </p>
                        )}
                      </td>
                      {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
                        const available = alwaysAvailable || p.availableDays.includes(dow);
                        const isToday = dow === todayDow;
                        return (
                          <td key={dow} className="py-3 px-3 text-center">
                            {available ? (
                              <span
                                className="inline-block w-5 h-5 rounded-full"
                                style={{
                                  background: isToday ? "var(--accent)" : "var(--sand)",
                                }}
                                title="Disponibile"
                              />
                            ) : (
                              <span
                                className="inline-block w-5 h-5 rounded-full"
                                style={{ background: "var(--border)" }}
                                title="Non disponibile"
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full" style={{ background: "var(--accent)" }} />
          Disponibile oggi
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full" style={{ background: "var(--sand)" }} />
          Disponibile
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full" style={{ background: "var(--border)" }} />
          Non disponibile
        </span>
      </div>

      <Link href="/area-clienti/prenotazioni/nuova" className="btn-primary inline-block">
        Prenota ora
      </Link>
    </div>
  );
}
