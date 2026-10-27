# Phase 4 new-season mockups (sezon-nou-a.html, sezon-nou-b.html).
# Run through gen_phase4.py (exec'd there, so every helper and the real admin CSS are shared).

CUR, NXT = '2026-2027', '2027-2028'
NXT_FROM, NXT_TO = '1 oct 2027', '31 mai 2028'
SN_CSS = r'''
.p4-frame .ui-modal{max-height:none!important}
.ui-root .ui-table th .ui-check{font-size:inherit;color:inherit;align-items:center;font-weight:inherit;letter-spacing:inherit}
.ui-root .ui-table td .ui-check{align-items:center}
.ui-root .sn-sec{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);margin:14px 0 6px}
.ui-root .sn-sec:first-child{margin-top:0}
.ui-root .sn-tbl{border:1px solid var(--theme-border)}
.ui-root .sn-tbl .ui-table td{padding:8px 12px;vertical-align:middle}
.ui-root .sn-tbl .ui-table th{padding:8px 12px}
.ui-root .sn-prog{color:var(--theme-text-muted);font-size:12.5px;margin-left:4px}
.ui-root .sn-kids td{background:var(--theme-surface-subtle)}
.ui-root .sn-kid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--theme-border-subtle);font-size:13px}
.ui-root .sn-kid:last-child{border-bottom:none}
.ui-root .sn-kidh{font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:var(--theme-text-muted);font-weight:700;padding:2px 0 6px;border-bottom:1px solid var(--theme-border)}
.ui-root .sn-chg{color:var(--theme-text)}
.ui-root .sn-chg small{display:block;color:var(--theme-text-muted);font-size:12px}
.ui-root .sn-sum{margin-top:14px;padding:10px 12px;border:1px solid var(--theme-border);border-left:3px solid var(--theme-primary);background:var(--theme-surface-subtle);color:var(--theme-text);font-size:13px}
.ui-root .sn-rule{font-size:12px;color:var(--theme-text-muted);margin:6px 0 0}
.ui-root .sn-step{font-size:12px;color:var(--theme-text-muted);font-weight:600}
.ui-root .sn-kv{display:grid;grid-template-columns:150px minmax(0,1fr);gap:4px 14px;padding:8px 0;border-bottom:1px solid var(--theme-border-subtle);font-size:13px}
.ui-root .sn-kv:last-child{border-bottom:none}
.ui-root .sn-kv b{color:var(--theme-text);font-weight:600}
.ui-root .sn-kv span{color:var(--theme-text-secondary)}
.ui-root .sn-lines{margin:12px 0 0;padding:0;list-style:none;font-size:13px;color:var(--theme-text-secondary)}
.ui-root .sn-lines li{padding:7px 0;border-bottom:1px solid var(--theme-border-subtle)}
.ui-root .sn-lines li:last-child{border-bottom:none}
.ui-root .sn-lines b{color:var(--theme-text);font-weight:600}
.ui-root .sn-card{border:1px solid var(--theme-border);background:var(--theme-surface);padding:10px 12px;margin-bottom:8px}
.ui-root .sn-card .nm{font-weight:700;color:var(--theme-text)}
.ui-root .sn-card .sub{font-size:12.5px;color:var(--theme-text-muted);margin:1px 0 8px}
.ui-root .sn-card .ui-check{display:flex;margin-top:6px}
.ui-root .sn-card .sn-kidlist{margin-top:8px;padding-top:6px;border-top:1px solid var(--theme-border)}
.ui-root .sn-nowrap{white-space:nowrap}
.ui-root .sn-acts{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.ui-root .sn-stats4{grid-template-columns:repeat(4,minmax(0,1fr))}
@media (max-width:640px){.ui-root .sn-stats4{grid-template-columns:repeat(2,minmax(0,1fr))}.ui-root .sn-kv{grid-template-columns:1fr;gap:2px}.ui-root .sn-kid{grid-template-columns:1fr;gap:2px}}
'''

