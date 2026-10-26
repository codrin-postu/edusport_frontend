import sys,os
OUTAL2=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_aloca.py'), HERE+'/throw/al1.html']
exec(open(sys.argv[0]).read())
# Real admin CSS (tokensCss() + UI_CSS from edusport_backend/src/admin/ui, extracted with esbuild).
ADMIN=open(os.path.join(HERE,'admin-ui-extract.css')).read()
fix='''<style>
.A .ui-root.ui-pop{position:absolute!important}
.A .ui-root.ui-toast-viewport{position:absolute!important;top:16px!important;right:16px!important}
.A .agp{width:420px;padding:0}
.A .agp .r{display:flex;gap:12px;align-items:flex-end;padding:10px 14px;border-bottom:1px solid var(--theme-border)}
.A .agp .r .nm{flex:1;min-width:0}.A .agp .r small{display:block;color:var(--theme-text-muted);font-size:12px;margin:1px 0 6px}
.A .agp .hd{font-weight:700;align-items:center}
.A .agp .ft2{display:flex;justify-content:flex-end;padding:10px 14px}
.A .agp .ui-cbx{flex:1}.A .agp .ln{display:flex;gap:10px;align-items:center}
</style>'''
CHEV='<svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" stroke-width="1.6"/></svg>'
CLOSE='<svg viewBox="0 0 14 14" fill="none" aria-hidden="true" width="14" height="14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
def cbx(v): return f'<div class="ui-root ui-cbx"><input class="ui-input" role="combobox" value="{v}" readonly><span class="ui-cbx-actions"><button type="button" class="ui-iconbtn ui-iconbtn--sm">{CHEV}</button></span></div>'
def btn(t,v='primary',sm=True): return f'<button type="button" class="ui-btn ui-btn--{v}{" ui-btn--sm" if sm else ""}">{t}</button>'
def rowR(n,s,g): return f'<div class="r"><div class="nm"><b>{n}</b><small>{s}</small><div class="ln">{cbx(g)}{btn("Alocă")}</div></div></div>'
def popR(kids): return ('<div class="ui-root ui-pop agp" style="top:68px;right:150px"><div class="r hd"><span>'+str(len(kids))+' sportivi fără grupă</span></div>'+''.join(rowR(*k) for k in kids)
  +'<div class="ft2">'+btn('Alocă toți în grupele propuse','ghost')+'</div></div>')
def toast(text,undo=False): return ('<div class="ui-root ui-toast-viewport"><div class="ui-toast ui-toast--success" role="status"><div class="ui-toast-text"><span class="ui-toast-body">'+text+'</span>'
  +('<div style="margin-top:6px">'+btn('Anulează','ghost')+'</div>' if undo else '')+f'</div><button type="button" class="ui-btn ui-btn--ghost ui-btn--sm ui-btn--icon ui-toast-close" aria-label="Închide">{CLOSE}</button></div></div>')
def optlist(top):
  opts=[(g,'Școala de patinaj · propus' if g=='Intermediari Bronze' else 'Școala de patinaj',g=='Intermediari Bronze') for g,p,a,c in SG]+[(g,'Club',False) for g,p,a,c in CG]
  return (f'<div class="ui-root ui-pop ui-list" role="listbox" style="top:{top}px;right:229px;width:327px">'+''.join(f'<div class="ui-opt" role="option"{" aria-selected=\"true\" data-active=\"true\"" if on else ""}><span>{g}</span><span class="ui-opt-hint">{h}</span></div>' for g,h,on in opts)+'</div>')
