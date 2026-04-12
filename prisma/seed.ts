import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();
const slug = (s: string) => slugify(s, { lower: true, strict: true });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Business Settings ───────────────────────────────────────────────────────
  const settingsData = {
    address: "Via Roma 12, 20013 Magenta MI",
    phone: "+39 02 9790000",
    email: "info@fornoirma.it",
    instagramUrl: "https://www.instagram.com/forno_irma/",
    pickupInstructions:
      "Ritiro in negozio nelle fasce orarie selezionate. Nessun pagamento online: si paga al ritiro.",
    openingHours: [
      { day: "Lunedì", hours: "Chiuso" },
      { day: "Martedì – Venerdì", hours: "07:30 – 18:30" },
      { day: "Sabato", hours: "08:00 – 18:30" },
      { day: "Domenica", hours: "08:00 – 12:30" },
    ],
  };
  await prisma.businessSettings.upsert({
    where: { id: "singleton" },
    update: settingsData,
    create: { id: "singleton", ...settingsData },
  });

  // ─── Site Content ────────────────────────────────────────────────────────────
  await prisma.siteContent.upsert({
    where: { key: "ABOUT_PAGE" },
    update: {},
    create: {
      key: "ABOUT_PAGE",
      title: "La storia di Forno Irma",
      body: `Forno Irma è il forno di riferimento del quartiere a Magenta. Ogni mattina lo stesso rito: farina, acqua, lievito naturale e le mani di chi conosce il mestiere. Nessun additivo, nessuna fretta.

Il catalogo è volutamente semplice: due pani classici sempre presenti, il pan bauletto per i più golosi, i dolci del giorno e un pane speciale che cambia ogni mattina — perché la monotonia non fa per noi.

Siamo un forno di quartiere. Ci piace conoscere i nostri clienti per nome e sapere cosa si aspettano quando entrano. La prenotazione online è il nostro modo di stare al passo con i tempi senza perdere il carattere artigianale che ci contraddistingue.`,
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "HOME_HERO" },
    update: {},
    create: {
      key: "HOME_HERO",
      title: "Il pane di una volta, pronto quando vuoi tu",
      body: "Prenota online, ritira in negozio. Farine selezionate, lievito madre, impasto a mano ogni giorno.",
    },
  });

  // Pane del giorno — aggiornato dall'admin ogni mattina
  await prisma.siteContent.upsert({
    where: { key: "DAILY_SPECIAL" },
    update: {},
    create: {
      key: "DAILY_SPECIAL",
      title: "Pane alle noci e rosmarino",
      body: "Impasto rustico con noci tostate e rosmarino fresco. Crosta spessa, mollica morbida e profumata. Disponibile fino ad esaurimento.",
    },
  });

  // ─── Categorie ───────────────────────────────────────────────────────────────
  const [pane, bauletto, dolci] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "pane" },
      update: {},
      create: { name: "Pane", slug: "pane", description: "I due pani classici del forno, ogni giorno", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "pan-bauletto" },
      update: {},
      create: { name: "Pan bauletto", slug: "pan-bauletto", description: "Il soffice del forno", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "dolci" },
      update: {},
      create: { name: "Dolci", slug: "dolci", description: "Dolci e lievitati del giorno", sortOrder: 3 },
    }),
  ]);

  // Rimuoviamo la vecchia categoria "specialita" se esiste
  await prisma.category.updateMany({
    where: { slug: "focacce" },
    data: { isVisible: false },
  });
  await prisma.category.updateMany({
    where: { slug: "specialita" },
    data: { isVisible: false },
  });

  // ─── Prodotti ────────────────────────────────────────────────────────────────
  const products = [
    // I due pani fissi
    {
      name: "Pane di farina bianca",
      categoryId: pane.id,
      shortDescription: "Il classico. Crosta croccante, mollica aperta. Lievito madre, cottura a legna.",
      isSeasonal: false,
      isSpecial: false,
      sortOrder: 1,
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Pane integrale",
      categoryId: pane.id,
      shortDescription: "Farina integrale macinata a pietra. Sapore pieno, nutriente, con la crosta che scricchiola.",
      isSeasonal: false,
      isSpecial: false,
      sortOrder: 2,
      image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1200&q=80",
    },
    // Pan bauletto
    {
      name: "Pan bauletto",
      categoryId: bauletto.id,
      shortDescription: "Soffice, leggero, con una crosticina sottile. Perfetto a colazione o per i più piccoli.",
      isSeasonal: false,
      isSpecial: false,
      sortOrder: 1,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
    },
    // Dolci
    {
      name: "Crostata alla marmellata",
      categoryId: dolci.id,
      shortDescription: "Pasta frolla burrosissima con marmellata di albicocche o fragole, secondo la stagione.",
      isSeasonal: false,
      isSpecial: false,
      sortOrder: 1,
      image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Cornetti al burro",
      categoryId: dolci.id,
      shortDescription: "Sfogliatura con burro di qualità. Vuoti o con crema pasticcera.",
      isSeasonal: false,
      isSpecial: false,
      sortOrder: 2,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const p of products) {
    const productSlug = slug(p.name);
    const product = await prisma.product.upsert({
      where: { slug: productSlug },
      update: { sortOrder: p.sortOrder },
      create: {
        name: p.name,
        slug: productSlug,
        shortDescription: p.shortDescription,
        categoryId: p.categoryId,
        isSeasonal: p.isSeasonal,
        isSpecial: p.isSpecial,
        isVisible: true,
        sortOrder: p.sortOrder,
      },
    });
    const existing = await prisma.productImage.findFirst({ where: { productId: product.id } });
    if (!existing) {
      await prisma.productImage.create({ data: { productId: product.id, url: p.image, sortOrder: 0 } });
    }
  }

  // ─── Fasce orarie ────────────────────────────────────────────────────────────
  const slots = [
    { label: "Mattina (08:00 – 10:00)", startTime: "08:00", endTime: "10:00" },
    { label: "Mattina tarda (10:00 – 12:00)", startTime: "10:00", endTime: "12:00" },
    { label: "Mezzogiorno (12:00 – 13:30)", startTime: "12:00", endTime: "13:30" },
    { label: "Pomeriggio (16:30 – 18:00)", startTime: "16:30", endTime: "18:00" },
    { label: "Sera (18:00 – 19:30)", startTime: "18:00", endTime: "19:30" },
  ];
  for (const s of slots) {
    const existing = await prisma.pickupSlot.findFirst({ where: { label: s.label } });
    if (!existing) {
      await prisma.pickupSlot.create({ data: { ...s, isActive: true, maxOrders: 20 } });
    }
  }

  // ─── Admin user ──────────────────────────────────────────────────────────────
  const adminEmail = "admin@fornoirma.it";
  if (!await prisma.user.findUnique({ where: { email: adminEmail } })) {
    await prisma.user.create({
      data: {
        name: "Admin Forno Irma",
        email: adminEmail,
        password: await bcrypt.hash("admin1234", 12),
        role: Role.ADMIN,
      },
    });
    console.log(`✅ Admin creato: ${adminEmail} / admin1234`);
  }

  console.log("✅ Seed completato.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
