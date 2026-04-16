import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

// Messaggi per ogni tipo di notifica
const NOTIFICATION_COPY: Record<NotificationType, (code: string) => { title: string; body: string }> = {
  NEW_RESERVATION: (code) => ({
    title: "Nuova prenotazione ricevuta",
    body: `È arrivata la prenotazione #${code}. Verificala e confermala.`,
  }),
  RESERVATION_CONFIRMED: (code) => ({
    title: "Prenotazione confermata ✓",
    body: `La tua prenotazione #${code} è stata confermata. Ti aspettiamo!`,
  }),
  RESERVATION_READY: (code) => ({
    title: "Il tuo ordine è pronto 🎉",
    body: `La prenotazione #${code} è pronta per il ritiro. Passa in negozio!`,
  }),
  RESERVATION_CANCELLED: (code) => ({
    title: "Prenotazione annullata",
    body: `La prenotazione #${code} è stata annullata. Contattaci per info.`,
  }),
};

/** Notifica tutti gli admin di una nuova prenotazione */
export async function notifyAdminsNewReservation(reservationCode: string, linkUrl: string) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (admins.length === 0) return;

  const copy = NOTIFICATION_COPY.NEW_RESERVATION(reservationCode);
  await prisma.notification.createMany({
    data: admins.map((a) => ({
      userId: a.id,
      type: NotificationType.NEW_RESERVATION,
      title: copy.title,
      body: copy.body,
      linkUrl,
    })),
  });

  admins.forEach((a) => revalidateTag(`notifications-${a.id}`));
}

/** Notifica l'utente del cambio stato della sua prenotazione */
export async function notifyUserReservationStatus(
  userId: string,
  reservationCode: string,
  type: Extract<NotificationType, "RESERVATION_CONFIRMED" | "RESERVATION_READY" | "RESERVATION_CANCELLED">,
  linkUrl: string
) {
  const copy = NOTIFICATION_COPY[type](reservationCode);
  await prisma.notification.create({
    data: { userId, type, title: copy.title, body: copy.body, linkUrl },
  });

  revalidateTag(`notifications-${userId}`);
}
