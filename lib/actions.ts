"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateReservationCode } from "@/lib/utils";

// ─── Auth ─────────────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
});

export async function registerAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return { error: "Dati non validi. Controlla i campi." };

  const { name, email, password, phone } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Esiste già un account con questa email." };

  await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 12), phone },
  });

  redirect("/login?registered=1");
}

// ─── Admin: Categories ────────────────────────────────────────────────────────

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

// ─── Reservations ─────────────────────────────────────────────────────────────

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

  // Fetch product names for snapshot
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

  revalidatePath("/area-clienti/prenotazioni");
  return { code: reservation.code };
}
