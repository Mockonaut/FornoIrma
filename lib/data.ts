import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Cache helpers ────────────────────────────────────────────────────────────
// Static-ish data: revalidate every 10 minutes
// Daily special: revalidate every 5 minutes (changes once a day but must be fresh)
// Reservations/admin: never cached here (always dynamic)

export const getPublicCategories = unstable_cache(
  () => prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  }),
  ["public-categories"],
  { revalidate: 600 }
);

export const getVisibleProducts = unstable_cache(
  (categorySlug?: string) => prisma.product.findMany({
    where: {
      isVisible: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
  }),
  ["visible-products"],
  { revalidate: 600 }
);

export const getHomeContent = unstable_cache(
  () => prisma.siteContent.findMany().then((rows) =>
    Object.fromEntries(rows.map((c) => [c.key, c]))
  ),
  ["home-content"],
  { revalidate: 600 }
);

export const getBusinessSettings = unstable_cache(
  () => prisma.businessSettings.findFirst(),
  ["business-settings"],
  { revalidate: 600 }
);

export type DailySpecialResult = {
  name: string;
  description?: string | null;
  source: "scheduled" | "recurring" | "fallback";
};

export const getDailySpecial = unstable_cache(
  async (): Promise<DailySpecialResult | null> => {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dow = today.getDay() === 0 ? 7 : today.getDay();

    const specific = await prisma.dailySchedule.findUnique({
      where: { date: todayDate },
      include: { breadType: true },
    });
    if (specific?.breadType.isActive) {
      return { name: specific.breadType.name, description: specific.breadType.description, source: "scheduled" };
    }

    const recurring = await prisma.dailySchedule.findUnique({
      where: { dayOfWeek: dow },
      include: { breadType: true },
    });
    if (recurring?.breadType.isActive) {
      return { name: recurring.breadType.name, description: recurring.breadType.description, source: "recurring" };
    }

    const legacy = await prisma.siteContent.findUnique({ where: { key: "DAILY_SPECIAL" } });
    if (legacy?.title) {
      return { name: legacy.title, description: legacy.body, source: "fallback" };
    }

    return null;
  },
  ["daily-special"],
  { revalidate: 300 }
);

export async function getBreadLibrary() {
  return prisma.breadType.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getDailySchedule() {
  return prisma.dailySchedule.findMany({
    include: { breadType: true },
    orderBy: [{ dayOfWeek: "asc" }, { date: "asc" }],
  });
}
