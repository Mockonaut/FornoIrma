import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReservationStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReservationStatus(status: ReservationStatus): string {
  const map: Record<ReservationStatus, string> = {
    PENDING: "In attesa",
    CONFIRMED: "Confermata",
    READY: "Pronta al ritiro",
    COMPLETED: "Ritirata",
    CANCELLED: "Annullata",
  };
  return map[status] ?? status;
}

// Step flow for progress bar (excludes CANCELLED)
export const RESERVATION_STEPS: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "READY",
  "COMPLETED",
];

// Next logical action(s) an admin can take from a given status
export const RESERVATION_TRANSITIONS: Partial<Record<ReservationStatus, { next?: ReservationStatus; label: string; style: "primary" | "ghost" }[]>> = {
  PENDING:    [{ next: "CONFIRMED", label: "Conferma",       style: "primary" }, { next: "CANCELLED", label: "Annulla", style: "ghost" }],
  CONFIRMED:  [{ next: "READY",     label: "Segna pronta",   style: "primary" }, { next: "CANCELLED", label: "Annulla", style: "ghost" }],
  READY:      [{ next: "COMPLETED", label: "Ritirata ✓",     style: "primary" }],
  COMPLETED:  [],
  CANCELLED:  [],
};

// ─── Stato apertura ───────────────────────────────────────────────────────────

const IT_DAYS: Record<string, number> = {
  lunedì: 1, martedì: 2, mercoledì: 3, giovedì: 4, venerdì: 5, sabato: 6, domenica: 7,
};

function parseTime(s: string): number {
  const [h, m] = s.trim().split(":").map(Number);
  return h * 60 + (m ?? 0);
}

/**
 * Verifica se il panificio è aperto in un dato giorno (ignorando l'orario).
 * Supporta sia giorni singoli ("Lunedì") che range ("Martedì – Venerdì").
 * Usata per bloccare prenotazioni nei giorni di chiusura.
 */
export function isOpenOnDate(
  openingHours: { day: string; hours: string }[],
  date: Date
): boolean {
  const dow = date.getDay() === 0 ? 7 : date.getDay();
  for (const row of openingHours) {
    const parts = row.day.split(/\s*[–-]\s*/);
    const from = IT_DAYS[parts[0].toLowerCase().trim()];
    const to   = parts[1] ? IT_DAYS[parts[1].toLowerCase().trim()] : from;
    if (from == null || to == null || dow < from || dow > to) continue;
    return row.hours.toLowerCase() !== "chiuso";
  }
  // Nessuna regola trovata → consideriamo chiuso (sicuro per default)
  return false;
}

/** Returns { open, opensAt, closesAt } given the openingHours JSON from BusinessSettings. */
export function getOpenStatus(
  openingHours: { day: string; hours: string }[],
  now: Date = new Date()
): { open: boolean; label: string; nextChange: string | null } {
  // ISO day: Mon=1 … Sun=7
  const dow = now.getDay() === 0 ? 7 : now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const row of openingHours) {
    // Match day range, e.g. "Martedì – Venerdì" or single "Sabato"
    const parts = row.day.split(/\s*[–-]\s*/);
    const from = IT_DAYS[parts[0].toLowerCase().trim()];
    const to   = parts[1] ? IT_DAYS[parts[1].toLowerCase().trim()] : from;

    if (from == null || to == null) continue;
    if (dow < from || dow > to) continue;

    if (row.hours.toLowerCase() === "chiuso") {
      return { open: false, label: "Oggi chiuso", nextChange: null };
    }

    // hours format: "07:30 – 18:30"
    const [openStr, closeStr] = row.hours.split(/\s*[–-]\s*/);
    const openMin  = parseTime(openStr);
    const closeMin = parseTime(closeStr);

    if (currentMinutes < openMin) {
      return { open: false, label: "Ancora chiuso", nextChange: openStr.trim() };
    }
    if (currentMinutes < closeMin) {
      return { open: true,  label: "Aperto",        nextChange: closeStr.trim() };
    }
    return { open: false, label: "Chiuso per oggi", nextChange: null };
  }

  return { open: false, label: "Chiuso", nextChange: null };
}

export function generateReservationCode(): string {
  const prefix = "FI";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
