"""Coach portal screens for the EduSport design canvas: phone (390) and desktop, ice palette, real brand block."""
import json, os, re, sys

P = '/private/tmp/claude-501/-Users-codrin-Documents-Programming/792234b9-ef96-4365-b85b-a0689ab19809/scratchpad/portal-sportiv/project/'

NAVY, ICE, ICE_L, BLUE, BG, LINE = '#0e1a3c', '#8fb8f5', '#e1ecfb', '#4a7bd0', '#f6f9fd', '#dde6f3'
MUTED, SEC = '#5f657a', '#495269'
SH = 'box-shadow: 8px 8px 0 rgba(14,26,60,0.16)'
LS = "font-family: 'League Spartan', sans-serif; font-weight: 800"

# Brand block exactly as the public site header (Header.tsx + globals.css lv2-nav):
# "CLUBUL SPORTIV" 0.75rem, .18em, weight 400, secondary; EDUSPORT Climate Crisis YEAR 1979, 1.375rem, .05em, line-height 1.
import base64
FONT_B64 = base64.b64encode(open(P + "fonts/ClimateCrisis-1979.woff2", "rb").read()).decode()
BRAND_CSS = """@font-face{font-family:'Climate Crisis';src:url(data:font/woff2;base64,FONT_B64) format('woff2');font-display:block}
.brand{display:inline-flex;flex-direction:column;gap:1px;line-height:1;text-decoration:none}
.brand:hover{text-decoration:none}
.brand-k{font-family:Inter,system-ui,sans-serif;font-size:12px;letter-spacing:.18em;font-weight:400;color:#495269;line-height:1}
.brand-w{font-family:'Climate Crisis',sans-serif;font-variation-settings:"YEAR" 1979;font-optical-sizing:auto;font-size:22px;letter-spacing:.05em;line-height:1;color:#0e1a3c}
.brand.dark .brand-k{color:#c9d6ee}.brand.dark .brand-w{color:#ffffff}""".replace("FONT_B64", FONT_B64)

def brand(dark=False, href='#'):
    return f'<a class="brand{" dark" if dark else ""}" href="{href}" aria-label="Clubul Sportiv EduSport"><span class="brand-k">CLUBUL SPORTIV</span><span class="brand-w">EDUSPORT</span></a>'

HEAD = """<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@600;700;800&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<style>
body{{margin:0;background:#f6f9fd}}
a{{color:#0e1a3c;text-decoration:none}}a:hover{{text-decoration:underline}}
summary{{list-style:none}}summary::-webkit-details-marker{{display:none}}
a:focus-visible,button:focus-visible,summary:focus-visible,input:focus-visible,select:focus-visible{{outline:2px solid #4a7bd0;outline-offset:2px}}
button{{font:inherit;cursor:pointer}}
{brand_css}
{extra}
</style>
</helmet>
"""
TAIL = """</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
  renderVals() {{
    return {{}};
  }}
}}
</script>
</body>
</html>
"""

DT_CSS = """.dt-root{display:flex;min-height:100vh;box-sizing:border-box;background:#f6f9fd;font-family:Inter,system-ui,sans-serif;color:#0e1a3c}
.dt-side{flex:0 0 240px;width:240px;box-sizing:border-box;background:#0e1a3c;color:#f6f9fd;padding:28px 16px 24px;display:flex;flex-direction:column;gap:32px}
.dt-side .brand{padding:0 14px}
.dt-nav{display:flex;flex-direction:column;gap:6px}
.dt-side a.dt-link{min-height:48px;box-sizing:border-box;display:flex;align-items:center;gap:12px;padding:0 14px;color:#c9d6ee;font-weight:600;font-size:15px;text-decoration:none}
.dt-side a.dt-link:hover{background:rgba(246,249,253,0.08)}
.dt-side a.dt-link.on{background:#8fb8f5;color:#0e1a3c;font-weight:700}
.dt-side a.dt-acct{margin-top:auto;min-height:48px;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 14px;border:1px solid rgba(246,249,253,0.35);color:#f6f9fd;font-weight:700;font-size:15px;text-decoration:none}
.dt-main{flex:1 1 0;min-width:0}
.dt-top{background:#e1ecfb;border-bottom:1px solid #dde6f3}
.dt-wrap{max-width:1200px;margin:0 auto;box-sizing:border-box;padding:32px}
.dt-cols{display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start}
@media (max-width:900px){
.dt-root{flex-direction:column}
.dt-side{flex:none;width:auto;padding:16px;gap:14px}
.dt-nav{flex-direction:row;flex-wrap:wrap}
.dt-side a.dt-link{flex:1 1 auto;justify-content:center}
.dt-side a.dt-acct{margin-top:0}
.dt-wrap{padding:20px}
.dt-cols{gap:24px}
}"""

ICONS = {
    'azi': '<path d="M3 11l9-7 9 7v9H3z"/>',
    'grupe': '<path d="M4 6h16M4 12h16M4 18h16"/>',
    'istoric': '<path d="M12 7v5l3 2"/><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    'concursuri': '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3"/><path d="M17 6h3v2a3 3 0 0 1-3 3"/><path d="M12 14v4"/><path d="M8 20h8"/>',
    'profil': '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
}
def icon(k, s=20):
    return f'<svg aria-hidden="true" width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICONS[k]}</svg>'
CHEV = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M9 6l6 6-6 6"/></svg>'
CHECK = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M5 12l5 5 9-10"/></svg>'

NAV = [('azi', 'Azi', 'Azi'), ('grupe', 'Grupe', 'Grupe'), ('concursuri', 'Concursuri', 'Concursuri'), ('istoric', 'Istoric', 'Istoric'), ('profil', 'Profil', 'Profil')]

# ---------- building blocks (fluid width, shared by phone and desktop) ----------

def h2(text, link=None):
    l = f'<a href="{link[1]}" style="min-height: 44px; display: inline-flex; align-items: center; font-weight: 700; font-size: 14px">{link[0]} ›</a>' if link else ''
    return f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><h2 style="margin: 0; {LS}; font-size: 22px">{text}</h2>{l}</div>'

def card(inner, pad=None, bg='#ffffff'):
    p = f'padding: {pad}; ' if pad else ''
    return f'<div style="background: {bg}; border: 1px solid {LINE}; {SH}; {p}display: flex; flex-direction: column">{inner}</div>'

def tblock(top, big, small_top=True):
    t = f'<span style="font-size: 11px; font-weight: 700; color: #be3330; text-transform: uppercase">{top}</span>' if top else ''
    return (f'<span style="width: 56px; height: 52px; background: {ICE_L}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0">'
            f'{t}<span style="{LS}; font-size: {22 if top else 17}px; line-height: 1">{big}</span></span>')

def endblock(label, kind):
    styles = {'todo': f'background: {NAVY}; color: #ffffff', 'done': f'background: {ICE_L}; color: {NAVY}',
              'lesson': f'background: {BLUE}; color: #ffffff', 'group': f'background: {NAVY}; color: #ffffff',
              'soft': f'background: {ICE_L}; color: {NAVY}'}[kind]
    return (f'<span style="width: 96px; flex: none; box-sizing: border-box; padding: 6px; display: flex; align-items: center; justify-content: center; '
            f'text-align: center; {styles}; font-size: 11px; font-weight: 800; line-height: 1.25">{label}</span>')

def row(href, block, title, sub, end=None, last=False, extra=''):
    border = '' if last else f'border-bottom: 1px solid {LINE}; '
    tail = end if end else f'<span style="width: 44px; flex: none; display: flex; align-items: center; justify-content: center; color: {SEC}">{CHEV}</span>'
    return (f'<a href="{href}" style="{border}display: flex; align-items: stretch; min-height: 76px; text-decoration: none; color: {NAVY}">'
            f'<span style="flex: 1; min-width: 0; display: flex; gap: 14px; align-items: center; padding: 12px 14px">{block}'
            f'<span style="display: flex; flex-direction: column; gap: 2px; min-width: 0">'
            f'<span style="font-weight: 700; font-size: 15px">{title}</span>'
            f'<span style="font-size: 13px; color: {MUTED}">{sub}</span>{extra}</span></span>{tail}</a>')

