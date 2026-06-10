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
//   BRAND_NAME        — jméno projektu do podpisu (jinak se vezme z CONTACT_FROM)
//   AUTOREPLY_SUBJECT — předmět poděkování (jinak "Děkujeme za Vaši zprávu — <BRAND>")
//   AUTOREPLY_TEXT    — úvodní odstavec poděkování (jinak rozumný default)
//   BROKER_NAME / BROKER_PHONE / BROKER_EMAIL — kontakt do podpisu (BROKER_EMAIL jinak = první CONTACT_TO)
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
    const sig = [brand, brokerName, brokerPhone, brokerEmail].filter(Boolean);

    const arText = [
      `Dobrý den ${jmeno},`,
      '',
      intro,
      ...(zprava ? ['', 'Vaše zpráva:', zprava] : []),
      '',
      'S pozdravem,',
      ...sig,
    ].join('\n');

    const arHtml = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222;line-height:1.6">
      <p>Dobrý den ${escape(jmeno)},</p>
      <p>${escape(intro)}</p>
      ${zprava ? `<p style="color:#6b7280;margin:0 0 4px">Vaše zpráva:</p><p style="white-space:pre-wrap;background:#f5f7ff;border:1px solid #e0e7ff;padding:12px;border-radius:8px;margin:0 0 16px">${escape(zprava)}</p>` : ''}
      <p style="margin:16px 0 0">S pozdravem,<br>
        <b>${escape(brand)}</b>${brokerName ? `<br>${escape(brokerName)}` : ''}${brokerPhone ? `<br>${escape(brokerPhone)}` : ''}${brokerEmail ? `<br><a href="mailto:${escape(brokerEmail)}">${escape(brokerEmail)}</a>` : ''}
      </p>
    </div>`;

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
