import sys, os

OUT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(sys.argv[0]))

ADMIN = open(os.path.join(HERE, 'admin-ui-extract.css')).read()
LIGHT = open(os.path.join(HERE, 'companion-light.html')).read()

# ---------------------------------------------------------------- icons ----
CHEV_UP = '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 7.5L6 4.5L9 7.5" stroke="currentColor" stroke-width="1.4"/></svg>'
CHEV_DOWN = '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.4"/></svg>'
ICON_CLOSE = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
ICON_PLUS = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1.5v9M1.5 6h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>'

# ---------------------------------------------------------- wrapper CSS ----
WRAP = '''<style>
.S{font:14px/1.5 Inter,system-ui,sans-serif;color:#1c2240;padding:8px 8px 40px;max-width:1280px;margin:0 auto}
.S h2{margin:0 0 4px;font-size:21px}
.S h3.qh{margin:34px 0 12px;padding-top:16px;border-top:3px solid #131c3d;font-size:17px}
.S p.note{color:#5b6380;margin:0 0 14px;font-size:13px;max-width:900px}
.options{display:flex;gap:18px;flex-wrap:wrap;margin-top:8px;align-items:flex-start}
.options.col{flex-direction:column}
.option{flex:1;min-width:320px;border:1px solid #d9dce6;padding:16px;cursor:pointer;background:#fff}
.option.selected{border-color:#3b4a9a;box-shadow:0 0 0 2px #3b4a9a}
.ot{font-weight:700;color:#1c2240!important;margin:0 0 12px!important;font-size:14px}
.od{margin:12px 0 0!important;font-size:12.5px;color:#5b6380}
.letter{display:inline-block;margin-right:6px}
.cap{font-size:11.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#5b6380;margin:16px 0 6px}
.cap:first-child{margin-top:0}
.framerow{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start}
.phx{width:100%}
.phx.narrow{width:420px;max-width:100%}
.phx.wide{width:780px;max-width:100%}
/* inline preview overrides: drawers render in-flow instead of as a fixed overlay */
.phx .ui-drawer-layer{position:static!important;inset:auto!important;background:transparent!important;display:block!important;padding:0!important}
.phx .ui-drawer{width:100%!important;max-width:100%!important;height:auto!important;box-shadow:0 10px 28px rgba(20,26,54,.14)!important;border:1px solid var(--theme-border)!important;animation:none!important}
.phx .ui-win{width:100%}
</style>'''

QH = lambda n, t: f'<h3 class="qh">{n}. {t}</h3>'
CAP = lambda t: f'<div class="cap">{t}</div>'


def O(letter, choice, title, body, desc=''):
    d = f'<p class="od">{desc}</p>' if desc else ''
    return (f'<div class="option" data-choice="{choice}" onclick="toggleSelect(this)">'
            f'<p class="ot"><span class="letter">{letter}</span>{title}</p>{body}{d}</div>')


# ------------------------------------------------------- component atoms ----

def root(inner, extra_cls=''):
    cls = ('ui-root ' + extra_cls).strip()
    return f'<div class="{cls}" data-theme="light">{inner}</div>'


def page_header(title, subtitle, actions=''):
    act = f'<div class="ui-ph-actions">{actions}</div>' if actions else ''
    return (f'<header class="ui-ph"><div><h1 class="ui-ph-title">{title}</h1>'
            f'<p class="ui-ph-sub">{subtitle}</p></div>{act}</header>')


def tabs(items, active):
    btns = ''.join(
        f'<button type="button" role="tab" aria-selected="{"true" if k == active else "false"}" class="ui-tab">{label}</button>'
        for k, label in items)
    return f'<div role="tablist" class="ui-tabs">{btns}</div>'


def btn(label, variant='secondary', sm=True, icon=''):
    cls = f'ui-btn ui-btn--{variant}' + (' ui-btn--sm' if sm else '')
    return f'<button type="button" class="{cls}">{icon}{label}</button>'


def field(label, control, hint=''):
    h = f'<div class="ui-hint">{hint}</div>' if hint else ''
    return f'<div class="ui-field"><label class="ui-label">{label}</label>{control}{h}</div>'


def field_row(*parts):
    return '<div class="ui-grid2">' + ''.join(parts) + '</div>'


def input_tag(value='', ph=''):
    return f'<input class="ui-input" value="{value}" placeholder="{ph}">'


def select_tag(value):
    return f'<select class="ui-input"><option>{value}</option></select>'


def numinput(value=''):
    return (f'<span class="ui-root ui-numin" data-theme="light"><input class="ui-input" value="{value}">'
            f'<span class="ui-numin-steps">'
            f'<button type="button" tabindex="-1" aria-label="Crește">{CHEV_UP}</button>'
            f'<button type="button" tabindex="-1" aria-label="Scade">{CHEV_DOWN}</button>'
            f'</span></span>')