def sn_doc(title, intro, states):
    return doc(title, intro, states).replace('</style></head>', SN_CSS + '</style></head>', 1)
def deskh(shell_html, body, overlay='', h=900):
    return f'<div class="p4-frame dk" style="min-height:{h}px">{shell_html}<div class="p4-main" style="min-height:{h}px">{body}</div>{overlay}</div>'
def phoneh(body, overlay='', h=844):
    burger = '<div class="ui-root"><button type="button" class="edu-mnav-burger" aria-label="Deschide meniul" style="top:12px;right:12px"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.8"/></svg></button></div>'
    return f'<div class="p4-frame ph" style="min-height:{h}px"><div class="p4-top"><span class="mk">ES</span></div>{burger}{body}{overlay}</div>'
def shell_top(active):
    s = shell(None, None)
    a = f'<a href="#">{ico(SH["calendar"])}<span class="esd-lbl">{active}</span>'
    return s.replace(a, a.replace('<a href="#">', '<a href="#" class="on">'), 1)
def modal_x(title, extra, body, footer, size='lg'):
    return (f'<div class="ui-root ui-modal-layer"><div class="ui-modal ui-modal--{size}" role="dialog"><div class="ui-modal-h"><h2 class="ui-modal-title">{title}</h2>'
            f'<div class="ui-modal-extra">{extra}</div></div><div class="ui-modal-b">{body}</div><div class="ui-modal-f">{footer}</div></div></div>')
def stats(items):
    return '<div class="ui-stats sn-stats4">' + ''.join(f'<div class="ui-stat ui-stat--{t}"><div class="ui-stat-label">{l}</div><div class="ui-stat-value ui-num">{v}</div><div class="ui-stat-caption">{c}</div></div>' for l, v, c, t in items) + '</div>'
def chk(label, on=True, disabled=False):
    return f'<label class="ui-check{" ui-check--disabled" if disabled else ""}"><input type="checkbox" {"checked" if on else ""} {"disabled" if disabled else ""}><span>{label}</span></label>'

# ================================================================= data
SEASONS = [(NXT, 'Octombrie 2027 - Mai 2028', '200 RON'), (CUR, 'Octombrie 2026 - Mai 2027', '200 RON'), ('2025-2026', 'Octombrie 2025 - Mai 2026', '180 RON')]
PROG = {g: p for g, p, c, k in SCOALA + CLUB}
AVANSATI_KIDS = [  # name, age, main in 2027-2028, note, active
 ('Andrei Matei', 12, 'Avansați', '', True),
 ('Daria Stan', 11, 'Avansați', '', True),
 ('Eric Ene', 13, 'Avansați', '', True),
 ('Ilinca Toma', 12, 'Avansați', '', True),
 ('Ioana Marin', 13, 'Profesioniști', 'ca în 2026-2027', True),
 ('Luca Mihai', 10, 'Avansați', 'în 2026-2027: Avansați Gold, care nu se copiază', True),
 ('Mara Dinu', 11, 'Avansați', '', True),
 ('Nora Vlad', 12, 'Avansați', '', True),
 ('Sara Popa', 14, 'Avansați', '', True),
 ('Tudor Matei', 12, '', '', False),
]
MAIN_CHANGES = 'Filip Radu: Intermediari Bronze → Profesioniști. Luca Mihai: Avansați Gold → Avansați.'

# ================================================================= Sezoane page
def sezoane_rows(mode, phone=False):
    rows = []
    for lbl, per, fee in SEASONS:
        cur = (lbl == CUR) if mode != 'after' else (lbl == NXT)
        act = ''
        if lbl == NXT and mode == 'a':
            act = btn(f'Începe sezonul {NXT}', 'secondary', True)
        elif lbl == NXT and mode == 'b':
            act = btn('Fă sezonul curent', 'secondary', True)
        name = f'<span class="p4-gname">{lbl}</span>'
        if phone and act:
            name += f'<div style="margin-top:6px">{act}</div>'
            act = ''
        r = [name, per, fee, badge('Curent', 'success') if cur else '']
        if not phone: r.append(f'<span class="sn-nowrap">{act}</span>')
        rows.append(r)
    return rows
