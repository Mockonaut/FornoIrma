import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const slug = (s: string) => slugify(s, { lower: true, strict: true });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Business Settings ──────────────────────────────────────────────────────
  const settingsData = {
    address: "Via Roma 12, 00100 Roma RM",
    phone: "+39 06 1234567",
    email: "info@fornoirma.it",
    instagramUrl: "https://www.instagram.com/forno_irma/",
    pickupInstructions:
      "Ritiro in negozio nelle fasce orarie selezionate. Nessun pagamento online: si paga al ritiro.",
    openingHours: [
      { day: "Lunedì", hours: "Chiuso" },
      { day: "Martedì – Venerdì", hours: "07:00 – 13:30 / 16:00 – 19:30" },
      { day: "Sabato", hours: "07:00 – 14:00" },
      { day: "Domenica", hours: "07:30 – 13:00" },
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
      body: `Forno Irma nasce nel 1978 per volontà di Irma Rossi, che dopo anni di lavoro nelle cucine di mezza Italia decide di aprire il suo laboratorio artigianale nel cuore del quartiere.

Da allora ogni mattina inizia allo stesso modo: farina, acqua, lievito naturale e le mani di chi conosce il mestiere. Nessun additivo, nessuna fretta.

Oggi il forno è gestito dalla seconda generazione della famiglia, che porta avanti le ricette originali affiancandole a nuove proposte stagionali. La focaccia ripiena del martedì, il pane di semola del fine settimana, i dolci delle feste: ogni prodotto racconta un pezzo di storia.

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

  // ─── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "pane" },
      update: {},
      create: { name: "Pane", slug: "pane", description: "Pane artigianale a lievitazione naturale", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "focacce" },
      update: {},
      create: { name: "Focacce", slug: "focacce", description: "Focacce farcite e classiche", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "dolci" },
      update: {},
      create: { name: "Dolci", slug: "dolci", description: "Torte, crostate e lievitati dolci", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "specialita" },
      update: {},
      create: { name: "Specialità", slug: "specialita", description: "Proposte stagionali e speciali", sortOrder: 4 },
    }),
  ]);

  const [pane, focacce, dolci, specialita] = categories;

  // ─── Products ────────────────────────────────────────────────────────────────
  const products = [
    {
      name: "Pane di semola",
      categoryId: pane.id,
      shortDescription: "Semola rimacinata di grano duro, crosta dorata e mollica profumata.",
      isSeasonal: false,
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Pane integrale",
      categoryId: pane.id,
      shortDescription: "Farina integrale macinata a pietra, ricco di fibre e dal sapore pieno.",
      isSeasonal: false,
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Filone con olive",
      categoryId: pane.id,
      shortDescription: "Impasto morbido con olive taggiasche. Disponibile il venerdì.",
      isSeasonal: false,
      isSpecial: true,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Focaccia classica",
      categoryId: focacce.id,
      shortDescription: "Olio extravergine, sale grosso e rosmarino. Alta e soffice.",
      isSeasonal: false,
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Focaccia ripiena",
      categoryId: focacce.id,
      shortDescription: "Ripieno del giorno: mortadella e stracchino oppure pomodoro e mozzarella.",
      isSeasonal: false,
      isSpecial: true,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Crostata alla marmellata",
      categoryId: dolci.id,
      shortDescription: "Pasta frolla burrosissima con marmellata di albicocche o fragole.",
      isSeasonal: false,
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Cornetti al burro",
      categoryId: dolci.id,
      shortDescription: "Sfogliatura con burro di qualità. Vuoti o con crema.",
      isSeasonal: false,
      isSpecial: false,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Panettone artigianale",
      categoryId: specialita.id,
      shortDescription: "Produzione limitata in novembre e dicembre. Uvetta e canditi o cioccolato.",
      isSeasonal: true,
      isSpecial: true,
      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const p of products) {
    const productSlug = slug(p.name);
    const product = await prisma.product.upsert({
      where: { slug: productSlug },
      update: {},
      create: {
        name: p.name,
        slug: productSlug,
        shortDescription: p.shortDescription,
        categoryId: p.categoryId,
        isSeasonal: p.isSeasonal,
        isSpecial: p.isSpecial,
        isVisible: true,
      },
    });
    const existing = await prisma.productImage.findFirst({ where: { productId: product.id } });
    if (!existing) {
      await prisma.productImage.create({ data: { productId: product.id, url: p.image, sortOrder: 0 } });
    }
  }

  // ─── Pickup Slots ────────────────────────────────────────────────────────────
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
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
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
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
