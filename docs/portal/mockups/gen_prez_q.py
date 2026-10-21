import sys,os
OUTPQ=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_main.py'), HERE+'/throw/mg.html']
exec(open(sys.argv[0]).read())
pqc='''<style>
.A .sess{width:100%;border-collapse:collapse;font-size:13px}.A .sess td,.A .sess th{padding:10px 16px;border-bottom:1px solid var(--theme-border);text-align:left}.A .sess th{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted)}
.A .sess .t{font-weight:700;width:70px}.A .sess .m{color:var(--theme-text-muted)}
.A .grid td,.A .grid th{text-align:center}.A .grid td:first-child,.A .grid th:first-child{text-align:left}
.A .strip{display:inline-flex;gap:3px}.A .strip i{width:12px;height:12px;border:1px solid var(--theme-border-strong)}.A .strip i.p{background:var(--theme-primary);border-color:var(--theme-primary)}
.A .btns{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap}
.A .tx{font-size:13px;line-height:1.5;padding:12px 16px}
</style>'''
st=lambda s:'<span class="strip">'+''.join(f'<i class="{"p" if c=="1" else ""}"></i>' for c in s)+'</span>'
# Q1
DAY=card('Prezență, sâmbătă 10 oct',('<table class="sess"><tr><th>Ora</th><th>Grupă</th><th>Prezenți</th><th></th></tr>'
 +''.join(f'<tr><td class="t">{t}</td><td>{g}</td><td>{p}</td><td class="m">{s}</td></tr>' for t,g,p,s in [('10:00','Primii Pași','12 din 14','salvată'),('10:00','Intermediari Bronze','10 din 12','salvată'),('11:00','Intermediari Silver','','nefăcută'),('12:00','Avansați Gold','','nefăcută')])+'</table>'),btn('Altă zi','ghost'))
GRID=card('Prezență, sâmbătă 10 oct, Școala de patinaj',('<table class="sess grid"><tr><th>Sportiv</th><th>10:00</th><th>11:00</th><th>12:00</th></tr>'
 +''.join(f'<tr><td>{n}</td>'+''.join(f'<td>{chk(c=="1") if c!="-" else ""}</td>' for c in cs)+'</tr>' for n,cs in [('Ana Bălan','11-'),('Maria Dumitrescu','11-'),('Tudor Enache','1--'),('Ioana Marin','0--')])+'</table>'))
GRP=card('Primii Pași',('<div class="ui-tabs" style="margin:0;padding:0 8px"><span class="ui-tab">Sportivi</span><span class="ui-tab on">Prezență</span><span class="ui-tab">Istoric</span></div>'
 '<table class="sess"><tr><th>Sportiv</th><th>Octombrie</th><th>Prezent</th></tr>'
 +''.join(f'<tr><td>{n}</td><td>{st(s)}</td><td>{s.count("1")} din {len(s)}</td></tr>' for n,s in [('Ana Bălan','11101'),('Maria Dumitrescu','11011'),('Tudor Enache','10111')])+'</table>'))
# Q2
SES=lambda b:card('Prezență: Intermediari Silver, sâmbătă 10 oct, 11:00',('<table class="att"><tr><th>Sportiv</th><th>Prezent</th></tr>'
 +''.join(f'<tr><td>{n}</td><td>{chk(p)}</td></tr>' for n,p in [('Ana Bălan',True),('Tudor Enache',True)])
 +'<tr class="ex"><td>Maria Dumitrescu<small>Grupa principală: Primii Pași</small></td><td>'+chk(True)+'</td></tr></table><div class="btns">'+b+'</div>'))
V2A=SES(btn('Adaugă doar la ședința asta','ghost')+btn('Adaugă și în lista grupei','ghost'))
V2B=SES(btn('Adaugă la ședința asta','ghost'))
# Q3
TX=lambda t:card('Prezență salvată',f'<div class="tx">{t}</div>')
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix+mvc+mgc+pqc
 +'<div class="A"><h2>Prezență în panou: 3 întrebări</h2><p class="note">Date inventate.</p>'
 +QH(1,'De unde pornești')+'<div class="options wcol" style="flex-direction:column!important">'
 +O('A','pz-day','Pagină pe zi: ședințele zilei, clic deschide prezența (recomandat)',DAY,'')
 +O('B','pz-grid','Pagină pe zi: un rând pe sportiv, o coloană pe oră',GRID,'')
 +O('C','pz-group','Din grupă: tab Prezență pe lună',GRP,'')+'</div>'
 +QH(2,'Sportiv din altă grupă la o ședință')+'<div class="options wcol" style="flex-direction:column!important">'
 +O('A','vis-both','Două butoane: doar la ședința asta, sau și în lista grupei (recomandat)',V2A,'')
 +O('B','vis-session','Un buton: doar la ședința asta. Lista grupei se schimbă din pagina Grupe',V2B,'')+'</div>'
 +QH(3,'Cine poate corecta o prezență salvată')+'<div class="options wcol">'
 +O('A','ed-48','Antrenorul 48 de ore, adminul oricând (recomandat)',TX('Orice corectură apare în Istoric.'),'')
 +O('B','ed-month','Antrenorul până la sfârșitul lunii, adminul oricând',TX('Orice corectură apare în Istoric.'),'')
 +O('C','ed-admin','Doar adminul, după salvare',TX('Antrenorul cere corectura adminului.'),'')+'</div></div>')
open(OUTPQ,'w').write(html)