def sezoane_page(mode, phone=False):
    heads = ['Sezon', 'Perioadă', 'Taxă de membru', 'Curent'] + ([] if phone else [''])
    hdr = ph('Sezoane', 'Sezoanele școlii, taxa de membru și sezonul curent.', btn('Sezon nou', 'primary', True, I_PLUS), 'Înapoi')
    body = f'<div class="ui-body"><div class="ui-table-root">{table(heads, sezoane_rows(mode, phone))}</div><p class="ui-hint">Clic pe un rând deschide editarea lui într-un panou lateral.</p></div>'
    return page(win(hdr + body))

# ================================================================= the window: what changes (current season)
def effects_block(prepared=True):
    site = [('Înscrieri', f'Formularul trece pe {NXT}, taxa de membru 200 RON. Deschis sau închis din Setări site, ca acum.'),
            ('Formular pe hârtie', f'Sezonul {NXT}.'),
            ('Program', f'Orarul Școlii se ia din programul grupelor în {NXT}.' if prepared else f'Grupele nu au încă program în {NXT}: pagina arată textul vechi până îl adaugi.'),
            ('Calendar', 'Nu se schimbă. Arată fiecare dată din programul grupelor, din ambele sezoane.')]
    panel = [('Grupe, Sportivi', f'Se deschid pe {NXT}.'),
             (CUR, 'Rămâne de citit în Grupe, nu se mai modifică.'),
             ('Membru A.C.S.', f'Pe sezon, nu se copiază. În {NXT} toți pornesc de la Nu.')]
    kv = lambda rows: ''.join(f'<div class="sn-kv"><b>{k}</b><span>{v}</span></div>' for k, v in rows)
    return f'<p class="sn-sec">Pe site</p>{kv(site)}<p class="sn-sec">În panou</p>{kv(panel)}'

# ================================================================= the window: groups (desktop)
def grp_row(g, n, kids_on, prog_on, extra='', expanded=False):
    tog = f'<button type="button" class="spv-link" style="margin-left:8px">{"Ascunde" if expanded else "Vezi sportivii"}</button>' if n else ''
    return [f'<span class="p4-gname">{g}</span>', f'<span class="ui-num">{n}</span> sportivi{extra}{tog}',
            chk('', kids_on), chk(f'<span class="sn-prog">{PROG[g].replace("<br>", ", ")}</span>', prog_on)]
def kids_block():
    out = '<div class="sn-kid sn-kidh"><span>Sportiv</span><span>Grupa principală în ' + NXT + '</span></div>'
    for n, a, main, note, act in AVANSATI_KIDS:
        if not act:
            out += f'<div class="sn-kid">{chk(f"{n}, {a} ani", False, True)}<span class="p4-muted">Inactiv, nu se copiază</span></div>'
            continue
        nt = f'<small>{note}</small>' if note else ''
        out += f'<div class="sn-kid">{chk(f"{n}, {a} ani", True)}<span class="sn-chg">{main}{nt}</span></div>'
    return out
def section_table(title, groups, kids_on, expand=None):
    allk = kids_on
    th = ['Grupă', f'În {CUR}', chk('Copiază sportivii', allk), chk('Copiază programul', True)]
    thh = ''.join(f'<th scope="col">{h}</th>' for h in th)
    trs = ''
    for g, p, c, k in groups:
        extra = ', 1 inactiv' if g == 'Avansați' else ''
        r = grp_row(g, k, kids_on, True, extra, expanded=(g == expand))
        trs += '<tr>' + ''.join(f'<td>{x}</td>' for x in r) + '</tr>'
        if g == expand:
            trs += f'<tr class="sn-kids"><td colspan="4">{kids_block()}</td></tr>'
    return f'<p class="sn-sec">{title}</p><div class="sn-tbl ui-table-wrap"><table class="ui-table"><thead><tr>{thh}</tr></thead><tbody>{trs}</tbody></table></div>'