def textarea_tag(value='', rows=2, ph=''):
    return f'<textarea class="ui-input" rows="{rows}" placeholder="{ph}">{value}</textarea>'


def switch_tag(on=True):
    track = '<span class="ui-switch-track" aria-hidden="true"><span class="ui-switch-thumb"></span></span>'
    return f'<button type="button" role="switch" aria-checked="{"true" if on else "false"}" class="ui-switch">{track}</button>'


def badge(text, tone='neutral', sm=True):
    return f'<span class="ui-badge ui-badge--{"sm" if sm else "md"} ui-badge--{tone}">{text}</span>'


def notice(text, tone='warning', title=''):
    t = f'<b class="ui-notice-title">{title}</b>' if title else ''
    return (f'<div class="ui-notice ui-notice--{tone}" role="alert"><span class="ui-notice-mark" aria-hidden="true"></span>'
            f'<div class="ui-notice-text">{t}' + (f'<span class="ui-notice-body">{text}</span>' if text else '') + '</div></div>')


def editor_card(title, body, desc='', action=''):
    act = f'<div class="ui-ecard-action">{action}</div>' if action else ''
    d = f'<p class="ui-ecard-desc">{desc}</p>' if desc else ''
    return (f'<section class="ui-root ui-ecard" data-theme="light"><div class="ui-ecard-h">'
            f'<div class="ui-ecard-titles"><h3 class="ui-ecard-title">{title}</h3>{d}</div>{act}</div>'
            f'<div class="ui-ecard-b">{body}</div></section>')


def table(cols, rows, clickable=True):
    th = ''.join(f'<th scope="col">{c}</th>' for c in cols)
    trs = ''
    for r in rows:
        cls = ' class="ui-table-click"' if clickable else ''
        tds = ''.join(f'<td>{c}</td>' for c in r)
        trs += f'<tr{cls}>{tds}</tr>'
    return (f'<div class="ui-table-root"><div class="ui-table-wrap"><table class="ui-table">'
            f'<thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table></div></div>')


def empty_state(text, action=''):
    return f'<div class="ui-empty"><div>{text}</div>{action}</div>'


def drawer(title, body, footer=''):
    return root(
        '<div class="ui-drawer" role="dialog" aria-modal="true">'
        f'<div class="ui-drawer-h"><h2 class="ui-drawer-title">{title}</h2>'
        f'<button type="button" class="ui-btn ui-btn--ghost ui-btn--sm ui-btn--icon" aria-label="Închide">{ICON_CLOSE}</button></div>'
        f'<div class="ui-drawer-b"><div class="ui-dsec"><div class="ui-dsec-b">{body}</div></div></div>'
        f'<div class="ui-drawer-f">{footer}</div></div>',
        'ui-drawer-layer',
    )


def win(inner):
    return root(f'<div class="ui-win">{inner}</div>', 'ui-page ui-stack')


def body(*parts):
    return '<div class="ui-body">' + ''.join(parts) + '</div>'


def frame(inner, cls='wide'):
    return f'<div class="phx {cls}">{inner}</div>'


# ---------------------------------------------------------------- data ----
STANDARD_ROWS = [
    ('Abonament 6 ședințe grup', 'Abonament', '6', '520 RON', '720 RON', True),
    ('Abonament 8 ședințe grup', 'Abonament', '8', '590 RON', '790 RON', False),
    ('1 ședință grup', 'Ședință', '1', '-', '150 RON', True),
]

MEMBER_FEE_TOOLTIP = 'Disponibil pentru cei care știu că vor lipsi un weekend din cele 4 aferente abonamentului.'
LAST_ROW_NOTE = 'Disponibil doar pentru prima ședință'
FOOTER_NOTE = 'Taxa de membru se achită o singură dată pe sezon, la înscrierea la cursurile noastre, indiferent de momentul înscrierii...'


def standard_table_rows():
    rows = []
    for name, kind, sessions, member, nonmember, has_extra in STANDARD_ROWS:
        mark = ' <span class="ui-hint" style="display:inline">*</span>' if has_extra else ''
        rows.append((name + mark, kind, sessions, member, nonmember))
    return rows


