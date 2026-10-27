# Phase 4 admin mockups (groups, schedules, breaks, migration).
# CSS = the real admin CSS strings (tokensCss + UI_CSS + SHELL_CSS + SPORTIVI_CSS + CAL_CSS),
# extracted from edusport_backend worktree p3be with esbuild into CSS_DIR.
# Usage: python3 gen_phase4.py <css_dir>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
CSS_DIR = sys.argv[1]
MOCK = os.path.abspath(os.path.join(HERE, '..', '..'))
LIGHT = open(os.path.join(MOCK, 'companion-light.html')).read().strip()
REAL = ''.join(open(os.path.join(CSS_DIR, f + '.css')).read() + '\n' for f in ['tokens', 'ui', 'shell', 'sportivi', 'cal'])

# ---------------------------------------------------------------- frame css
P4 = r'''
html,body{margin:0;background:#f5f5f7}
.p4-frame *,.p4-frame{animation:none!important;transition:none!important}
.p4-intro{font:14px/1.5 system-ui,-apple-system,sans-serif;color:#1d1d1f;background:#fff;padding:20px 16px;border-bottom:1px solid #d1d1d6}
.p4-intro h2{margin:0 0 6px;font-size:18px}.p4-intro p{margin:4px 0 0}.p4-intro ol{margin:6px 0 0;padding-left:20px}
.p4-cap{font:600 13px/1.4 system-ui,-apple-system,sans-serif;color:#1d1d1f;background:#e5e5e7;padding:10px 16px;margin:0;border-top:3px solid #0e1a3c}
.p4-opt{display:block;padding:0;border:0;background:none;margin:0}
.p4-frame{position:relative;overflow:hidden;background:var(--palette-grey-150,#eef0f4)}
.p4-frame.dk{min-height:900px}
.p4-frame.ph{min-height:844px;width:100%}
@media (max-width:640px){.p4-frame.dk{display:none}}
@media (min-width:641px){.p4-frame.ph{display:none}}
.p4-frame .esd-side{position:absolute!important;height:100%!important}
.p4-main{margin-left:236px;min-height:900px;display:flex;flex-direction:column}
.p4-main > .ui-root.ui-page{flex:1}
.p4-frame .ui-root.ui-modal-layer,.p4-frame .ui-root.ui-drawer-layer,.p4-frame .ui-root.ui-sheet-layer{position:absolute!important}
.p4-frame .ui-root.ui-toast-viewport{position:absolute!important}
.p4-frame .ui-root.ui-pop{position:absolute!important}
.p4-frame .ui-sheet--full{height:100%!important;max-height:100%!important}
.p4-frame .ui-sheet{max-height:92%!important}
.p4-frame.ph .edu-mnav-burger{position:absolute!important}
.p4-top{height:62px;background:var(--theme-surface);border-bottom:1px solid var(--theme-border);display:flex;align-items:center;padding:0 16px}
.p4-top .mk{width:28px;height:28px;border-radius:var(--ui-radius-md);background:var(--palette-blue-600);color:#fff;font:800 11px/28px system-ui;text-align:center}
/* small additions, tokens only */
.ui-root .p4-fg{border-color:var(--theme-cat-eveniment)!important}
.ui-root .p4-fg-n{display:inline-block;min-width:18px;padding:0 5px;font-size:11px;font-weight:800;line-height:18px;text-align:center;background:var(--theme-cat-eveniment-soft-fg);color:var(--theme-cat-eveniment-soft);border-radius:var(--ui-radius-sm)}
.ui-root .p4-line{padding:10px 18px;border-bottom:1px solid var(--theme-border);font-size:12.5px;color:var(--theme-text-muted)}
.ui-root .p4-muted{color:var(--theme-text-muted)}
.ui-root .p4-gname{font-weight:600;color:var(--theme-text)}
.ui-root .p4-dots{min-width:30px}
.ui-root .p4-rowbtn{text-align:right;width:44px}
.ui-root .p4-ser{display:flex;align-items:baseline;gap:12px;padding:9px 0;border-bottom:1px solid var(--theme-border-subtle)}
.ui-root .p4-ser:last-child{border-bottom:none}
.ui-root .p4-ser b{font-weight:600}
.ui-root .p4-ser .spv-link{margin-left:auto}
.p4-frame .p4-agp{width:440px;padding:0}
.p4-frame .p4-agp .r{display:flex;gap:12px;align-items:flex-end;padding:10px 14px;border-bottom:1px solid var(--theme-border)}
.p4-frame .p4-agp .nm{flex:1;min-width:0}
.p4-frame .p4-agp small{display:block;color:var(--theme-text-muted);font-size:12px;margin:1px 0 6px}
.p4-frame .p4-agp .hd{font-weight:700;align-items:center}
.p4-frame .p4-agp .ft2{display:flex;justify-content:flex-end;padding:10px 14px}
.p4-frame .p4-agp .ui-cbx{flex:1;position:relative}
.p4-frame .p4-agp .ln{display:flex;gap:10px;align-items:center}
.ui-root .p4-mv .l{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);margin-bottom:3px}
.ui-root .p4-mv .v{font-size:15px;font-weight:600;color:var(--theme-text)}
.ui-root .p4-mv .ft3{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;align-items:start}
.ui-root .p4-mv hr{border:0;border-top:1px solid var(--theme-border);margin:14px -15px}
.ui-root .p4-mv .row{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.ui-root .p4-mv .abt{font-weight:700;color:var(--theme-text)}
.ui-root .p4-mv .abe{color:var(--theme-text-muted)}
.ui-root .p4-mv .cap{margin-top:5px;font-size:12px;color:var(--theme-text-muted)}
.ui-root .p4-mv .seg{display:flex;gap:3px;margin-top:8px}
.ui-root .p4-mv .seg i{flex:1;height:8px;background:var(--theme-border);border-radius:2px}
.ui-root .p4-mv .seg i.u{background:var(--theme-primary)}
.ui-root .p4-two{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:16px;align-items:start}
.ui-root .p4-days{display:flex;flex-wrap:wrap;gap:4px}
.ui-root .p4-dayt{min-width:36px;height:32px;padding:0 6px;border:1px solid var(--theme-border-strong);border-radius:var(--ui-radius-sm);background:var(--theme-surface);color:var(--theme-text-secondary);font:700 var(--ui-fs-body-sm) var(--ui-font)}
.ui-root .p4-dayt[aria-pressed="true"]{background:var(--theme-primary);border-color:var(--theme-primary);color:var(--theme-on-primary)}
.ui-root .p4-g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
.ui-root .p4-cardrow{display:flex;align-items:flex-start;gap:8px}
.ui-root .p4-cardrow .spv-card{flex:1}
.ui-root .p4-wk .cal-day{min-height:120px;cursor:default}
.ui-root .p4-brk .cal-ev{opacity:.9}
.ui-root .p4-q{display:inline-block;min-width:18px;padding:0 5px;font-size:11px;font-weight:800;line-height:18px;text-align:center;background:var(--theme-warning-bg);color:var(--theme-warning);border:1px solid var(--theme-warning-border);border-radius:var(--ui-radius-sm)}
.ui-root .p4-src{font-size:12px;color:var(--theme-text-muted)}
.ui-root .p4-old{font-family:var(--ui-font-mono);font-size:12.5px}
.ui-root .p4-hint{font-size:12px;color:var(--theme-text-muted);margin:0}
.ui-root .p4-chk{display:flex;align-items:center;gap:8px}
'''

