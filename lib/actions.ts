"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateReservationCode, isOpenOnDate } from "@/lib/utils";
import { ReservationStatus } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/email";
import { uploadProductImage, deleteProductImage } from "@/lib/supabase-storage";
import { notifyAdminsNewReservation, notifyUserReservationStatus } from "@/lib/notifications";
import { NotificationType } from "@prisma/client";

// ─── Registrazione ────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  firstName: z.string().min(2, "Minimo 2 caratteri"),
  lastName: z.string().min(2, "Minimo 2 caratteri"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  password: z.string().min(8, "Minimo 8 caratteri"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

export async function registerAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = RegisterSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { error: first?.message ?? "Dati non validi." };
  }

  const { firstName, lastName, email, phone, password } = parsed.data;
  const name = `${firstName} ${lastName}`;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, ...(phone ? [{ phone }] : [])] },
  });
  if (existing) return { error: "Esiste già un account con questa email o numero di telefono." };

  const user = await prisma.user.create({
    data: { name, email, phone, password: await bcrypt.hash(password, 12) },
  });

  // Crea token di verifica email (scade in 24h)
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.verificationToken.create({
    data: { identifier: user.email!, token, expires },
  });

  // Invia email di verifica
  await sendVerificationEmail(email, firstName, token).catch(() => {});

  redirect("/login?registered=1");
}

// ─── Admin: Categorie ─────────────────────────────────────────────────────────

export async function createCategoryAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string | null)?.trim() || undefined;
  if (!name) return;

  const slug = slugify(name, { lower: true, strict: true });
  const max = await prisma.category.aggregate({ _max: { sortOrder: true } });
  await prisma.category.create({
    data: { name, slug, description, sortOrder: (max._max.sortOrder ?? 0) + 1 },
  });

  revalidatePath("/admin/categorie");
}

// ─── Admin: Pane del giorno — libreria ───────────────────────────────────────

export async function createBreadTypeAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string | null)?.trim() || undefined;
  if (!name) return;

  await prisma.breadType.create({ data: { name, description } });
  revalidatePath("/admin/pane-del-giorno");
}

export async function toggleBreadTypeAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const current = await prisma.breadType.findUnique({ where: { id }, select: { isActive: true } });
  if (!current) return;

  await prisma.breadType.update({ where: { id }, data: { isActive: !current.isActive } });
  revalidatePath("/admin/pane-del-giorno");
}

// ─── Admin: Pane del giorno — calendario ─────────────────────────────────────

export async function setDailyScheduleAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const breadTypeId = formData.get("breadTypeId") as string;
  const dateStr = (formData.get("date") as string | null)?.trim();
  const dowStr = (formData.get("dayOfWeek") as string | null)?.trim();

  if (!breadTypeId) return;

  if (dateStr) {
    const date = new Date(dateStr);
    await prisma.dailySchedule.upsert({
      where: { date },
      update: { breadTypeId },
      create: { breadTypeId, date },
    });
  } else if (dowStr) {
    const dayOfWeek = parseInt(dowStr, 10);
    await prisma.dailySchedule.upsert({
      where: { dayOfWeek },
      update: { breadTypeId },
      create: { breadTypeId, dayOfWeek },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/pane-del-giorno");
}

export async function removeDailyScheduleAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.dailySchedule.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/pane-del-giorno");
}

// ─── Utente: cancellazione account ───────────────────────────────────────────

export async function deleteAccountAction(): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autenticato." };

  await prisma.user.delete({ where: { id: session.user.id } });
  redirect("/");
}

// ─── Admin: Gestione ruoli utenti ────────────────────────────────────────────

export async function toggleUserRoleAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const userId = formData.get("userId") as string;
  if (!userId || userId === session.user.id) return; // non puoi retrocedere te stesso

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
  });

  revalidatePath("/admin/utenti");
}

// ─── Admin: Stato prenotazione ────────────────────────────────────────────────

export async function updateReservationStatusAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const reservationId = formData.get("reservationId") as string;
  const status = formData.get("status") as ReservationStatus;

  if (!reservationId || !status) return;

  const reservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status },
    select: { code: true, userId: true },
  });

  // Notifica in-app all'utente per i cambi di stato rilevanti
  const notifyMap: Partial<Record<ReservationStatus, NotificationType>> = {
    CONFIRMED: NotificationType.RESERVATION_CONFIRMED,
    READY: NotificationType.RESERVATION_READY,
    CANCELLED: NotificationType.RESERVATION_CANCELLED,
  };
  const notifType = notifyMap[status];
  if (notifType) {
    await notifyUserReservationStatus(
      reservation.userId,
      reservation.code,
      notifType as "RESERVATION_CONFIRMED" | "RESERVATION_READY" | "RESERVATION_CANCELLED",
      "/area-clienti/prenotazioni"
    ).catch(() => null);
  }

  revalidatePath("/admin/prenotazioni");
}

// ─── Prenotazioni utente ──────────────────────────────────────────────────────

const ReservationSchema = z.object({
  pickupDate: z.string().min(1),
  pickupSlotId: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })).min(1),
});