def rows(items):
    return card(''.join(row(*it[:5], last=(i == len(items) - 1), extra=(it[5] if len(it) > 5 else '')) for i, it in enumerate(items)))

def btn(label, href='#', primary=True, full=False):
    st = f'background: {NAVY}; color: #ffffff; border: 2px solid {NAVY}' if primary else f'background: #ffffff; color: {NAVY}; border: 2px solid {NAVY}'
    w = 'width: 100%; ' if full else ''
    return (f'<a href="{href}" style="{w}min-height: 48px; box-sizing: border-box; padding: 0 20px; display: inline-flex; align-items: center; justify-content: center; '
            f'{st}; font-weight: 700; font-size: 15px; text-decoration: none; {SH if primary else ""}">{label}</a>')

def stat_card(big, label, side=''):
    return (f'<section style="background: {NAVY}; color: #f6f9fd; {SH}; padding: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px">'
            f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="{LS}; font-size: 88px; line-height: 0.85; color: {ICE}">{big}</span>'
            f'<span style="font-size: 14px; color: #c0c0c4">{label}</span></div>{side}</section>')

def side_lines(lines):
    return '<div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-end; text-align: right">' + ''.join(
        f'<span style="font-size: 14px; color: #c9d6ee"><b style="color: #ffffff; font-size: 18px">{a}</b> {b}</span>' for a, b in lines) + '</div>'

def field(label, value, hint='', kind='input'):
    v = (f'<span style="min-height: 48px; box-sizing: border-box; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid #b9c6da; font-size: 15px">{value}'
         f'{"<span style=" + chr(34) + "color: " + SEC + chr(34) + ">" + CHEV + "</span>" if kind == "select" else ""}</span>')
    return (f'<label style="display: flex; flex-direction: column; gap: 6px"><span style="font-weight: 700; font-size: 14px">{label}</span>{v}'
            f'{f"<span style={chr(34)}font-size: 13px; color: {MUTED}{chr(34)}>{hint}</span>" if hint else ""}</label>')

def seg(options, on):
    return ('<div role="group" style="display: flex; border: 2px solid #0e1a3c; align-self: flex-start">' + ''.join(
        f'<a href="{h}" style="min-height: 44px; box-sizing: border-box; padding: 0 16px; display: flex; align-items: center; font-weight: 700; font-size: 14px; text-decoration: none; '
        f'{"background: " + NAVY + "; color: #ffffff" if i == on else "background: #ffffff; color: " + NAVY}">{t}</a>' for i, (t, h) in enumerate(options)) + '</div>')

def check(on, label):
    st = f'background: {NAVY}; color: #ffffff; border: 2px solid {NAVY}' if on else f'background: #ffffff; color: transparent; border: 2px solid #b9c6da'
    return f'<span role="checkbox" aria-checked="{"true" if on else "false"}" aria-label="{label}" style="width: 44px; height: 44px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; {st}">{CHECK}</span>'

def col(*parts, gap=26, flex=None):
    f = f'flex: {flex}; min-width: 0; ' if flex else ''
    return f'<div style="{f}display: flex; flex-direction: column; gap: {gap}px">' + ''.join(parts) + '</div>'

def section(title, body=None, link=None):
    return col(h2(title, link), body, gap=12)

# ---------- page shells ----------

def phone(name, title, head, body, nav, footer=''):
    navhtml = ''
    if nav:
        items = ''
        for k, label, target in NAV:
            on = k == nav
            st = f'color: {NAVY}; background: {ICE}; border-radius: 13px; font-weight: 700' if on else 'color: #c0c0c4; font-weight: 600'
            items += (f'<a href="{target}.dc.html" style="min-height: 52px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; '
                      f'text-decoration: none; {st}; font-size: 11px">{icon(k)}{label}</a>')
        navhtml = f'<nav aria-label="Meniu" style="margin: 0 16px 16px; display: grid; grid-template-columns: repeat({len(NAV)}, minmax(0, 1fr)); background: {NAVY}; border-radius: 18px; padding: 6px">{items}</nav>'
    html = HEAD.format(title=title, brand_css=BRAND_CSS, extra='') + (
        f'<div class="ph-root" style="width: 390px; min-height: 844px; box-sizing: border-box; background: {BG}; font-family: Inter, system-ui, sans-serif; color: {NAVY}; display: flex; flex-direction: column">\n'
        f'<header style="padding: 18px 20px 6px; display: flex; flex-direction: column; gap: 18px">{head}</header>\n'
        f'<main style="flex: 1; padding: 22px 20px 28px; display: flex; flex-direction: column; gap: 26px">{body}</main>\n{footer}{navhtml}\n</div>\n')
    return name, html

def phone_head(back=None, kicker='', h1='', sub=''):
    top = brand(href='Azi.dc.html') if not back else (
        f'<a href="{back[1]}" style="min-height: 44px; display: inline-flex; align-items: center; gap: 4px; font-weight: 700; font-size: 15px">‹ {back[0]}</a>')
    parts = [f'<div style="display: flex; justify-content: space-between; align-items: center; min-height: 44px">{top}</div>']
    t = ''
    if kicker: t += f'<span style="font-size: 14px; color: {MUTED}">{kicker}</span>'
    if h1: t += f'<h1 style="margin: 0; {LS}; font-size: 30px; line-height: 1.05">{h1}</h1>'
    if sub: t += f'<span style="font-size: 13px; color: {MUTED}">{sub}</span>'
    if t: parts.append(f'<div style="display: flex; flex-direction: column; gap: 8px">{t}</div>')
    return ''.join(parts)


def now_tile():
    return (f'<div aria-label="Marți, 10 noiembrie, ora 17:05" style="display: flex; align-items: stretch; {SH}; flex: none">'
            f'<span style="width: 64px; background: {NAVY}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 8px 0">'
            f'<span style="font-size: 11px; font-weight: 700; color: {ICE}; text-transform: uppercase; letter-spacing: 0.08em">Noi</span>'
            f'<span style="{LS}; font-size: 32px; line-height: 1; color: #ffffff">10</span></span>'
            f'<span style="background: #ffffff; border: 1px solid {LINE}; border-left: 0; padding: 8px 14px; display: flex; flex-direction: column; justify-content: center; gap: 4px">'
            f'<span style="{LS}; font-size: 26px; line-height: 1">17:05</span>'
            f'<span style="font-size: 13px; color: {MUTED}">Marți</span></span></div>')

def azi_head():
    return (f'<div style="display: flex; justify-content: space-between; align-items: center; min-height: 44px">{brand(href="Azi.dc.html")}</div>'
            f'<div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 12px">'
            f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {MUTED}">Bună, Alina</span>'
            f'<h1 style="margin: 0; {LS}; font-size: 30px; line-height: 1.05">Azi</h1></div>{now_tile()}</div>')

def desktop(name, title, nav, kicker, h1, sub, main, back=None, topextra=''):
    links = ''.join(
        f'<a class="dt-link{" on" if k == nav else ""}" href="Desktop{t}.dc.html">{icon(k)}{l}</a>' for k, l, t in NAV if k != 'profil')
    b = f'<a href="{back[1]}" style="min-height: 44px; display: inline-flex; align-items: center; font-weight: 700; font-size: 15px; align-self: flex-start">‹ {back[0]}</a>' if back else ''
    k = f'<span style="font-size: 14px; color: {MUTED}">{kicker}</span>' if kicker else ''
    s = f'<span style="font-size: 14px; color: {MUTED}">{sub}</span>' if sub else ''
    html = HEAD.format(title=title, brand_css=BRAND_CSS, extra=DT_CSS) + (
        f'<div class="dt-root">\n  <aside class="dt-side">\n    {brand(dark=True, href="DesktopAzi.dc.html")}\n'
        f'    <nav class="dt-nav" aria-label="Meniu">{links}</nav>\n'
        f'    <a class="dt-acct" href="DesktopProfil.dc.html" aria-label="Contul">Alina\n      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M6 9l6 6 6-6"/></svg></a>\n'
        f'  </aside>\n  <div class="dt-main">\n    <header class="dt-top">\n'
        f'      <div class="dt-wrap" style="padding-top: 28px; padding-bottom: 28px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px">'
        f'<div style="display: flex; flex-direction: column; gap: 8px">{b}{k}<h1 style="margin: 0; {LS}; font-size: 40px; line-height: 1.05">{h1}</h1>{s}</div>{topextra}</div>\n'
        f'    </header>\n    <main class="dt-wrap" style="display: flex; flex-direction: column; gap: 32px">\n{main}\n    </main>\n  </div>\n</div>\n')
    return name, html

