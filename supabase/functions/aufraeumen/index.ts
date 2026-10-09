/**
 * Supabase Edge Function `aufraeumen`: Löschfrist der Anfragen (F, Datenschutz).
 * Täglich von pg_cron aufgerufen (siehe Migration). Löscht Anfragen, die älter sind als
 * LOESCHFRIST_MONATE und nicht als `behalten` markiert sind, samt ihren Dateien im Bucket.
 *
 *   LOESCHFRIST_MONATE  Standard 6 [FEHLT — mit dem Kunden festlegen]
 *   CRON_SECRET         muss im Header x-cron-secret mitkommen
 */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

const env = (k: string, d = '') => Deno.env.get(k) ?? d;
const MONATE = Number(env('LOESCHFRIST_MONATE', '6'));

Deno.serve(async (req) => {
  const geheim = env('CRON_SECRET');
  if (!geheim || req.headers.get('x-cron-secret') !== geheim) return new Response('Nicht erlaubt', { status: 401 });

  const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
  const grenze = new Date();
  grenze.setUTCMonth(grenze.getUTCMonth() - MONATE);

  const { data, error } = await db
    .from('anfragen')
    .select('id, dateien')
    .eq('behalten', false)
    .lt('created_at', grenze.toISOString())
    .limit(500);
  if (error) return new Response(`Fehler: ${error.message}`, { status: 500 });

  let dateien = 0;
  for (const a of data ?? []) {
    if (a.dateien?.length) {
      const { error: e } = await db.storage.from('anfragen').remove(a.dateien);
      if (e) {
        console.error('Dateien nicht gelöscht', a.id, e.message);
        continue;
      }
      dateien += a.dateien.length;
    }
    await db.from('anfragen').delete().eq('id', a.id);
  }
  const bericht = { anfragen: data?.length ?? 0, dateien, grenze: grenze.toISOString() };
  console.log('aufraeumen', bericht);
  return new Response(JSON.stringify(bericht), { headers: { 'content-type': 'application/json' } });
});
