-- Anfragen der Website (F). Region: EU (beim Anlegen des Projekts wählen, z. B. Frankfurt).
-- Zugriff nur über den Service-Role-Schlüssel der Edge Functions; RLS ohne Policies sperrt alles andere.

create table if not exists public.anfragen (
  id uuid primary key,
  created_at timestamptz not null default now(),
  sprache text not null check (sprache in ('fr', 'de', 'lb', 'en')),
  anliegen text not null check (anliegen in ('neubau', 'renovierung', 'licht', 'photovoltaik', 'ladestation', 'sicherheit', 'hausgeraet', 'anderes')),
  ortschaft text not null,
  name text not null,
  email text not null,
  telefon text,
  betreff text not null,
  daten jsonb not null,
  dateien text[] not null default '{}',
  mail_status text not null default 'offen' check (mail_status in ('offen', 'gesendet', 'fehler')),
  mail_fehler text,
  -- Von Hand auf true setzen, wenn aus der Anfrage ein Auftrag wird: dann löscht der Cron-Job sie nicht
  behalten boolean not null default false
);
create index if not exists anfragen_created_at_idx on public.anfragen (created_at);
alter table public.anfragen enable row level security;

-- Rate-Limit: nur ein gesalzener SHA-256-Hash der IP, 24 Stunden
create table if not exists public.anfrage_rate (
  id bigserial primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists anfrage_rate_hash_idx on public.anfrage_rate (ip_hash, created_at);
alter table public.anfrage_rate enable row level security;

-- Privater Bucket für Pläne und Fotos: höchstens 10 MB je Datei, nur Bilder und PDF
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('anfragen', 'anfragen', false, 10485760, array['image/*', 'application/pdf'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Löschfrist [FEHLT — mit dem Kunden festlegen, Vorschlag: 6 Monate, wenn kein Auftrag entsteht]
-- Dateien lassen sich nicht per SQL löschen (Storage-API nötig). Deshalb ruft pg_cron täglich die
-- Edge Function `aufraeumen` auf. Vorher im Supabase-Dashboard (SQL Editor) zwei Geheimnisse anlegen:
--   select vault.create_secret('https://<ref>.supabase.co', 'biesen_projekt_url');
--   select vault.create_secret('<CRON_SECRET>', 'biesen_cron_secret');
-- und dasselbe CRON_SECRET als Secret der Function setzen (siehe README).
-- ---------------------------------------------------------------------------
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

create or replace function public.biesen_aufraeumen()
returns bigint
language sql
security definer
set search_path = public, extensions
as $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'biesen_projekt_url') || '/functions/v1/aufraeumen',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'biesen_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
$$;
revoke all on function public.biesen_aufraeumen() from public, anon, authenticated;

-- Täglich um 03:23 UTC: abgelaufene Anfragen samt Dateien löschen
select cron.schedule('biesen-aufraeumen', '23 3 * * *', $$ select public.biesen_aufraeumen() $$);

-- Alle 30 Minuten: IP-Hashes älter als 24 Stunden löschen
select cron.schedule(
  'biesen-anfrage-rate',
  '*/30 * * * *',
  $$ delete from public.anfrage_rate where created_at < now() - interval '24 hours' $$
);
