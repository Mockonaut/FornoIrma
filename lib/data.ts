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

export async function getDailySpecial() {
  return prisma.siteContent.findUnique({ where: { key: "DAILY_SPECIAL" } });
}

export async function getBusinessSettings() {
  return prisma.businessSettings.findFirst();
}
