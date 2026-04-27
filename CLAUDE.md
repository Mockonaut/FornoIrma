# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Progetto

**Forno Irma** — MVP per un forno artigianale a Magenta. Permette ai clienti di prenotare prodotti online e ritirarli in negozio. Il pannello admin gestisce prodotti, prenotazioni, disponibilità e contenuti del sito.

## Comandi

```bash
npm run dev           # sviluppo locale
npm run build         # prisma generate + next build
npm run lint          # ESLint via Next.js

# Database (richiedono .env.local caricato)
set -a && source .env.local && set +a && npx prisma migrate dev --name <nome>
npm run db:seed       # seeding dati demo
npm run studio        # Prisma Studio (GUI DB)
```

> Le migrazioni vanno eseguite con `.env.local` caricato esplicitamente (vedi sopra): il file `.env` di default punta al pooler Neon che non supporta DDL.

## Variabili d'ambiente

File: `.env.local` (non committato).

| Variabile | Scopo |
|---|---|
| `DATABASE_URL` | Pooler Neon (porta 5432, usato da Prisma client) |
| `DIRECT_URL` | Connessione diretta Neon (usata solo per migrazioni) |
| `AUTH_SECRET` | Secret JWT per Auth.js |
| `NEXTAUTH_URL` | URL base (`http://localhost:3000` in locale) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Storage (immagini) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role per upload/delete immagini |
| `RESEND_API_KEY` | Email transazionali via Resend |
| `RESEND_FROM` | Mittente email |
| `DEV_EMAIL_OVERRIDE` | Sovrascrive destinatario email **solo in sviluppo** (`NODE_ENV=development`). Non ha effetto in produzione. |
| `NEXT_PUBLIC_SITE_URL` | URL pubblico del sito (usato nei template email) |

## Architettura

### Route groups

```
app/
  (public)/          # vetrina pubblica, nessuna auth
    disponibilita/   # griglia settimanale prodotti × giorni
  (auth)/            # login, registrazione, reset password
  (user)/            # area clienti autenticata (/profilo, /area-clienti, /notifiche)
  admin/             # pannello admin
  api/auth/          # handler Auth.js
  api/auth/verify-email/            # verifica token email
  api/admin/export-reservations/    # GET ?date=YYYY-MM-DD → CSV prenotazioni
```

La protezione delle route è gestita in due livelli:
1. **Middleware Edge** (`middleware.ts`) — usa `auth.config.ts` (no Prisma, no bcrypt, gira su Edge runtime). Protegge i path `/admin/*`, `/area-clienti/*`, `/profilo/*`.
2. **Server-side guard** — ogni pagina protetta chiama `requireAuth()` o `requireAdmin()` da `lib/session.ts`.

**Importante:** `lib/auth.config.ts` è separato da `lib/auth.ts` perché il middleware Edge non può importare moduli Node-only (Prisma, bcryptjs). Non aggiungere import Node-only ad `auth.config.ts`.

### Dati: read vs write

