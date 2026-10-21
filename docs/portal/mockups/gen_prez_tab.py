import sys,os
OUTPT=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_prez_q.py'), HERE+'/throw/pq.html']
exec(open(sys.argv[0]).read())
ptc='''<style>
.A .ui-root.ui-drawer-layer{position:absolute!important}
.A .pw{position:relative;min-height:560px}
.A .mbar{display:flex;align-items:center;gap:8px;padding:10px 18px;border-bottom:1px solid var(--theme-border)}
.A .mbar b{font-size:14px;min-width:120px;text-align:center}
.A .dates{display:flex;gap:6px;padding:10px 18px;border-bottom:1px solid var(--theme-border);flex-wrap:wrap}
.A .dt{display:flex;flex-direction:column;align-items:center;min-width:58px;padding:6px 8px;border:1px solid var(--theme-border-strong);border-radius:6px;font-size:12px;background:var(--theme-surface)}
.A .dt b{font-size:13px}.A .dt small{color:var(--theme-text-muted)}.A .dt.todo{border-color:var(--theme-warning)}.A .dt.todo small{color:var(--theme-warning)}.A .dt.fut{opacity:.45}
.A .dt.on{background:var(--theme-primary);border-color:var(--theme-primary);color:#fff}.A .dt.on small{color:#dfe6ff}
.A .rt{width:100%;border-collapse:collapse;font-size:13px}.A .rt td,.A .rt th{padding:10px 18px;border-bottom:1px solid var(--theme-border);text-align:left}.A .rt th{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted)}
.A .rt .sub td{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);background:var(--theme-surface-subtle);padding:6px 18px}
.A .strip i.x{background:transparent;border-color:transparent}
.A .sl{width:100%;border-collapse:collapse;font-size:13px}.A .sl td,.A .sl th{padding:11px 18px;border-bottom:1px solid var(--theme-border);text-align:left}.A .sl th{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted)}.A .sl .m{color:var(--theme-text-muted)}.A .sl .w{color:var(--theme-warning);font-weight:600}
.A .drb{padding:12px 16px;display:grid;gap:12px}.A .drb .ui-cbx{flex:1}.A .drb .lb2{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);margin-bottom:4px}
.A .pl{width:100%;border-collapse:collapse;font-size:13px}.A .pl td{padding:9px 0;border-bottom:1px solid var(--theme-border)}.A .pl td:last-child{text-align:right}.A .pl small{display:block;color:var(--theme-text-muted)}
.A .ph2{width:340px;border:1px solid var(--theme-border);border-radius:14px;overflow:hidden;background:var(--theme-surface)}
.A .ph2 .top{padding:12px 14px;border-bottom:1px solid var(--theme-border);font-weight:700}
.A .ph2 .ui-tabs{margin:0;padding:0 6px}
</style>'''
D=[('Sâ','3 oct','12 din 14',''),('Du','4 oct','13 din 14',''),('Sâ','10 oct','12 din 14','on'),('Du','11 oct','nefăcută','todo'),('Sâ','17 oct','','fut'),('Du','18 oct','','fut')]
dates='<div class="ui-root dates">'+''.join(f'<span class="dt {c}"><small>{d}</small><b>{n}</b><small>{s}</small></span>' for d,n,s,c in D)+'</div>'
mbar=f'<div class="ui-root mbar">{btn("‹","ghost")}<b>Octombrie 2026</b>{btn("›","ghost")}</div>'
gh=('<div class="wh"><div><h1>Primii Pași</h1><div class="ghint"><span>Sâmbătă și duminică, 10:00</span><span>Antrenor: Cristi Vlad</span><span>14 sportivi</span></div></div></div>'
 '<div class="ui-tabs" style="margin:0;padding:0 14px"><span class="ui-tab">Sportivi</span><span class="ui-tab on">Prezență</span><span class="ui-tab">Istoric</span></div>')
R=[('Ana Bălan','1101'),('Maria Dumitrescu','1110'),('Tudor Enache','1011'),('Ioana Marin','0100')]
def strip(s): return '<span class="strip">'+''.join(f'<i class="{"p" if c=="1" else ""}"></i>' for c in s)+'</span>'
rowsA=(''.join(f'<tr><td>{n}</td><td>{s[:3].count("1")} din 3</td></tr>' for n,s in R)
 +'<tr class="sub"><td colspan="2">Din alte grupe</td></tr><tr><td>Sara-Maria Ilie<div class="hint" style="font-size:12px">Grupa principală: Intermediari Bronze</div></td><td>1</td></tr>')
