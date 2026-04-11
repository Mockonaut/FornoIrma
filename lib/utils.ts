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

export function generateReservationCode(): string {
  const prefix = "FI";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
