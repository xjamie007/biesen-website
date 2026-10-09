/**
 * Effekte nach dem Vorbild der Nave-Website (nave-website/assets/js/main.js), angepasst an Biesen:
 * - Höhe des Kopfs als CSS-Variable --kopf-ist, damit die Sprungleiste genau darunter klebt
 * - Sprungleiste: zeigt, in welchem Abschnitt man gerade ist, und rückt den Chip ins Bild
 *   (wie die lokale Navigation bei Nave und die Leiste unter dem Kopf bei Apple)
 * - gestapelte Karten: die untere wird kleiner und etwas dunkler, wenn die nächste darüberrutscht
 * - Lichtpunkt unter dem Mauszeiger auf Kacheln und Karten, magnetische Hauptknöpfe (nur Maus)
 * Was am Scrollen hängt, läuft gesammelt in einem requestAnimationFrame. Bei reduzierter Bewegung
 * bleiben nur Kopfhöhe und Sprungleiste. Effekte, die mit CSS allein gehen (Hero beim Scrollen,
 * Überschrift, Aufleuchten, Zähler), stehen in global.css.
 */
const RUHIG = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAUS = matchMedia('(hover: hover) and (pointer: fine)').matches;
const klemmen = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function initEffekte(): void {
  const aufgaben: (() => void)[] = [];
  let geplant = false;
  const beimScrollen = () => {
    if (geplant) return;
    geplant = true;
    requestAnimationFrame(() => {
      geplant = false;
      for (const a of aufgaben) a();
    });
  };

  // Kopfhöhe: der Kopf wird beim Scrollen flacher, die Sprungleiste rückt mit
  const kopf = document.querySelector<HTMLElement>('.kopf');
  if (kopf && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      document.documentElement.style.setProperty('--kopf-ist', `${Math.round(kopf.getBoundingClientRect().height)}px`);
    }).observe(kopf);
  }

  // Sprungleiste: der Chip des Abschnitts, in dem man gerade ist, ist gefüllt
  for (const leiste of document.querySelectorAll<HTMLElement>('[data-sprungleiste]')) {
    const links = [...leiste.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const ziele = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
    const liste = leiste.querySelector<HTMLElement>('ul');
    let aktiv: HTMLAnchorElement | null = null;
    aufgaben.push(() => {
      const linie = leiste.getBoundingClientRect().bottom + 80;
      let i = -1;
      ziele.forEach((z, j) => {
        if (z && z.getBoundingClientRect().top <= linie) i = j;
      });
      const letztes = ziele[ziele.length - 1];
      if (letztes && letztes.getBoundingClientRect().bottom < linie) i = -1;
      const link = links[i] ?? null;
      if (link === aktiv) return;
      aktiv?.removeAttribute('aria-current');
      aktiv = link;
      if (!link || !liste || liste.scrollWidth <= liste.clientWidth + 1) {
        link?.setAttribute('aria-current', 'true');
        return;
      }
      link.setAttribute('aria-current', 'true');
      const l = liste.getBoundingClientRect();
      const c = link.getBoundingClientRect();
      liste.scrollTo({ left: liste.scrollLeft + c.left + c.width / 2 - (l.left + l.width / 2), behavior: RUHIG ? 'auto' : 'smooth' });
    });
  }

  // Gestapelte Karten: wie weit ist die nächste schon über die aktuelle gerutscht? (0 … 1)
  if (!RUHIG) {
    for (const stapel of document.querySelectorAll<HTMLElement>('[data-stapel]')) {
      const karten = [...stapel.children] as HTMLElement[];
      aufgaben.push(() => {
        if (getComputedStyle(karten[0]).position !== 'sticky') return;
        karten.forEach((k, i) => {
          const naechste = karten[i + 1];
          if (!naechste) return;
          const abstand = naechste.getBoundingClientRect().top - k.getBoundingClientRect().top;
          k.style.setProperty('--sp', klemmen(1 - abstand / k.offsetHeight, 0, 1).toFixed(3));
        });
      });
    }
  }

  if (MAUS && !RUHIG) {
    // Lichtpunkt unter dem Mauszeiger
    document.addEventListener(
      'pointermove',
      (e) => {
        const el = (e.target as Element).closest?.<HTMLElement>('[data-licht], .karte');
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      },
      { passive: true },
    );

    // Magnetische Hauptknöpfe: folgen dem Mauszeiger ein Stück
    for (const k of document.querySelectorAll<HTMLElement>('.knopf--gross:not(.knopf--hell), .nav__aktion')) {
      k.addEventListener('pointermove', (e) => {
        const r = k.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.2;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        k.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      });
      k.addEventListener('pointerleave', () => {
        k.style.translate = '';
      });
    }
  }

  if (aufgaben.length) {
    addEventListener('scroll', beimScrollen, { passive: true });
    addEventListener('resize', beimScrollen);
    beimScrollen();
  }
}
