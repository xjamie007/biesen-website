"""Rechtschreibung aller vier Sprachen mit Hunspell-Wörterbüchern (Luxemburgisch von spellchecker.lu).

Vorbereitung (einmal, außerhalb des Repositorys, z. B. in /tmp/sprache):
    npm install dictionary-lb dictionary-de dictionary-fr dictionary-en
    python3 -m pip install --target py spylls
Aufruf:
    node --experimental-strip-types scripts/sprache/texte.ts > /tmp/texte.jsonl
    python3 scripts/sprache/hunspell.py /tmp/sprache /tmp/texte.jsonl lb,de,fr,en
    VORSCHLAEGE=1 …   zeigt zusätzlich Vorschläge (langsam)
Ausgabe: je Sprache die unbekannten Wörter mit Anzahl und Fundstellen. Eigennamen und zusammengesetzte
Wörter, die das Wörterbuch nicht als Ganzes kennt, tauchen hier auf und werden von Hand bewertet.
"""
import json, os, re, sys, collections
BASIS = sys.argv[1]
sys.path.insert(0, BASIS + '/py')
from spylls.hunspell import Dictionary

SPRACHEN = sys.argv[3].split(',') if len(sys.argv) > 3 else ['lb']
VORSCHLAEGE = os.environ.get('VORSCHLAEGE') == '1'
dicts = {l: Dictionary.from_files(f'{BASIS}/node_modules/dictionary-{l}/index') for l in SPRACHEN}

def saeubern(t):
    t = re.sub(r'\[(FEHLT|UNBESTÄTIGT)[^\]]*\]', ' ', t)   # interne Hinweise (immer deutsch)
    t = re.sub(r'\{[^}]*\}', ' ', t)                       # Platzhalter
    t = re.sub(r'<[^>]+>', ' ', t)                         # HTML
    t = re.sub(r'https?://\S+|\S+@\S+|www\.\S+', ' ', t)   # Adressen
    return t.replace('­', '')                         # weiches Trennzeichen

WORT = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿĀ-ž’'\-]+")
funde = collections.defaultdict(lambda: {'n': 0, 'wo': []})

def bekannt(d, s):
    return d.lookup(s) or (s[0].isupper() and d.lookup(s.lower())) or (s.isupper() and len(s) <= 5)

for zeile in open(sys.argv[2], encoding='utf8'):
    e = json.loads(zeile)
    l = e['lang']
    if l not in dicts or e['key'].startswith('slug:'):
        continue
    d = dicts[l]
    for roh in WORT.findall(saeubern(e['text'])):
        w = roh.strip("-'’").replace('’', "'")
        if len(w) < 2:
            continue
        # Apostroph: frz. l', d', qu' …; lb. d', 't; engl. 's
        if "'" in w:
            teile = [p for p in w.split("'") if len(p) > 1]
            if l == 'en':
                teile = [re.sub(r"'s$", '', w)]
        else:
            teile = [w]
        for t in teile:
            for s in ([t] if bekannt(d, t) or '-' not in t else [x for x in t.split('-') if len(x) > 1]):
                if bekannt(d, s):
                    continue
                f = funde[(l, s)]
                f['n'] += 1
                if len(f['wo']) < 3:
                    f['wo'].append(e['key'])

for l in SPRACHEN:
    liste = sorted([(s, v) for (ll, s), v in funde.items() if ll == l], key=lambda x: x[0].lower())
    print(f'=== {l}: {len(liste)} unbekannte Wörter', flush=True)
    for s, v in liste:
        vor = []
        if VORSCHLAEGE:
            for i, x in enumerate(dicts[l].suggest(s)):
                vor.append(x)
                if i >= 2:
                    break
        print(f"{s}\t{v['n']}\t{', '.join(vor)}\t{'; '.join(v['wo'])}", flush=True)