# ---------------------------------------------------------------- icons (src/admin/ui/icons.tsx)
def svg(p, s=14, box=14): return f'<svg width="{s}" height="{s}" viewBox="0 0 {box} {box}" fill="none" aria-hidden="true" focusable="false">{p}</svg>'
I_PLUS = svg('<path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.6"/>')
I_CLOSE = svg('<path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" stroke-width="1.6"/>')
I_DOWN = svg('<path d="M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" stroke-width="1.6"/>', 12)
I_LEFT = svg('<path d="M8.5 3.5L5 7l3.5 3.5" stroke="currentColor" stroke-width="1.6"/>')
I_RIGHT = svg('<path d="M5.5 3.5L9 7l-3.5 3.5" stroke="currentColor" stroke-width="1.6"/>')
I_SEARCH = svg('<path d="M1.75 1.75h7.5v7.5h-7.5zM9.25 9.25l3.25 3.25" stroke="currentColor" stroke-width="1.5"/>')
I_CHECK = svg('<path d="M3 7.5l2.6 2.6L11 4.5" stroke="currentColor" stroke-width="1.6"/>', 12)
I_CLOCK = svg('<rect x="1.75" y="1.75" width="10.5" height="10.5" stroke="currentColor" stroke-width="1.4"/><path d="M7 4v3.3h2.5" stroke="currentColor" stroke-width="1.4"/>')
BACK_ARROW = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>'

def ico(paths):  # shell icons (EdusportShell ICON_PATHS)
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths}</svg>'
SH = {
 'house': '<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 'bell': '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
 'gear': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.35.41.64.76.83H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
 'feather': '<path d="M20 12a8 8 0 0 0-8-8 8 8 0 0 0-8 8v8h8a8 8 0 0 0 8-8z"/><path d="M8 20l8-8"/>',
 'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 'user': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
 'grid': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 'book': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
}
def chev(open_): return f'<svg class="esd-chev{" open" if open_ else ""}" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

GROUPS_MENU = [
 ('forms', 'Formulare', 'feather', ['Formulare', 'Înscrieri', 'Voluntari', 'Parteneri', 'Contact']),
 ('program', 'Program și calendar', 'calendar', ['Calendar și serii']),
 ('club', 'Club și școală', 'user', ['Grupe', 'Sportivi']),
 ('team', 'Sportivi și echipă', 'user', ['Membri echipă', 'Competiții', 'Discipline']),
 ('pages', 'Pagini site', 'grid', ['Pagina principală', 'Cursuri', 'Prețuri']),
 ('content', 'Articole și media', 'book', ['Articole']),
 ('system', 'Sistem', 'gear', ['Media']),
]
def shell(open_group, active, program_links=None):
    nav = f'<a href="#" class="">{ico(SH["house"])}<span class="esd-lbl">Acasă</span></a>'
    for lbl, ic in [('Anunțuri', 'bell'), ('Setări site', 'gear'), ('Sezoane', 'calendar'), ('Meniu site', 'grid')]:
        nav += f'<a href="#">{ico(SH[ic])}<span class="esd-lbl">{lbl}</span></a>'
    for key, label, icon, links in GROUPS_MENU:
        if key == 'program' and program_links: links = program_links
        op = key == open_group
        subs = ''.join(f'<a href="#" class="esd-sub{" on" if l == active else ""}">{l}</a>' for l in links) if op else ''
        nav += f'<div class="esd-group"><button type="button" class="esd-grp-btn" aria-expanded="{str(op).lower()}">{ico(SH[icon]).replace("<svg ", "<svg class=\"esd-gicon\" ",1)}<span class="esd-glabel">{label}</span>{chev(op)}</button>{subs}</div>'
    caret = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>'
    return (f'<aside class="esd-side" aria-label="Navigare EduSport"><div class="esd-brand"><span class="mark">ES</span><span class="esd-brand-text"><b>EduSport</b><small>Panou</small></span><button type="button" class="esd-collapse" aria-label="Pliază bara">{caret}</button></div>'
            f'<nav class="esd-nav">{nav}</nav>'
            '<div class="esd-foot"><div class="esd-who"><span class="esd-av">A</span><span class="esd-mail">admin@example.com</span></div><div class="esd-acts"><a class="esd-act" href="#">Contul meu</a><button class="esd-act out" type="button">Ieși din cont</button></div><button class="esd-switch" type="button">Comută la meniul Strapi</button></div></aside>')

# ---------------------------------------------------------------- components (class names from src/admin/ui)
def btn(t, v='primary', sm=False, icon='', cls='', iconOnly=False, label=None):
    c = f'ui-btn ui-btn--{v}' + (' ui-btn--sm' if sm else '') + (' ui-btn--icon' if iconOnly else '') + (f' {cls}' if cls else '')
    al = f' aria-label="{label}"' if label else ''
    return f'<button type="button" class="{c}"{al}>{icon}{"" if iconOnly else t}</button>'
def menu_btn(): return '<button type="button" class="ui-btn ui-btn--secondary ui-btn--sm p4-dots"><span aria-hidden="true">...</span><span class="ui-sr">Mai multe acțiuni</span></button>'
def ph(title, sub=None, actions='', back=None):
    b = f'<a class="ui-ph-back" href="#">{BACK_ARROW}{back}</a>' if back else ''
    s = f'<p class="ui-ph-sub">{sub}</p>' if sub else ''
    a = f'<div class="ui-ph-actions">{actions}</div>' if actions else ''
    return f'<header class="ui-ph"><div>{b}<h1 class="ui-ph-title">{title}</h1>{s}</div>{a}</header>'
def select(val, cls='', style=''):
    return f'<button type="button" role="combobox" class="ui-input ui-sel {cls}" style="{style}"><span class="ui-sel-val"><span data-on="true">{val}</span></span><span class="ui-sel-chev" aria-hidden="true">{I_DOWN}</span></button>'
def tabs(items, on, cls=''):
    out = ''
    for lbl, cnt in items:
        c = f'<span class="ui-tab-count ui-num">{cnt}</span>' if cnt is not None else ''
        out += f'<button type="button" role="tab" aria-selected="{"true" if lbl == on else "false"}" class="ui-tab">{lbl}{c}</button>'
    return f'<div role="tablist" class="ui-tabs {cls}">{out}</div>'
def field(label, ctrl, hint=None):
    h = f'<div class="ui-hint">{hint}</div>' if hint else ''
    return f'<div class="ui-field"><label class="ui-label">{label}</label>{ctrl}{h}</div>'
def inp(v, ph_=''): return f'<input class="ui-input" value="{v}" placeholder="{ph_}">'
def timein(v): return f'<span class="ui-root ui-time"><button type="button" class="ui-time-btn" aria-label="Alege ora">{I_CLOCK}</button><input type="text" class="ui-input" value="{v}"></span>'
def cbx(v, placeholder=''):
    return f'<div class="ui-root ui-cbx"><input class="ui-input" role="combobox" value="{v}" placeholder="{placeholder}" readonly><span class="ui-cbx-actions"><button type="button" class="ui-iconbtn ui-iconbtn--sm">{I_DOWN}</button></span></div>'
def seg(opts, on, block=True):
    return '<div role="radiogroup" class="ui-root ui-seg' + (' ui-seg--block' if block else '') + '">' + ''.join(f'<button type="button" role="radio" aria-checked="{"true" if o == on else "false"}" class="ui-seg-opt">{o}</button>' for o in opts) + '</div>'
