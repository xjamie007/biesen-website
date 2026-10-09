/**
 * Anfrageformular (F) mit JavaScript:
 * - ?anliegen= wählt vor; nur die passenden bedingten Feldgruppen sind sichtbar (die anderen
 *   sind deaktiviert und werden nicht mitgeschickt); Gebäude entfällt bei Hausgerät
 * - der Hinweis unter „Beschreibung“ passt sich dem Anliegen an
 * - Prüfung vor dem Absenden: Fehler am Feld, Zusammenfassung für Screenreader, Fokus darauf
 * - gesendet wird weiter per normalem POST; die Edge Function antwortet mit 303 auf die Danke-Seite
 */
const MAX_DATEIEN = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initFormular(): void {
  const form = document.querySelector<HTMLFormElement>('[data-formular]');
  if (!form) return;
  form.noValidate = true;

  const radios = (name: string) => [...form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)];
  const gewaehlt = (name: string) => radios(name).find((r) => r.checked)?.value ?? '';
  const feld = <T extends HTMLElement>(id: string) => form.querySelector<T>(`#${id}`)!;
  const hinweis = feld<HTMLElement>('hinweis-beschreibung');
  const dateien = feld<HTMLInputElement>('dateien');
  const dateiliste = form.querySelector<HTMLUListElement>('[data-dateiliste]')!;
  const zusammenfassung = form.querySelector<HTMLElement>('[data-zusammenfassung]')!;
  const senden = form.querySelector<HTMLButtonElement>('[data-senden]')!;

  // Vorauswahl aus der Adresse (Knöpfe „Angebot anfragen“ der Leistungsseiten)
  const vorwahl = new URLSearchParams(location.search).get('anliegen');
  const passend = radios('anliegen').find((r) => r.value === vorwahl);
  if (passend) passend.checked = true;

  function sichtbarkeit() {
    const a = gewaehlt('anliegen');
    for (const g of form!.querySelectorAll<HTMLFieldSetElement>('[data-nur]')) {
      const aktiv = g.dataset.nur === a;
      g.classList.toggle('ist-aktiv', aktiv);
      g.disabled = !aktiv;
    }
    for (const g of form!.querySelectorAll<HTMLFieldSetElement>('[data-ausser]')) {
      const weg = g.dataset.ausser === a;
      g.hidden = weg;
      g.disabled = weg;
    }
    const r = radios('anliegen').find((x) => x.checked);
    hinweis.textContent = r?.dataset.hinweis ?? hinweis.dataset.hinweisStandard ?? '';
  }

  type Pruefung = { id: string; fehlerId: string; meldung: () => string | null };
  const text = (id: string) => (feld<HTMLInputElement | HTMLTextAreaElement>(id).value ?? '').trim();
  const fehlerEl = (id: string) => feld<HTMLElement>(id);

  function dateiFehler(): string | null {
    const el = fehlerEl('fehler-dateien');
    const liste = [...(dateien.files ?? [])];
    if (liste.length > MAX_DATEIEN) return el.dataset.zuViele!;
    for (const d of liste) {
      if (!(d.type.startsWith('image/') || d.type === 'application/pdf')) return el.dataset.typ!.replace('{datei}', d.name);
      if (d.size > MAX_BYTES) return el.dataset.zuGross!.replace('{datei}', d.name);
    }
    return null;
  }

  const pruefungen: Pruefung[] = [
    { id: 'feld-anliegen', fehlerId: 'fehler-anliegen', meldung: () => (gewaehlt('anliegen') ? null : fehlerEl('fehler-anliegen').dataset.text!) },
    {
      id: 'feld-gebaeude',
      fehlerId: 'fehler-gebaeude',
      meldung: () => {
        const a = gewaehlt('anliegen');
        return !a || a === 'hausgeraet' || gewaehlt('gebaeude') ? null : fehlerEl('fehler-gebaeude').dataset.text!;
      },
    },
    {
      id: 'geraet',
      fehlerId: 'fehler-geraet',
      meldung: () => (gewaehlt('anliegen') !== 'hausgeraet' || text('geraet') ? null : fehlerEl('fehler-geraet').dataset.text!),
    },
    { id: 'ortschaft', fehlerId: 'fehler-ortschaft', meldung: () => (text('ortschaft') ? null : fehlerEl('fehler-ortschaft').dataset.text!) },
    { id: 'beschreibung', fehlerId: 'fehler-beschreibung', meldung: () => (text('beschreibung') ? null : fehlerEl('fehler-beschreibung').dataset.text!) },
    { id: 'dateien', fehlerId: 'fehler-dateien', meldung: dateiFehler },
    { id: 'name', fehlerId: 'fehler-name', meldung: () => (text('name') ? null : fehlerEl('fehler-name').dataset.text!) },
    {
      id: 'email',
      fehlerId: 'fehler-email',
      meldung: () => {
        const v = text('email');
        const el = fehlerEl('fehler-email');
        return !v ? el.dataset.text! : EMAIL.test(v) ? null : el.dataset.format!;
      },
    },
    {
      id: 'feld-einwilligung',
      fehlerId: 'fehler-einwilligung',
      meldung: () =>
        form!.querySelector<HTMLInputElement>('input[name="einwilligung"]')!.checked ? null : fehlerEl('fehler-einwilligung').dataset.text!,
    },
  ];

  function zeigen(p: Pruefung, meldung: string | null) {
    const el = fehlerEl(p.fehlerId);
    const ziel = feld<HTMLElement>(p.id);
    el.hidden = !meldung;
    el.textContent = meldung ?? '';
    if (meldung) ziel.setAttribute('aria-invalid', 'true');
    else ziel.removeAttribute('aria-invalid');
  }

  function zusammenfassen(n: number) {
    if (n === 0) {
      zusammenfassung.textContent = '';
      return;
    }
    const regel = new Intl.PluralRules(document.documentElement.lang || 'de').select(n);
    const vorlage = regel === 'one' ? form!.dataset.zusammenfassungOne! : form!.dataset.zusammenfassungOther!;
    zusammenfassung.textContent = vorlage.replace('{n}', String(n));
  }

  let versucht = false;
  let gesendet = false;

  form.addEventListener('submit', (e) => {
    if (gesendet) {
      e.preventDefault();
      return;
    }
    versucht = true;
    const fehler = pruefungen.map((p) => [p, p.meldung()] as const);
    for (const [p, m] of fehler) zeigen(p, m);
    const anzahl = fehler.filter(([, m]) => m).length;
    zusammenfassen(anzahl);
    if (anzahl > 0) {
      e.preventDefault();
      zusammenfassung.focus();
      return;
    }
    gesendet = true;
    senden.textContent = form.dataset.sendet ?? senden.textContent;
    senden.setAttribute('aria-disabled', 'true');
  });

  // Nach dem ersten Versuch: Fehler verschwinden, sobald sie behoben sind
  form.addEventListener('input', aktualisieren);
  form.addEventListener('change', (e) => {
    if ((e.target as HTMLInputElement).name === 'anliegen') sichtbarkeit();
    if (e.target === dateien) zeigeDateien();
    aktualisieren();
  });

  function aktualisieren() {
    if (!versucht) return;
    const fehler = pruefungen.map((p) => [p, p.meldung()] as const);
    for (const [p, m] of fehler) {
      const el = fehlerEl(p.fehlerId);
      // nur bestehende Fehler aktualisieren, keine neuen beim Tippen aufmachen
      if (!el.hidden || !m) zeigen(p, el.hidden ? null : m);
    }
    zusammenfassen(fehler.filter(([p]) => !fehlerEl(p.fehlerId).hidden).length);
  }

  function zeigeDateien() {
    const liste = [...(dateien.files ?? [])];
    dateiliste.replaceChildren(
      ...liste.map((d) => {
        const li = document.createElement('li');
        li.textContent = `${d.name} (${(d.size / 1024 / 1024).toLocaleString(document.documentElement.lang, { maximumFractionDigits: 1 })} MB)`;
        return li;
      }),
    );
    dateiliste.hidden = liste.length === 0;
    const p = pruefungen.find((x) => x.id === 'dateien')!;
    zeigen(p, dateiFehler());
  }

  sichtbarkeit();

  // Rückleitung der Edge Function ohne JavaScript-Prüfung: ?fehler=gebaeude,geraet#fehlt
  const vomServer = (new URLSearchParams(location.search).get('fehler') ?? '').split(',').filter(Boolean);
  if (vomServer.length) {
    versucht = true;
    const zuId: Record<string, string> = { anliegen: 'feld-anliegen', gebaeude: 'feld-gebaeude', einwilligung: 'feld-einwilligung' };
    for (const name of vomServer) {
      const p = pruefungen.find((x) => x.id === (zuId[name] ?? name));
      if (p) zeigen(p, p.meldung() ?? fehlerEl(p.fehlerId).dataset.text ?? '');
    }
  }
}
