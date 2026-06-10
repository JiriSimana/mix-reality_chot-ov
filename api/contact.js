// Vercel serverless funkce — kontaktní formulář přes Resend.
// Znovupoužitelné napříč weby: chování řídí pouze env proměnné, kód se nemění.
//
// POVINNÉ env proměnné (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   — API klíč z resend.com (re_...)
//   CONTACT_TO       — kam chodí poptávky (víc adres oddělíš čárkou)
//   CONTACT_FROM     — odesílatel z OVĚŘENÉ domény, např: "Novostavba Chotěšov <noreply@send.smartcase.cz>"
//
// VOLITELNÉ — auto-odpověď návštěvníkovi ("Děkujeme za vyplnění"):
//   AUTOREPLY         — "on" zapne auto-odpověď (jinak vypnuto)
//   BRAND_NAME        — jméno projektu v hlavičce/podpisu (jinak se vezme z CONTACT_FROM)
//   AUTOREPLY_SUBJECT — předmět poděkování
//   AUTOREPLY_TEXT    — úvodní odstavec poděkování
//   BROKER_NAME / BROKER_PHONE / BROKER_EMAIL — kontakt do podpisu (BROKER_EMAIL jinak = první CONTACT_TO)
//   AUTOREPLY_IMAGE   — URL obrázku do hlavičky e-mailu (např. vizualizace projektu)
//   SITE_URL          — odkaz pro tlačítko v e-mailu (když nastaveno, zobrazí se CTA)
//   AUTOREPLY_CTA     — text tlačítka (default "Zobrazit web")
//   BRAND_COLOR       — hex barva značky (default #1d4ed8)
//
// API klíč NIKDY necommituj do gitu — jen jako env proměnnou.

const { Resend } = require('resend');

const escape = (v) => String(v == null ? '' : v).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));
const truthy = (v) => /^(1|true|on|yes|ano)$/i.test(String(v || '').trim());