def switch(label, on=True):
    return f'<button type="button" role="switch" aria-checked="{"true" if on else "false"}" class="ui-switch"><span class="ui-switch-track" aria-hidden="true"><span class="ui-switch-thumb"></span></span><span class="ui-switch-text"><span>{label}</span></span></button>'
def check(label, on=True): return f'<label class="ui-check"><input type="checkbox" {"checked" if on else ""}><span>{label}</span></label>'
def badge(t, tone='neutral'): return f'<span class="ui-badge ui-badge--sm ui-badge--{tone}">{t}</span>'
def notice(body, tone='warning', title=None, action=''):
    t = f'<b class="ui-notice-title">{title}</b>' if title else ''
    a = f'<div class="ui-notice-action">{action}</div>' if action else ''
    return f'<div class="ui-notice ui-notice--{tone}"><span class="ui-notice-mark" aria-hidden="true"></span><div class="ui-notice-text">{t}<span class="ui-notice-body">{body}</span></div>{a}</div>'
def section(title, body, aside='', footer=''):
    f = f'<div class="ui-sec-f">{footer}</div>' if footer else ''
    return f'<section class="ui-sec"><div class="ui-sec-h"><h2 class="ui-sec-title">{title}</h2>{aside}</div><div class="ui-sec-b">{body}</div>{f}</section>'
def table(heads, rows, click=True):
    th = ''.join(f'<th scope="col"{" class=\"p4-rowbtn\"" if h == "" else ""}>{h}</th>' for h in heads)
    trs = ''.join(f'<tr class="{"ui-table-click" if click else ""}">' + ''.join(f'<td{" class=\"p4-rowbtn\"" if heads[i] == "" else ""}>{c}</td>' for i, c in enumerate(r)) + '</tr>' for r in rows)
    return f'<div class="ui-table-wrap"><table class="ui-table"><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table></div>'
def toast(text, undo=True, top=16):
    a = btn('Anulează', 'ghost', True, cls='ui-toast-action') if undo else btn('', 'ghost', True, I_CLOSE, 'ui-toast-close', True, 'Închide')
    return f'<div class="ui-root ui-toast-viewport" style="top:{top}px"><div class="ui-toast ui-toast--success" role="status"><div class="ui-toast-text"><span class="ui-toast-body">{text}</span></div>{a}</div></div>'
def modal(title, body, footer, size='md'):
    return f'<div class="ui-root ui-modal-layer"><div class="ui-modal ui-modal--{size}" role="dialog"><div class="ui-modal-h"><h2 class="ui-modal-title">{title}</h2></div><div class="ui-modal-b">{body}</div><div class="ui-modal-f">{footer}</div></div></div>'
def drawer(title, body, footer, sub=''):
    s = f'<div class="ui-drawer-sub">{sub}</div>' if sub else ''
    return (f'<div class="ui-root ui-drawer-layer"><div class="ui-drawer cal-drawer" role="dialog"><div class="ui-drawer-h"><h2 class="ui-drawer-title">{title}</h2>{btn("", "ghost", True, I_CLOSE, "", True, "Închide")}</div>{s}'
            f'<div class="ui-drawer-b">{body}</div><div class="ui-drawer-f">{footer}</div></div></div>')
def dsec(title, body): return f'<section class="ui-dsec"><div class="ui-dsec-h"><h3 class="ui-dsec-title">{title}</h3></div><div class="ui-dsec-b">{body}</div></section>'
def sheet(title, body, footer='', full=False):
    f = f'<div class="ui-sheet-f">{footer}</div>' if footer else ''
    return (f'<div class="ui-root ui-sheet-layer"><div class="ui-sheet{" ui-sheet--full" if full else ""}" role="dialog"><div class="ui-sheet-h"><span class="ui-sheet-grab" aria-hidden="true"></span><div class="ui-sheet-hrow"><h2 class="ui-sheet-title">{title}</h2>{btn("", "ghost", True, I_CLOSE, "", True, "Închide")}</div></div>'
            f'<div class="ui-sheet-b">{body}</div>{f}</div></div>')
def pop_menu(items, style):
    return f'<div class="ui-root ui-pop spv-menu" role="menu" style="{style}">' + ''.join(f'<button type="button" role="menuitem"{" class=\"spv-danger\"" if d else ""}>{t}</button>' for t, d in items) + '</div>'
def win(inner): return f'<div class="ui-win">{inner}</div>'
def page(inner, fit=False): return f'<div class="ui-root ui-page ui-stack{" ui-page--fit" if fit else ""}">{inner}</div>'

def desk(shell_html, body, overlay=''):
    return f'<div class="p4-frame dk">{shell_html}<div class="p4-main">{body}</div>{overlay}</div>'
def phone(body, *overlays):
    overlay = ''.join(overlays)
    burger = '<div class="ui-root"><button type="button" class="edu-mnav-burger" aria-label="Deschide meniul" style="top:12px;right:12px"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.8"/></svg></button></div>'
    return f'<div class="p4-frame ph"><div class="p4-top"><span class="mk">ES</span></div>{burger}{body}{overlay}</div>'
def state(cap, d, p, choice=None):
    if choice:
        return f'<section class="p4-opt option" data-choice="{choice}" onclick="typeof toggleSelect===\'function\'&&toggleSelect(this)"><p class="p4-cap">{cap}</p>{d}{p}</section>'
    return f'<section><p class="p4-cap">{cap}</p>{d}{p}</section>'
def doc(title, intro, states):
    NAVCSS = '.ui-root .edu-mnav-burger{position:fixed;top:12px;right:12px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;padding:0;border:1px solid var(--theme-border-strong);border-radius:var(--ui-radius-sm);background:var(--theme-surface);color:var(--theme-primary);cursor:pointer;box-shadow:var(--theme-shadow-sm);z-index:99998}'
    return (f'<!DOCTYPE html><html lang="ro" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title>'
            f'{LIGHT}<style>{REAL}{NAVCSS}{P4}</style></head><body><div class="p4-intro">{intro}</div>{"".join(states)}</body></html>')

def write(name, html):
    open(os.path.join(HERE, name), 'w').write(html)
    print(name, len(html))

# ================================================================= data
SEASON = 'Sezon 2026-2027'
SCOALA = [  # name, program, coaches, count
 ('Avansați Gold', 'Sâ, Du 09:00', None, 8),
 ('Primii Pași', 'Sâ, Du 10:00', None, 14),
 ('Intermediari Silver', 'Sâ, Du 10:00', 'Virgil Pascu', 16),
 ('Avansați Silver', 'Sâ, Du 10:00', None, 9),
 ('Începători', 'Sâ, Du 11:00', None, 12),
 ('Intermediari Bronze', 'Sâ, Du 11:00', 'Virgil Pascu', 11),
 ('Avansați Bronze', 'Sâ, Du 11:00', None, 7),
]
CLUB = [
 ('Profesioniști', 'Lu, Mi, Vi 18:00', 'Andreea Pascu', 6),
 ('Avansați', 'Lu, Mi 17:00<br>Sâ 09:00', 'Andreea Pascu', 10),
]
NO_COACH = '<span class="p4-muted">Fără antrenor</span>'
UNASSIGNED = [  # name, source, proposal
 ('Elisa Georgescu', 'Înscriere Școală, 12 ani', 'Intermediari Bronze'),
 ('Matei Georgescu', 'Înscriere Școală, 7 ani', 'Primii Pași'),
 ('Luca Stoica', 'Adăugat în Sportivi, 13 ani', ''),
]
ROSTER = [  # name, age, main?, other groups
 ('Ana Ionescu', 12, True, ''), ('Bianca Radu', 9, True, ''), ('Carla Pop', 12, True, ''),
 ('Daria Stan', 11, False, 'Avansați (principală)'), ('Elisa Radu', 14, True, ''), ('Filip Radu', 13, True, 'Profesioniști'),
 ('Gabriel Pop', 8, True, ''), ('Horia Stan', 7, True, ''), ('Irina Radu', 10, True, ''), ('Matei Ionescu', 9, True, ''), ('Sofia Tănase', 10, True, ''),
]
GROUP = 'Intermediari Bronze'
GROUP_SUB = 'Școala de patinaj, Virgil Pascu, lista Standard, 11 sportivi'