def q1_option_a():
    standard_card = editor_card(
        'Standard', desc='Școala de patinaj',
        action=btn(ICON_PLUS + 'Adaugă preț', variant='ghost'),
        body=table(['Nume', 'Tip', 'Ședințe', 'Membri', 'Non-membri'], standard_table_rows())
        + '<p class="ui-hint" style="margin-top:8px">* are tooltip. Clic pe rând pentru editare.</p>',
    )
    gold_card = editor_card(
        'Avansați Gold', desc='Școala de patinaj',
        action=btn(ICON_PLUS + 'Adaugă preț', variant='ghost'),
        body=notice('', tone='warning', title='Preț incomplet')
        + table(['Nume', 'Tip', 'Ședințe', 'Membri', 'Non-membri'],
                [('Abonament 8 ședințe grup', 'Abonament', '8', badge('Lipsă', 'warning'), badge('Lipsă', 'warning'))]),
    )
    footer_card = editor_card(
        'Notițe subsol', desc='Textele afișate în subsolul secțiunii de prețuri de pe site.',
        action=btn(ICON_PLUS + 'Adaugă notă', variant='ghost'),
        body=textarea_tag(FOOTER_NOTE, rows=2),
    )
    main = win(page_header('Prețuri', 'Listele de prețuri pe secțiuni și sezonul curent.')
               + body(tabs([('scoala', 'Școala de patinaj'), ('club', 'Club')], 'scoala'),
                      standard_card, gold_card,
                      btn(ICON_PLUS + 'Listă nouă', variant='secondary'),
                      footer_card))
    club_empty = win(page_header('Prețuri', 'Listele de prețuri pe secțiuni și sezonul curent.')
                      + body(tabs([('scoala', 'Școala de patinaj'), ('club', 'Club')], 'club'),
                             empty_state('Nicio listă de prețuri', btn(ICON_PLUS + 'Listă nouă'))))
    return (CAP('Școala de patinaj tab') + frame(main)
            + CAP('Club tab, empty state') + frame(club_empty, 'narrow'))


def price_item_card(name, kind, sessions, member, nonmember, tooltip='', note=''):
    rows = [
        field_row(field('Nume', input_tag(name)), field('Tip', select_tag(kind))),
        field_row(field('Ședințe', numinput(sessions)), field('Preț membri', input_tag(member))),
        field_row(field('Preț non-membri', input_tag(nonmember)),
                  field('Tooltip', textarea_tag(tooltip, rows=1), hint='Opțional')),
    ]
    return editor_card(name, body=''.join(rows))


def q1_option_b():
    items = []
    items.append('<p class="ui-hint" style="font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:4px 0 8px">Standard</p>')
    items.append(price_item_card('Abonament 6 ședințe grup', 'Abonament', '6', '520', '720', tooltip=MEMBER_FEE_TOOLTIP))
    items.append(price_item_card('1 ședință grup', 'Ședință', '1', '-', '150', tooltip=LAST_ROW_NOTE))
    items.append(btn(ICON_PLUS + 'Adaugă preț', variant='ghost'))
    items.append('<p class="ui-hint" style="font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:20px 0 8px">Avansați Gold</p>')
    items.append(notice('', tone='warning', title='Preț incomplet'))
    items.append(price_item_card('Abonament 8 ședințe grup', 'Abonament', '8', '', ''))
    items.append(btn(ICON_PLUS + 'Adaugă preț', variant='ghost'))
    main = win(page_header('Prețuri', 'Listele de prețuri pe secțiuni și sezonul curent.')
               + body(tabs([('scoala', 'Școala de patinaj'), ('club', 'Club')], 'scoala'),
                      ''.join(items),
                      btn(ICON_PLUS + 'Listă nouă', variant='secondary')))
    return frame(main)


def q2_option_a():
    season_row = ('2026-2027', 'Octombrie 2026 - Mai 2027', '270 RON', badge('Curent', 'success'))
    main = win(page_header('Sezoane', 'Sezoanele școlii, taxa de membru și sezonul curent.',
                            actions=btn(ICON_PLUS + 'Sezon nou', variant='primary'))
               + body(table(['Sezon', 'Perioadă', 'Taxă de membru', 'Curent'], [season_row]),
                      '<p class="ui-hint">Clic pe un rând deschide editarea lui într-un panou lateral.</p>'))
    season_drawer = drawer(
        'Sezon 2026-2027',
        body=field('Sezon', input_tag('2026-2027'))
        + field_row(field('Început', select_tag('Octombrie 2026')), field('Sfârșit', select_tag('Mai 2027')))
        + field('Taxă de membru', numinput('270'), hint='RON'),
        footer=btn('Anulează', variant='ghost') + btn('Salvează', variant='primary'),
    )
    return (CAP('Pagina Sezoane') + frame(main)
            + CAP('Panoul de editare a sezonului') + frame(season_drawer, 'narrow'))


