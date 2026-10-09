#!/usr/bin/env python3
"""
Favicon (G2) bis zur Vektordatei des Logos: ein „B“ in Weiß auf Noutem-Blau, aus Schibsted Grotesk 800
als Pfad (damit es ohne Schrift funktioniert). Schreibt public/favicon.svg.
Sobald das Logo als Vektor da ist: den gelben Blitz auf Noutem-Blau verwenden (siehe README).
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parents[2]
font = instancer.instantiateVariableFont(TTFont(ROOT / 'fonts-src' / 'SchibstedGrotesk[wght].ttf'), {'wght': 800})
gs = font.getGlyphSet()
name = font.getBestCmap()[ord('B')]
bp = BoundsPen(gs)
gs[name].draw(bp)
xmin, ymin, xmax, ymax = bp.bounds
pen = SVGPathPen(gs)
gs[name].draw(pen)
w, h = xmax - xmin, ymax - ymin
size = 64
scale = (size * 0.62) / h
tx = (size - w * scale) / 2 - xmin * scale
ty = (size + h * scale) / 2 + ymin * scale
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">
  <rect width="{size}" height="{size}" fill="#0070C0"/>
  <path fill="#FFFFFF" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f} {-scale:.5f})" d="{pen.getCommands()}"/>
</svg>
'''
(ROOT / 'public' / 'favicon.svg').write_text(svg)
print('public/favicon.svg geschrieben')