SUMMARY = f'Se copiază <b>14 sportivi</b> în 2 grupe și <b>programul a 9 grupe</b>. 73 de sportivi rămân fără grupă, 2 inactivi nu se copiază.'
RULE = 'Grupa principală rămâne aceeași dacă se copiază și ea. Altfel devine principală grupa copiată.'
def groups_step(expand='Avansați'):
    lead = f'<p style="margin:0 0 12px">Toate grupele trec în {NXT}. Alege ce copiezi din {CUR}.</p>'
    return (lead + section_table('Școala de patinaj', SCOALA, False) + section_table('Club', CLUB, True, expand)
            + f'<p class="sn-rule">{RULE}</p><div class="sn-sum">{SUMMARY}</div>')

# ================================================================= the window: groups (phone cards)
def groups_step_phone(expand='Avansați'):
    out = f'<p style="margin:0 0 10px;font-size:13px">Toate grupele trec în {NXT}. Alege ce copiezi din {CUR}.</p>'
    for title, groups, on in [('Școala de patinaj', SCOALA, False), ('Club', CLUB, True)]:
        out += f'<p class="sn-sec">{title}</p><div style="margin-bottom:8px">{chk("Sportivii, toate", on)}&nbsp;&nbsp;{chk("Programul, toate", True)}</div>'
        for g, p, c, k in groups:
            extra = ', 1 inactiv' if g == 'Avansați' else ''
            kids = ''
            if g == expand:
                kids = '<div class="sn-kidlist">' + ''.join(
                    (f'<div class="sn-kid">{chk(f"{n}, {a} ani", False, True)}<span class="p4-muted" style="padding-left:24px;font-size:12.5px">Inactiv, nu se copiază</span></div>' if not act else
                     f'<div class="sn-kid">{chk(f"{n}, {a} ani", True)}<span class="sn-chg" style="padding-left:24px;font-size:12.5px">Principală: {main}{f"<small>{note}</small>" if note else ""}</span></div>')
                    for n, a, main, note, act in AVANSATI_KIDS) + '</div>'
            link = f'<button type="button" class="spv-link">{"Ascunde sportivii" if g == expand else "Vezi sportivii"}</button>'
            out += (f'<div class="sn-card"><div class="nm">{g}</div><div class="sub">{k} sportivi în {CUR}{extra}, {p.replace("<br>", ", ")}</div>'
                    f'{chk("Copiază sportivii", on)}{chk("Copiază programul", True)}<div style="margin-top:6px">{link}</div>{kids}</div>')
    out += f'<p class="sn-rule">{RULE}</p><div class="sn-sum">{SUMMARY}</div>'
    return out

# ================================================================= the window: preview
def preview_step(undo=True):
    st = stats([('Grupe', '9', f'toate trec în {NXT}', 'neutral'), ('Sportivi copiați', '14', 'în 2 grupe Club', 'primary'),
                ('Programe copiate', '10', f'din {NXT_FROM}', 'primary'), ('Fără grupă', '73', f'grupa din {CUR} propusă', 'warning')])
    lines = [
        f'<b>Grupa principală se schimbă pentru 2 sportivi.</b> {MAIN_CHANGES}',
        '<b>Rămâne aceeași pentru 12 sportivi</b>, de exemplu Ioana Marin: Profesioniști.',
        '<b>2 sportivi inactivi nu se copiază:</b> Tudor Matei, Mihnea Sava.',
        f'<b>73 de sportivi intră la Fără grupă</b> în {NXT}, cu grupa principală din {CUR} propusă.',
        f'<b>Programul se repetă</b> din {NXT_FROM} până pe {NXT_TO}. Pauzele nu se copiază: adaugă vacanțele în Calendar și serii.',
        f'<b>Membru A.C.S. nu se copiază.</b> În {NXT} toți pornesc de la Nu.',
    ]
    warn = '' if undo else notice('După aplicare nu se mai poate anula. Se corectează grupă cu grupă.', 'warning', 'Fără anulare')
    return st + '<ul class="sn-lines">' + ''.join(f'<li>{l}</li>' for l in lines) + '</ul>' + (f'<div style="margin-top:12px">{warn}</div>' if warn else '')