def q2_option_b():
    season_card = editor_card(
        'Sezon curent', desc='Sezonul folosit pe site și în documente.',
        body=field_row(field('Sezon', select_tag('2026-2027')), field('Taxă de membru', numinput('270')))
        + field_row(field('Început', select_tag('Octombrie 2026')), field('Sfârșit', select_tag('Mai 2027'))),
    )
    main = win(page_header('Prețuri', 'Listele de prețuri pe secțiuni și sezonul curent.')
               + body(season_card, tabs([('scoala', 'Școala de patinaj'), ('club', 'Club')], 'scoala'),
                      '<p class="ui-hint">Listele de prețuri rămân mai jos, neschimbate.</p>'))
    return frame(main)


def q3_drawer(with_extra):
    rows = [
        field_row(field('Nume', input_tag('Abonament 6 ședințe grup')), field('Tip', select_tag('Abonament'))),
        field_row(field('Ședințe', numinput('6')), field('Preț membri', input_tag('520'))),
        field('Preț non-membri', input_tag('720')),
    ]
    if with_extra:
        rows.append(field('Tooltip', textarea_tag(MEMBER_FEE_TOOLTIP, rows=2), hint='Opțional'))
    return drawer('Abonament 6 ședințe grup', body=''.join(rows),
                  footer=btn('Anulează', variant='ghost') + btn('Salvează', variant='primary'))


def q4_frame():
    switch_field = field(
        'Înscrieri deschise',
        '<div style="display:flex;align-items:center;gap:10px">'
        + switch_tag(True)
        + '<span class="ui-hint">Vizibile pe site</span>'
        + '<button type="button" class="ui-root ui-tipbtn" aria-label="Mai multe informații" style="width:18px;height:18px">i</button>'
        + '</div>',
        hint='Când este activ, pe site se afișează secțiunea de înscrieri. Când este inactiv, apare mesajul că înscrierile sunt închise.',
    )
    card = editor_card('Înscrieri', body=switch_field)
    main = win(page_header('Setări site', 'Înscrieri și date de contact, folosite pe tot site-ul.') + body(card))
    return frame(main)


def build():
    html = []
    html.append('<div class="S">')
    html.append('<h2>Phase 2 admin screens: Prețuri and Sezon</h2>')
    html.append('<p class="note">Decided: these two screens replace the old Prețuri page and the season card in Setări site. '
                 'The website and the registration form read from them. "Înscrieri deschise" stays in Setări site.</p>')

    html.append(QH(1, 'Prețuri page layout'))
    html.append('<div class="options col">')
    html.append(O('A', 'q1-table', 'Tabs, one EditorCard per price list, compact table rows (recommended)', q1_option_a(),
                  'Scans fastest: a whole list at a glance. Row click opens the tooltip/note drawer. Closer to a normal admin list.'))
    html.append(O('B', 'q1-fields', 'Tabs, one EditorCard per price with Field rows', q1_option_b(),
                  'Closer to the page as it is today. More vertical scrolling once a list has several prices.'))
    html.append('</div>')

    html.append(QH(2, 'Sezon screen'))
    html.append('<p class="note">Marking another season as current, and carrying groups over to it, come in phase 4. This screen only edits seasons.</p>')
    html.append('<div class="options col">')
    html.append(O('A', 'q2-page', 'Its own "Sezoane" page, reached from the sidebar', q2_option_a(),
                  'Room to show every season later, not just the current one.'))
    html.append(O('B', 'q2-card', '"Sezon curent" card on top of the Prețuri page', q2_option_b(),
                  'One page instead of two, but other seasons only reachable through the small Select.'))
    html.append('</div>')

    html.append(QH(3, 'Tooltip only (your idea): the note under the name is dropped'))
    html.append('<div class="options">')
    html.append(O('A', 'q3-tooltip-ok', 'Looks right', frame(q3_drawer(True), 'narrow'),
                  '"Disponibil doar pentru prima ședință" moves into the tooltip of 1 ședință grup.'))
    html.append(O('B', 'q3-tooltip-change', 'Change something', '', 'Tell me in chat.'))
    html.append('</div>')

    html.append(QH(4, 'Setări site after the change'))
    html.append('<p class="note">The "Înscrieri" card keeps only the open/closed switch; the season fields move to the Sezon screen above.</p>')
    html.append(q4_frame())
    html.append('<div class="options" style="margin-top:16px">')
    html.append(O('A', 'q4-ok', 'Looks right', ''))
    html.append(O('B', 'q4-change', 'Change something, tell me in chat', ''))
    html.append('</div>')

    html.append('</div>')
    return ''.join(html)


out = LIGHT + '<style>' + ADMIN + '</style>' + WRAP + build()
open(OUT, 'w').write(out)
print('wrote', OUT, len(out), 'bytes')
