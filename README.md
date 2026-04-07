# Forno Irma MVP

MVP production-ready per un forno artigianale locale basato su Next.js App Router, TypeScript, PostgreSQL, Prisma, Auth.js e Tailwind CSS.

## Cosa include

- area pubblica vetrina con Home, Chi siamo, Prodotti, Prenotazioni, Contatti
- area clienti autenticata per prenotare prodotti e vedere lo storico
- area admin per gestire prodotti, categorie, contenuti, disponibilità, prenotazioni e impostazioni business
- seed iniziale realistico per “Forno Irma”
- architettura semplice e riusabile per altri piccoli food business

## Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Auth.js con Credentials provider e Prisma Adapter
- Tailwind CSS
- storage compatibile S3 tramite adapter semplice

## Architettura progetto

```text
forno-irma-mvp/
├── app/
│   ├── (public)/               # pagine pubbliche
│   ├── (auth)/                 # login e registrazione
│   ├── (user)/                 # area cliente
│   ├── admin/                  # dashboard admin
│   ├── api/auth/[...nextauth]  # endpoint Auth.js
│   └── api/upload              # upload immagini verso storage compatibile S3
├── components/
│   ├── admin/
│   ├── forms/
│   ├── layout/
│   └── reservations/
├── lib/
│   ├── actions.ts              # server actions principali
│   ├── auth.ts                 # configurazione Auth.js
│   ├── data.ts                 # query read-side
│   ├── prisma.ts               # singleton Prisma client
│   ├── session.ts              # guard auth / admin
│   └── storage.ts              # adapter upload S3
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── validators/
├── middleware.ts
└── README.md
```

## Modello dati

### Entità principali

- `User`: utenti cliente e admin
- `Category`: categorie prodotto
- `Product`: catalogo pubblico e prenotabile
- `ProductImage`: immagini prodotto
- `ProductAvailability`: disponibilità per data, max quantity, nota
- `PickupSlot`: fasce orarie di ritiro
- `Reservation`: testata prenotazione
- `ReservationItem`: righe prenotazione
- `SiteContent`: contenuti editoriali statici gestibili da admin
- `BusinessSettings`: contatti, orari, istruzioni di ritiro
- `Account`, `Session`, `VerificationToken`: tabelle Auth.js adapter

## Ruoli

### CUSTOMER

- registrazione e login
- visualizzazione profilo
- creazione prenotazioni
- visualizzazione storico prenotazioni

### ADMIN

- accesso area admin
- CRUD prodotti
- creazione categorie base
- gestione disponibilità per data
- aggiornamento stati prenotazioni
- modifica contenuti statici
- modifica impostazioni business

## Flussi principali

### Cliente

1. visita il catalogo pubblico
2. si registra oppure accede
3. apre `Nuova prenotazione`
4. seleziona quantità per i prodotti desiderati
5. sceglie data e fascia oraria
6. invia la prenotazione
7. controlla stato e storico nell’area cliente

### Admin

1. accede a `/admin`
2. controlla contatori dashboard
3. gestisce prodotti e immagini
4. imposta disponibilità per prodotto e data
5. aggiorna gli stati delle prenotazioni
6. modifica contenuti editoriali e contatti

## Setup locale

### 1. Clona e installa

```bash
pnpm install
# oppure npm install
```

### 2. Configura environment

Copia `.env.example` in `.env`.

```bash
cp .env.example .env
```

Variabili principali:

- `DATABASE_URL`: connessione PostgreSQL
- `AUTH_SECRET`: secret per Auth.js
- `AUTH_URL`: URL base auth in locale
- `NEXT_PUBLIC_APP_URL`: URL pubblico app
- `NEXT_PUBLIC_BUSINESS_NAME`: label business
- variabili `S3_*`: opzionali per upload immagini

### 3. Avvia PostgreSQL

Puoi usare una istanza locale o Docker. Esempio rapido:

```bash
docker run --name forno-irma-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=forno_irma \
  -p 5432:5432 -d postgres:16
```

### 4. Applica schema e seed

```bash
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

### 5. Avvia il progetto

```bash
pnpm dev
```

Apri `http://localhost:3000`.

## Credenziali demo seed

- Admin: `admin@fornoirma.it` / `Password123!`
- Cliente: `giulia@example.com` / `Password123!`

## Upload immagini

L’endpoint `POST /api/upload` accetta un `file` multipart e carica verso storage S3-compatible usando `lib/storage.ts`.

Per usare un provider diverso basta sostituire l’implementazione di:

- `getStorageClient`
- `uploadBuffer`

Il resto dell’app usa solo l’URL finale, quindi l’adapter è facile da rimpiazzare.

## Note implementative

### Autenticazione

- Auth.js con Credentials provider
- password hashate con `bcryptjs`
- sessione JWT con ruolo copiato nel token/session
- protezione server-side con `requireAuth()` e `requireAdmin()`
- middleware per percorsi sensibili

### Validazione

- validazione input con Zod per auth, prodotti e prenotazioni
- controlli lato server dentro le server actions
- messaggi errore minimi ma chiari

### UX MVP

- mobile-first
- loading state base nei form auth e prenotazioni
- empty state per storico prenotazioni
- struttura admin semplice, niente pannello nav pesante

## Seed demo

Il seed crea:

- 4 categorie: Pane, Focacce, Dolci, Specialità
- 12 prodotti realistici
- contenuti editoriali demo per Home e Chi siamo
- contatti e orari placeholder configurabili
- 4 pickup slots
- 2 utenti demo
- 2 prenotazioni demo

## Hardening consigliato per produzione

- rate limit su login e API upload
- CSRF e security headers via hosting / reverse proxy
- logging centralizzato e monitoring errori
- resize immagini lato upload
- auditing admin actions
- backup DB automatici
- job schedulati per pulizia immagini inutilizzate

## Query e operazioni utili

Aprire Prisma Studio:

```bash
pnpm studio
```

Rigenerare Prisma Client:

```bash
pnpm prisma generate
```

## Possibili evoluzioni future

- pagamento online
- notifiche email
- notifiche WhatsApp o Telegram
- multi-sede
- multi-tenant per altri forni o attività locali
- coupon e promozioni
- analytics base
- report giornalieri per laboratorio
- stampante comande / ricevute di produzione

## Riusabilità multi-cliente

Il progetto è già predisposto per essere duplicato su clienti simili grazie a:

- contenuti statici in tabella `SiteContent`
- contatti e business info in `BusinessSettings`
- adapter storage isolato
- server actions organizzate per dominio
- schema dati generico per prenotazioni e ritiro in negozio

## Riferimenti tecnici

La struttura si appoggia al router filesystem di Next.js App Router, alla configurazione Tailwind per Next.js, a Prisma ORM con PostgreSQL e ad Auth.js per autenticazione con credenziali. citeturn878927search4turn878927search3turn878927search5turn878927search10