# ================================================================= Grupe pages (new season)
SCOALA0 = [(g, p, c, 0) for g, p, c, k in SCOALA]
CLUB1 = [('Profesioniști', CLUB[0][1], CLUB[0][2], 6), ('Avansați', CLUB[1][1], CLUB[1][2], 9)]
def grupe2(season, club=False, fara=0, banner='', line=None, groups=None, phone=False):
    rows_src = groups if groups is not None else (CLUB1 if club else SCOALA0)
    acts = (fara_grupa_btn(fara) if fara else '') + add_group_btn()
    tool = f'<div class="spv-toolbar">{select(f"Sezon {season}", "spv-season")}</div>'
    tb = tabs([('Școala de patinaj', 7), ('Club', 2)], 'Club' if club else 'Școala de patinaj', 'spv-tabs')
    ln = line if line is not None else ('14 sportivi în 2 grupe' if club else '0 sportivi în 7 grupe')
    if phone:
        cards = ''.join(f'<li><button type="button" class="spv-card"><span class="spv-name">{g}</span><span class="spv-sub2">{p.replace("<br>", ", ")}, {k} sportivi</span><span class="spv-sub2">{c or "Fără antrenor"}</span></button></li>' for g, p, c, k in rows_src)
        head = f'<header class="ui-ph" style="flex-direction:column;align-items:stretch"><div><h1 class="ui-ph-title">Grupe</h1></div><div style="display:flex;gap:8px;flex-wrap:wrap">{acts}</div></header>'
        return page(win(head + tool + banner + tb + f'<p class="spv-count">{ln}</p><ul class="spv-cards">{cards}</ul>'))
    rows = [[f'<a class="spv-name" href="#">{g}</a>', p, c or NO_COACH, f'<span class="ui-num">{k}</span>'] for g, p, c, k in rows_src]
    return page(win(ph('Grupe', None, acts) + tool + banner + tb + f'<div class="p4-line">{ln}</div>' + table(['Grupă', 'Program', 'Antrenori', 'Sportivi'], rows)))
B_BANNER = f'<div class="spv-banner">{notice(f"Sezonul {NXT} nu are încă grupe.", "info", None, btn("Pregătește sezonul", "secondary", True))}</div>'

CARRIED = [('Ana Ionescu', f'Din {CUR}, 12 ani', 'Intermediari Bronze'), ('Bianca Radu', f'Din {CUR}, 9 ani', 'Primii Pași'),
           ('Carla Pop', f'Din {CUR}, 12 ani', 'Avansați Silver'), ('Elisa Georgescu', 'Înscriere Școală, 12 ani', '')]
def agp73(style):
    out = f'<div class="ui-root ui-pop p4-agp" style="{style}"><div class="r hd"><span>73 de sportivi fără grupă</span></div>'
    for n, s, g in CARRIED:
        out += f'<div class="r"><div class="nm"><b>{n}</b><small>{s}</small><div class="ln">{cbx(g, "Alege grupa")}{btn("Alocă", "primary", True)}</div></div></div>'
    return out + '<div class="r" style="justify-content:center;color:var(--theme-text-muted);font-size:12.5px">încă 69</div><div class="ft2">' + btn('Alocă toți în grupele propuse', 'ghost', True) + '</div></div>'
