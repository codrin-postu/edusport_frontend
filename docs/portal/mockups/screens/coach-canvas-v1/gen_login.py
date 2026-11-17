"""Login screens for both portals in the admin-panel style (navy L panel + brand ribbon), and a looping
login -> dashboard transition board per portal and size."""
import re, sys
sys.path.insert(0, '/private/tmp/claude-501/-Users-codrin-Documents-Programming/792234b9-ef96-4365-b85b-a0689ab19809/scratchpad/coach')
import gen_coach as g

P = g.P
# Ribbon colours: the admin login (src/admin/dashboard/loginBranding.ts), outer to inner.
GOLD, ORANGE, RUST, BURG = '#efb22b', '#ea7233', '#be3330', '#6e4256'
PASTEL = '#aabbe5'  # landing registration band (--color-pastel)

LOGIN_CSS = """
.lg{position:relative;overflow:hidden;background:#ffffff;font-family:Inter,system-ui,sans-serif;color:#0e1a3c;box-sizing:border-box}
.lg-navy{position:absolute;inset:0;background:#0e1a3c}
.lg-rib{position:absolute;inset:0;width:100%;height:100%}
.lg-brand{position:absolute;z-index:2;font-family:Inter,system-ui,sans-serif;display:flex;flex-direction:column;align-items:flex-start;gap:0}
.lg-k{font-size:12px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#8fb8f5;margin:0 0 12px}
.lg-w{font-family:'Climate Crisis',sans-serif;font-variation-settings:"YEAR" 1979;line-height:.9;color:#ffffff;margin:0;white-space:nowrap}
.lg-l{margin:16px 0 0;font-size:14px;font-weight:600;color:#c9d6ee}
.lg-form{position:absolute;z-index:3}
/* desktop: the admin panel geometry, 1000x600 viewBox stretched */
.lg.dt{width:100%;height:100vh;min-height:760px}
.lg.dt .lg-navy{clip-path:inset(0 47.5% 9.2% 0 round 0 0 122px 0)}
.lg.dt .lg-brand{top:56px;left:56px}
.lg.dt .lg-w{font-size:62px}
.lg.dt .lg-form{top:50%;right:7%;width:400px;transform:translateY(-50%)}
/* phone: white page, brand at the top, the landing wave band along the bottom edge */
.lg.ph{width:390px;height:844px}
.lg.ph .lg-navy{display:none}
.lg.ph .lg-rib{top:auto;bottom:0;height:168px}
.lg.ph .lg-brand{top:40px;left:24px}
.lg.ph .lg-k{color:#495269}
.lg.ph .lg-w{font-size:31px;color:#0e1a3c}
.lg.ph .lg-l{color:#495269}
.lg.ph .lg-form{left:20px;right:20px;top:176px}
@media (max-width:900px){.lg.dt .lg-navy{clip-path:inset(0 0 70% 0)}.lg.dt .lg-rib{display:none}.lg.dt .lg-form{left:20px;right:20px;width:auto;top:auto;bottom:24px;transform:none}.lg.dt .lg-w{font-size:40px}}
"""

def ribbon(kind):
    if kind == 'dt':
        return (f'<svg class="lg-rib" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" aria-hidden="true"><g stroke-width="33">'
                f'<path d="M-40,590 H430 A140,140 0 0 0 570,450 V-40" stroke="{GOLD}"/>'
                f'<path d="M-40,560 H430 A110,110 0 0 0 540,450 V-40" stroke="{ORANGE}"/>'
                f'<path d="M-40,530 H430 A80,80 0 0 0 510,450 V-40" stroke="{RUST}"/>'
                f'<path d="M-40,500 H430 A50,50 0 0 0 480,450 V-40" stroke="{BURG}"/></g></svg>')
    # phone: the landing page's warm wave band (RegistrationWaveDivider) along the bottom edge, gold
    # on top to burgundy, four touching 40 px stripes; the burgundy runs on past the bottom edge
    def wave(b):
        return (f'M-40,{b} C60,{b + 12} 150,{b - 10} 230,{b + 2} '
                f'C300,{b + 12} 350,{b - 8} 430,{b + 4}')
    paths = f'<rect x="-40" y="150" width="470" height="80" fill="{BURG}"/>'
    for y, c in ((150, BURG), (110, RUST), (70, ORANGE), (30, GOLD)):
        paths += f'<path d="{wave(y)}" stroke="{c}"/>'
    return f'<svg class="lg-rib" viewBox="0 0 390 168" fill="none" aria-hidden="true" style="overflow:hidden"><g stroke-width="40">{paths}</g></svg>'

def login(kind, portal):
    form = g.login_body().replace('box-shadow: 8px 8px 0 rgba(14,26,60,0.16)', 'box-shadow: 8px 8px 0 rgba(14,26,60,0.16)', 1)
    return (f'<div class="lg {kind}"><div class="lg-navy"></div>{ribbon(kind)}'
            f'<div class="lg-brand"><p class="lg-k">Clubul Sportiv</p><p class="lg-w">EDUSPORT</p><p class="lg-l">{portal}</p></div>'
            f'<div class="lg-form">{form}</div></div>')

# ---------- transition ----------

