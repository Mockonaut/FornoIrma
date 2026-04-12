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

export function generateReservationCode(): string {
  const prefix = "FI";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