# ---------- content ----------

IND = ('<span style="display: inline-flex; align-items: center; background: #111111; color: #ffffff; font-size: 11px; font-weight: 700; '
       'padding: 2px 6px; margin-right: 6px; vertical-align: 1px">Individual</span>')

TODAY = 'Marți, 10 noiembrie'
TODO = [
    ('Prezenta.dc.html', tblock('', '17:30'), 'Intermediari Bronze', 'grup, 14 copii, AFI Cotroceni', endblock('Fă prezența', 'todo')),
    ('Lectie.dc.html', tblock('', '18:30'), 'Maria Ionescu', IND + '45 min', endblock('Individual', 'lesson')),
]
DONE = [('Prezenta.dc.html', tblock('', '16:00'), 'Inițiere A', 'grup, 8 prezenți', endblock('Completat', 'done'))]
PAST = [('Prezenta.dc.html', tblock('Joi', '5'), 'Intermediari Bronze', 'grup, 17:30', None)]

GREEN = '#9fdcb5'

def type_block(kind, status):
    done = status == 'Completat'
    bg = BLUE if done else NAVY
    icon = ('<path d="M5 12l5 5 9-10"/>' if done else '<path d="M4 4h16v16H4z"/><path d="M12 7.5v5h4"/>')
    label = f'{kind}, {"completat" if done else "necompletat"}'
    return (f'<span role="img" aria-label="{label}" style="width: 64px; flex: none; display: flex; align-items: center; justify-content: center; background: {bg}; color: #ffffff">'
            f'<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" stroke-linejoin="miter">{icon}</svg></span>')

def today_row(href, time, title, sub, kind, status, past, done, last=False):
    border = '' if last else f'border-bottom: 1px solid {LINE}; '
    fade = ''
    dim = 'color: #979ba5; ' if past else ''
    green = ''
    return (f'<a href="{href}" style="{border}position: relative; display: flex; align-items: stretch; min-height: 76px; text-decoration: none; color: {NAVY}">'
            f'<span style="{fade}flex: 1; min-width: 0; display: flex; align-items: stretch">'
            f'<span style="flex: 1; min-width: 0; display: flex; gap: 14px; align-items: center; padding: 12px 14px">{tblock("", time).replace('line-height: 1">', 'line-height: 1; ' + dim + '">')}'
            f'<span style="display: flex; flex-direction: column; gap: 2px; min-width: 0"><span style="{dim}font-weight: 700; font-size: 15px">{title}</span>'
            f'<span style="font-size: 13px; color: {MUTED}">{sub}</span></span></span>{type_block(kind, status)}</span>{green}</a>')

TODAY_ROWS = [
    ('Lectie.dc.html', '15:00', 'Luca Stan', IND + '45 min', 'Individual', 'Necompletat', True, False),
    ('Prezenta.dc.html', '16:00', 'Inițiere A', 'grup, 8 prezenți', 'Grup', 'Completat', True, True),
    ('Prezenta.dc.html', '17:30', 'Intermediari Bronze', 'grup, 14 copii, AFI Cotroceni', 'Grup', '', False, False),
    ('Lectie.dc.html', '18:30', 'Maria Ionescu', IND + '45 min', 'Individual', '', False, False),
]


def coach_calendar():
    week = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']
    ev = {}
    for d in (3, 5, 10, 12, 17, 19, 24, 26): ev[d] = 'gg'
    for d in (4, 11, 18, 25): ev[d] = ev.get(d, '') + 'g'
    for d in (9, 12, 16, 23): ev[d] = ev.get(d, '') + 'i'
    ev[19] = 'gx'
    cells = ['<span></span>'] * 6
    for d in range(1, 31):
        e = ev.get(d, '')
        bars = ''.join(f'<span style="width: 8px; height: 3px; background: {dict(g=NAVY, i=BLUE, x="#c0c0c4")[ch]}"></span>' for ch in e)
        marks = f'<span style="display: flex; gap: 2px; justify-content: center; min-height: 3px">{bars}</span>'
        sel, today = d == 12, d == 10
        st = (f'background: {NAVY}; color: #ffffff;' if sel else (f'background: {ICE_L};' if today else ''))
        if sel: marks = marks.replace(NAVY, ICE)
        cells.append(f'<a href="#" style="height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; {st} '
                     f'font-weight: {800 if e else 500}; font-size: 14px; text-decoration: none; color: {"#ffffff" if sel else NAVY}">{d}{marks}</a>')
    heads = ''.join(f'<span style="text-align: center; font-size: 11px; font-weight: 700; color: {MUTED}">{w}</span>' for w in week)
    grid = card(f'<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; margin-bottom: 6px">{heads}</div>'
                f'<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px">{"".join(cells)}</div>', pad='12px')
    legend = '<div style="display: flex; flex-wrap: wrap; gap: 16px">' + ''.join(
        f'<span style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: {MUTED}"><span style="width: 12px; height: 3px; background: {c}"></span>{t}</span>'
        for c, t in [(NAVY, 'grup'), (BLUE, 'individual'), ('#c0c0c4', 'anulată')]) + '</div>'
    rows_ = [('Prezenta.dc.html', '16:00', 'Inițiere A', 'grup, 9 copii, AFI Cotroceni', 'Grup', '', False, False),
             ('Prezenta.dc.html', '17:30', 'Intermediari Bronze', 'grup, 14 copii, AFI Cotroceni', 'Grup', '', False, False),
             ('Lectie.dc.html', '18:30', 'Maria Ionescu', IND + '45 min', 'Individual', '', False, False)]
    day = section('Joi, 12 noiembrie', card(''.join(today_row(*r, last=(i == len(rows_) - 1)) for i, r in enumerate(rows_))))
    return month_picker(), grid, legend, day

def azi_parts():
    hero = stat_card('4', 'antrenamente azi', side_lines([('1', 'completat')]))
    today = section('Antrenamente azi', link=('Calendar', 'Calendar.dc.html'), body=card(''.join(today_row(*r, last=(i == len(TODAY_ROWS) - 1)) for i, r in enumerate(TODAY_ROWS))))
    past = section('Antrenamente fără prezență', card(''.join(row(*p[:4], type_block('Grup', 'Necompletat'), last=(i == len(PAST) - 1)) for i, p in enumerate(PAST))))
    add = btn('+ Adaugă antrenament', 'Adauga.dc.html', primary=False, full=True)
    return hero, today, past, add

ATHLETES = [
    ('Ana Popescu', '9 ani, Ședința 5/8', True, False),
    ('Matei Ionescu', '10 ani, Ședința 2/8', True, False),
    ('Ioana Dumitrescu', '9 ani, nou', True, False),
    ('Luca Stan', '11 ani, Ședința 7/8', False, False),
    ('Sofia Marin', '10 ani, Fără abonament', True, False),
    ('David Radu', '9 ani, Ședința 4/8', True, True),
    ('Elena Vasile', '8 ani, Ședința 1/8', False, False),
    ('Tudor Neagu', '10 ani, și în Performanță', True, False),
]

def presence_table():
    head = (f'<div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid {LINE}; background: {ICE_L}; font-size: 12px; font-weight: 700; color: {SEC}">'
            '<span style="flex: 1">Sportiv</span><span style="width: 44px; text-align: center">Grup</span><span style="width: 44px; text-align: center">Uscat</span></div>')
    body = ''
    for i, (n, meta, g, u) in enumerate(ATHLETES):
        b = '' if i == len(ATHLETES) - 1 else f'border-bottom: 1px solid {LINE}; '
        body += (f'<div style="{b}display: flex; align-items: center; gap: 10px; min-height: 68px; padding: 8px 14px">'
                 f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><a href="Sportiv.dc.html" style="font-weight: 700; font-size: 15px">{n}</a>'
                 f'<span style="font-size: 13px; color: {MUTED}">{meta}</span></span>{check(g, "Grup, " + n)}{check(u, "Uscat, " + n)}</div>')
    return card(head + body)