def sheet73():
    body = ''
    for n, s, g in CARRIED:
        body += f'<div style="padding:10px 0;border-bottom:1px solid var(--theme-border)"><b>{n}</b><div class="spv-sub2" style="margin:1px 0 6px">{s}</div><div class="p4-agp" style="width:auto"><div class="ln" style="display:flex;gap:8px;align-items:center">{cbx(g, "Alege grupa")}{btn("Alocă", "primary", True)}</div></div></div>'
    return sheet('73 de sportivi fără grupă', body, btn('Alocă toți în grupele propuse', 'secondary'))

# ================================================================= group page, new season, empty tabs (run again for one group)
def grp_new(tab, phone=False):
    sub = 'Școala de patinaj, Virgil Pascu, lista Standard, 0 sportivi'
    tb = tabs([('Sportivi', 0), ('Program', None), ('Istoric', 6)], tab, 'spv-tabs')
    if tab == 'Sportivi':
        bar = f'<div class="ui-table-bar"><span class="p4-muted" style="font-size:12.5px">0 sportivi</span><span style="flex:1"></span>{btn("Adaugă sportivi", "secondary", True, I_PLUS)}</div>'
        body = bar + f'<div class="ui-empty"><div>Niciun sportiv în {NXT}.</div><div class="sn-acts">{btn(f"Copiază sportivii din {CUR}", "secondary", True)}</div><div class="p4-hint">11 sportivi în {CUR}, 1 inactiv nu se copiază.</div></div>'
    else:
        body = (f'<div class="ui-body"><div><p class="spv-h">Program obișnuit</p><div class="ui-empty" style="padding:22px 12px"><div>Niciun program în {NXT}.</div>'
                f'<div class="sn-acts">{btn(f"Copiază programul din {CUR}", "secondary", True)}{btn("Adaugă program", "secondary", True, I_PLUS)}</div>'
                f'<div class="p4-hint">În {CUR}: Sâ și Du, 11:00, 50 min. Se repetă din {NXT_FROM}.</div></div></div></div>')
    if phone:
        head = f'<div class="spv-phone-head"><span class="spv-sub2">{sub}</span><div class="spv-head-acts">{menu_btn()}</div></div>'
        return f'<div class="ui-root ui-sheet-layer" style="background:none"><div class="ui-sheet ui-sheet--full" role="dialog"><div class="ui-sheet-h"><span class="ui-sheet-grab" aria-hidden="true"></span><div class="ui-sheet-hrow"><h2 class="ui-sheet-title">{GROUP}</h2>{btn("", "ghost", True, I_CLOSE, "", True, "Închide")}</div></div><div class="ui-sheet-b">{head}{tb}{body}</div></div></div>'
    return page(win(ph(GROUP, sub, menu_btn(), 'Grupe') + tb + body))

