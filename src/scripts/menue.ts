/**
 * Menü (C4, C7):
 * - mobil: Fläche in Weiß, Fokusfalle, Schließen per Escape und Knopf, Fokus zurück auf „Menü“
 * - ab 768 px: „Leistungen“ klappt die fünf Leistungsseiten auf (Escape, Klick daneben, Fokus verlässt das Menü)
 */
const DESKTOP = '(min-width: 48rem)';

export function initMenue(): void {
  const nav = document.getElementById('navigation');
  const auf = document.querySelector<HTMLButtonElement>('[data-menue-auf]');
  const zu = document.querySelector<HTMLButtonElement>('[data-menue-zu]');
  if (!nav || !auf || !zu) return;

  const draussen = () => [
    document.querySelector('.topbar'),
    document.querySelector('main'),
    document.querySelector('footer'),
    document.querySelector('.kopf__zeile > .kopf__logo'),
    document.querySelector('.kopf__mobil'),
  ];

  const fokussierbar = () =>
    [...nav.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
      (el) => el.offsetParent !== null && el.tabIndex !== -1,
    );

  function oeffnen() {
    nav!.classList.add('ist-offen');
    auf!.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    for (const el of draussen()) el?.setAttribute('inert', '');
    zu!.focus();
  }

  function schliessen(fokus = true) {
    if (!nav!.classList.contains('ist-offen')) return;
    nav!.classList.remove('ist-offen');
    auf!.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    for (const el of draussen()) el?.removeAttribute('inert');
    if (fokus) auf!.focus();
  }

  auf.addEventListener('click', oeffnen);
  zu.addEventListener('click', () => schliessen());

  nav.addEventListener('keydown', (e) => {
    if (!nav.classList.contains('ist-offen')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      schliessen();
      return;
    }
    if (e.key !== 'Tab') return;
    const liste = fokussierbar();
    if (liste.length === 0) return;
    const erstes = liste[0];
    const letztes = liste[liste.length - 1];
    if (e.shiftKey && document.activeElement === erstes) {
      e.preventDefault();
      letztes.focus();
    } else if (!e.shiftKey && document.activeElement === letztes) {
      e.preventDefault();
      erstes.focus();
    }
  });

  // Links im mobilen Menü (auch Anker auf derselben Seite) schließen die Fläche
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a') && nav.classList.contains('ist-offen')) schliessen(false);
  });

  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener('change', () => {
    if (mq.matches) schliessen(false);
    untermenueZu(false);
  });

  // ---- Untermenü „Leistungen“ ----
  const knopf = nav.querySelector<HTMLButtonElement>('[data-untermenue]');
  const unter = document.getElementById('nav-leistungen');
  if (!knopf || !unter) return;

  // Mobil ist die Liste in der Fläche immer offen; ab 1024 px klappt sie auf
  const sync = () => {
    if (mq.matches) unter.hidden = knopf.getAttribute('aria-expanded') !== 'true';
    else unter.hidden = false;
  };
  sync();
  mq.addEventListener('change', sync);

  function untermenueZu(fokus: boolean) {
    if (knopf!.getAttribute('aria-expanded') !== 'true') return;
    knopf!.setAttribute('aria-expanded', 'false');
    sync();
    if (fokus) knopf!.focus();
  }

  knopf.addEventListener('click', () => {
    const offen = knopf.getAttribute('aria-expanded') === 'true';
    knopf.setAttribute('aria-expanded', String(!offen));
    sync();
  });

  unter.parentElement!.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mq.matches) untermenueZu(true);
  });

  document.addEventListener('click', (e) => {
    if (mq.matches && !unter.parentElement!.contains(e.target as Node)) untermenueZu(false);
  });

  unter.parentElement!.addEventListener('focusout', (e) => {
    const ziel = e.relatedTarget as Node | null;
    if (mq.matches && ziel && !unter.parentElement!.contains(ziel)) untermenueZu(false);
  });
}