def coach_line():
    return (f'<div style="display: flex; flex-direction: column; gap: 6px"><span style="font-weight: 700; font-size: 14px">Antrenor</span>'
            f'<span style="font-size: 15px">Alina Gheorghe (tu)</span>'
            f'<a href="#" style="min-height: 44px; display: inline-flex; align-items: center; font-weight: 700; font-size: 14px; align-self: flex-start">+ Adaugă alți antrenori</a></div>')

def save_bar(sticky=True):
    pos = ''
    return (f'<div style="{pos}background: #ffffff; border-top: 1px solid {LINE}; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px">'
            f'<span style="{LS}; font-size: 20px">6 prezenți</span>{btn("Salvează")}</div>')

GROUPS = [
    ('Grupa.dc.html', tblock('Mar', '10'), 'Intermediari Bronze', 'Ma, Jo 17:30, 14 copii', None),
    ('Grupa.dc.html', tblock('Mar', '10'), 'Inițiere A', 'Ma, Jo 16:00, 9 copii', None),
    ('Grupa.dc.html', tblock('Mie', '11'), 'Avansați Silver', 'Lu, Mi, Vi 18:00, 11 copii', None),
]
OTHERS = [
    ('Grupa.dc.html', tblock('Mie', '11'), 'Performanță', 'zilnic 7:00, 6 copii', None, f'<span style="font-size: 13px; color: {MUTED}">Antrenor: Andrei Pop</span>'),
    ('Grupa.dc.html', tblock('Sâm', '14'), 'Inițiere B', 'Sâ 10:00, 12 copii', None, f'<span style="font-size: 13px; color: {MUTED}">Antrenor: Ioana Matei</span>'),
]

MEMBERS = [
    ('Sportiv.dc.html', '', 'Ana Popescu', '9 ani'),
    ('Sportiv.dc.html', '', 'Ioana Dumitrescu', '9 ani, nou'),
    ('Sportiv.dc.html', '', 'Matei Ionescu', '10 ani'),
    ('Sportiv.dc.html', '', 'Sofia Marin', '10 ani'),
    ('Sportiv.dc.html', '', 'Tudor Neagu', '10 ani, și în Performanță'),
]

def members():
    return rows([(h, b, t, s, None) for h, b, t, s in MEMBERS])

def group_info():
    return card(
        f'<span style="font-size: 14px"><b>Program:</b> Ma, Jo 17:30 - 18:30</span>'
        f'<span style="font-size: 14px"><b>Loc:</b> AFI Cotroceni</span>'
        f'<span style="font-size: 14px"><b>Antrenori:</b> Alina Gheorghe, Andrei Pop</span>', pad='16px', bg=ICE_L).replace(
        'flex-direction: column">', 'flex-direction: column; gap: 6px">', 1)

def kv(rows_):
    out = ''
    for i, (k, v) in enumerate(rows_):
        b = '' if i == len(rows_) - 1 else f'border-bottom: 1px solid {LINE}; '
        out += (f'<div style="{b}display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 56px; padding: 8px 16px">'
                f'<span style="font-size: 14px; color: {MUTED}">{k}</span><span style="font-weight: 700; font-size: 15px; text-align: right">{v}</span></div>')
    return card(out)


def place_block(n):
    return (f'<span style="width: 56px; height: 52px; background: {ICE_L}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0">'
            f'<span style="font-size: 10px; font-weight: 700; color: {MUTED}; text-transform: uppercase; letter-spacing: 0.06em">Loc</span>'
            f'<span style="{LS}; font-size: 22px; line-height: 1">{n}</span></span>')

def pts(p):
    return (f'<span style="width: 84px; flex: none; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; padding-right: 14px">'
            f'<span style="{LS}; font-size: 18px">{p}</span><span style="font-size: 11px; color: {MUTED}">puncte</span></span>')

ATH_COMP = [('2', 'Cupa României', '26 oct 2026, Brașov', '98,42'), ('1', 'Edu Sport Trophy', '13 sep 2026, București', '101,07'), ('3', 'Cupa Patinoarului Nord', '15 iun 2026, București', '92,10')]

def athlete_comp():
    rows_ = [('#', place_block(p), n, d, pts(x)) for p, n, d, x in ATH_COMP]
    cat = (f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid {LINE}; background: {ICE_L}">'
           f'<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 12px; color: {MUTED}">Categoria 2026-2027</span>'
           f'<span style="font-weight: 800; font-size: 15px">Advanced Novice Girls</span></span>'
           f'<span style="display: flex; gap: 16px; text-align: right"><span><b style="{LS}; font-size: 18px">41</b><br><span style="font-size: 11px; color: {MUTED}">concursuri</span></span>'
           f'<span><b style="{LS}; font-size: 18px">12</b><br><span style="font-size: 11px; color: {MUTED}">podiumuri</span></span></span></div>')
    body = cat + ''.join(row(*r, last=(i == len(rows_) - 1)) for i, r in enumerate(rows_))
    return section('Concursuri', card(body), link=('Toate', 'Concursuri.dc.html'))

def athlete_presence():
    return section('Prezențe', kv([('În sezon', '26 de prezențe'), ('Lecții individuale', '4 în sezon'), ('Ultima', 'Marți, 10 noi'), ('Lipsă luna asta', '1')]), link=('Istoric', '#'))

COMPS = [
    ('Oct', '26', 'Cupa României', 'Brașov', [('Ioana Marin', 'Adv. Novice Girls', '2', '98,42'), ('Ana Popescu', 'Basic Novice Girls', '1', '74,10'), ('Tudor Neagu', 'Intermediate Novice Boys', '4', '80,05'), ('Sofia Marin', 'Basic Novice Girls', '6', '61,30')]),
    ('Sep', '13', 'Edu Sport Trophy', 'București', [('Ioana Marin', 'Adv. Novice Girls', '1', '101,07'), ('Ana Popescu', 'Basic Novice Girls', '3', '70,85')]),
    ('Iun', '15', 'Cupa Patinoarului Nord', 'București', [('Ioana Marin', 'Adv. Novice Girls', '3', '92,10')]),
]

def comp_card(m, d, name, city, members, open_=False):
    mem = ''.join(
        f'<a href="Sportiv.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 60px; padding: 8px 14px; border-top: 1px solid {LINE}; text-decoration: none; color: {NAVY}">'
        f'{place_block(p)}<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 700; font-size: 15px">{n}</span>'
        f'<span style="font-size: 13px; color: {MUTED}">{cat}</span></span><span style="{LS}; font-size: 16px">{x}</span></a>' for n, cat, p, x in members)
    return (f'<details{" open" if open_ else ""} style="background: #ffffff; border: 1px solid {LINE}; {SH}">'
            f'<summary style="display: flex; align-items: stretch; min-height: 76px; cursor: pointer">'
            f'<span style="flex: 1; min-width: 0; display: flex; gap: 14px; align-items: center; padding: 12px 14px">{tblock(m, d)}'
            f'<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 700; font-size: 15px">{name}</span>'
            f'<span style="font-size: 13px; color: {MUTED}">{city}</span></span></span>'
            f'<span style="width: 96px; flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center; background: {NAVY}; color: #ffffff">'
            f'<span style="{LS}; font-size: 22px; line-height: 1">{len(members)}</span><span style="font-size: 11px; font-weight: 700">sportivi</span></span></summary>{mem}</details>')

def comps_parts():
    filt = seg([('Toți sportivii', '#'), ('Grupele mele', '#')], 0)
    season = field('Sezon', '2026-2027', kind='select')
    lst = col(*[comp_card(*c, open_=(i == 0)) for i, c in enumerate(COMPS)], gap=14)
    return filt, season, lst

