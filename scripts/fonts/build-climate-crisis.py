"""Freeze Climate Crisis at YEAR 1979 (the only value the site uses) as woff2."""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = "public/fonts/ClimateCrisis-Regular-VariableFont_YEAR.ttf"
OUT = "public/fonts/ClimateCrisis-1979.woff2"

font = TTFont(SRC)
static = instancer.instantiateVariableFont(font, {"YEAR": 1979})
static.flavor = "woff2"
static.save(OUT)
print("wrote", OUT)
