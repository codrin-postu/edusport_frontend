import sys,os
OUTU=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_groups.py'), HERE+'/throw/un.html']
exec(open(sys.argv[0]).read())
tot2=tot.replace('<a>Alocă-i ↓</a>','')
# A: pseudo-row in table
rowFG=(f'<tr style="background:#fafbfd"><td><b>Fără grupă</b><small style="display:block;color:var(--mu)">confirmați, nealocați</small></td><td class="hint">—</td><td class="hint">—</td><td><b style="color:#b45309">3</b></td><td>1</td><td>0 din 3</td><td><span class="lnk">Alocă{ic("chev")}</span></td></tr>')
gtA=gt.replace('</table>',rowFG+'</table>')
WA=('<div class="win"><div class="wh"><div><h1>Grupe</h1><p>Școala de patinaj, un singur loc.</p></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>'+tot2+gtA+'</div>')
# A2: opened "Fără grupă" page = like group page with assign per row + bulk
FGrows=''.join(f'<tr><td><label class="ccb"><input type="checkbox" {"checked" if i<2 else ""}></label></td><td><b>{n}</b></td><td>{a} ani</td><td class="hint">{lvl}</td><td><div class="cdd"><button class="cdd-t"><span class="cdd-v">{g}</span>{ic("down")}</button></div></td></tr>' for i,(n,a,lvl,g) in enumerate(UNG))
WA2=('<div class="win"><div class="wh"><div><span class="lnk">'+ic('chev').replace('class="ic"','class="ic" style="transform:rotate(180deg)"')+'Grupe</span><h1 style="margin-top:6px">Fără grupă</h1><p>Sportivi confirmați pentru 2026-2027 care nu sunt încă într-o grupă. Grupa propusă după nivel și vârstă.</p></div></div>'
 +'<div class="selban">'+ic('check')+'<b>2 selectați</b><span style="flex:1"></span><span class="btn sm pr">Alocă în grupele propuse</span><span class="btn sm">Anulează</span></div>'
 +'<table class="gt"><tr><th><label class="ccb"><input type="checkbox"></label></th><th>Nume sportiv</th><th>Vârstă</th><th>Nivel</th><th style="width:300px">Grupa propusă</th></tr>'+FGrows+'</table></div>')
# B: tabs on page
tb2=('<div class="ui-tabs" style="margin:0;padding:0 14px"><span class="ui-tab">Grupe<span class="ui-tab-count">6</span></span><span class="ui-tab on">Fără grupă<span class="ui-tab-count">3</span></span></div>')
WB=('<div class="win"><div class="wh"><div><h1>Grupe</h1><p>Școala de patinaj, un singur loc.</p></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>'+tot2+tb2
 +'<div class="selban">'+ic('check')+'<b>2 selectați</b><span style="flex:1"></span><span class="btn sm pr">Alocă în grupele propuse</span><span class="btn sm">Anulează</span></div>'
 +'<table class="gt"><tr><th><label class="ccb"><input type="checkbox"></label></th><th>Nume sportiv</th><th>Vârstă</th><th>Nivel</th><th style="width:300px">Grupa propusă</th></tr>'+FGrows+'</table></div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+'<div class="A"><h2>Sportivii fără grupă: fără card separat</h2><p class="note">Fără limită de locuri (decis). Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','row','Un rând "Fără grupă" la finalul tabelului, ca o grupă (recomandat)','<p class="cap2">Lista</p>'+screen('scoala',WA)+'<p class="cap2" style="margin-top:14px">Apeși "Alocă": se deschide ca o grupă</p>'+screen('scoala',WA2),'Se comportă ca orice grupă; acolo alegi grupa pe fiecare rând sau aloci mai mulți deodată în grupele propuse.')
 +O('B','tab','Tab "Fără grupă" lângă "Grupe"',screen('scoala',WB),'Lista separată, cu același tabel de alocare.')+'</div></div>')
open(OUTU,'w').write(html)