export async function createReservationAction(data: {
  pickupDate: string;
  pickupSlotId: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
}): Promise<{ error?: string; code?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autenticato." };

  const parsed = ReservationSchema.safeParse(data);
  if (!parsed.success) return { error: "Dati non validi." };

  const { pickupDate, pickupSlotId, notes, items } = parsed.data;

  // Verifica che il giorno scelto non sia una chiusura straordinaria
  const dateObj = new Date(pickupDate);
  const closureOnDate = await prisma.closureDate.findUnique({
    where: { date: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()) },
  });
  if (closureOnDate) {
    const reason = closureOnDate.reason ? ` (${closureOnDate.reason})` : "";
    return { error: `Il panificio è chiuso in quella data${reason}. Scegli un altro giorno.` };
  }

  // Verifica che il giorno non sia tra i giorni di chiusura settimanale
  const settings = await prisma.businessSettings.findFirst({ select: { openingHours: true } });
  if (settings?.openingHours) {
    const oh = settings.openingHours as { day: string; hours: string }[];
    if (!isOpenOnDate(oh, dateObj)) {
      return { error: "Il panificio è chiuso in quel giorno. Scegli una data diversa." };
    }
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isVisible: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p.name]));

  const code = generateReservationCode();
  const reservation = await prisma.reservation.create({
    data: {
      code,
      userId: session.user.id,
      pickupDate: new Date(pickupDate),
      pickupSlotId,
      notes,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          productName: productMap.get(item.productId) ?? "Prodotto",
          quantity: item.quantity,
        })),
      },
    },
  });

  // Notifica in-app a tutti gli admin
  await notifyAdminsNewReservation(
    reservation.code,
    `/admin/prenotazioni`
  ).catch(() => null);

  revalidatePath("/area-clienti/prenotazioni");
  return { code: reservation.code };
}

// ─── Admin: Immagini prodotto ─────────────────────────────────────────────────

export async function upsertProductImageAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Non autorizzato" };

  const productId = formData.get("productId") as string;
  const file = formData.get("file") as File;
  if (!productId || !file || file.size === 0) return { error: "Dati mancanti" };

  // Elimina immagine precedente (prima posizione) se esiste
  const existing = await prisma.productImage.findFirst({
    where: { productId, sortOrder: 0 },
  });
  if (existing) {
    await deleteProductImage(existing.url).catch(() => null);
    await prisma.productImage.delete({ where: { id: existing.id } });
  }

  const publicUrl = await uploadProductImage(productId, file);

  await prisma.productImage.create({
    data: { productId, url: publicUrl, sortOrder: 0 },
  });

  revalidatePath("/admin/prodotti");
  revalidatePath("/prodotti");
}

export async function toggleProductVisibilityAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const productId = formData.get("productId") as string;
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { isVisible: true } });
  if (!product) return;

  await prisma.product.update({
    where: { id: productId },
    data: { isVisible: !product.isVisible },
  });

  revalidatePath("/admin/prodotti");
  revalidatePath("/prodotti");
}

// ─── Notifiche ────────────────────────────────────────────────────────────────

export async function markNotificationsReadAction() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  revalidateTag(`notifications-${session.user.id}`);
  revalidatePath("/notifiche");
}

// ─── Admin: Fasce orarie ──────────────────────────────────────────────────────

export async function createPickupSlotAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const label = (formData.get("label") as string)?.trim();
  const startTime = (formData.get("startTime") as string)?.trim();
  const endTime = (formData.get("endTime") as string)?.trim();
  const maxOrders = parseInt(formData.get("maxOrders") as string) || 20;

  if (!label || !startTime || !endTime) return;

  await prisma.pickupSlot.create({ data: { label, startTime, endTime, maxOrders } });
  revalidatePath("/admin/impostazioni");
}

export async function togglePickupSlotAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const slot = await prisma.pickupSlot.findUnique({ where: { id }, select: { isActive: true } });
  if (!slot) return;

  await prisma.pickupSlot.update({ where: { id }, data: { isActive: !slot.isActive } });
  revalidatePath("/admin/impostazioni");
}

export async function deletePickupSlotAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.pickupSlot.delete({ where: { id } });
  revalidatePath("/admin/impostazioni");
}

// ─── Admin: Orari di apertura ─────────────────────────────────────────────────

export async function saveOpeningHoursAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
  const openingHours = days.map((day) => {
    const key = day.toLowerCase();
    const closed = formData.get(`closed_${key}`) === "on";
    const open = formData.get(`open_${key}`) as string;
    const close = formData.get(`close_${key}`) as string;
    return {
      day,
      hours: closed ? "Chiuso" : `${open} – ${close}`,
    };
  });

  const existing = await prisma.businessSettings.findFirst();
  if (existing) {
    await prisma.businessSettings.update({ where: { id: existing.id }, data: { openingHours } });
  } else {
    await prisma.businessSettings.create({ data: { openingHours } });
  }

  revalidatePath("/admin/impostazioni");
  revalidatePath("/contatti");
  revalidatePath("/");
}

// ─── Admin: Chiusure straordinarie ───────────────────────────────────────────

export async function addClosureDateAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const dateStr = formData.get("date") as string;
  const reason = (formData.get("reason") as string)?.trim() || null;
  if (!dateStr) return;

  const date = new Date(dateStr);
  await prisma.closureDate.upsert({
    where: { date },
    update: { reason },
    create: { date, reason },
  });

  revalidatePath("/admin/impostazioni");
}

export async function removeClosureDateAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.closureDate.delete({ where: { id } });
  revalidatePath("/admin/impostazioni");
}
