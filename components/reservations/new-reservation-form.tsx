"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReservationAction } from "@/lib/actions";
import type { Product, Category, PickupSlot } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };

interface Props {
  products: ProductWithCategory[];
  pickupSlots: PickupSlot[];
}

interface CartItem {
  productId: string;
  quantity: number;
}

export function NewReservationForm({ products, pickupSlots }: Props) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupSlotId, setPickupSlotId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const setQuantity = (productId: string, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (qty <= 0) return prev.filter((i) => i.productId !== productId);
      if (existing) return prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i));
      return [...prev, { productId, quantity: qty }];
    });
  };

  const getQty = (productId: string) => cart.find((i) => i.productId === productId)?.quantity ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) { setError("Seleziona almeno un prodotto."); return; }
    if (!pickupDate) { setError("Seleziona la data di ritiro."); return; }
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

  // Group products by category
  const byCategory = products.reduce<Record<string, ProductWithCategory[]>>((acc, p) => {
    const cat = p.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Products */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold">1. Scegli i prodotti</h2>
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
        </div>

        {cart.length > 0 && (
          <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-amber-900">Riepilogo: {cart.reduce((s, i) => s + i.quantity, 0)} pezzi</p>
          </div>
        )}
      </div>

      {/* Pickup date & slot */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold">2. Scegli data e fascia di ritiro</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label mb-1.5">Data di ritiro</label>
            <input
              type="date"
              className="input"
              min={today}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
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

      {/* Notes */}
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