TA=f'<table class="ui-root rt"><tr><th>Sportiv</th><th>Prezent</th></tr>{rowsA}</table>'
TB=('<table class="ui-root sl"><tr><th>Ședință</th><th>Prezenți</th><th>Antrenor</th><th></th></tr>'
 +''.join(f'<tr><td><b>{d} {n}</b>, 10:00</td><td class="{"w" if c=="todo" else ""}">{s or "<span class=m>urmează</span>"}</td><td class="m">{"Cristi Vlad" if s and c!="todo" else ""}</td><td class="m">{"Din alte grupe: 1" if n=="4 oct" else ""}</td></tr>' for d,n,s,c in D)+'</table>')
def page(body,over=''): return screen('scoala','<div class="win pw">'+gh+mbar+body+over+'</div>')
PA=page(dates+TA)
PB=page(TB)
# session drawer
plist=(''.join(f'<tr><td>{n}</td><td>{chk(p)}</td></tr>' for n,p in [('Ana Bălan',True),('Maria Dumitrescu',True),('Tudor Enache',True),('Ioana Marin',False)])
 +'<tr><td>Sara-Maria Ilie<small>Grupa principală: Intermediari Bronze</small></td><td>'+chk(True)+'</td></tr>')
DRW=('<div class="ui-root ui-drawer-layer"><div class="ui-drawer"><div class="ui-drawer-h"><h2 class="ui-drawer-title">Primii Pași, sâmbătă 10 oct, 10:00</h2>'
 f'<button type="button" class="ui-btn ui-btn--ghost ui-btn--sm ui-btn--icon">{CLOSE}</button></div><div class="ui-drawer-b"><div class="drb">'
 '<div><div class="lb2">Antrenor</div>'+cbx('Cristi Vlad')+'</div>'
 '<div><div class="lb2">Prezență, 12 din 14</div><table class="pl">'+plist+'</table></div>'
 '<div style="display:flex;gap:8px">'+cbx('Caută sportiv din club')+btn('Adaugă doar la ședința asta','ghost')+'</div>'
 '<div class="hint">Salvată de Cristi Vlad, 10 oct, 11:05</div></div></div>'
 '<div class="ui-drawer-f"><span style="flex:1"></span>'+btn('Anulează','ghost',False)+btn('Salvează','primary',False)+'</div></div></div>')
PD=page(dates.replace('class="dt on"','class="dt on"')+TA,DRW)
# phone
PH=('<div class="ui-root ph2"><div class="top">Primii Pași</div><div class="ui-tabs"><span class="ui-tab">Sportivi</span><span class="ui-tab on">Prezență</span><span class="ui-tab">Istoric</span></div>'
 '<div class="mbar">'+btn('‹','ghost')+'<b>Octombrie 2026</b>'+btn('›','ghost')+'</div>'
 '<table class="sl">'+''.join(f'<tr><td><b>{d} {n}</b></td><td class="{"w" if c=="todo" else ""}">{s or "<span class=m>urmează</span>"}</td></tr>' for d,n,s,c in D)+'</table></div>')
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix+mvc+mgc+pqc+ptc
 +'<div class="A"><h2>Grupa: tab Prezență</h2><p class="note">Date inventate.</p>'
 +QH(1,'Cum arată luna')+'<div class="options wcol" style="flex-direction:column!important">'
 +O('A','pt-roster','Ședințele sus, sportivii dedesubt (recomandat)',PA,'Clic pe o ședință o deschide.')
 +O('B','pt-list','Listă de ședințe',PB,'Clic pe rând o deschide.')+'</div>'
 +'<div class="qh">Ședința deschisă (Drawer)</div><p class="note">Antrenor, bife, "Adaugă doar la ședința asta". Corecturile intră în Istoric.</p>'+PD
 +'<div class="qh">Pe telefon</div><p class="note">Lista ședințelor; ședința se deschide pe tot ecranul.</p>'+PH+'</div>')
open(OUTPT,'w').write(html)
