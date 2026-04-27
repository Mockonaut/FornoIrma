import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return session;
}

/**
 * Usata nelle server actions admin: lancia un errore esplicito invece di
 * tornare silenziosamente, così il problema è visibile nei log.
 */
export async function assertAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Accesso non autorizzato: ruolo ADMIN richiesto.");
  }
  return session;
}