- **`lib/data.ts`** — solo letture, spesso con `unstable_cache`. Da usare nelle Server Component per dati pubblici o quasi-statici.
- **`lib/actions.ts`** — tutte le Server Action (`"use server"`). Contiene tutta la logica di business: auth, prenotazioni, admin prodotti/categorie/impostazioni, notifiche. Le action admin iniziano con `await assertAdmin()` (lancia un errore esplicito se non autorizzato; quelle che necessitano dell'id admin usano `const session = await assertAdmin()`).
- **`lib/constants.ts`** — costanti condivise: durate token, limiti immagine, default slot e prenotazioni.
- **`lib/prisma.ts`** — singleton Prisma client.

### Autenticazione

Auth.js v5 con Credentials provider. Il login accetta **email o numero di telefono**. L'account richiede verifica email prima di poter accedere (`emailVerified` deve essere non-null). Il ruolo (`USER` | `ADMIN`) viene copiato nel JWT e letto da `session.user.role`.

### Storage immagini

`lib/supabase-storage.ts` gestisce upload/delete verso Supabase Storage (bucket `product-images`). Ogni prodotto ha una sola immagine attiva (sortOrder = 0). La validazione di tipo MIME, estensione e dimensione avviene **lato server** in `uploadProductImage()`, non solo client-side.

### Email

`lib/email.ts` usa Resend. Funzioni disponibili: `sendVerificationEmail`, `sendWelcomeEmail`, `sendPasswordResetEmail`, `sendReservationStatusEmail` (CONFIRMED / READY / CANCELLED). `DEV_EMAIL_OVERRIDE` reindirizza le email solo se `NODE_ENV=development`.

### Notifiche in-app

`lib/notifications.ts` scrive record `Notification` nel DB. Gli admin ricevono notifica per ogni nuova prenotazione; i clienti per i cambi di stato (in parallelo all'email). Il conteggio non letto è invalidato via `revalidateTag("notifications-<userId>")`.

## Modello dati — punti chiave

- **`Product.availableDays Int[]`** — ISO 1=Lun…7=Dom. Vuoto = sempre disponibile. Filtra i prodotti nel form prenotazione e viene validato server-side.
- **`Product.maxQtyPerOrder Int?`** — null = nessun limite. Il pulsante `+` nel form si disabilita al limite; validato anche server-side.
- **`BusinessSettings.maxOpenReservations Int`** — default 3. Blocca la creazione se l'utente ha già N prenotazioni in stato PENDING/CONFIRMED/READY.
- **`BusinessSettings.openingHours Json`** — struttura `{ day: string; hours: string }[]`. Giorni di chiusura settimanale. Sia il form client che la server action usano `isOpenOnDate()` da `lib/utils.ts` (stessa logica).
- **`ClosureDate`** — chiusure straordinarie per data specifica.
- **`BreadType` + `DailySchedule`** — sistema informativo per la homepage ("pane del giorno"). **Non collegato alle prenotazioni.** `DailySchedule` ha `dayOfWeek` (ricorrente) o `date` (specifica, sovrascrive il ricorrente).
- **`ReservationItem.productName`** — denormalizzato intenzionalmente: preserva il nome al momento della prenotazione.
- **`SiteContent`** — contenuti editoriali key/value. Modificabili da admin senza deploy.

## Logica prenotazioni

`createReservationAction` valida in sequenza:
1. Utente autenticato
2. Utente non ha già `maxOpenReservations` prenotazioni aperte (PENDING/CONFIRMED/READY)
3. Data non in `ClosureDate`
4. Giorno aperto secondo `BusinessSettings.openingHours`
5. Slot attivo e non al completo (`maxOrders` per quella data)
6. Prodotti visibili, disponibili nel giorno scelto (`availableDays`), entro `maxQtyPerOrder`

Il form (`components/reservations/new-reservation-form.tsx`) è un Client Component: seleziona la data prima, poi filtra i prodotti disponibili client-side. La validazione è rifatta server-side.

Il cliente può annullare prenotazioni proprie in stato PENDING o CONFIRMED con data futura (`cancelReservationAction`).

## Slug

Generati con `generateUniqueSlug()` da `lib/utils.ts`: prova lo slug base, aggiunge suffisso numerico progressivo (-2, -3, …) se già occupato. Applicato a prodotti e categorie. Non modificabile dall'admin UI dopo la creazione.

## Convenzioni

- Le pagine `admin/` e `(user)/` sono Server Component; i form interattivi sono Client Component nella cartella `components/`.
- I Server Component admin caricano dati direttamente con `prisma.*` (non tramite `lib/data.ts`), perché i dati admin non vengono cachati.
- `lib/data.ts` è riservato a letture pubbliche o semi-pubbliche con caching (`unstable_cache`).
- I giorni della settimana seguono lo standard ISO: 1 = Lunedì, 7 = Domenica (non il formato JS dove Domenica = 0).
- Le costanti (durate token, limiti file, default numerici) stanno in `lib/constants.ts`.
