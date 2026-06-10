// Vercel serverless funkce — odeslání kontaktního formuláře přes Resend.
// Znovupoužitelné napříč weby: chování řídí pouze env proměnné, kód se nemění.
//
// Povinné env proměnné (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY   — API klíč z resend.com (re_...)
//   CONTACT_TO       — kam chodí poptávky (lze víc adres oddělených čárkou)
//   CONTACT_FROM     — odesílatel z OVĚŘENÉ domény, např: "Novostavba Chotěšov <noreply@mail.tvojedomena.cz>"
//
// API klíč NIKDY necommituj do gitu — jen jako env proměnnou.

const { Resend } = require('resend');

const escape = (v) => String(v == null ? '' : v).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel parsuje JSON body automaticky; fallback kdyby přišel jako string
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const { jmeno, email, telefon, zprava, hypoteka, website } = body;

  // Honeypot — boti vyplní skryté pole "website", lidé ne. Tváříme se úspěšně.
  if (website) return res.status(200).json({ ok: true });

  // Validace
  if (!jmeno || !String(jmeno).trim()) return res.status(400).json({ error: 'Vyplňte prosím jméno.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'Zadejte prosím platný e-mail.' });

  // Konfigurace
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !to || !from) {
    console.error('Chybí env proměnné RESEND_API_KEY / CONTACT_TO / CONTACT_FROM.');
    return res.status(500).json({ error: 'Formulář zatím není nakonfigurován. Kontaktujte nás prosím telefonicky nebo e-mailem.' });
  }

  const resend = new Resend(apiKey);

  const text = [
    `Jméno: ${jmeno}`,
    `E-mail: ${email}`,
    `Telefon: ${telefon || '—'}`,
    `Financování hypotékou: ${hypoteka ? 'ANO — má zájem o informace' : 'ne'}`,
    '',
    'Zpráva:',
    zprava || '(bez zprávy)',
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222;line-height:1.5">
    <h2 style="color:#1d4ed8;margin:0 0 14px">Nová poptávka z webu</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-size:15px">
      <tr><td style="color:#6b7280">Jméno</td><td><b>${escape(jmeno)}</b></td></tr>
      <tr><td style="color:#6b7280">E-mail</td><td><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
      <tr><td style="color:#6b7280">Telefon</td><td>${escape(telefon) || '—'}</td></tr>
      <tr><td style="color:#6b7280">Hypotéka</td><td>${hypoteka ? '<b>ano</b>' : 'ne'}</td></tr>
    </table>
    <p style="margin:16px 0 4px;color:#6b7280">Zpráva:</p>
    <p style="white-space:pre-wrap;background:#f5f7ff;border:1px solid #e0e7ff;padding:12px;border-radius:8px;margin:0">${escape(zprava) || '<i>(bez zprávy)</i>'}</p>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: to.split(',').map((s) => s.trim()).filter(Boolean),
      replyTo: email,
      subject: `Nová poptávka z webu — ${jmeno}`,
      text,
      html,
    });
    if (error) {
      console.error('Resend error:', error);
      return res.status(502).json({ error: 'E-mail se nepodařilo odeslat. Zkuste to prosím za chvíli znovu.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Send exception:', e);
    return res.status(500).json({ error: 'Došlo k chybě při odesílání. Zkuste to prosím znovu.' });
  }
};