def pg(n,tbl,over): return screen('scoala','<div class="win" style="position:relative;min-height:520px">'+hdrN(n)+tabsG('s')+info('64 sportivi în 6 grupe')+tbl+'</table>'+over+'</div>')
T12=T0.replace('<td>Andrei Popa</td><td>11</td>','<td>Andrei Popa</td><td>12</td>',1)
F1=pg(3,T0,popR(KIDS))
F2=pg(3,T0,popR(KIDS)+optlist(203))
F3=pg(2,T12,popR(KIDS[1:])+toast('Maria Dumitrescu a intrat în grupa Intermediari Bronze.'))
F4=pg(0,T12,toast('3 sportivi au intrat în grupele propuse.'))
U1=pg(2,T12,popR(KIDS[1:])+toast('Maria Dumitrescu a intrat în grupa Intermediari Bronze.',True))
U2=pg(2,T12,popR(KIDS[1:])+toast('Maria Dumitrescu a intrat în grupa Intermediari Bronze.'))
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix
 +'<div class="A"><h2>"Alocă" cu componentele din panou</h2><p class="note">Dropdown-ul de pe fiecare rând este <b>SearchableSelect</b>, iar lista de grupe este <b>Popover</b> cu opțiunile lui (<code>src/admin/ui</code>). Confirmarea este <b>Toast</b>-ul din panou (<code>adminToast.success</code>, sus în dreapta, dispare după 5 secunde). Stilurile sunt cele reale, extrase din cod. Nu se trimite e-mail părintelui, nu se creează abonament, totul intră în Istoric. Date inventate.</p>'+flow
 +'<div class="qh">Fluxul</div><div class="wcol" style="flex-direction:column">'
 +cap('1. Dropdown "Fără grupă": fiecare rând are grupa propusă deja aleasă în SearchableSelect')+F1
 +cap('2. Altă grupă: scrii sau alegi din listă. Secțiunea apare ca text mic sub nume (SearchableSelect nu are titluri de secțiune); cea propusă e marcată')+F2
 +cap('3. "Alocă" la Maria: rândul dispare din dropdown, numărul scade la 2, grupa din tabel trece la 12, toast de succes')+F3
 +cap('4. "Alocă toți în grupele propuse": butonul "Fără grupă" dispare, toast de succes')+F4+'</div>'
 +QH(1,'Anularea din toast')+'<p class="note">Toast-ul de azi are doar text și X, fără buton. "Anulează" ar cere o mică extindere a componentei (o opțiune <code>action</code>), folosită apoi oriunde în panou.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','undo-yes','Adăugăm "Anulează" în toast (recomandat)',U1,'Greșeala se repară dintr-un clic, cât timp toast-ul e vizibil. Extinderea servește și la alte acțiuni (ștergeri, mutări).')
 +O('B','undo-no','Toast-ul rămâne cum e, fără anulare',U2,'Dacă ai greșit, muți sportivul din pagina grupei.')+'</div>'
 +QH(2,'Taburi pe secțiuni: Școala de patinaj / Club')+'<p class="note">Fără "Toate", 4 coloane: Grupă, Program, Antrenori, Sportivi; clic pe rând deschide grupa. Plus filtrul "Secțiune" în Sportivi.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','q2-ok','Da, așa',screen('scoala',WAs),'"+ Grupă nouă" creează grupa în tabul deschis.')
 +O('B','q2-change','Mai e de schimbat',TXT('Spune ce în chat.'),'')+'</div>'
 +QH(3,'Numele secțiunii din meniu')+'<div class="options wcol">'
 +O('A','q3-keep','Rămâne "Școala de patinaj"',M1,'')
 +O('B','q3-club','"Club și școală"',M2,'Spune corect ce e înăuntru.')+'</div>'
 +QH(4,'Mutarea unui sportiv în altă grupă în timpul sezonului')+'<div class="options wcol">'
 +O('A','q4-keep','Abonamentul merge cu sportivul (recomandat)',TXT('Ședințele rămase se folosesc în grupa nouă; prezența veche rămâne la grupa veche, în Istoric.'),'')
 +O('B','q4-stay','Abonamentul rămâne la grupa veche',TXT('În grupa nouă trebuie cumpărat alt abonament.'),'Mai complicat pentru părinte.')+'</div>'
 +QH(5,'Programul grupei')+'<div class="options wcol">'
 +O('A','q5-cal','Vine din calendarul site-ului, seria Școlii (recomandat)',TXT('Schimbi ora o dată în calendar; se vede pe site, la grupă și la prezență.'),'')
 +O('B','q5-own','Se scrie separat la grupă',TXT('Program introdus pe fiecare grupă.'),'Riscă să nu se potrivească cu site-ul.')+'</div></div>')
open(OUTAL2,'w').write(html)