def fara_grupa_btn(n=3): return f'<button type="button" class="ui-btn ui-btn--secondary p4-fg">Fără grupă <span class="p4-fg-n ui-num">{n}</span></button>'
def add_group_btn(): return btn('Grupă nouă', 'primary', icon=I_PLUS)

# ================================================================= 1. grupe-list
def grupe_table(club=False):
    rows = []
    for n, p, c, k in (CLUB if club else SCOALA):
        rows.append([f'<a class="spv-name" href="#">{n}</a>', p, c or NO_COACH, f'<span class="ui-num">{k}</span>'])
    return table(['Grupă', 'Program', 'Antrenori', 'Sportivi'], rows)
def grupe_page(club=False, n=3):
    acts = (fara_grupa_btn(n) if n else '') + add_group_btn()
    tool = f'<div class="spv-toolbar">{select(SEASON, "spv-season")}</div>'
    line = '<div class="p4-line">15 sportivi în 2 grupe</div>' if club else '<div class="p4-line">77 sportivi în 7 grupe</div>'
    tb = tabs([('Școala de patinaj', 7), ('Club', 2)], 'Club' if club else 'Școala de patinaj', 'spv-tabs')
    return page(win(ph('Grupe', None, acts) + tool + tb + line + grupe_table(club)))
def agp(rows, style):
    out = f'<div class="ui-root ui-pop p4-agp" style="{style}"><div class="r hd"><span>{len(rows)} sportivi fără grupă</span></div>'
    for n, s, g in rows:
        out += f'<div class="r"><div class="nm"><b>{n}</b><small>{s}</small><div class="ln">{cbx(g, "Alege grupa")}{btn("Alocă", "primary", True)}</div></div></div>'
    return out + '<div class="ft2">' + btn('Alocă toți în grupele propuse', 'ghost', True) + '</div></div>'
def grupe_phone(club=False, n=3):
    acts = f'<div style="display:flex;gap:8px;flex-wrap:wrap">{(fara_grupa_btn(n) if n else "")}{add_group_btn()}</div>'
    cards = ''
    for g, p, c, k in (CLUB if club else SCOALA):
        cards += f'<li><button type="button" class="spv-card"><span class="spv-name">{g}</span><span class="spv-sub2">{p.replace("<br>", ", ")}, {k} sportivi</span><span class="spv-sub2">{c or "Fără antrenor"}</span></button></li>'
    head = f'<header class="ui-ph" style="flex-direction:column;align-items:stretch"><div><h1 class="ui-ph-title">Grupe</h1></div>{acts}</header>'
    tool = f'<div class="spv-toolbar">{select(SEASON, "spv-season")}</div>'
    tb = tabs([('Școala de patinaj', 7), ('Club', 2)], 'Club' if club else 'Școala de patinaj', 'spv-tabs')
    return page(win(head + tool + tb + f'<p class="spv-count">{"15 sportivi în 2 grupe" if club else "77 sportivi în 7 grupe"}</p><ul class="spv-cards">{cards}</ul>'))
def sheet_unassigned(rows):
    body = ''
    for n, s, g in rows:
        body += f'<div style="padding:10px 0;border-bottom:1px solid var(--theme-border)"><b>{n}</b><div class="spv-sub2" style="margin:1px 0 6px">{s}</div><div class="p4-agp" style="width:auto"><div class="ln" style="display:flex;gap:8px;align-items:center">{cbx(g, "Alege grupa")}{btn("Alocă", "primary", True)}</div></div></div>'
    return sheet(f'{len(rows)} sportivi fără grupă', body, btn('Alocă toți în grupele propuse', 'secondary'))

def build_grupe():
    sh = shell('club', 'Grupe')
    intro = ('<h2>Grupe: list page</h2><p>Menu "Club și școală" > "Grupe". Tabs per section, season like Sportivi, "+ Grupă nouă" creates in the open tab. '
             'Orange "Fără grupă" opens the allocation dropdown (pending-groups-v1, aloca-v2); it disappears at 0. Counts per group, the line counts distinct athletes.</p>'
             '<p>Groups with no coach set show "Fără antrenor" (only Virgil Pascu and Andreea Pascu are known).</p>')
    s = []
    s.append(state('1. Școala de patinaj tab', desk(sh, grupe_page()), phone(grupe_phone())))
    s.append(state('2. Club tab', desk(sh, grupe_page(True)), phone(grupe_phone(True))))
    s.append(state('3. "Fără grupă" open: proposed group preselected, "Alocă" per row, "Alocă toți" at the bottom',
                   desk(sh, grupe_page(), agp(UNASSIGNED, 'top:62px;right:150px')),
                   phone(grupe_phone(), sheet_unassigned(UNASSIGNED))))
    opts = [(g, 'Școala de patinaj') for g, *_ in SCOALA] + [(g, 'Club') for g, *_ in CLUB]
    lst = '<div class="ui-root ui-pop ui-list" role="listbox" style="top:{t}px;right:{r}px;width:{w}px">' + ''.join(
        f'<div class="ui-opt" role="option"{" data-active=\"true\"" if g == "Profesioniști" else ""}><span>{g}</span><span class="ui-opt-hint">{h}</span></div>' for g, h in opts) + '</div>'
    s.append(state('4. Row without a proposal: the group list (SearchableSelect), section as hint',
                   desk(sh, grupe_page(), agp(UNASSIGNED, 'top:62px;right:150px') + lst.format(t=404, r=229, w=348)),
                   phone(grupe_phone(), sheet_unassigned(UNASSIGNED) + lst.format(t=470, r=96, w=250))))
    s.append(state('5. After "Alocă": toast with "Anulează", count 2',
                   desk(sh, grupe_page(n=2), toast('Elisa Georgescu alocată în Intermediari Bronze.')),
                   phone(grupe_phone(n=2), toast('Elisa Georgescu alocată în Intermediari Bronze.', top=72))))
    write('grupe-list.html', doc('Phase 4: Grupe list', intro, s))

# ================================================================= group page pieces
def roster_rows(menu_on=None):
    rows = []
    for n, a, main, other in ROSTER:
        rows.append([f'<a class="spv-name" href="#">{n}</a>', f'{a} ani', 'Da' if main else '<span class="p4-muted">Nu</span>',
                     other or '<span class="p4-muted">Niciuna</span>', menu_btn()])
    return rows
ROW_MENU = [('Mută', False), ('Adaugă și în grupă', False), ('Scoate din grupă', True)]
def roster_desk():
    bar = f'<div class="ui-table-bar"><span class="p4-muted" style="font-size:12.5px">11 sportivi</span><span style="flex:1"></span>{btn("Adaugă sportivi", "secondary", True, I_PLUS)}</div>'
    return bar + table(['Sportiv', 'Vârstă', 'Principală', 'Alte grupe', ''], roster_rows())
