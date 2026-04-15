"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Forno Irma <onboarding@resend.dev>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forno-irma.vercel.app";

// ─── Template base ────────────────────────────────────────────────────────────

function baseTemplate(body: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Forno Irma</title>
</head>
<body style="margin:0;padding:0;background:#FDF8F3;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8F3;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="text-align:center;padding-bottom:32px;">
          <img src="${SITE}/Logo.jpg" alt="Forno Irma" width="72" height="72"
            style="border-radius:14px;display:block;margin:0 auto 16px;" />
          <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#9C8578;font-family:Arial,sans-serif;">
            Forno Irma · Magenta
          </div>
          <div style="margin:12px auto;width:120px;height:1px;background:#E8DDD5;position:relative;">
            <span style="position:absolute;left:50%;transform:translateX(-50%) translateY(-50%);background:#FDF8F3;padding:0 8px;color:#B87620;font-size:14px;">★</span>
          </div>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#FFFFFF;border-radius:20px;padding:40px 36px;box-shadow:0 2px 16px rgba(45,26,8,0.07);">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:28px 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;color:#B8A99A;font-family:Arial,sans-serif;letter-spacing:0.1em;">
            © ${new Date().getFullYear()} Forno Irma — Magenta
          </p>
          <p style="margin:0;font-size:11px;color:#C9BAB0;font-family:Arial,sans-serif;">
            <a href="${SITE}/privacy" style="color:#C9BAB0;">Privacy Policy</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const h1 = (text: string) =>
  `<h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#2D1A08;line-height:1.2;">${text}</h1>`;

const p = (text: string) =>
  `<p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#6B5344;">${text}</p>`;

const btn = (text: string, href: string) =>
  `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr><td style="background:#B87620;border-radius:999px;padding:14px 32px;">
      <a href="${href}" style="color:#FDF8F3;text-decoration:none;font-size:14px;font-weight:700;font-family:Arial,sans-serif;letter-spacing:0.04em;">${text}</a>
    </td></tr>
  </table>`;

const muted = (text: string) =>
  `<p style="margin:16px 0 0;font-size:12px;color:#9C8578;font-family:Arial,sans-serif;">${text}</p>`;

// ─── Email: verifica indirizzo email ─────────────────────────────────────────

export async function sendVerificationEmail(to: string, firstName: string, token: string) {
  const verifyUrl = `${SITE}/api/auth/verify-email?token=${token}`;

  const body = `
    ${h1(`Ciao, ${firstName}!`)}
    ${p("Grazie per esserti registrato al Forno Irma. Per attivare il tuo account e iniziare a prenotare, conferma il tuo indirizzo email cliccando il pulsante qui sotto.")}
    ${btn("Conferma la tua email", verifyUrl)}
    ${p("Il link è valido per <strong>24 ore</strong>. Se non ti sei registrato tu, ignora questa email.")}
    ${muted("Hai ricevuto questa email perché qualcuno ha usato questo indirizzo per registrarsi su Forno Irma.")}
  `;

  // In sviluppo senza dominio verificato, Resend accetta solo l'email dell'account owner.
  // Rimuovere DEV_EMAIL_OVERRIDE quando il dominio è verificato su resend.com/domains.
  const recipient = process.env.DEV_EMAIL_OVERRIDE ?? to;

  return resend.emails.send({
    from: FROM,
    to: recipient,
    subject: "Conferma la tua email — Forno Irma",
    html: baseTemplate(body),
  });
}

// ─── Email: benvenuto dopo verifica ──────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string) {
  const body = `
    ${h1(`Benvenuto, ${firstName}!`)}
    ${p("Il tuo account è attivo. Da adesso puoi prenotare il tuo pane preferito online e ritirarlo direttamente da noi a Magenta — quando fa comodo a te.")}
    ${p("Ecco cosa puoi fare subito:")}
    <ul style="margin:0 0 20px;padding-left:20px;color:#6B5344;font-size:15px;line-height:2;">
      <li>Sfoglia il nostro <a href="${SITE}/prodotti" style="color:#B87620;">catalogo prodotti</a></li>
      <li>Scopri il <strong>pane speciale del giorno</strong> — cambia ogni mattina</li>
      <li>Fai la tua prima prenotazione in pochi clic</li>
    </ul>
    ${btn("Vai alla tua area personale", `${SITE}/profilo`)}
    ${muted("Hai ricevuto questa email perché il tuo account su Forno Irma è stato attivato.")}
  `;

  const recipient = process.env.DEV_EMAIL_OVERRIDE ?? to;

  return resend.emails.send({
    from: FROM,
    to: recipient,
    subject: "Benvenuto al Forno Irma ★",
    html: baseTemplate(body),
  });
}