// "Brand <addr@dom>" → "Brand"
function brandFromFrom(from) {
  const m = String(from || '').match(/^\s*"?([^"<]+?)"?\s*</);
  return m ? m[1].trim() : '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const { jmeno, email, telefon, zprava, hypoteka, website } = body;

  if (website) return res.status(200).json({ ok: true });                          // honeypot
  if (!jmeno || !String(jmeno).trim()) return res.status(400).json({ error: 'Vyplňte prosím jméno.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'Zadejte prosím platný e-mail.' });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !to || !from) {
    console.error('Chybí env proměnné RESEND_API_KEY / CONTACT_TO / CONTACT_FROM.');
    return res.status(500).json({ error: 'Formulář zatím není nakonfigurován. Kontaktujte nás prosím telefonicky nebo e-mailem.' });
  }

  const resend = new Resend(apiKey);
  const toList = to.split(',').map((s) => s.trim()).filter(Boolean);

  // ── 1) Notifikace makléři ──────────────────────────────────────
  const notifyText = [
    `Jméno: ${jmeno}`,
    `E-mail: ${email}`,
    `Telefon: ${telefon || '—'}`,
    `Financování hypotékou: ${hypoteka ? 'ANO — má zájem o informace' : 'ne'}`,
    '',
    'Zpráva:',
    zprava || '(bez zprávy)',
  ].join('\n');

  const notifyHtml = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222;line-height:1.5">
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
      to: toList,
      replyTo: email,
      subject: `Nová poptávka z webu — ${jmeno}`,
      text: notifyText,
      html: notifyHtml,
    });
    if (error) {
      console.error('Resend (notifikace) error:', error);
      return res.status(502).json({ error: 'E-mail se nepodařilo odeslat. Zkuste to prosím za chvíli znovu.' });
    }
  } catch (e) {
    console.error('Notifikace exception:', e);
    return res.status(500).json({ error: 'Došlo k chybě při odesílání. Zkuste to prosím znovu.' });
  }

  // ── 2) Auto-odpověď návštěvníkovi (volitelné) ──────────────────
  // Selhání auto-odpovědi NEsmí shodit request — hlavní e-mail makléři už odešel.
  if (truthy(process.env.AUTOREPLY)) {
    const brand = process.env.BRAND_NAME || brandFromFrom(from) || 'Náš tým';
    const subject = process.env.AUTOREPLY_SUBJECT || `Děkujeme za Vaši zprávu — ${brand}`;
    const intro = process.env.AUTOREPLY_TEXT || 'děkujeme za Vaši zprávu. Obdrželi jsme ji a co nejdříve se Vám ozveme.';
    const brokerName = process.env.BROKER_NAME || '';
    const brokerPhone = process.env.BROKER_PHONE || '';
    const brokerEmail = process.env.BROKER_EMAIL || toList[0];
    const brandColor = process.env.BRAND_COLOR || '#1d4ed8';
    const image = process.env.AUTOREPLY_IMAGE || '';
    const siteUrl = process.env.SITE_URL || '';
    const ctaLabel = process.env.AUTOREPLY_CTA || 'Zobrazit web';
    const phoneLink = brokerPhone ? brokerPhone.replace(/[^0-9+]/g, '') : '';
    const sig = [brand, brokerName, brokerPhone, brokerEmail].filter(Boolean);

    // Plain-text varianta (pro klienty bez HTML)
    const arText = [
      `Dobrý den ${jmeno},`,
      '',
      intro,
      ...(zprava ? ['', 'Vaše zpráva:', zprava] : []),
      ...(siteUrl ? ['', `${ctaLabel}: ${siteUrl}`] : []),
      '',
      'S pozdravem,',
      ...sig,
    ].join('\n');

    // HTML varianta — tabulkový layout + inline styly (kompatibilní s e-mail klienty)
    const arHtml = `<!DOCTYPE html><html lang="cs"><body style="margin:0;padding:0;background:#f4f5f7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
      ${image ? `<tr><td style="padding:0;"><img src="${image}" width="600" alt="${escape(brand)}" style="display:block;width:100%;height:auto;border:0;"></td></tr>` : ''}
      <tr><td style="background:${brandColor};padding:18px 32px;">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;">${escape(brand)}</span>
      </td></tr>
      <tr><td style="padding:32px;color:#2c2c2c;font-size:16px;line-height:1.6;">
        <p style="margin:0 0 16px;">Dobrý den <b>${escape(jmeno)}</b>,</p>
        <p style="margin:0 0 20px;">${escape(intro)}</p>
        ${zprava ? `<p style="margin:0 0 6px;color:#6b7280;font-size:14px;">Vaše zpráva:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#f5f7ff;border-left:3px solid ${brandColor};border-radius:6px;padding:14px 16px;color:#374151;font-size:15px;white-space:pre-wrap;">${escape(zprava)}</td></tr></table>` : ''}
        ${siteUrl ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;"><tr><td style="border-radius:8px;background:${brandColor};">
          <a href="${escape(siteUrl)}" style="display:inline-block;padding:13px 30px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;border-radius:8px;">${escape(ctaLabel)} &rarr;</a>
        </td></tr></table>` : ''}
      </td></tr>
      <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eceef1;margin:0;"></td></tr>
      <tr><td style="padding:24px 32px;color:#2c2c2c;font-size:15px;line-height:1.5;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">S pozdravem,</p>
        <p style="margin:0;font-weight:bold;font-size:16px;">${escape(brand)}</p>
        ${brokerName ? `<p style="margin:6px 0 0;">${escape(brokerName)}</p>` : ''}
        ${brokerPhone ? `<p style="margin:3px 0 0;"><a href="tel:${escape(phoneLink)}" style="color:${brandColor};text-decoration:none;">${escape(brokerPhone)}</a></p>` : ''}
        ${brokerEmail ? `<p style="margin:3px 0 0;"><a href="mailto:${escape(brokerEmail)}" style="color:${brandColor};text-decoration:none;">${escape(brokerEmail)}</a></p>` : ''}
      </td></tr>
      <tr><td style="background:#f4f5f7;padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px;line-height:1.5;">
        Toto je automatické potvrzení o přijetí Vaší zprávy. Brzy se Vám ozveme.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

    try {
      const { error } = await resend.emails.send({
        from,
        to: email,
        replyTo: brokerEmail,
        subject,
        text: arText,
        html: arHtml,
      });
      if (error) console.error('Resend (auto-odpověď) error:', error);
    } catch (e) {
      console.error('Auto-odpověď exception:', e);
    }
  }

  return res.status(200).json({ ok: true });
};
