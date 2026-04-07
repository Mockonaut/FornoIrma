export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/profilo/:path*", "/area-clienti/:path*", "/admin/:path*"]
};