def roster_cards():
    out = '<ul class="spv-cards">'
    for n, a, main, other in ROSTER:
        sub = f'{a} ani' + (', principală' if main else '') + (f', și în {other.replace(" (principală)", "")}' if other else '')
        out += f'<li class="p4-cardrow"><button type="button" class="spv-card"><span class="spv-name">{n}</span><span class="spv-sub2">{sub}</span></button>{menu_btn()}</li>'
    return out + '</ul>'

SERIES = [('Sâ și Du, 11:00, 50 min', 'din 4 oct 2026')]
def series_block(btn_full=False):
    rows = ''.join(f'<div class="p4-ser"><b>{t}</b><span class="p4-muted">{d}</span><button type="button" class="spv-link">Schimbă</button></div>' for t, d in SERIES)
    return f'<div><p class="spv-h">Program obișnuit</p>{rows}</div><div>{btn("Adaugă program", "secondary", True, I_PLUS)}</div>'

def ev(time, text='', cat='scoala', struck=False):
    t = f'<b>{time}</b>' + (f' {text}' if text else '')
    return f'<button type="button" class="cal-ev{" cal-ev--cancel" if struck else ""}" data-calcat="{cat}"><span class="cal-ev-t">{t}</span></button>'
NOV = [  # weeks: label, days (dow, num, [events])
 ('26 oct - 1 noiembrie', [('Du', 1, [ev('11:00')])]),
 ('2 - 8 noiembrie', [('Sâ', 7, [ev('11:00')]), ('Du', 8, [ev('11:00')])]),
 ('9 - 15 noiembrie', [('Sâ', 14, [ev('11:00', 'Anulată: Competiție la Brașov', 'anulat', True)]), ('Du', 15, [ev('11:00')])]),
 ('16 - 22 noiembrie', [('Vi', 20, [ev('18:00')]), ('Sâ', 21, [ev('12:00', 'Mutată de la 11:00')]), ('Du', 22, [ev('11:00')])]),
 ('23 - 29 noiembrie', [('Sâ', 28, [ev('11:00')]), ('Du', 29, [ev('11:00')])]),
]
BRK = 'Vacanța de iarnă'
DEC = [
 ('30 noiembrie - 6 decembrie', [('Sâ', 5, [ev('11:00')]), ('Du', 6, [ev('11:00')])]),
 ('7 - 13 decembrie', [('Sâ', 12, [ev('11:00')]), ('Du', 13, [ev('11:00')])]),
 ('14 - 20 decembrie', [('Sâ', 19, [ev('11:00')]), ('Du', 20, [ev('11:00', BRK, 'liber', True)])]),
 ('21 - 27 decembrie', [('Sâ', 26, [ev('11:00', BRK, 'liber', True)]), ('Du', 27, [ev('11:00', BRK, 'liber', True)])]),
 ('28 decembrie - 3 ianuarie', [('Sâ', 2, [ev('11:00', BRK, 'liber', True)]), ('Du', 3, [ev('11:00', BRK, 'liber', True)])]),
]
def cal_bar(title, view='Listă'):
    nav = f'<div class="cal-nav">{btn("", "secondary", True, I_LEFT, "", True, "Luna anterioară")}<span class="cal-mon">{title}</span>{btn("", "secondary", True, I_RIGHT, "", True, "Luna următoare")}</div>'
    return f'<div class="cal-bar"><div class="cal-bar-row">{nav}<span class="cal-sp"></span>{btn("Azi", "secondary", True)}<div class="cal-viewseg">{seg(["Listă", "Lună"], view, False)}</div></div></div>'
def agenda(weeks, sel=None):
    out = '<div class="cal-list">'
    for lbl, days in weeks:
        out += f'<section><div class="cal-wk">{lbl}</div>'
        for dow, num, evs in days:
            hl = ' style="background:var(--theme-primary-soft)"' if sel == num else ''
            out += f'<div class="cal-ag"{hl}><button type="button" class="cal-ag-dd"><small>{dow}</small><span class="cal-ag-n">{num}</span></button><div class="cal-ag-l">{"".join(evs)}</div></div>'
        out += '</section>'
    return out + '</div>'
def program_tab(month='Noiembrie 2026', weeks=NOV, sel=None, brk=False):
    note = ''
    return (f'<div class="ui-body">{series_block()}{note}<div class="ui-root cal{" p4-brk" if brk else ""}"><div class="cal-frame">{cal_bar(month)}{agenda(weeks, sel)}</div></div></div>')
HIST = [
 ('27 oct 2026, 14:22', 'admin@example.com', 'Elisa Georgescu adăugată în grupă.'),
 ('26 oct 2026, 10:05', 'admin@example.com', 'Ana Ionescu mutată în Intermediari Silver. Grupa principală schimbată: Intermediari Bronze → Intermediari Silver'),
 ('20 oct 2026, 09:12', 'admin@example.com', 'Program adăugat: Sâ și Du, 11:00, 50 min, din 4 oct 2026.'),
 ('18 oct 2026, 18:40', 'admin@example.com', 'Ședința din 14 noiembrie anulată: Competiție la Brașov. Părinții anunțați pe e-mail.'),
 ('1 oct 2026, 08:00', 'migrare', 'Grupă creată din textul vechi "Intermediari Bronze".'),
]
def hist():
    return '<div class="ui-body"><ol class="spv-hist">' + ''.join(f'<li><div class="spv-hist-h"><b>{w}</b><span>{a}</span></div><div>{t}</div></li>' for w, a, t in HIST) + '</ol></div>'

def group_head(): return ph(GROUP, GROUP_SUB, menu_btn(), 'Grupe')
def group_a(tab='Sportivi', body=None):
    tb = tabs([('Sportivi', 11), ('Program', None), ('Istoric', 5)], tab, 'spv-tabs')
    return page(win(group_head() + tb + (body if body is not None else roster_desk())))
def group_a_phone(tab='Sportivi', body=None, overlay=''):
    head = f'<div class="spv-phone-head"><span class="spv-sub2">{GROUP_SUB}</span><div class="spv-head-acts">{menu_btn()}</div></div>'
    tb = tabs([('Sportivi', 11), ('Program', None), ('Istoric', 5)], tab, 'spv-tabs')
    b = body if body is not None else roster_cards()
    return f'<div class="ui-root ui-sheet-layer" style="background:none"><div class="ui-sheet ui-sheet--full" role="dialog"><div class="ui-sheet-h"><span class="ui-sheet-grab" aria-hidden="true"></span><div class="ui-sheet-hrow"><h2 class="ui-sheet-title">{GROUP}</h2>{btn("", "ghost", True, I_CLOSE, "", True, "Închide")}</div></div><div class="ui-sheet-b">{head}{tb}{b}</div></div></div>{overlay}'

# drawers / sheets for schedule
DAYS = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du']
def days(on): return '<div class="p4-days">' + ''.join(f'<button type="button" class="p4-dayt" aria-pressed="{"true" if d in on else "false"}">{d}</button>' for d in DAYS) + '</div>'
def new_program_fields():
    return (switch('Se repetă', True)
            + field('Cât de des', select('Săptămânal', '', 'width:100%'))
            + field('Zile', days(['Sâ', 'Du']))
            + f'<div class="p4-g2">{field("De la", timein("12:00"))}{field("Durată", select("50 min", "", "width:100%"))}</div>'
            + field('Se aplică din', inp('01.11.2026')))
