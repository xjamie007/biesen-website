"""Eifeler Regel (n-Regel) im Luxemburgischen prüfen.
Aufruf (Vorbereitung wie in hunspell.py):
    python3 scripts/sprache/nregel.py /tmp/sprache /tmp/texte.jsonl
Gemeldet wird „n-zu-viel“ (n vor einem Konsonanten außer n, d, t, z, h) und „n-fehlt?“ (Form ohne n vor
Vokal oder n, d, t, z, h, wenn das Wörterbuch auch die Form mit n kennt). Platzhalter und Zahlen
(Aussprache!) sowie Wörter ohne n-Form (méi, no, Wee) erzeugen Fehlalarme; jede Stelle von Hand bewerten.
Ein End-n fällt weg vor Konsonanten außer n, d, t, z, h; es bleibt vor Vokalen, n, d, t, z, h und am Satzende.
Ob ein n beweglich ist, entscheidet das Wörterbuch: Gibt es das Wort auch ohne n, ist es beweglich."""
import json, re, sys, functools
sys.path.insert(0, sys.argv[1] + '/py')
from spylls.hunspell import Dictionary
d = Dictionary.from_files(f'{sys.argv[1]}/node_modules/dictionary-lb/index')
@functools.lru_cache(None)
def gibt(w): return d.lookup(w) or (w[:1].isupper() and d.lookup(w.lower()))
BLEIBT = set('ndtzh')
VOKAL = set('aeiouäëéèêöüyàâîôûï')
def anlaut(w):
    if re.match(r"^[dD][’']", w): return 'd'    # d’Haus klingt wie dHaus: n bleibt
    w = re.sub(r"^[’']t\b", 't', w)
    return w[:1].lower()
funde = []
for z in open(sys.argv[2], encoding='utf8'):
    e = json.loads(z)
    if e['lang'] != 'lb' or e['key'].startswith('slug:'): continue
    t = re.sub(r'\[(FEHLT|UNBESTÄTIGT)[^\]]*\]', ' . ', e['text'])
    t = re.sub(r'\{[^}]*\}', ' X ', t)
    t = re.sub(r'<[^>]+>', ' ', t)
    # Satzzeichen trennen Abschnitte (dort gilt die Regel nicht)
    for abschnitt in re.split(r'[.,;:!?()«»“”"–—/]|\s-\s', t):
        w = [x for x in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ’'\-]+|\d+", abschnitt)]
        for a, b in zip(w, w[1:]):
            if b.isdigit() or a.isdigit(): continue
            a = re.sub(r"^[dD][’']", '', a)          # d’Leeschtungen vun → Leeschtungen
            al = anlaut(b)
            if not al: continue
            if a.endswith('n') and al not in BLEIBT and al not in VOKAL:
                ohne = a[:-2] if a.endswith('nn') and gibt(a[:-2]) else a[:-1]
                if gibt(ohne) and gibt(a):
                    funde.append(('n-zu-viel', e['key'], f'{a} {b}', f'→ {ohne} {b}'))
            elif not a.endswith('n') and (al in BLEIBT or al in VOKAL) and (len(a) > 1 or a.lower() == 'a'):
                if gibt(a + 'n') and gibt(a) and a.lower() not in ('de', 'eng', 'mir', 'dir', 'hir', 'se', 'si', 'ze', 'déi', 'dee', 'wéi', 'fir', 'vir', 'nëmme', 'méi', 'no', 'wee'):
                    funde.append(('n-fehlt?', e['key'], f'{a} {b}', f'→ {a}n {b}'))
for f in funde: print('\t'.join(f))
print(f'# {len(funde)} Stellen', file=sys.stderr)