TR_CSS = """
.tr{position:relative;overflow:hidden;background:#f6f9fd}
.tr.ph{width:390px;height:844px}.tr.dt{width:1280px;height:800px}
.tr-dash,.tr-login,.tr-fade{position:absolute;inset:0}
.tr-dash{overflow:hidden}
.tr-login{animation:trLogin 6s linear infinite}
.tr-fade{background:#0e1a3c;opacity:0;pointer-events:none;animation:trFade 6s linear infinite}
.tr-rib path{stroke-dasharray:100 100;stroke-dashoffset:0;animation:trSlide 6s cubic-bezier(.55,0,.75,.35) infinite}
.tr-rib path:nth-child(4){animation-delay:0s}.tr-rib path:nth-child(3){animation-delay:.05s}
.tr-rib path:nth-child(2){animation-delay:.1s}.tr-rib path:nth-child(1){animation-delay:.15s}
.tr-press{animation:trPress 6s linear infinite}
.tr-tag{position:absolute;right:12px;bottom:12px;z-index:9;background:#0e1a3c;color:#fff;font:700 11px Inter,system-ui,sans-serif;padding:6px 8px;opacity:.85}
@keyframes trPress{0%,21%{filter:none}22%,25%{filter:brightness(1.7)}26%,100%{filter:none}}
@keyframes trSlide{0%,25%{stroke-dashoffset:0}38%,100%{stroke-dashoffset:-100}}
@keyframes trFade{0%,35%{opacity:0}43%,63%{opacity:1}73%,100%{opacity:0}}
@keyframes trLogin{0%,43%{opacity:1}44%,100%{opacity:0}}
@keyframes trMark{0%,41%{opacity:0}47%,63%{opacity:1}70%,100%{opacity:0}}
.tr-mark{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;pointer-events:none;animation:trMark 6s linear infinite}
.tr-mark .k{font:700 12px Inter,system-ui,sans-serif;letter-spacing:.28em;color:#8fb8f5}
.tr-mark .w{font-family:'Climate Crisis',sans-serif;font-variation-settings:"YEAR" 1979;color:#fff;line-height:.9;white-space:nowrap}
.tr.ph .tr-mark .w{font-size:44px}.tr.dt .tr-mark .w{font-size:84px}
@media (prefers-reduced-motion:reduce){.tr-login,.tr-fade{display:none}}
"""

def brand_html(portal, cls='lg-brand'):
    return f'<div class="{cls}"><p class="lg-k">Clubul Sportiv</p><p class="lg-w">EDUSPORT</p><p class="lg-l">{portal}</p></div>'

def stripes():
    return '<div class="stripes">' + ''.join(f'<span style="background:{c}"></span>' for c in (BURG, RUST, ORANGE, GOLD)) + '</div>'

def transition(kind, portal, dash_html):
    lg = login(kind, portal).replace('class="lg-rib"', 'class="lg-rib tr-rib"').replace('<path ', '<path pathLength="100" ')
    lg = lg.replace('justify-content: center; background: #0e1a3c; color: #ffffff; border: 2px solid #0e1a3c', 'justify-content: center; background: #0e1a3c; color: #ffffff; border: 2px solid #0e1a3c" class="tr-press', 1)
    return (f'<div class="tr {kind}"><div class="tr-dash">{dash_html}</div>'
            f'<div class="tr-login">{lg}</div><div class="tr-fade"></div><div class="tr-mark"><span class="k">CLUBUL SPORTIV</span><span class="w">EDUSPORT</span></div>'
            f'<span class="tr-tag">Animație în buclă, 6 s</span></div>')

def body_of(html):
    return html.split('</helmet>\n', 1)[1].split('</x-dc>', 1)[0]

def page(title, inner, w, h):
    head = g.HEAD.format(title=title, brand_css=g.BRAND_CSS, extra=g.DT_CSS + LOGIN_CSS + TR_CSS)
    return head + inner + '\n' + g.TAIL.format(w=w, h=h)

def main():
    coach = {n: h for n, h in g.build()}
    sp_ph = body_of(open(P + 'Main.dc.html').read())
    sp_dt = body_of(open(P + 'DesktopMain.dc.html').read())
    out = {
        'AntrenorIntrare.dc.html': page('Intră în cont, antrenor', login('ph', 'Portal antrenor'), 390, 844),
        'AntrenorDesktopIntrare.dc.html': page('Intră în cont, antrenor, desktop', login('dt', 'Portal antrenor'), 1280, 800),
        'Intrare.dc.html': page('Intră în cont, sportiv', login('ph', 'Portal sportiv'), 390, 844),
        'DesktopIntrare.dc.html': page('Intră în cont, sportiv, desktop', login('dt', 'Portal sportiv'), 1280, 800),
        'AntrenorTranzitie.dc.html': page('Intrare în aplicație, antrenor', transition('ph', 'Portal antrenor', body_of(coach['Azi.dc.html'])), 390, 844),
        'AntrenorDesktopTranzitie.dc.html': page('Intrare în aplicație, antrenor, desktop', transition('dt', 'Portal antrenor', body_of(coach['DesktopAzi.dc.html'])), 1280, 800),
        'Tranzitie.dc.html': page('Intrare în aplicație, sportiv', transition('ph', 'Portal sportiv', sp_ph), 390, 844),
        'DesktopTranzitie.dc.html': page('Intrare în aplicație, sportiv, desktop', transition('dt', 'Portal sportiv', sp_dt), 1280, 800),
    }
    for n, html in out.items():
        open(P + n, 'w').write(html)
    print('\n'.join(out))

if __name__ == '__main__':
    main()
