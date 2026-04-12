import type { Metadata } from "next";
import { getHomeContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "La storia di Forno Irma a Magenta: pane artigianale con passione e ingredienti selezionati ogni giorno.",
  openGraph: {
    title: "Chi siamo | Forno Irma",
    description: "La storia di Forno Irma a Magenta: pane artigianale con passione e ingredienti selezionati ogni giorno.",
  },
};

export default async function AboutPage() {
  const content = await getHomeContent();
  const about = content.ABOUT_PAGE;

  return (
    <div className="container-shell py-12">
      <div className="card mx-auto max-w-4xl p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Chi siamo</p>
        <h1 className="mt-3 text-4xl font-bold">{about?.title ?? "La storia di Forno Irma"}</h1>
        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-[var(--muted)]">{about?.body}</p>
      </div>
    </div>
  );
}