# ================================================================= build
def build_sezon_nou():
    shS, shG = shell_top('Sezoane'), shell('club', 'Grupe')
    def wiz(title, step, n, body, foot, h_d, h_p, base_d, base_p, shl):
        d = deskh(shl, base_d, modal_x(title, f'<span class="sn-step">Pasul {step} din {n}</span>', body[0], foot[0]), h_d)
        p = phoneh(base_p, sheet(title, f'<p class="sn-step" style="margin:4px 0 10px">Pasul {step} din {n}</p>' + body[1], foot[1], True), h_p)
        return d, p
    nav = lambda back, nxt, primary=True: (btn(back, 'ghost') + btn(nxt, 'primary' if primary else 'secondary'), btn(back, 'secondary') + btn(nxt))
    GROUP_TOAST = 'Sezonul {s}: 14 sportivi și 10 programe copiate.'

    # ---------------- A
    sA = []
    baseA, baseAp = sezoane_page('a'), sezoane_page('a', True)
    sA.append(state(f'A1. Q1 A: Sezoane, button "Începe sezonul {NXT}" only on the season after the current one (it exists after "Sezon nou")',
                    deskh(shS, baseA), phoneh(baseAp)))
    d, p = wiz(f'Începe sezonul {NXT}', 1, 3, (f'<p style="margin:0 0 4px">{NXT} devine sezonul curent. Se aplică abia la ultimul pas.</p>' + effects_block(),) * 2,
               nav('Anulează', 'Continuă'), 1000, 1100, baseA, baseAp, shS)
    sA.append(state('A2. Q5 same flow: step 1 says what changes on the website and in the panel when the season becomes current. Nothing is written yet', d, p))
    d, p = wiz(f'Începe sezonul {NXT}', 2, 3, (groups_step(), groups_step_phone()), nav('Înapoi', 'Continuă'), 1500, 2800, baseA, baseAp, shS)
    sA.append(state('A3. Q2 step 2, the groups: per row "Copiază sportivii" (Școala off, Club on) and "Copiază programul" (on, repeats from the season start); header ticks per section; "Vezi sportivii" opens the children with their main group in the new season; summary line', d, p))
    d, p = wiz(f'Începe sezonul {NXT}', 3, 3, (preview_step(), preview_step()), nav('Înapoi', f'Începe sezonul {NXT}'), 1000, 1080, baseA, baseAp, shS)
    sA.append(state('A4. Q4 preview before applying: counts, main-group changes, inactive left out, Fără grupă, program dates, breaks and A.C.S. not copied', d, p))
    sA.append(state(f'A5. Q4 option 1 (recommended): applied in one go, Grupe opens on {NXT}, toast with "Anulează" for 8 s (reverts the current season and every copy)',
                    deskh(shG, grupe2(NXT, fara=73), toast(f'{NXT} este sezonul curent. 14 sportivi și 10 programe copiate.')),
                    phoneh(grupe2(NXT, fara=73, phone=True), toast(f'{NXT} este sezonul curent. 14 sportivi și 10 programe copiate.', top=72))))
    d, p = wiz(f'Începe sezonul {NXT}', 3, 3, (preview_step(False), preview_step(False)), nav('Înapoi', f'Începe sezonul {NXT}'), 1050, 1180, baseA, baseAp, shS)
    sA.append(state('A6. Q4 option 2: no undo. The preview carries a warning; the toast after it has only the X, no "Anulează"', d, p))
    sA.append(state('A7. Sezoane after: the new season is current, no button on any row', deskh(shS, sezoane_page('after')), phoneh(sezoane_page('after', True))))
    sA.append(state(f'A8. Q3: children not copied are "Fără grupă" in {NXT}, last season\'s main group proposed, source "Din {CUR}"; new registrations join the same list',
                    deskh(shG, grupe2(NXT, fara=73), agp73('top:62px;right:150px'), 1000), phoneh(grupe2(NXT, fara=73, phone=True), sheet73())))
    sA.append(state(f'A9. Run again for one group later: empty Sportivi tab in {NXT} offers "Copiază sportivii din {CUR}" (toast with "Anulează")',
                    deskh(shG, grp_new('Sportivi')), phoneh('', grp_new('Sportivi', True))))
    sA.append(state(f'A10. Same for the program: empty Program tab offers "Copiază programul din {CUR}" next to "Adaugă program"',
                    deskh(shG, grp_new('Program')), phoneh('', grp_new('Program', True))))
    introA = (f'<h2>New season, option A: start on Sezoane, one window</h2>'
              f'<p>Sezoane shows "Începe sezonul {NXT}" on the season after the current one. One window, 3 steps: what changes when {NXT} becomes current, the groups (copy children, copy program), the preview. '
              f'The last button makes the season current and copies everything in one go.</p>'
              f'<p>Example: {CUR} has 89 children (7 Școala groups, 2 Club groups, 3 children in both sections, 2 inactive). Club copied, Școala left empty: 14 children copied, 73 go to "Fără grupă". Children are synthetic.</p>'
              f'<p>Compare with sezon-nou-b.html (start on Grupe, making the season current is a separate action).</p>')
    write('sezon-nou-a.html', sn_doc('Phase 4: new season A', introA, sA))

    # ---------------- B
    sB = []
    baseB, baseBp = grupe2(CUR, fara=3, banner=B_BANNER, line='77 sportivi în 7 grupe', groups=SCOALA), grupe2(CUR, fara=3, banner=B_BANNER, line='77 sportivi în 7 grupe', groups=SCOALA, phone=True)
    sB.append(state(f'B1. Q1 B: Grupe ({CUR}) shows a banner as soon as {NXT} exists in Sezoane and has no groups yet',
                    deskh(shG, baseB), phoneh(baseBp)))
    d, p = wiz(f'Pregătește sezonul {NXT}', 1, 2, (groups_step(), groups_step_phone()), nav('Anulează', 'Continuă'), 1500, 2800, baseB, baseBp, shG)
    sB.append(state('B2. Q2 the same groups step as A (step 1 of 2 here)', d, p))
    d, p = wiz(f'Pregătește sezonul {NXT}', 2, 2, (preview_step(), preview_step()), nav('Înapoi', 'Pregătește sezonul'), 1000, 1080, baseB, baseBp, shG)
    sB.append(state(f'B3. Q4 preview, button "Pregătește sezonul". {CUR} stays current: the website does not change yet', d, p))
    sB.append(state(f'B4. Q4 option 1 (recommended): Grupe opens on {NXT} (not current yet), toast with "Anulează"',
                    deskh(shG, grupe2(NXT, fara=73), toast(GROUP_TOAST.format(s=NXT))),
                    phoneh(grupe2(NXT, fara=73, phone=True), toast(GROUP_TOAST.format(s=NXT), top=72))))
    baseS, baseSp = sezoane_page('b'), sezoane_page('b', True)
    sB.append(state('B5. Q5 separate: Sezoane, "Fă sezonul curent" on the season after the current one', deskh(shS, baseS), phoneh(baseSp)))
    conf = lambda prepared: f'<p style="margin:0 0 4px">{CUR} rămâne de citit.</p>' + effects_block(prepared)
    foot = (btn('Anulează', 'ghost') + btn('Fă sezonul curent'), btn('Anulează', 'secondary') + btn('Fă sezonul curent'))
    sB.append(state(f'B6. Q5 the confirmation lists what changes; toast "{NXT} este sezonul curent." with "Anulează"',
                    deskh(shS, baseS, modal(f'Faci {NXT} sezonul curent?', conf(True), foot[0])),
                    phoneh(baseSp, sheet(f'Faci {NXT} sezonul curent?', conf(True), foot[1]), 900)))
    warn = notice(f'Grupele nu au încă program în {NXT}.', 'warning', None, btn('Pregătește sezonul', 'secondary', True))
    sB.append(state('B7. Q5 risk of the separate step: made current before the groups are prepared, the website program falls back to the old text. The confirmation warns',
                    deskh(shS, baseS, modal(f'Faci {NXT} sezonul curent?', warn + '<div style="height:10px"></div>' + conf(False), foot[0])),
                    phoneh(baseSp, sheet(f'Faci {NXT} sezonul curent?', warn + '<div style="height:10px"></div>' + conf(False), foot[1]), 960)))
    sB.append(state('B8. Q3 and run again: same as A8 to A10 (Fără grupă with the proposal, "Copiază sportivii din ..." on an empty group)',
                    deskh(shG, grupe2(NXT, fara=73), agp73('top:62px;right:150px'), 1000), phoneh('', grp_new('Sportivi', True))))
    introB = (f'<h2>New season, option B: start on Grupe, current season separate</h2>'
              f'<p>Grupe shows the banner "Sezonul {NXT} nu are încă grupe." with "Pregătește sezonul" once {NXT} exists. The window has 2 steps (groups, preview) and does not touch the website. '
              f'Making {NXT} current is a separate button on Sezoane with its own confirmation.</p>'
              f'<p>Same example data as option A. Compare with sezon-nou-a.html.</p>')
    write('sezon-nou-b.html', sn_doc('Phase 4: new season B', introB, sB))
