import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=token_mancante", req.url));
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return NextResponse.redirect(new URL("/login?error=token_non_valido", req.url));
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.redirect(new URL("/login?error=token_scaduto", req.url));
  }

  // Attiva l'account
  const user = await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
    select: { name: true, email: true },
  });

  await prisma.verificationToken.delete({ where: { token } });

  // Invia email di benvenuto ora che l'account è attivo
  const firstName = user.name?.split(" ")[0] ?? "caro cliente";
  await sendWelcomeEmail(user.email!, firstName).catch(() => {});

  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}
