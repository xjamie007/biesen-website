/** Stellen (D4): nur `offen: true` bekommt eine Seite, Daten und einen Eintrag in der Sitemap. */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Route } from '@/i18n/config';

export type Job = CollectionEntry<'jobs'>;

export async function offeneJobs(): Promise<Job[]> {
  return (await getCollection('jobs', (j) => j.data.offen)).sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
}

export function jobRoute(j: Job): Route {
  return { page: 'job', id: j.id, slugs: j.data.pfad };
}