def athlete_parts():
    groups = section('Grupe', rows([
        ('Grupa.dc.html', '', 'Intermediari Bronze', 'Ma, Jo 17:30', endblock('Bronze', 'group'))]))
    school = section('Școala', kv([('Abonament', 'A-0124, Ședința 5/8'), ('Valabil până la', '30 noi'), ('Locație', 'AFI Cotroceni')]))
    ic = lambda d: f'<svg aria-hidden="true" width="18" height="18" style="flex: none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{d}</svg>'
    call = ic('<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>')
    wa = ic('<path d="M4 20l1.5-4.5A8 8 0 1 1 9 19z"/><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.5"/>')
    cp = ic('<path d="M9 9h11v11H9z"/><path d="M5 15H4V4h11v1"/>')
    def cbtn(icon, label, primary=False, href='#'):
        st = f'background: {NAVY}; color: #ffffff; border: 2px solid {NAVY}' if primary else f'background: #ffffff; color: {NAVY}; border: 2px solid {NAVY}'
        return (f'<a href="{href}" style="min-height: 48px; box-sizing: border-box; padding: 0 10px; display: flex; align-items: center; justify-content: center; gap: 8px; '
                f'{st}; font-weight: 700; font-size: 14px; text-decoration: none">{icon}{label}</a>')
    contact = section('Contact', card(
        f'<div style="display: flex; flex-direction: column; gap: 14px; padding: 16px">'
        f'<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; color: {MUTED}">Părinte</span>'
        f'<span style="font-weight: 700; font-size: 15px">Mihaela Popescu</span>'
        f'<span style="display: flex; align-items: center; gap: 4px"><span style="{LS}; font-size: 24px; letter-spacing: 0.02em">0722 123 456</span>'
        f'<button type="button" aria-label="Copiază numărul" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border: 0; background: transparent; color: {SEC}">{cp}</button></span></span>'
        f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">'
        f'{cbtn(call, "Sună", True, "tel:+40722123456")}{cbtn(wa, "WhatsApp", href="https://wa.me/40722123456")}</div></div>'))
    return groups, school, contact

def lesson_form():
    present = (f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 56px; padding: 6px 0">'
               f'<span style="font-weight: 700; font-size: 15px">Prezent</span>{check(True, "Prezent")}</div>')
    return col(field('Sportiv', 'Maria Ionescu', kind='select'),
               f'<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">{field("Data", "10.11.2026")}{field("Ora", "18:30")}</div>',
               field('Durată', '45 min', kind='select'), field('Antrenor', 'Alina Gheorghe', kind='select'), present,
               btn('Salvează lecția', full=True), gap=18)

HIST = [
    ('Prezenta.dc.html', tblock('Mar', '10'), 'Inițiere A', 'grup, 8 prezenți', type_block('Grup', 'Completat')),
    ('Lectie.dc.html', tblock('Lun', '9'), 'Maria Ionescu', IND + '45 min', type_block('Individual', 'Completat')),
    ('Prezenta.dc.html', tblock('Joi', '5'), 'Intermediari Bronze', 'grup, fără prezență', type_block('Grup', 'Necompletat')),
    ('Prezenta.dc.html', tblock('Joi', '5'), 'Performanță', 'înlocuitor, 5 prezenți', type_block('Grup', 'Completat')),
    ('Prezenta.dc.html', tblock('Mar', '3'), 'Intermediari Bronze', 'grup, 12 prezenți', type_block('Grup', 'Completat')),
]

def month_picker():
    a = 'min-height: 44px; min-width: 44px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; border: 2px solid #0e1a3c; background: #ffffff'
    return (f'<div style="display: flex; align-items: center; gap: 10px"><a href="#" aria-label="Luna anterioară" style="{a}">‹</a>'
            f'<span style="{LS}; font-size: 20px; min-width: 150px; text-align: center">Noiembrie 2026</span>'
            f'<a href="#" aria-label="Luna următoare" style="{a}">›</a></div>')

def hist_hero():
    return stat_card('12', 'ședințe de grup în noiembrie', side_lines([('4', 'lecții individuale'), ('18,5', 'ore')]))

def profile_list():
    items = [('Setari.dc.html', '', 'Setări cont', 'nume, e-mail, telefon, parolă', None),
             ('Setari.dc.html', '', 'Securitate', 'dispozitive conectate', None)]
    return col(rows(items), btn('Ieși din cont', primary=False, full=True), gap=20)

def settings_parts():
    who = section('Cont', kv([('Nume', 'Alina Gheorghe'), ('E-mail', 'alina.gheorghe@example.invalid')]) +
                  f'<span style="font-size: 13px; color: {MUTED}">Numele și e-mailul le schimbă administratorul. După schimbarea e-mailului, intri cu adresa nouă.</span>')
    phone_ = section('Telefon', col(field('Telefon', '0722 000 111'), btn('Salvează', primary=True), gap=12))
    pw = section('Schimbă parola', col(field('Parola actuală', '••••••••'), field('Parola nouă', ''), btn('Salvează', primary=True), gap=12))
    return who, phone_, pw

def login_body():
    g = (f'<a href="#" style="min-height: 48px; display: flex; align-items: center; justify-content: center; gap: 10px; border: 2px solid {NAVY}; background: #ffffff; font-weight: 700; font-size: 15px">'
         f'<svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M45 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.1z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/><path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5C3 17.1 2 20.4 2 24s1 6.9 2.5 9.9l7.3-5.7z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/></svg>Continuă cu Google</a>')
    orl = f'<span style="text-align: center; font-size: 13px; color: {MUTED}">sau</span>'
    return card(col(f'<h1 style="margin: 0; {LS}; font-size: 28px">Intră în cont</h1>', g, orl, field('E-mail', 'alina.gheorghe@example.invalid'),
                    field('Parolă', '••••••••••'), btn('Intră', full=True),
                    f'<a href="#" style="min-height: 44px; display: inline-flex; align-items: center; font-weight: 700; font-size: 14px; align-self: center">Am uitat parola</a>', gap=16), pad='24px')

def big_brand(dark=False):
    return brand(dark=dark).replace('class="brand', 'style="transform: scale(1.6); transform-origin: center; margin: 24px 0" class="brand', 1)

# ---------- pages ----------

