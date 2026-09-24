"""Render 'weekend!' in Caveat 400 as SVG path data for src/components/ui/weekend-note.tsx."""
import subprocess
import urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

URL = "https://github.com/google/fonts/raw/main/ofl/caveat/Caveat%5Bwght%5D.ttf"
try:
    urllib.request.urlretrieve(URL, "/tmp/Caveat.ttf")
except Exception:
    # Some local Python installs (notably python.org builds on macOS) ship
    # without a CA bundle wired into ssl, so urllib fails to verify GitHub's
    # certificate. curl uses the system trust store and works fine there.
    subprocess.run(["curl", "-fsSL", URL, "-o", "/tmp/Caveat.ttf"], check=True)
font = instancer.instantiateVariableFont(TTFont("/tmp/Caveat.ttf"), {"wght": 400})
glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
upm = font["head"].unitsPerEm
x, parts = 0, []
for ch in "weekend!":
    name = cmap[ord(ch)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, upm * 0.8)))
    parts.append(pen.getCommands())
    x += hmtx[name][0]
print(f'viewBox="0 0 {x} {upm}"')
print("d=" + " ".join(parts))
