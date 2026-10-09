/**
 * Regler der Fotopaare (C6): setzt --abend (0 bis 1) als Deckkraft des Abendbildes und
 * aria-valuetext („Tag“, „Abend“, sonst „Übergang, 40 Prozent“). Keine erfundenen Uhrzeiten.
 * Pfeiltasten, Bild auf/ab, Pos1 und Ende bedient das native <input type="range">.
 */
export function initRegler(): void {
  for (const fig of document.querySelectorAll<HTMLElement>('[data-regler]')) {
    const input = fig.querySelector<HTMLInputElement>('input[type="range"]');
    const stapel = fig.querySelector<HTMLElement>('.regler__stapel');
    if (!input || !stapel || fig.classList.contains('regler--aktiv')) continue;
    const { tag = '', abend = '', uebergang = '' } = input.dataset;
    const setzen = () => {
      const w = Number(input.value);
      stapel.style.setProperty('--abend', String(w / 100));
      input.setAttribute('aria-valuetext', w <= 0 ? tag : w >= 100 ? abend : uebergang.replace('{wert}', String(w)));
    };
    input.addEventListener('input', setzen);
    fig.classList.add('regler--aktiv');
    input.parentElement!.hidden = false;
    setzen();
  }
}
