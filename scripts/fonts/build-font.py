#!/usr/bin/env python3
"""
Baut public/fonts/schibsted-grotesk-var.woff2 aus der offiziellen variablen Datei
(github.com/schibsted/schibsted-grotesk, SIL OFL 1.1) und misst die Ausweichschrift.

  curl -L -o "fonts-src/SchibstedGrotesk[wght].ttf" \
    "https://raw.githubusercontent.com/schibsted/schibsted-grotesk/main/fonts/variable/SchibstedGrotesk%5Bwght%5D.ttf"
  python3 scripts/fonts/build-font.py

- Subset (C2): Basic Latin, Latin-1 Supplement, Latin Extended-A
  plus „ “ ” ‚ ‘ ’ – — … €
- Gewichtsachse bleibt 400–900, nur aufrecht.
- tnum wirkt nur auf Ziffern, nicht auf Doppelpunkt und Satzzeichen (sonst „08 : 00“).
- Schibsted Grotesk hat kein schmales geschütztes Leerzeichen (U+202F) und keinen
  geschützten Bindestrich (U+2011). Beide werden auf vorhandene Glyphen gelegt
  (space, hyphen), damit für die französische Typografie und die Faxnummer
  keine Ausweichschrift einspringt.
- Ausweichschrift: Arial (Regular für Fließtext, Bold für Überschriften) wird mit
  size-adjust, ascent-override und descent-override auf Schibsted Grotesk angeglichen.
  Die Werte landen in scripts/fonts/fallback.json und werden von Hand in src/styles/global.css übernommen.
"""
import json
import os
import subprocess
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'fonts-src' / 'SchibstedGrotesk[wght].ttf'
TMP = ROOT / 'fonts-src' / 'schibsted-sub.ttf'
OUT = ROOT / 'src' / 'assets' / 'fonts' / 'schibsted-grotesk-var.woff2'
METRICS = ROOT / 'scripts' / 'fonts' / 'fallback.json'

UNICODES = ','.join([
    'U+0020-007E',  # Basic Latin
    'U+00A0-00FF',  # Latin-1 Supplement
    'U+0100-017F',  # Latin Extended-A
    'U+2013-2014',  # – —
    'U+2018-201A',  # ‘ ’ ‚
    'U+201C-201E',  # “ ” „
    'U+2026',       # …
    'U+20AC',       # €
])

subprocess.run([
    'pyftsubset', str(SRC), f'--output-file={TMP}',
    f'--unicodes={UNICODES}',
    '--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk,case,tnum,pnum',
    '--no-hinting', '--desubroutinize',
], check=True)

font = TTFont(TMP)

# Tabellenziffern (tnum) nur für Ziffern: Schibsted Grotesk setzt sonst auch Doppelpunkt,
# Punkt, Komma und Semikolon auf Ziffernbreite („08 : 00“). Uhrzeiten sollen eng bleiben.
gsub = font['GSUB'].table
for rec in gsub.FeatureList.FeatureRecord:
    if rec.FeatureTag != 'tnum':
        continue
    for index in rec.Feature.LookupListIndex:
        for sub in gsub.LookupList.Lookup[index].SubTable:
            mapping = getattr(sub, 'mapping', None)
            if mapping:
                for name in ('colon', 'semicolon', 'period', 'comma'):
                    mapping.pop(name, None)

cmap = font.getBestCmap()
space, hyphen = cmap[0x20], cmap[0x2D]
for table in font['cmap'].tables:
    if table.isUnicode():
        table.cmap[0x202F] = space   # schmales geschütztes Leerzeichen (Französisch)
        table.cmap[0x2011] = hyphen  # geschützter Bindestrich (95 80 99‑99)
font.flavor = 'woff2'
font.save(OUT)
feats = {fr.FeatureTag for fr in font['GSUB'].table.FeatureList.FeatureRecord}
print(f'{OUT.name}: {os.path.getsize(OUT)} Bytes, tnum: {"tnum" in feats}, case: {"case" in feats}')

# ---------------------------------------------------------------------------
# Ausweichschrift vermessen
# ---------------------------------------------------------------------------
SAMPLE = (
    'Strom und Licht für Haus, Hof und Betrieb. Wir sind ein Elektrobetrieb mit 26 Leuten in Noutem. '
    'Électricité et lumière pour maison, ferme et entreprise. Nous réalisons l’électricité des maisons. '
    'Electricity and light for homes, farms and businesses. Rufft eis un: 95 80 99'
)
ARIAL = Path('/System/Library/Fonts/Supplemental/Arial.ttf')
ARIAL_BOLD = Path('/System/Library/Fonts/Supplemental/Arial Bold.ttf')


def width(f: TTFont, text: str) -> float:
    cm = f.getBestCmap()
    upm = f['head'].unitsPerEm
    total = 0
    for ch in text:
        g = cm.get(ord(ch))
        if g is None:
            g = cm[0x20]
        total += f['hmtx'][g][0]
    return total / upm


def metrics(weight: int, arial_path: Path) -> dict:
    var = TTFont(SRC)
    inst = instancer.instantiateVariableFont(var, {'wght': weight}) if weight != 400 else var
    upm = inst['head'].unitsPerEm
    asc = inst['hhea'].ascent / upm
    desc = abs(inst['hhea'].descent) / upm
    arial = TTFont(arial_path)
    size_adjust = width(inst, SAMPLE) / width(arial, SAMPLE)
    return {
        'sizeAdjust': f'{size_adjust * 100:.2f}%',
        'ascentOverride': f'{asc / size_adjust * 100:.2f}%',
        'descentOverride': f'{desc / size_adjust * 100:.2f}%',
        'lineGapOverride': '0%',
    }


result = {'regular': metrics(400, ARIAL), 'bold': metrics(800, ARIAL_BOLD)}
METRICS.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
