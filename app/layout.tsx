import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forno-irma.vercel.app";

export const metadata: Metadata = {
  title: { default: "Forno Irma", template: "%s | Forno Irma" },
  description: "Pane artigianale a Magenta. Prenota online i tuoi prodotti e ritirali direttamente in negozio.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Forno Irma",
    title: "Forno Irma — Pane artigianale a Magenta",
    description: "Pane artigianale a Magenta. Prenota online i tuoi prodotti e ritirali direttamente in negozio.",
    images: [{ url: "/Logo.jpg", width: 800, height: 800, alt: "Forno Irma" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
