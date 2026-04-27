"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createReservationAction } from "@/lib/actions";
import { isOpenOnDate } from "@/lib/utils";
import type { Product, Category, PickupSlot } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };

interface Props {
  products: ProductWithCategory[];
  pickupSlots: PickupSlot[];
  closureDates: string[];
  openingHours: { day: string; hours: string }[] | null;
}

interface CartItem {
  productId: string;
  quantity: number;
}

function isDateOpen(dateStr: string, closureDates: string[], openingHours: Props["openingHours"]): boolean {
  if (closureDates.includes(dateStr)) return false;
  if (!openingHours) return true;
  return isOpenOnDate(openingHours, new Date(dateStr + "T12:00:00"));
}

export function NewReservationForm({ products, pickupSlots, closureDates, openingHours }: Props) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupSlotId, setPickupSlotId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // Prodotti disponibili per la data selezionata
  const availableProducts = useMemo(() => {
    if (!pickupDate) return [];
    const d = new Date(pickupDate + "T12:00:00");
    const dow = d.getDay() === 0 ? 7 : d.getDay();
    return products.filter((p) => p.availableDays.length === 0 || p.availableDays.includes(dow));
  }, [pickupDate, products]);

  const dateOpen = pickupDate ? isDateOpen(pickupDate, closureDates, openingHours) : null;

  const setQuantity = (productId: string, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (qty <= 0) return prev.filter((i) => i.productId !== productId);
      if (existing) return prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i));
      return [...prev, { productId, quantity: qty }];
    });
  };

  // Rimuovi dal carrello prodotti non più disponibili quando cambia la data
  const handleDateChange = (newDate: string) => {
    setPickupDate(newDate);
    if (!newDate) { setCart([]); return; }
    const d = new Date(newDate + "T12:00:00");
    const dow = d.getDay() === 0 ? 7 : d.getDay();
    const availableIds = new Set(
      products
        .filter((p) => p.availableDays.length === 0 || p.availableDays.includes(dow))
        .map((p) => p.id)
    );
    setCart((prev) => prev.filter((i) => availableIds.has(i.productId)));
  };

  const getQty = (productId: string) => cart.find((i) => i.productId === productId)?.quantity ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pickupDate) { setError("Seleziona la data di ritiro."); return; }
    if (!dateOpen) { setError("Il panificio è chiuso in quella data. Scegli un altro giorno."); return; }
    if (cart.length === 0) { setError("Seleziona almeno un prodotto."); return; }
    if (!pickupSlotId) { setError("Seleziona una fascia oraria."); return; }

    setLoading(true);
    const result = await createReservationAction({ pickupDate, pickupSlotId, notes, items: cart });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/area-clienti/prenotazioni?nuovo=${result.code}`);
    }
  };

  // Raggruppa prodotti disponibili per categoria
  const byCategory = availableProducts.reduce<Record<string, ProductWithCategory[]>>((acc, p) => {
    const cat = p.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Passo 1: Data e fascia oraria */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold">1. Scegli data e fascia di ritiro</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label mb-1.5">Data di ritiro</label>
            <input
              type="date"
              className="input"
              min={today}
              value={pickupDate}
              onChange={(e) => handleDateChange(e.target.value)}
              required
            />
            {pickupDate && dateOpen === false && (
              <p className="mt-2 text-sm font-medium" style={{ color: "var(--error, #dc2626)" }}>
                Il panificio è chiuso in questa data. Scegli un altro giorno.
              </p>
            )}
          </div>
          <div>
            <label className="label mb-1.5">Fascia oraria</label>
            <select
              className="input"
              value={pickupSlotId}
              onChange={(e) => setPickupSlotId(e.target.value)}
              required
            >
              <option value="">Seleziona…</option>
              {pickupSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>{slot.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Passo 2: Prodotti disponibili per la data scelta */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold">2. Scegli i prodotti</h2>

        {!pickupDate && (
          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
            Seleziona prima una data per vedere i prodotti disponibili.
          </p>
        )}

        {pickupDate && dateOpen === false && (
          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
            Nessun prodotto disponibile: il panificio è chiuso in questa data.
          </p>
        )}

        {pickupDate && dateOpen && availableProducts.length === 0 && (
          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
            Nessun prodotto programmato per questa data.
          </p>
        )}

        {pickupDate && dateOpen && availableProducts.length > 0 && (
          <div className="mt-5 space-y-6">
            {Object.entries(byCategory).map(([cat, prods]) => (
              <div key={cat}>
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-[var(--muted)]">{cat}</p>
                <div className="space-y-3">
                  {prods.map((product) => {
                    const qty = getQty(product.id);
                    return (
                      <div key={product.id} className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{product.name}</p>
                          {product.shortDescription && (
                            <p className="text-sm text-[var(--muted)] truncate">{product.shortDescription}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, qty - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border text-lg font-bold transition-colors hover:bg-stone-100"
                            style={{ borderColor: "var(--border)" }}
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, qty + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border text-lg font-bold transition-colors hover:bg-stone-100"
                            style={{ borderColor: "var(--border)" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {cart.length > 0 && (
              <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm">
                <p className="font-semibold text-amber-900">Riepilogo: {cart.reduce((s, i) => s + i.quantity, 0)} pezzi</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Passo 3: Note */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold">3. Note (opzionale)</h2>
        <textarea
          className="input mt-4 h-24 resize-none"
          placeholder="Intolleranze, richieste speciali…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary px-10 py-3 text-base">
        {loading ? "Invio in corso…" : "Conferma prenotazione"}
      </button>
    </form>
  );
}
