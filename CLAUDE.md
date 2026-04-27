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
| `DEV_EMAIL_OVERRIDE` | Sovrascrive destinatario email in sviluppo (Resend senza dominio verificato) |
| `NEXT_PUBLIC_SITE_URL` | URL pubblico del sito (usato nei template email) |

## Architettura

### Route groups

```
app/
  (public)/        # vetrina pubblica, nessuna auth
  (auth)/          # login, registrazione, reset password
  (user)/          # area clienti autenticata (/profilo, /area-clienti, /notifiche)
  admin/           # pannello admin
  api/auth/        # handler Auth.js
  api/auth/verify-email/  # verifica token email
```

La protezione delle route è gestita in due livelli:
1. **Middleware Edge** (`middleware.ts`) — usa `auth.config.ts` (no Prisma, no bcrypt, gira su Edge runtime). Protegge i path `/admin/*`, `/area-clienti/*`, `/profilo/*`.
2. **Server-side guard** — ogni pagina protetta chiama `requireAuth()` o `requireAdmin()` da `lib/session.ts` come ulteriore controllo.

**Importante:** `lib/auth.config.ts` è separato da `lib/auth.ts` proprio perché il middleware Edge non può importare moduli Node-only (Prisma, bcryptjs). Non aggiungere import Node-only ad `auth.config.ts`.

### Dati: read vs write

- **`lib/data.ts`** — solo letture, spesso con `unstable_cache`. Da usare nelle Server Component per dati pubblici o quasi-statici.
- **`lib/actions.ts`** — tutte le Server Action (`"use server"`). Contiene tutta la logica di business: auth, prenotazioni, admin prodotti/categorie/impostazioni, notifiche. Ogni action verifica il ruolo prima di agire.
- **`lib/prisma.ts`** — singleton Prisma client.

### Autenticazione

Auth.js v5 con Credentials provider. Il login accetta **email o numero di telefono**. L'account richiede verifica email prima di poter accedere (`emailVerified` deve essere non-null). Il ruolo (`USER` | `ADMIN`) viene copiato nel JWT e letto da `session.user.role`.

### Storage immagini

`lib/supabase-storage.ts` gestisce upload/delete verso Supabase Storage (bucket `product-images`). Ogni prodotto ha una sola immagine attiva (sortOrder = 0). L'upload avviene tramite Server Action (`upsertProductImageAction`), non via API route.

### Email

`lib/email.ts` usa Resend. In sviluppo, settare `DEV_EMAIL_OVERRIDE` per ricevere le email sull'account Resend owner (necessario finché il dominio non è verificato su Resend).

### Notifiche in-app

`lib/notifications.ts` scrive record `Notification` nel DB. Gli admin ricevono notifica per ogni nuova prenotazione; i clienti per i cambi di stato. Il conteggio non letto è invalidato via `revalidateTag("notifications-<userId>")`.

## Modello dati — punti chiave

- **`Product.availableDays`** — array `Int[]` (ISO 1=Lun…7=Dom). Vuoto = sempre disponibile. Usato per filtrare i prodotti prenotabili in base al giorno scelto.
- **`BreadType` + `DailySchedule`** — sistema separato, solo informativo (homepage "pane del giorno"). **Non è collegato alle prenotazioni.** `DailySchedule` ha `dayOfWeek` (ricorrente) o `date` (specifica); `date` sovrascrive il ricorrente.
- **`BusinessSettings.openingHours`** — campo `Json` con struttura `{ day: string; hours: string }[]`. I giorni di chiusura settimanale si derivano da qui.
- **`ClosureDate`** — chiusure straordinarie per data specifica.
- **`ReservationItem.productName`** — denormalizzato intenzionalmente: preserva il nome al momento della prenotazione anche se il prodotto viene rinominato.
- **`SiteContent`** — contenuti editoriali key/value (es. testo homepage, chi siamo). Modificabili da admin senza deploy.

## Logica prenotazioni

Il flusso di creazione (`createReservationAction` in `lib/actions.ts`) valida in sequenza:
1. Data non in `ClosureDate`
2. Giorno aperto secondo `BusinessSettings.openingHours`
3. Ogni prodotto ha `availableDays` vuoto oppure contenente il dayOfWeek della data scelta

Il form (`components/reservations/new-reservation-form.tsx`) è un Client Component che filtra i prodotti client-side non appena la data viene selezionata, mostrando solo quelli disponibili. La validazione è comunque rifatta server-side nell'action.

## Convenzioni

- Le pagine `admin/` e `(user)/` sono Server Component; i form interattivi sono Client Component separati nella cartella `components/`.
- I Server Component admin caricano dati direttamente con `prisma.*` (non tramite `lib/data.ts`), perché i dati admin non vengono cachati.
- `lib/data.ts` è riservato a letture pubbliche o semi-pubbliche con caching (`unstable_cache`).
- Gli slug vengono generati automaticamente con `slugify` (lowercase, strict) al momento della creazione; non sono modificabili dall'admin UI.
- I giorni della settimana seguono lo standard ISO: 1 = Lunedì, 7 = Domenica (non il formato JS dove Domenica = 0).