def single_fields():
    return (switch('Se repetă', False) + field('Data', inp('20.11.2026'))
            + f'<div class="p4-g2">{field("De la", timein("18:00"))}{field("Durată", select("90 min", "", "width:100%"))}</div>'
            + field('Notă', inp('Pregătire concurs'), 'Opțional'))
def date_fields(mode):
    f = field('Această dată', seg(['Ține', 'Anulează', 'Mută'], mode))
    if mode == 'Mută':
        f += f'<div class="p4-g2">{field("Data nouă", inp("21.11.2026"))}{field("De la", timein("12:00"))}</div>'
    f += field('Motiv', inp('Competiție la Brașov' if mode == 'Anulează' else 'Gheața e ocupată la 11:00'), 'Opțional')
    f += check('Anunță părinții pe e-mail', True)
    return f
FOOT = btn('Anulează', 'secondary') + '<span class="cal-sp"></span>' + btn('Salvează')
FOOT_PH = btn('Anulează', 'secondary') + btn('Salvează')

def move_body(phone=False):
    return ('<div class="p4-mv"><div class="l">Sportiv</div><div class="v">Ana Ionescu</div>'
            f'<div class="ft3"><div><div class="l">Din</div><div class="v">{GROUP}</div></div><div><div class="l">În</div>{cbx("Intermediari Silver")}</div></div><hr>'
            '<div class="row"><span class="abt">Abonament Școala de patinaj, 8 ședințe</span><span class="abe">Expiră pe 7 nov 2026</span></div>'
            '<span class="seg">' + '<i class="u"></i>' * 5 + '<i></i>' * 3 + '</span><div class="row cap"><span>5 folosite</span><span>3 rămase</span></div></div>')
MOVE_FOOT = btn('Anulează', 'ghost') + btn('Mută')

def build_grupa_a():
    sh = shell('club', 'Grupe')
    intro = ('<h2>Group page, option A: record with tabs</h2><p>Like the Sportivi record: header (name, section, coach, price list, count), tabs Sportivi / Program / Istoric. '
             'Program = the coach-schedule-app-v3 behaviour in the admin calendar components: "+ Adaugă program", per date Ține / Anulează / Mută. Phone: full-height sheet like the athlete record.</p>'
             '<p>Pick A or B (grupa-b.html). The "not a spreadsheet" idea from October was never approved.</p>')
    s = []
    s.append(state('A1. Tab Sportivi: main group mark, other groups, "..." per row', desk(sh, group_a()), phone('', group_a_phone())))
    s.append(state('A2. Row "...": Mută / Adaugă și în grupă / Scoate din grupă',
                   desk(sh, group_a(), pop_menu(ROW_MENU, 'top:290px;right:36px')),
                   phone('', group_a_phone(), pop_menu(ROW_MENU, 'top:270px;right:16px'))))
    s.append(state('A3. "Mută": the one move window (move-modal-final); "În" picked here. Same price list, so no abonament text',
                   desk(sh, group_a(), modal('Mută în altă grupă', move_body(), MOVE_FOOT)),
                   phone('', group_a_phone(), sheet('Mută în altă grupă', move_body(True), btn('Anulează', 'secondary') + btn('Mută')))))
    s.append(state('A4. Tab Program: usual schedule + every date (Listă / Lună). One-off dates look the same (Vi 20). Cancelled and moved dates in place',
                   desk(sh, group_a('Program', program_tab())), phone('', group_a_phone('Program', program_tab()))))
    s.append(state('A5. "+ Adaugă program", Se repetă on: Cât de des, Zile, De la, Durată, Se aplică din',
                   desk(sh, group_a('Program', program_tab()), drawer('Program nou', f'<div class="ui-dsec-b">{new_program_fields()}</div>', FOOT)),
                   phone('', group_a_phone('Program', program_tab()), sheet('Program nou', new_program_fields(), FOOT_PH))))
    s.append(state('A6. Same form, Se repetă off: one class on a date (also on the website)',
                   desk(sh, group_a('Program', program_tab()), drawer('Program nou', f'<div class="ui-dsec-b">{single_fields()}</div>', FOOT)),
                   phone('', group_a_phone('Program', program_tab()), sheet('Program nou', single_fields(), FOOT_PH))))
    s.append(state('A7. Click a date: Ține / Anulează / Mută, reason, "Anunță părinții pe e-mail" (opt-in)',
                   desk(sh, group_a('Program', program_tab(sel=14)), drawer('Sâmbătă, 14 noiembrie, 11:00', f'<div class="ui-dsec-b">{date_fields("Anulează")}</div>', FOOT)),
                   phone('', group_a_phone('Program', program_tab(sel=14)), sheet('Sâmbătă, 14 noiembrie, 11:00', date_fields('Anulează'), FOOT_PH))))
    s.append(state('A8. "Mută": new date and time',
                   desk(sh, group_a('Program', program_tab(sel=21)), drawer('Sâmbătă, 21 noiembrie, 11:00', f'<div class="ui-dsec-b">{date_fields("Mută")}</div>', FOOT)),
                   phone('', group_a_phone('Program', program_tab(sel=21)), sheet('Sâmbătă, 21 noiembrie, 11:00', date_fields('Mută'), FOOT_PH))))
    s.append(state('A9. Saved: toast with "Anulează"',
                   desk(sh, group_a('Program', program_tab()), toast('Ședința din 14 noiembrie a fost anulată.')),
                   phone('', group_a_phone('Program', program_tab()), toast('Ședința din 14 noiembrie a fost anulată.', top=72))))
    s.append(state('A10. Tab Istoric', desk(sh, group_a('Istoric', hist())), phone('', group_a_phone('Istoric', hist()))))
    write('grupa-a.html', doc('Phase 4: group page A', intro, s))

# ================================================================= grupa B
WEEK = [('Lu', 16, []), ('Ma', 17, []), ('Mi', 18, []), ('Jo', 19, []), ('Vi', 20, [ev('18:00')]), ('Sâ', 21, [ev('12:00', 'Mutată de la 11:00')]), ('Du', 22, [ev('11:00')])]
def week_grid():
    cells = ''.join(f'<div class="cal-day{" cal-day--we" if i >= 5 else ""}"><button type="button" class="cal-num">{n}</button>{"".join(e)}</div>' for i, (d, n, e) in enumerate(WEEK))
    dows = ''.join(f'<div>{d}</div>' for d, _, _ in WEEK)
    nav = f'<div class="cal-bar"><div class="cal-bar-row"><div class="cal-nav">{btn("", "secondary", True, I_LEFT, "", True, "Săptămâna anterioară")}<span class="cal-mon">16 - 22 noiembrie 2026</span>{btn("", "secondary", True, I_RIGHT, "", True, "Săptămâna următoare")}</div><span class="cal-sp"></span>{btn("Azi", "secondary", True)}</div></div>'
    return f'<div class="ui-root cal p4-wk"><div class="cal-frame">{nav}<div class="cal-month"><div class="cal-dows">{dows}</div><div class="cal-grid">{cells}</div></div></div></div>'
def roster_compact():
    rows = [[f'<a class="spv-name" href="#">{n}</a>', f'{a} ani', 'Da' if m else '<span class="p4-muted">Nu</span>', menu_btn()] for n, a, m, o in ROSTER]
    return table(['Sportiv', 'Vârstă', 'Principală', ''], rows)
