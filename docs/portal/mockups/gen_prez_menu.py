import sys,os
OUTPM=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_prez_tab.py'), HERE+'/throw/pt.html']
exec(open(sys.argv[0]).read())
pmc='''<style>.A .fl{display:flex;gap:8px;align-items:center;padding:10px 18px;border-bottom:1px solid var(--theme-border);flex-wrap:wrap}.A .fl .ui-cbx{width:180px}
.A .sl .sec td{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);background:var(--theme-surface-subtle);padding:6px 18px}</style>'''
def mp(body,over=''): return screen('prezenta','<div class="win pw">'+body+over+'</div>')
hd=lambda sub='':'<div class="wh"><div><h1>Prezență</h1></div></div>'+sub
S=[('10:00','Primii Pași','12 din 14','Cristi Vlad'),('10:00','Intermediari Bronze','10 din 12','Andrei Popa'),('11:00','Intermediari Silver','','Bianca Ene'),('12:00','Avansați Gold','','Bianca Ene'),('17:00','Performanță Juniori','9 din 12','Andrei Popa')]
row=lambda t,g,p,c,d='':f'<tr><td><b>{d}{t}</b></td><td>{g}</td><td class="{"" if p else "w"}">{p or "nefăcută"}</td><td class="m">{c}</td></tr>'
dayA=(f'<div class="ui-root mbar">{btn("‹","ghost")}<b>Azi, sâmbătă 10 oct</b>{btn("›","ghost")}{btn("Alege data","ghost")}</div>'
 '<table class="ui-root sl"><tr><th>Ora</th><th>Grupă</th><th>Prezenți</th><th>Antrenor</th></tr>'
 '<tr class="sec"><td colspan="4">Nefăcute din zilele trecute (2)</td></tr>'
 +row('10:00','Primii Pași','','Cristi Vlad','Du 4 oct, ')+row('17:00','Uscat Juniori','','Andrei Popa','Vi 9 oct, ')
 +'<tr class="sec"><td colspan="4">Azi</td></tr>'+''.join(row(*x) for x in S)+'</table>')
PA2=mp(hd(dayA))
flB=('<div class="ui-root fl">'+cbx('Ultimele 7 zile')+cbx('Toate grupele')+cbx('Stare: toate')+'</div>'
 '<table class="ui-root sl"><tr><th>Ședință</th><th>Grupă</th><th>Prezenți</th><th>Antrenor</th></tr>'
 +''.join(row(t,g,p,c,'Sâ 10 oct, ') for t,g,p,c in S)+row('17:00','Uscat Juniori','','Andrei Popa','Vi 9 oct, ')+row('10:00','Primii Pași','13 din 14','Cristi Vlad','Du 4 oct, ')+'</table>')
PB2=mp(hd(flB))
DRW2=DRW.replace('Primii Pași, sâmbătă 10 oct, 10:00','Intermediari Silver, sâmbătă 10 oct, 11:00').replace('Salvată de Cristi Vlad, 10 oct, 11:05','Nefăcută').replace('Prezență, 12 din 14','Prezență').replace(' checked','').replace('Cristi Vlad</span>','Bianca Ene</span>').replace('value="Cristi Vlad"','value="Bianca Ene"')
PD2=mp(hd(dayA),DRW2)
PT=mp(hd(dayA).replace('<td class="w">nefăcută</td><td class="m">Bianca Ene</td></tr><tr><td><b>12:00','<td>11 din 16</td><td class="m">Bianca Ene</td></tr><tr><td><b>12:00',1),toast('Prezența la Intermediari Silver, 11:00 a fost salvată.',True))
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix+mvc+mgc+pqc+ptc+pmc
 +'<div class="A"><h2>Meniu: Prezență</h2><p class="note">Toate grupele. Clic pe o ședință deschide același panou ca din grupă. Date inventate.</p>'
 +QH(1,'Pagina')+'<div class="options wcol" style="flex-direction:column!important">'
 +O('A','pm-day','Azi, cu nefăcutele din zilele trecute sus (recomandat)',PA2,'')
 +O('B','pm-list','Listă cu filtre (perioadă, grupă, stare)',PB2,'')+'</div>'
 +'<div class="qh">Clic pe o ședință</div>'+PD2
 +'<div class="qh">După Salvează</div>'+PT+'</div>')
open(OUTPM,'w').write(html)
