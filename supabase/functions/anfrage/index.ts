/**
 * Supabase Edge Function `anfrage` (F, Region EU).
 *
 * Nimmt das Anfrageformular per normalem POST (multipart/form-data) entgegen, ohne JavaScript im Browser:
 *  1. Honeypot `website` gefüllt → still auf die Danke-Seite, nichts speichern
 *  2. Prüfung je nach Anliegen (lib.ts); bei Fehlern 303 zurück zum Formular (?fehler=…#fehlt).
 *     Eine eigene HTML-Fehlerseite geht nicht: Supabase liefert HTML nur mit eigener Domain aus.
 *  3. Rate-Limit über einen gesalzenen Hash der IP (24 Stunden)
 *  4. Dateien in den privaten Bucket `anfragen`, Anfrage in die Tabelle `anfragen`
 *  5. Mail an FORM_RECIPIENT mit zeitlich begrenzten Links auf die Dateien (keine Anhänge);
 *     scheitert die Mail, bleibt die Anfrage gespeichert (mail_status = fehler)
 *  6. 303 auf die Danke-Seite der Sprache
 *
 * Umgebungsvariablen (supabase secrets set …), nie im Frontend:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   setzt Supabase selbst
 *   SITE_URL          https://electricite-biesen.lu (ohne Schrägstrich am Ende, mit BASE_PATH falls nötig)
 *   FORM_RECIPIENT    Empfänger der Anfragen [UNBESTÄTIGT — wer liest]
 *   MAIL_PROVIDER     brevo | scaleway | log  (EU-Anbieter [mit Nave klären]; log = nur ins Protokoll)
 *   MAIL_API_KEY      Schlüssel des Mailanbieters
 *   MAIL_FROM         z. B. "Website Electricité Biesen <website@biesen.lu>"
 *   SCALEWAY_PROJECT_ID  nur bei scaleway
 *   IP_HASH_SALT      zufälliger Wert
 *   LINK_TAGE         Gültigkeit der Datei-Links in Tagen (Standard 30)
 *   RATE_LIMIT        Anfragen pro IP und 24 h (Standard 10)
 *   ANFRAGE_DRY_RUN   1 = nichts speichern, keine Mail (lokaler Test)
 */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { betreff, DANKE, fehlerZiel, istSprache, mailText, pruefe, sichererName, type Datei } from './lib.ts';

const env = (k: string, d = '') => Deno.env.get(k) ?? d;
const SITE_URL = env('SITE_URL', 'https://electricite-biesen.lu').replace(/\/+$/, '');
const BUCKET = 'anfragen';
const LINK_TAGE = Number(env('LINK_TAGE', '30'));
const RATE_LIMIT = Number(env('RATE_LIMIT', '10'));
const DRY = env('ANFRAGE_DRY_RUN') === '1';

const db = DRY ? null : createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });

const weiter = (ziel: string) => new Response(null, { status: 303, headers: { Location: ziel } });

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sendeMail(opts: { betreff: string; text: string; antwortAn: string }): Promise<void> {
  const anbieter = env('MAIL_PROVIDER', 'log');
  const an = env('FORM_RECIPIENT');
  const von = env('MAIL_FROM');
  if (anbieter === 'log' || !an) {
    console.log(`[mail:${anbieter}] an ${an || '(FORM_RECIPIENT fehlt)'}: ${opts.betreff}\n${opts.text}`);
    return;
  }
  const m = von.match(/^(.*)<(.+)>$/);
  const vonName = m ? m[1].trim().replace(/^"|"$/g, '') : 'Website Electricité Biesen';
  const vonAdresse = m ? m[2].trim() : von;
  let res: Response;
  if (anbieter === 'brevo') {
    res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': env('MAIL_API_KEY'), 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: vonName, email: vonAdresse },
        to: [{ email: an }],
        replyTo: { email: opts.antwortAn },
        subject: opts.betreff,
        textContent: opts.text,
      }),
    });
  } else if (anbieter === 'scaleway') {
    res = await fetch('https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails', {
      method: 'POST',
      headers: { 'X-Auth-Token': env('MAIL_API_KEY'), 'content-type': 'application/json' },
      body: JSON.stringify({
        from: { email: vonAdresse, name: vonName },
        to: [{ email: an }],
        subject: opts.betreff,
        text: opts.text,
        project_id: env('SCALEWAY_PROJECT_ID'),
        additional_headers: [{ key: 'Reply-To', value: opts.antwortAn }],
      }),
    });
  } else {
    throw new Error(`Unbekannter MAIL_PROVIDER ${anbieter}`);
  }
  if (!res.ok) throw new Error(`Mail ${anbieter}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return weiter(`${SITE_URL}/fr/contact/#technisch`);
  }

  const felder: Record<string, string> = {};
  const dateien: File[] = [];
  for (const [k, v] of form.entries()) {
    if (typeof v === 'string') felder[k] = v;
    else if (k === 'dateien' && v.size > 0) dateien.push(v);
  }
  const sprache = istSprache(felder.sprache) ? felder.sprache : 'fr';

  // Honeypot: Bots bekommen dieselbe Antwort wie Menschen, gespeichert wird nichts
  if (felder.website) return weiter(`${SITE_URL}${DANKE[sprache]}`);

  const info: Datei[] = dateien.map((d) => ({ name: d.name, type: d.type, size: d.size }));
  const p = pruefe(felder, info);
  if (!p.ok) return weiter(fehlerZiel(SITE_URL, p.sprache, p.felder));
  const a = p.anfrage;

  const kennung = crypto.randomUUID();
  const titel = betreff(a);

  if (DRY) {
    const links = info.map((d, i) => ({ name: d.name, url: `(Probelauf) ${BUCKET}/${sichererName(d.name, i)}` }));
    console.log(`[probelauf] ${titel}\n${mailText(a, links, LINK_TAGE, new Date(), kennung)}`);
    return weiter(`${SITE_URL}${DANKE[sprache]}`);
  }

  try {
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unbekannt';
    const ipHash = await sha256(`${env('IP_HASH_SALT')}|${ip}`);
    const seit = new Date(Date.now() - 24 * 3_600_000).toISOString();
    const { count, error: zaehlFehler } = await db!
      .from('anfrage_rate')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', seit);
    if (zaehlFehler) throw zaehlFehler;
    if ((count ?? 0) >= RATE_LIMIT) return weiter(`${SITE_URL}${DANKE[sprache].replace(/[^/]+\/$/, '')}#zu-viele`);
    await db!.from('anfrage_rate').insert({ ip_hash: ipHash });

    // Dateien in den privaten Bucket: JJJJ/MM/<kennung>/<n>-<name>
    const monat = new Date().toISOString().slice(0, 7).replace('-', '/');
    const pfade: string[] = [];
    for (const [i, d] of dateien.entries()) {
      const pfad = `${monat}/${kennung}/${sichererName(d.name, i)}`;
      const { error } = await db!.storage.from(BUCKET).upload(pfad, d, { contentType: d.type || 'application/octet-stream', upsert: false });
      if (error) throw error;
      pfade.push(pfad);
    }

    const { error: speicherFehler } = await db!.from('anfragen').insert({
      id: kennung,
      sprache: a.sprache,
      anliegen: a.anliegen,
      ortschaft: a.ortschaft,
      name: a.name,
      email: a.email,
      telefon: a.telefon,
      betreff: titel,
      daten: a,
      dateien: pfade,
    });
    if (speicherFehler) throw speicherFehler;

    try {
      let links: { name: string; url: string }[] = [];
      if (pfade.length) {
        const { data, error } = await db!.storage.from(BUCKET).createSignedUrls(pfade, LINK_TAGE * 86_400);
        if (error) throw error;
        links = (data ?? []).map((x, i) => ({ name: dateien[i].name, url: x.signedUrl ?? '(Link konnte nicht erzeugt werden)' }));
      }
      await sendeMail({ betreff: titel, text: mailText(a, links, LINK_TAGE, new Date(), kennung), antwortAn: a.email });
      await db!.from('anfragen').update({ mail_status: 'gesendet' }).eq('id', kennung);
    } catch (mailFehler) {
      console.error('Mail fehlgeschlagen, Anfrage bleibt gespeichert', mailFehler);
      await db!
        .from('anfragen')
        .update({ mail_status: 'fehler', mail_fehler: String((mailFehler as Error).message).slice(0, 500) })
        .eq('id', kennung);
    }
    return weiter(`${SITE_URL}${DANKE[sprache]}`);
  } catch (err) {
    console.error('anfrage', err);
    return weiter(`${SITE_URL}${DANKE[sprache].replace(/[^/]+\/$/, '')}#technisch`);
  }
});