def group_b():
    left = f'<section class="ui-sec"><div class="ui-sec-h"><h2 class="ui-sec-title">Sportivi <span class="ui-tab-count ui-num">11</span></h2>{btn("Adaugă sportivi", "secondary", True, I_PLUS)}</div>{roster_compact()}</section>'
    right = section('Program', series_block() + week_grid())
    return page(win(group_head() + f'<div class="ui-body"><div class="p4-two">{left}{right}</div></div>'))
def group_b_phone(overlay=''):
    head = f'<div class="spv-phone-head"><span class="spv-sub2">{GROUP_SUB}</span><div class="spv-head-acts">{menu_btn()}</div></div>'
    prog = f'<p class="spv-h" style="margin-top:12px">Program</p><div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">{series_block()}<div class="ui-root cal"><div class="cal-frame">{cal_bar("16 - 22 nov", "Listă")}{agenda([NOV[3]])}</div></div></div>'
    ros = f'<p class="spv-h" style="margin-top:16px">Sportivi <span class="ui-tab-count ui-num">11</span></p>{roster_cards()}'
    return f'<div class="ui-root ui-sheet-layer" style="background:none"><div class="ui-sheet ui-sheet--full" role="dialog"><div class="ui-sheet-h"><span class="ui-sheet-grab" aria-hidden="true"></span><div class="ui-sheet-hrow"><h2 class="ui-sheet-title">{GROUP}</h2>{btn("", "ghost", True, I_CLOSE, "", True, "Închide")}</div></div><div class="ui-sheet-b">{head}{prog}{ros}</div></div></div>{overlay}'
def build_grupa_b():
    sh = shell('club', 'Grupe')
    intro = ('<h2>Group page, option B: one page, no tabs</h2><p>Roster on the left, the group\'s program on the right as a week (real admin calendar grid, one row). '
             'Same "..." per row, same move window, same date and "+ Adaugă program" panels as A. Istoric moves into the header "..." menu. Phone: program first, then the roster.</p>')
    s = []
    s.append(state('B1. Roster + week', desk(sh, group_b()), phone('', group_b_phone())))
    s.append(state('B2. Row "..." and the move window behave as in A',
                   desk(sh, group_b(), modal('Mută în altă grupă', move_body(), MOVE_FOOT)),
                   phone('', group_b_phone(sheet('Mută în altă grupă', move_body(True), btn('Anulează', 'secondary') + btn('Mută'))))))
    s.append(state('B3. Click a date in the week: same panel as A',
                   desk(sh, group_b(), drawer('Sâmbătă, 21 noiembrie, 11:00', f'<div class="ui-dsec-b">{date_fields("Mută")}</div>', FOOT)),
                   phone('', group_b_phone(sheet('Sâmbătă, 21 noiembrie, 11:00', date_fields('Mută'), FOOT_PH)))))
    write('grupa-b.html', doc('Phase 4: group page B', intro, s))

# ================================================================= pauze
BREAKS = [('Vacanța de iarnă', '20 dec 2026', '7 ian 2027'), ('Vacanța de primăvară', '3 apr 2027', '11 apr 2027')]
def breaks_table():
    return table(['Nume', 'De la', 'Până la', ''], [[f'<span class="p4-gname">{n}</span>', a, b, menu_btn()] for n, a, b in BREAKS])
def break_form(): return field('Nume', inp('Vacanța de iarnă')) + f'<div class="p4-g2">{field("De la", inp("20.12.2026"))}{field("Până la", inp("07.01.2027"))}</div>' + '<p class="p4-hint">Nicio ședință a grupelor în aceste zile.</p>'
def month_grid_dec():
    # December 2026 starts on Tuesday. Weekend chips: first 2 groups + "+5 încă"; break days 20-31 with a liber chip.
    cells = []
    days = [(None, 30, 'off')] + [(None, d, '') for d in range(1, 32)] + [(None, d, 'off') for d in (1, 2, 3)]
    for i, (_, d, off) in enumerate(days):
        dow = i % 7
        cls = 'cal-day' + (' cal-day--off' if off else '') + (' cal-day--we' if dow >= 5 else '')
        chips = ''
        inbrk = (not off and d >= 20) or (off and d in (1, 2, 3))
        if inbrk:
            chips = ev('', BRK, 'liber')
        elif dow >= 5 and not off:
            chips = ev('09:00', 'Avansați Gold') + ev('10:00', 'Primii Pași') + '<button type="button" class="cal-more">+5 încă</button>'
        cells.append(f'<div class="{cls}"><button type="button" class="cal-num">{d}</button>{chips}</div>')
    dows = ''.join(f'<div>{d}</div>' for d in DAYS)
    filt = '<div class="cal-filters">' + ''.join(f'<button type="button" class="cal-filter" aria-pressed="true" data-calcat="{c}"><span class="cal-sw"></span><span class="cal-filter-l">{l}</span></button>' for c, l in [('scoala', 'Școala de patinaj'), ('antrenament', 'Antrenament'), ('eveniment', 'Eveniment'), ('liber', 'Pauză'), ('anulat', 'Anulat')]) + '</div>'
    bar = f'<div class="cal-bar"><div class="cal-bar-row"><div class="cal-nav">{btn("", "secondary", True, I_LEFT, "", True, "Luna anterioară")}<span class="cal-mon">Decembrie 2026</span>{btn("", "secondary", True, I_RIGHT, "", True, "Luna următoare")}</div><span class="cal-sp"></span>{btn("Azi", "secondary", True)}<div class="cal-viewseg">{seg(["Listă", "Lună"], "Lună", False)}</div>{btn("Adaugă", "primary", True, I_PLUS)}</div>{filt}</div>'
    return f'<div class="ui-root cal"><div class="cal-frame">{bar}<div class="cal-month"><div class="cal-dows">{dows}</div><div class="cal-grid">{"".join(cells)}</div></div></div></div>'
def program_page_a():
    cal = section('Calendar', month_grid_dec(), badge('se salvează automat'))
    pz = section('Pauze', breaks_table() if False else '', btn('Adaugă pauză', 'secondary', True, I_PLUS))
    pz = f'<section class="ui-sec"><div class="ui-sec-h"><h2 class="ui-sec-title">Pauze</h2>{btn("Adaugă pauză", "secondary", True, I_PLUS)}</div>{breaks_table()}</section>'
    return page(win(ph('Program', 'Calendarul sezonului și seriile de cursuri', '', 'Înapoi') + f'<div class="ui-body">{pz}{cal}</div>'))
def program_page_a_phone():
    cards = ''.join(f'<li class="p4-cardrow"><button type="button" class="spv-card"><span class="spv-name">{n}</span><span class="spv-sub2">{a} - {b}</span></button>{menu_btn()}</li>' for n, a, b in BREAKS)
    pz = f'<section class="ui-sec"><div class="ui-sec-h"><h2 class="ui-sec-title">Pauze</h2>{btn("Adaugă pauză", "secondary", True, I_PLUS)}</div><ul class="spv-cards">{cards}</ul></section>'
    return page(win(ph('Program', 'Calendarul sezonului și seriile de cursuri', '', 'Înapoi') + f'<div class="ui-body">{pz}<section class="ui-sec"><div class="ui-sec-h"><h2 class="ui-sec-title">Calendar</h2>{badge("se salvează automat")}</div><div class="ui-sec-b"><p class="p4-hint">Calendarul, ca azi.</p></div></section></div>'))
def pauze_page_b():
    tool = f'<div class="spv-toolbar">{select(SEASON, "spv-season")}</div>'
    return page(win(ph('Pauze', 'Zile fără ședințe pentru toate grupele.', btn('Adaugă pauză', 'primary', icon=I_PLUS)) + tool + breaks_table()))