def build():
    pages = []
    hero, today, past, add = azi_parts()
    pages.append(phone('Azi.dc.html', 'Azi', azi_head(), hero + today + add + past, 'azi'))
    pages.append(desktop('DesktopAzi.dc.html', 'Azi, desktop', 'azi', 'Bună, Alina', 'Azi', '',
                         f'<div class="dt-cols">{col(hero, past, flex="1 1 300px", gap=32)}{col(today, flex="2 1 420px", gap=32)}</div>',
                         topextra=f'<div style="display: flex; align-items: center; gap: 20px">{now_tile()}{btn("+ Adaugă antrenament", "DesktopAdauga.dc.html", primary=False)}</div>'))


    mp, cg, lg_, dy = coach_calendar()
    pages.append(phone('Calendar.dc.html', 'Calendar', phone_head(back=('Azi', 'Azi.dc.html'), h1='Calendar', sub='Ședințele și lecțiile tale'), mp + cg + lg_ + dy, 'azi'))
    pages.append(desktop('DesktopCalendar.dc.html', 'Calendar, desktop', 'azi', '', 'Calendar', 'Ședințele și lecțiile tale',
                         f'<div class="dt-cols">{col(cg, lg_, flex="1 1 420px", gap=14)}{col(dy, flex="1 1 380px")}</div>',
                         back=('Azi', 'DesktopAzi.dc.html'), topextra=mp))

    ph_pres = col(coach_line(), presence_table(), gap=20)
    pages.append(phone('Prezenta.dc.html', 'Prezență', phone_head(back=('Azi', 'Azi.dc.html'), h1='Intermediari Bronze', sub='Marți, 10 noi, 17:30, AFI Cotroceni'),
                       ph_pres, None, footer=save_bar()))
    pages.append(desktop('DesktopPrezenta.dc.html', 'Prezență, desktop', 'azi', '', 'Intermediari Bronze', 'Marți, 10 noi, 17:30, AFI Cotroceni',
                         f'<div class="dt-cols">{col(card(coach_line(), pad="18px"), group_info(), flex="1 1 280px", gap=24)}'
                         f'{col(presence_table(), card(save_bar(sticky=False).replace("padding: 14px 20px", "padding: 14px 16px")), flex="2 1 480px", gap=20)}</div>',
                         back=('Azi', 'DesktopAzi.dc.html')))

    mine, others = section('Grupele mele', rows(GROUPS)), section('Alte grupe', rows(OTHERS))
    pages.append(phone('Grupe.dc.html', 'Grupe', phone_head(h1='Grupe', sub='3 grupe, 34 de copii'), mine + others, 'grupe'))
    pages.append(desktop('DesktopGrupe.dc.html', 'Grupe, desktop', 'grupe', '', 'Grupe', '3 grupe, 34 de copii',
                         f'<div class="dt-cols">{col(mine, flex="1 1 380px")}{col(others, flex="1 1 380px")}</div>'))

    gtabs = seg([('Sportivi (14)', 'Grupa.dc.html'), ('Program', 'GrupaProgram.dc.html')], 0)
    gactions = col(btn('Fă prezența', 'Prezenta.dc.html', full=True), btn('Modifică grupa', 'GrupaModifica.dc.html', primary=False, full=True), gap=12)
    pages.append(phone('Grupa.dc.html', 'Grupă', phone_head(back=('Grupe', 'Grupe.dc.html'), h1='Intermediari Bronze', sub='Școala de patinaj'),
                       group_info() + gactions + col(gtabs, members(), gap=14), 'grupe'))
    pages.append(desktop('DesktopGrupa.dc.html', 'Grupă, desktop', 'grupe', '', 'Intermediari Bronze', 'Școala de patinaj',
                         f'<div class="dt-cols">{col(group_info(), gactions, flex="1 1 280px", gap=24)}{col(gtabs, members(), flex="2 1 480px", gap=14)}</div>',
                         back=('Grupe', 'DesktopGrupe.dc.html'), topextra=btn('Fă prezența', 'DesktopPrezenta.dc.html')))


    def edit_rows(remove_name=None):
        out = ''
        for i, (_, _, name, sub) in enumerate(MEMBERS):
            b = '' if i == len(MEMBERS) - 1 else f'border-bottom: 1px solid {LINE}; '
            out += (f'<div style="{b}display: flex; align-items: center; gap: 12px; min-height: 68px; padding: 8px 14px">'
                    f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 700; font-size: 15px">{name}</span>'
                    f'<span style="font-size: 13px; color: {MUTED}">{sub}</span></span>'
                    f'<span style="display: flex; gap: 6px; flex: none"><a href="GrupaMuta.dc.html" style="min-height: 44px; box-sizing: border-box; padding: 0 12px; display: flex; align-items: center; border: 2px solid {NAVY}; background: #ffffff; font-weight: 700; font-size: 14px">Mută</a>'
                    f'<a href="GrupaScoate.dc.html" style="min-height: 44px; box-sizing: border-box; padding: 0 12px; display: flex; align-items: center; border: 2px solid {NAVY}; background: #ffffff; font-weight: 700; font-size: 14px">Scoate</a></span></div>')
        return card(out)
    eadd = btn('+ Adaugă sportiv', '#', primary=False, full=True)
    edone = btn('Gata', 'Grupa.dc.html', full=True)
    ehead = phone_head(back=('Intermediari Bronze', 'Grupa.dc.html'), h1='Modifică grupa', sub='Intermediari Bronze, 14 sportivi')
    pages.append(phone('GrupaModifica.dc.html', 'Modifică grupa', ehead, eadd + edit_rows() + edone, 'grupe'))
    pages.append(desktop('DesktopGrupaModifica.dc.html', 'Modifică grupa, desktop', 'grupe', '', 'Modifică grupa', 'Intermediari Bronze, 14 sportivi',
                         f'<div style="max-width: 640px; display: flex; flex-direction: column; gap: 20px">{edit_rows()}</div>',
                         back=('Intermediari Bronze', 'DesktopGrupa.dc.html'),
                         topextra=f'<div style="display: flex; gap: 12px">{btn("+ Adaugă sportiv", "#", primary=False)}{btn("Gata", "DesktopGrupa.dc.html")}</div>'))
    sheet = card(col(f'<h2 style="margin: 0; {LS}; font-size: 22px">Scoți pe Ana Popescu din grupă?</h2>',
                     f'<span style="font-size: 14px; color: {MUTED}">Prezențele de până acum rămân. Nu mai apare la ședințele grupei.</span>',
                     field('Din data', '10.11.2026'),
                     f'<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">{btn("Renunță", "GrupaModifica.dc.html", primary=False, full=True)}{btn("Scoate din grupă", "GrupaModifica.dc.html", full=True)}</div>', gap=14), pad='20px')
    over = lambda inner, pos: (f'<div style="position: absolute; inset: 0; background: rgba(14,26,60,0.45); display: flex; {pos}; z-index: 5">{inner}</div>')
    nm, html = phone('GrupaScoate.dc.html', 'Scoate din grupă', ehead, eadd + edit_rows() + edone, 'grupe')
    html = html.replace('<div class="ph-root" style="', '<div class="ph-root" style="position: relative; ', 1).replace('\n</div>\n', '\n' + over(f'<div style="width: 100%">{sheet}</div>', 'align-items: flex-end; padding: 0') + '</div>\n', 1)
    pages.append((nm, html))
    nm, html = desktop('DesktopGrupaScoate.dc.html', 'Scoate din grupă, desktop', 'grupe', '', 'Modifică grupa', 'Intermediari Bronze, 14 sportivi',
                       f'<div style="max-width: 640px">{edit_rows()}</div>', back=('Intermediari Bronze', 'DesktopGrupa.dc.html'))
    html = html.replace('<div class="dt-root">', '<div class="dt-root" style="position: relative">', 1).replace('</div>\n</div>\n', '</div>\n' + over(f'<div style="width: 460px">{sheet}</div>', 'align-items: center; justify-content: center') + '</div>\n', 1)
    pages.append((nm, html))

    msheet = card(col(f'<h2 style="margin: 0; {LS}; font-size: 22px">Muți pe Ana Popescu în altă grupă</h2>',
                      f'<span style="font-size: 14px; color: {MUTED}">Prezențele de până acum rămân în Intermediari Bronze.</span>',
                      field('Grupa nouă', 'Intermediari Silver', kind='select'), field('Din data', '10.11.2026'),
                      f'<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">{btn("Renunță", "GrupaModifica.dc.html", primary=False, full=True)}{btn("Mută", "GrupaModifica.dc.html", full=True)}</div>', gap=14), pad='20px')
    nm, html = phone('GrupaMuta.dc.html', 'Mută în altă grupă', ehead, eadd + edit_rows() + edone, 'grupe')
    html = html.replace('<div class="ph-root" style="', '<div class="ph-root" style="position: relative; ', 1).replace('\n</div>\n', '\n' + over(f'<div style="width: 100%">{msheet}</div>', 'align-items: flex-end; padding: 0') + '</div>\n', 1)
    pages.append((nm, html))
    nm, html = desktop('DesktopGrupaMuta.dc.html', 'Mută în altă grupă, desktop', 'grupe', '', 'Modifică grupa', 'Intermediari Bronze, 14 sportivi',
                       f'<div style="max-width: 640px">{edit_rows()}</div>', back=('Intermediari Bronze', 'DesktopGrupa.dc.html'))
    html = html.replace('<div class="dt-root">', '<div class="dt-root" style="position: relative">', 1).replace('</div>\n</div>\n', '</div>\n' + over(f'<div style="width: 460px">{msheet}</div>', 'align-items: center; justify-content: center') + '</div>\n', 1)
    pages.append((nm, html))

    g, s, c = athlete_parts()
    ac, ap = athlete_comp(), athlete_presence()
    pages.append(phone('Sportiv.dc.html', 'Sportiv', phone_head(back=('Intermediari Bronze', 'Grupa.dc.html'), h1='Ana Popescu', sub='9 ani, Școala de patinaj'), c + ap + ac + g + s, 'grupe'))
    pages.append(desktop('DesktopSportiv.dc.html', 'Sportiv, desktop', 'grupe', '', 'Ana Popescu', '9 ani, Școala de patinaj',
                         f'<div class="dt-cols">{col(c, ap, g, flex="1 1 380px")}{col(ac, s, flex="1 1 380px")}</div>', back=('Intermediari Bronze', 'DesktopGrupa.dc.html')))
    cf, cs, cl = comps_parts()
    pages.append(phone('Concursuri.dc.html', 'Concursuri', phone_head(h1='Concursuri', sub='Rezultatele sportivilor clubului'), col(cf, cs, gap=12) + cl, 'concursuri'))
    pages.append(desktop('DesktopConcursuri.dc.html', 'Concursuri, desktop', 'concursuri', '', 'Concursuri', 'Rezultatele sportivilor clubului',
                         f'<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end">{cf}<div style="width: 220px">{cs}</div></div><div style="max-width: 860px">{cl}</div>'))

    pages.append(phone('Lectie.dc.html', 'Lecție individuală', phone_head(back=('Azi', 'Azi.dc.html'), h1='Lecție individuală'), lesson_form(), None))
    pages.append(desktop('DesktopLectie.dc.html', 'Lecție individuală, desktop', 'azi', '', 'Lecție individuală', '',
                         f'<div style="max-width: 520px">{card(lesson_form(), pad="24px")}</div>', back=('Azi', 'DesktopAzi.dc.html')))


    # ---------- antrenament nou, program, o dată, lecție ----------
    def days(on):
        out = ''
        for d in ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du']:
            a = d in on
            st = f'background: {NAVY}; color: #ffffff; border: 2px solid {NAVY}' if a else f'background: #ffffff; color: {NAVY}; border: 1px solid #b9c6da'
            out += f'<span role="checkbox" aria-checked="{"true" if a else "false"}" style="height: 44px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; {st}; font-weight: 700; font-size: 14px">{d}</span>'
        return (f'<div style="display: flex; flex-direction: column; gap: 6px"><span style="font-weight: 700; font-size: 14px">Zile</span>'
                f'<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px">{out}</div></div>')
    def summary(text):
        return f'<div style="background: {ICE_L}; padding: 12px 14px; font-size: 14px; font-weight: 600">{text}</div>'
    two = lambda a, b: f'<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">{a}{b}</div>'
    def add_form(kind, repeat):
        tabs = seg([('Grup', 'Adauga.dc.html'), ('Individual', 'AdaugaIndividual.dc.html')], 0 if kind == 'grup' else 1)
        who = field('Grupa', 'Intermediari Bronze', kind='select') if kind == 'grup' else field('Sportiv', 'Maria Ionescu', kind='select')
        rep = field('Se repetă', repeat, kind='select')
        parts = [tabs, who]
        if repeat == 'Nu se repetă':
            parts += [two(field('Data', '12.11.2026'), field('Ora', '18:30')), field('Durată', '45 min' if kind != 'grup' else '60 min', kind='select'), rep]
            sm = 'Miercuri, 12 noiembrie, 18:30, o singură dată.'
        else:
            parts += [rep, days(['Ma', 'Jo']), two(field('Ora', '17:30'), field('Durată', '60 min', kind='select')),
                      two(field('Din data', '11.11.2026'), field('Până la', 'Sfârșitul sezonului', kind='select'))]
            sm = 'Marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.'
        if kind != 'grup':
            parts.append(field('Antrenor', 'Alina Gheorghe', kind='select'))
        parts += [summary(sm), btn('Adaugă antrenamentul', full=True)]
        return col(*parts, gap=18)
    for nm_, kind, repeat in [('Adauga', 'grup', 'Săptămânal'), ('AdaugaIndividual', 'individual', 'Nu se repetă')]:
        f_ = add_form(kind, repeat)
        pages.append(phone(f'{nm_}.dc.html', 'Antrenament nou', phone_head(back=('Azi', 'Azi.dc.html'), h1='Antrenament nou'), f_, None))
        pages.append(desktop(f'Desktop{nm_}.dc.html', 'Antrenament nou, desktop', 'azi', '', 'Antrenament nou', '',
                             f'<div style="max-width: 560px">{card(f_.replace(".dc.html", ".dc.html").replace("href=" + chr(34) + "Adauga", "href=" + chr(34) + "DesktopAdauga"), pad="24px")}</div>', back=('Azi', 'DesktopAzi.dc.html')))

    RULES = [('Marți, 17:30', '60 min, săptămânal, din 1 septembrie'), ('Joi, 17:30', '60 min, săptămânal, din 1 septembrie')]
    def rules_card():
        out = ''
        for i, (t, sub) in enumerate(RULES):
            b = '' if i == len(RULES) - 1 else f'border-bottom: 1px solid {LINE}; '
            out += (f'<div style="{b}display: flex; align-items: center; gap: 12px; min-height: 68px; padding: 8px 14px">'
                    f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 700; font-size: 15px">{t}</span>'
                    f'<span style="font-size: 13px; color: {MUTED}">{sub}</span></span>'
                    f'<span style="display: flex; gap: 6px; flex: none"><a href="ProgramSchimba.dc.html" style="min-height: 44px; box-sizing: border-box; padding: 0 12px; display: flex; align-items: center; border: 2px solid {NAVY}; background: #ffffff; font-weight: 700; font-size: 14px">Schimbă</a>'
                    f'<a href="ProgramSterge.dc.html" style="min-height: 44px; box-sizing: border-box; padding: 0 12px; display: flex; align-items: center; border: 2px solid {NAVY}; background: #ffffff; font-weight: 700; font-size: 14px">Șterge</a></span></div>')
        return card(out)
    DATES = [('Mar', '11', 'Marți, 17:30', '60 min', None), ('Joi', '13', 'Joi, 17:30', '60 min', ('Anulată', 'soft')),
             ('Mar', '18', 'Marți, 17:30', '60 min', None), ('Vin', '21', 'Vineri, 18:00', 'mutată din joi, 20 noiembrie', ('Mutată', 'soft')),
             ('Mar', '25', 'Marți, 17:30', '60 min', None)]
    def dates_card():
        items = [('ProgramData.dc.html', tblock(m, d), t, sub, endblock(*e) if e else None) for m, d, t, sub, e in DATES]
        return rows(items)
    ptabs = seg([('Sportivi (14)', 'Grupa.dc.html'), ('Program', 'GrupaProgram.dc.html')], 1)
    pview = seg([('Listă', '#'), ('Lună', '#')], 0)
    padd = btn('+ Adaugă program', 'Adauga.dc.html', primary=False, full=True)
    ppub = (f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 56px">'
            f'<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 700; font-size: 15px">Arată programul pe site</span>'
            f'<span style="font-size: 13px; color: {MUTED}">Programul este public, îl vede oricine pe site.</span></span>{check(True, "Arată programul pe site")}</div>')
    prog_body = col(ptabs, section('Program săptămânal', rules_card()), padd, ppub,
                    col(h2('Următoarele date'), pview, dates_card(), gap=12), gap=22)
    pages.append(phone('GrupaProgram.dc.html', 'Program grupă', phone_head(back=('Grupe', 'Grupe.dc.html'), h1='Intermediari Bronze', sub='Școala de patinaj'), prog_body, 'grupe'))
    pages.append(desktop('DesktopGrupaProgram.dc.html', 'Program grupă, desktop', 'grupe', '', 'Intermediari Bronze', 'Școala de patinaj',
                         f'<div class="dt-cols">{col(ptabs, section("Program săptămânal", rules_card()), padd, ppub, flex="1 1 380px", gap=20)}{col(h2("Următoarele date"), pview, dates_card(), flex="1 1 380px", gap=12)}</div>',
                         back=('Grupe', 'DesktopGrupe.dc.html'), topextra=btn('+ Adaugă program', 'DesktopAdauga.dc.html', primary=False)))

    def overlay_phone(nm_, title, body, inner):
        nm2, html = phone(nm_, title, phone_head(back=('Grupe', 'Grupe.dc.html'), h1='Intermediari Bronze', sub='Școala de patinaj'), body, 'grupe')
        html = html.replace('<div class="ph-root" style="', '<div class="ph-root" style="position: relative; ', 1).replace('\n</div>\n', '\n' + over(f'<div style="width: 100%">{inner}</div>', 'align-items: flex-end; padding: 0') + '</div>\n', 1)
        return (nm2, html)
    def overlay_desktop(nm_, title, inner):
        nm2, html = desktop(nm_, title, 'grupe', '', 'Intermediari Bronze', 'Școala de patinaj',
                            f'<div class="dt-cols">{col(ptabs, section("Program săptămânal", rules_card()), flex="1 1 380px")}{col(h2("Următoarele date"), dates_card(), flex="1 1 380px", gap=12)}</div>', back=('Grupe', 'DesktopGrupe.dc.html'))
        html = html.replace('<div class="dt-root">', '<div class="dt-root" style="position: relative">', 1).replace('</div>\n</div>\n', '</div>\n' + over(f'<div style="width: 460px">{inner}</div>', 'align-items: center; justify-content: center') + '</div>\n', 1)
        return (nm2, html)
    choice = lambda label, sub, on: (f'<a href="#" style="display: flex; gap: 12px; align-items: center; min-height: 60px; padding: 8px 12px; border: {"2px solid " + NAVY if on else "1px solid #b9c6da"}; background: #ffffff; text-decoration: none; color: {NAVY}">'
                                     f'<span style="width: 20px; height: 20px; box-sizing: border-box; border: 2px solid {NAVY}; background: {NAVY if on else "#ffffff"}; flex: none"></span>'
                                     f'<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 700; font-size: 15px">{label}</span><span style="font-size: 13px; color: {MUTED}">{sub}</span></span></a>')
    dsheet = card(col(f'<h2 style="margin: 0; {LS}; font-size: 22px">Joi, 13 noiembrie, 17:30</h2>',
                      f'<span style="font-size: 14px; color: {MUTED}">Schimbi doar această dată. Programul săptămânal rămâne.</span>',
                      choice('Anulează', 'Părinții văd data anulată și nota.', True), field('Notă', 'Patinoarul este închis.'),
                      choice('Mută', 'Alegi altă zi sau oră pentru această dată.', False),
                      choice('Șterge', 'Data dispare din program, fără notă.', False),
                      two(btn('Renunță', 'GrupaProgram.dc.html', primary=False, full=True), btn('Salvează', 'GrupaProgram.dc.html', full=True)), gap=12), pad='20px')
    pages.append(overlay_phone('ProgramData.dc.html', 'O dată din program', prog_body, dsheet))
    pages.append(overlay_desktop('DesktopProgramData.dc.html', 'O dată din program, desktop', dsheet))
    csheet = card(col(f'<h2 style="margin: 0; {LS}; font-size: 22px">Schimbă programul</h2>',
                      f'<span style="font-size: 14px; color: {MUTED}">Marți, 17:30. Datele de dinainte rămân cum au fost.</span>',
                      days(['Ma']), two(field('Ora', '18:00'), field('Durată', '60 min', kind='select')), field('Se aplică din', '17.11.2026'),
                      two(btn('Renunță', 'GrupaProgram.dc.html', primary=False, full=True), btn('Schimbă', 'GrupaProgram.dc.html', full=True)), gap=14), pad='20px')
    pages.append(overlay_phone('ProgramSchimba.dc.html', 'Schimbă programul', prog_body, csheet))
    pages.append(overlay_desktop('DesktopProgramSchimba.dc.html', 'Schimbă programul, desktop', csheet))
    ssheet = card(col(f'<h2 style="margin: 0; {LS}; font-size: 22px">Ștergi programul de marți?</h2>',
                      f'<span style="font-size: 14px; color: {MUTED}">Ședințele și prezențele de până atunci rămân. După data aleasă nu mai apare.</span>',
                      field('Din data', '17.11.2026'),
                      two(btn('Renunță', 'GrupaProgram.dc.html', primary=False, full=True), btn('Șterge programul', 'GrupaProgram.dc.html', full=True)), gap=14), pad='20px')
    pages.append(overlay_phone('ProgramSterge.dc.html', 'Șterge programul', prog_body, ssheet))
    pages.append(overlay_desktop('DesktopProgramSterge.dc.html', 'Șterge programul, desktop', ssheet))

    def lesson_detail():
        present = (f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 56px">'
                   f'<span style="font-weight: 700; font-size: 15px">Prezent</span>{check(True, "Prezent")}</div>')
        info = kv([('Data', 'Miercuri, 12 noiembrie'), ('Ora', '18:30, 45 min'), ('Antrenor', 'Alina Gheorghe'), ('Se repetă', 'Nu')])
        return col(info, card(present, pad='4px 14px'),
                   btn('Salvează prezența', full=True), btn('Modifică lecția', 'AdaugaIndividual.dc.html', primary=False, full=True),
                   f'<a href="#" style="min-height: 44px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px">Șterge lecția</a>', gap=16)
    pages.append(phone('LectieDetaliu.dc.html', 'Lecție individuală', phone_head(back=('Azi', 'Azi.dc.html'), kicker='Lecție individuală', h1='Maria Ionescu'), lesson_detail(), 'azi'))
    pages.append(desktop('DesktopLectieDetaliu.dc.html', 'Lecție individuală, desktop', 'azi', 'Lecție individuală', 'Maria Ionescu', '',
                         f'<div style="max-width: 520px">{lesson_detail()}</div>', back=('Azi', 'DesktopAzi.dc.html')))

    hh, hl = hist_hero(), rows(HIST)
    pages.append(phone('Istoric.dc.html', 'Istoric', phone_head(h1='Istoric'), month_picker() + hh + hl, 'istoric'))
    pages.append(desktop('DesktopIstoric.dc.html', 'Istoric, desktop', 'istoric', '', 'Istoric', '',
                         f'<div class="dt-cols">{col(hh, flex="1 1 300px")}{col(hl, flex="2 1 420px")}</div>', topextra=month_picker()))

    pages.append(phone('Profil.dc.html', 'Profil', phone_head(h1='Alina Gheorghe', sub='Antrenor'), profile_list(), 'profil'))
    pages.append(desktop('DesktopProfil.dc.html', 'Profil, desktop', 'profil', '', 'Alina Gheorghe', 'Antrenor',
                         f'<div style="max-width: 560px">{profile_list()}</div>'))

    w, p_, pw = settings_parts()
    pages.append(phone('Setari.dc.html', 'Setări cont', phone_head(back=('Profil', 'Profil.dc.html'), h1='Setări cont'), w + p_ + pw, 'profil'))
    pages.append(desktop('DesktopSetari.dc.html', 'Setări cont, desktop', 'profil', '', 'Setări cont', '',
                         f'<div class="dt-cols">{col(w, flex="1 1 380px")}{col(p_, pw, flex="1 1 380px")}</div>', back=('Profil', 'DesktopProfil.dc.html')))

    # login: phone and desktop share one centred layout
    lg = (f'<div style="min-height: 844px; box-sizing: border-box; background: {BG}; font-family: Inter, system-ui, sans-serif; color: {NAVY}; '
          f'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; padding: 32px 20px">'
          f'{big_brand()}<div style="width: 100%; max-width: 400px">{login_body()}</div></div>')
    pages.append(('Intrare.dc.html', HEAD.format(title='Intră în cont', brand_css=BRAND_CSS, extra='') + f'<div style="width: 390px">{lg}</div>\n'))
    pages.append(('DesktopIntrare.dc.html', HEAD.format(title='Intră în cont, desktop', brand_css=BRAND_CSS, extra='') + lg.replace('min-height: 844px', 'min-height: 100vh') + '\n'))
    return pages

def main():
    out = {}
    pages = build()
    names = [n for n, _ in pages]
    def ren(n): return 'Antrenor' + n
    for name, html in pages:
        for n in names:
            html = html.replace(f'href="{n}"', f'href="{ren(n)}"').replace(f'href="{n}#', f'href="{ren(n)}#')
        name = ren(name)
        w = 1280 if 'Desktop' in name else 390
        out[name] = html
        with open(P + name, 'w') as f:
            f.write(html + TAIL.format(w=w, h=844))
    print('\n'.join(out))

if __name__ == '__main__':
    main()
