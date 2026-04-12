import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Middleware leggero: usa solo authConfig (niente bcryptjs, niente Prisma).
// Il callback `authorized` in authConfig gestisce protezione route e ruoli.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/profilo/:path*", "/area-clienti/:path*", "/admin/:path*"],
};
