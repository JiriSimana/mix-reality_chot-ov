# Kontaktní formulář přes Resend — návod

Formulář odesílá poptávky e-mailem přes [Resend](https://resend.com) pomocí Vercel serverless funkce
[`api/contact.js`](api/contact.js). Kód je **znovupoužitelný** — chování řídí jen 3 env proměnné,
takže na další weby stačí zkopírovat a nastavit proměnné.

---

## Jak to funguje

```
formulář na webu → fetch('/api/contact') → Vercel funkce → Resend → e-mail makléři
```

- `api/contact.js` — serverless funkce, drží tajný API klíč (jen na serveru, nikdy v prohlížeči).
- Frontend (`src/main.js`, funkce `initContactForm`) odešle data jako JSON.
- Antispam: skryté honeypot pole `website` (boti ho vyplní → zahodí se).

---

## Zprovoznění (jednorázově)

### 1) Resend účet + API klíč
1. Registrace na <https://resend.com>.
2. **API Keys → Create** → zkopíruj klíč (`re_...`).

### 2) Ověření odesílací domény ⭐
E-maily musí chodit z **ověřené domény**, jinak spadnou do spamu.
1. Resend → **Domains → Add Domain** (např. `mail.tvojedomena.cz`).
2. Resend vypíše **DNS záznamy (SPF, DKIM)** → vlož je u správce domény.
3. Počkej na ověření (status *Verified*).

> Tip: jednu vlastní doménu ověříš jednou a posílají přes ni **všechny** weby.

### 3) Env proměnné ve Vercelu
Vercel → **Project → Settings → Environment Variables** (Production i Preview):

| Název | Hodnota (příklad) |
|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` |
| `CONTACT_TO` | `jaroslav.straka@mixreality.eu` (víc adres oddělíš čárkou) |
| `CONTACT_FROM` | `Novostavba Chotěšov <noreply@mail.tvojedomena.cz>` |

Po uložení **redeploy** projektu.

### 4) Test
Odešli formulář na webu → zpráva má dorazit na `CONTACT_TO`.
Logy: Vercel → Project → **Logs** (funkce `api/contact`).

---

## Přenos na další web (Strkan, Mnichovice, Vejrty, Lisovice…)

1. Zkopíruj do nového repa:
   - `api/contact.js`
   - frontend handler `initContactForm()` z `src/main.js` (+ jeho volání v `DOMContentLoaded`)
   - formulář s `name` atributy a honeypotem z `index.html`
2. `npm install resend`
3. Ve Vercelu nastav **stejný** `RESEND_API_KEY` a **per web** `CONTACT_TO` + `CONTACT_FROM`.
4. Hotovo — doménu už máš ověřenou z prvního webu.

---

## Bezpečnost
- `RESEND_API_KEY` **nikdy do gitu** — pouze env proměnná ve Vercelu.
- Free plán Resend: 3 000 e-mailů/měsíc, 100/den, 1 doména — pro kontaktní formuláře bohatě stačí.
- Doporučeno na ostro: doplnit [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (zdarma) k honeypotu.