def pauze_page_b_phone():
    cards = ''.join(f'<li class="p4-cardrow"><button type="button" class="spv-card"><span class="spv-name">{n}</span><span class="spv-sub2">{a} - {b}</span></button>{menu_btn()}</li>' for n, a, b in BREAKS)
    head = f'<header class="ui-ph" style="flex-direction:column;align-items:stretch"><div><h1 class="ui-ph-title">Pauze</h1><p class="ui-ph-sub">Zile fără ședințe pentru toate grupele.</p></div><div>{btn("Adaugă pauză", "primary", icon=I_PLUS)}</div></header>'
    return page(win(head + f'<div class="spv-toolbar">{select(SEASON, "spv-season")}</div><ul class="spv-cards">{cards}</ul>'))
def effect_state(sh):
    return state('Effect: the break on a group\'s Program (Intermediari Bronze, December). Dates stay listed, struck, grey, with the break name; no session, nothing on the website calendar for them',
                 desk(sh, group_a('Program', program_tab('Decembrie 2026', DEC, brk=True))),
                 phone('', group_a_phone('Program', program_tab('Decembrie 2026', DEC, brk=True))))
def build_pauze():
    modal_ = modal('Pauză nouă', f'<div class="ui-stack" style="display:flex;flex-direction:column;gap:12px">{break_form()}</div>', btn('Anulează', 'ghost') + btn('Salvează'))
    sheet_ = sheet('Pauză nouă', break_form(), FOOT_PH)
    # A
    shA = shell('program', 'Calendar și serii')
    introA = ('<h2>Holiday breaks, option A: a section in "Calendar și serii"</h2><p>Breaks = calendar-blackout (label, from, to). A "Pauze" section at the top of the Program page; the calendar shows the break days as "Pauză". '
              'The old "Serii de cursuri Școala de Patinaj" section is gone (its text moves to the groups).</p><p>Compare with pauze-b.html.</p>')
    s = [state('A1. Program page with the Pauze section', desk(shA, program_page_a()), phone(program_page_a_phone())),
         state('A2. "+ Adaugă pauză"', desk(shA, program_page_a(), modal_), phone(program_page_a_phone(), sheet_)),
         effect_state(shell('club', 'Grupe'))]
    write('pauze-a.html', doc('Phase 4: breaks A', introA, s))
    # B
    shB = shell('program', 'Pauze', ['Calendar și serii', 'Pauze'])
    introB = ('<h2>Holiday breaks, option B: own page "Pauze"</h2><p>Menu "Program și calendar" > "Pauze", next to "Calendar și serii". Season select like Sportivi. Same window, same effect on the groups.</p><p>Compare with pauze-a.html.</p>')
    s = [state('B1. Pauze page', desk(shB, pauze_page_b()), phone(pauze_page_b_phone())),
         state('B2. "+ Adaugă pauză"', desk(shB, pauze_page_b(), modal_), phone(pauze_page_b_phone(), sheet_)),
         effect_state(shell('club', 'Grupe'))]
    write('pauze-b.html', doc('Phase 4: breaks B', introB, s))

# ================================================================= migrare
MIG = [  # old text, where, group, section, sure
 ('Primii Pași', 'Serii 10:00 (seed, backup 17 sep)', 'Primii Pași', 'Școala', True),
 ('Primii Paşi', 'Serii 10:00 (site live, 19 oct), ş cu sedilă', 'Primii Pași', 'Școala', True),
 ('Intermediari Silver', 'Serii 10:00; Virgil Pascu, "Predă la"', 'Intermediari Silver', 'Școala', True),
 ('Avansați Silver', 'Serii 10:00', 'Avansați Silver', 'Școala', True),
 ('Începători', 'Serii 11:00', 'Începători', 'Școala', True),
 ('Intermediari Bronze', 'Serii 11:00; Virgil Pascu, "Predă la"', 'Intermediari Bronze', 'Școala', True),
 ('Avansați Bronze', 'Serii 11:00', 'Avansați Bronze', 'Școala', True),
 ('Avansați Gold', 'Serii 09:00 (site live, 19 oct)', 'Avansați Gold', 'Școala', True),
 ('Profesionisti', 'Andreea Pascu, "Predă la"', 'Profesioniști', 'Club', True),
 ('Avansati', 'Andreea Pascu, "Predă la"', 'Avansați', 'Club', True),
 ('Curs Avansati', 'Calendar, curs special 18 mai 2026, Berceni Arena', 'Avansați', 'Club', False),
 ('Avansați', 'seed-content.js, antrenori demo', 'Avansați', 'Club', False),
 ('Intermediari', 'seed-content.js, antrenori demo', 'Intermediari Bronze sau Silver', 'Școala', False),
 ('Grup Performanță', 'seed-content.js, antrenori demo', 'Profesioniști', 'Club', False),
 ('Grupa A', 'seed-calendar-sample.js, eveniment de test', None, 'skip', False),
 ('Weekend curs', 'TEST: eveniment Școala, sâ și du 10:00 - 12:00, nov 2026', 'toate grupele Școlii', 'Școala', False),
 ('Performanță', 'TEST: grupă Club creată de mână', 'Profesioniști', 'Club', False),
 ('Grupa Mică, Grupa Mare', 'TEST: a doua școală (Patinoar Nord)', None, 'skip', False),
]
def build_migrare():
    rows = []
    for old, where, g, sec, sure in MIG:
        grp = f'<span class="p4-gname">{g}</span> <span class="p4-muted">{sec}</span>' if g else '<span class="p4-muted">Nu se migrează (date de test)</span>'
        rows.append([f'<span class="p4-old">{old}</span>', f'<span class="p4-src">{where}</span>', grp, 'Da' if sure else '<span class="p4-q">?</span>'])
    n1 = notice('Producția poate avea mai multe nume. Le citim mai târziu, doar citire, cu acordul tău.', 'warning', 'Doar TEST și fișierele din repo')
    n2 = notice('În TEST programul (serii, calendar vechi) și membrii echipei sunt goale. Numele vin din data/seed/content.json, backups/program-page-pre-legacy-cleanup-2026-09-17.json, scripts/seed-*.js, citirea site-ului live din 19 oct (data-q1-groups) și tabelele TEST club_groups și calendar_events.', 'info')
    body = f'<div class="ui-body">{n1}{n2}</div>' + table(['Text vechi', 'Unde apare', 'Grupă propusă', 'Sigur'], rows, False)
    intro = ('<h2>Migration: old free text -> real groups</h2><p>Each distinct legacy group name found, with the proposed group. "?" = not sure, decide per row. '
             'Matching ignores diacritics, case and ş/ș (nameKey in src/club/migrate/names.ts). Nothing was written to any database.</p>')
    d = f'<div class="p4-frame dk" style="min-height:0"><div class="ui-root ui-page ui-stack">{win(ph("Migrare grupe", "Text vechi -> Grupă") + body)}</div></div>'
    p = f'<div class="p4-frame ph" style="min-height:0"><div class="ui-root ui-page ui-stack">{win(ph("Migrare grupe", "Text vechi -> Grupă") + body)}</div></div>'
    write('migrare-grupe.html', doc('Phase 4: group migration', intro, [state('Table', d, p)]))

exec(open(os.path.join(HERE, 'gen_sezon_nou.py')).read())

build_grupe(); build_grupa_a(); build_grupa_b(); build_pauze(); build_migrare()
build_sezon_nou()
