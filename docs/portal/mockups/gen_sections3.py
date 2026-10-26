import sys,os
OUTSE3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_sections2.py'), HERE+'/throw/se3.html']
exec(open(sys.argv[0]).read())
def tabs3g(on,first=True):
  t=[('f','Fără grupă',3),('s','Școala de patinaj',6),('c','Club',3)] if first else [('s','Școala de patinaj',6),('c','Club',3),('f','Fără grupă',3)]
  return '<div class="ui-tabs" style="margin:0;padding:0 14px">'+''.join(f'<span class="ui-tab{" on" if k==on else ""}">{l}<span class="ui-tab-count" style="{"background:#fdf3e1;color:#8a4b06" if k=="f" else ""}">{c}</span></span>' for k,l,c in t)+'</div>'
FGrows2=''.join(f'<tr><td><label class="ccb"><input type="checkbox"></label></td><td><b>{n}</b></td><td>{a} ani</td><td class="hint">{src}</td><td><div class="cdd"><button class="cdd-t"><span class="cdd-v">{g}</span>{ic("down")}</button></div></td></tr>' for n,a,src,g in [('Maria Dumitrescu',12,'Înscriere Școală · 6 oct','Școală · Intermediari Bronze'),('Andrei Popescu',10,'Înscriere Școală · 5 oct','Școală · Primii Pași'),('Victor Lungu',19,'Adăugat de antrenor · 2 oct','Club · Performanță Seniori')])
fgT=('<table class="gt"><tr><th><label class="ccb"><input type="checkbox"></label></th><th>Nume sportiv</th><th>Vârstă</th><th>De unde</th><th style="width:300px">Grupa propusă</th></tr>'+FGrows2+'</table>')
WA=('<div class="win">'+hdr+tabs3g('f')+info('Sportivi confirmați din tot clubul care nu sunt încă într-o grupă.')+fgT+'</div>')
WAs=('<div class="win">'+hdr+tabs3g('s')+info('64 sportivi în 6 grupe')+simple(SG)+'</table></div>')
ban=('<div style="display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid var(--ln);background:#fffcf5"><span style="width:8px;height:8px;background:#b45309;display:inline-block"></span><b>3 sportivi fără grupă</b><span class="hint">din tot clubul</span><span style="flex:1"></span><span class="lnk">Alocă'+ic('chev')+'</span></div>')
WB=('<div class="win">'+hdr+ban+tabsG('s')+info('64 sportivi în 6 grupe')+simple(SG)+'</table></div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+'<div class="A"><h2>"Fără grupă" pentru tot clubul, sus</h2><p class="note">Un sportiv fără grupă poate veni din înscrierea la Școală sau poate fi adăugat de un antrenor la Club, deci "Fără grupă" nu ține de o secțiune. Grupa propusă poate fi din oricare secțiune. Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','tab-first','Primul tab: "Fără grupă", apoi Școala de patinaj, Club (recomandat)','<p class="cap2">Tab Fără grupă</p>'+screen('scoala',WA)+'<p class="cap2" style="margin-top:14px">Tab Școala de patinaj</p>'+screen('scoala',WAs),'Se vede primul, cu numărul portocaliu; când e 0, tabul rămâne, cu 0 gri. Alocarea se face direct în tab.')
 +O('B','line','O linie sus, deasupra taburilor, doar când există',screen('scoala',WB),'Mai discret; "Alocă" deschide pagina de alocare. Când e 0, linia dispare.')+'</div></div>')
open(OUTSE3,'w').write(html)
