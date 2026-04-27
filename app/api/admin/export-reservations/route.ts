import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return new NextResponse("Non autorizzato", { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date"); // formato YYYY-MM-DD
  if (!dateParam) return new NextResponse("Parametro date mancante", { status: 400 });

  const day = new Date(dateParam + "T00:00:00");
  const nextDay = new Date(dateParam + "T00:00:00");
  nextDay.setDate(nextDay.getDate() + 1);

  const reservations = await prisma.reservation.findMany({
    where: {
      pickupDate: { gte: day, lt: nextDay },
      status: { notIn: ["CANCELLED"] },
    },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      pickupSlot: { select: { label: true } },
      items: true,
    },
    orderBy: [{ pickupSlot: { startTime: "asc" } }, { createdAt: "asc" }],
  });

  const rows: string[] = [
    ["Codice", "Cliente", "Email", "Telefono", "Fascia oraria", "Prodotto", "Quantità", "Note"].join(";"),
  ];

  for (const r of reservations) {
    for (const item of r.items) {
      rows.push(
        [
          r.code,
          r.user.name ?? "",
          r.user.email ?? "",
          r.user.phone ?? "",
          r.pickupSlot.label,
          item.productName,
          item.quantity,
          r.notes ?? "",
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(";")
      );
    }
  }

  const csv = rows.join("\r\n");
  const filename = `prenotazioni-${dateParam}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
