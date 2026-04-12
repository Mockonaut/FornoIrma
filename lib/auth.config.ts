import type { NextAuthConfig } from "next-auth";

// Config leggera senza dipendenze Node-only (bcryptjs, Prisma).
// Usata dal middleware Edge — NON importare qui nulla che non giri su Edge.
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [], // i provider reali sono in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { role?: string })?.role === "ADMIN";
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) {
        if (!isLoggedIn) return false; // → redirect a /login
        if (!isAdmin) return Response.redirect(new URL("/", nextUrl));
        return true;
      }
      if (
        path.startsWith("/profilo") ||
        path.startsWith("/area-clienti")
      ) {
        return isLoggedIn; // false → redirect a /login
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
