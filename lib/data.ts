import { prisma } from "@/lib/prisma";

export async function getPublicCategories() {
  return prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getVisibleProducts(categorySlug?: string) {
  return prisma.product.findMany({
    where: {
      isVisible: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getHomeContent() {
  const contents = await prisma.siteContent.findMany();
  return Object.fromEntries(contents.map((c) => [c.key, c]));
}

export type DailySpecialResult = {
  name: string;
  description?: string | null;
  source: "scheduled" | "recurring" | "fallback";
};

export async function getDailySpecial(): Promise<DailySpecialResult | null> {
  const today = new Date();
  // Zero out time so @db.Date comparison works
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // ISO day of week: Mon=1 … Sun=7
  const dow = today.getDay() === 0 ? 7 : today.getDay();

  // 1. Specific date entry for today
  const specific = await prisma.dailySchedule.findUnique({
    where: { date: todayDate },
    include: { breadType: true },
  });
  if (specific?.breadType.isActive) {
    return { name: specific.breadType.name, description: specific.breadType.description, source: "scheduled" };
  }

  // 2. Recurring day-of-week
  const recurring = await prisma.dailySchedule.findUnique({
    where: { dayOfWeek: dow },
    include: { breadType: true },
  });
  if (recurring?.breadType.isActive) {
    return { name: recurring.breadType.name, description: recurring.breadType.description, source: "recurring" };
  }

  // 3. Legacy SiteContent fallback
  const legacy = await prisma.siteContent.findUnique({ where: { key: "DAILY_SPECIAL" } });
  if (legacy?.title) {
    return { name: legacy.title, description: legacy.body, source: "fallback" };
  }

  return null;
}

export async function getBreadLibrary() {
  return prisma.breadType.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getDailySchedule() {
  return prisma.dailySchedule.findMany({
    include: { breadType: true },
    orderBy: [{ dayOfWeek: "asc" }, { date: "asc" }],
  });
}

export async function getBusinessSettings() {
  return prisma.businessSettings.findFirst();
}
