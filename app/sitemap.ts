import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forno-irma.vercel.app";
  const now = new Date();

  return [
    { url: base,                    lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/prodotti`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/prenotazioni`,  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/chi-siamo`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contatti`,      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
