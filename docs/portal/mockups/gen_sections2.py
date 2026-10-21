import sys,os
OUTSE2=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_sections.py'), HERE+'/throw/se2.html']
exec(open(sys.argv[0]).read())
def tabsG(on):
  return '<div class="ui-tabs" style="margin:0;padding:0 14px">'+''.join(f'<span class="ui-tab{" on" if k==on else ""}">{l}<span class="ui-tab-count">{c}</span></span>' for k,l,c in [('s','Școala de patinaj',6),('c','Club',3)])+'</div>'
simple=lambda lst:'<table class="gt"><tr><th>Grupă</th><th>Program</th><th>Antrenori</th><th>Sportivi</th></tr>'+''.join(f'<tr><td><b>{g}</b></td><td>{p}</td><td>{a}</td><td>{c}</td></tr>' for g,p,a,c in lst)
fg='<tr><td><b>Fără grupă</b></td><td class="hint">confirmați, nealocați</td><td></td><td><b style="color:#b45309">3</b></td></tr>'
info=lambda t:f'<div style="padding:10px 18px;color:var(--mu);font-size:12.5px;border-bottom:1px solid var(--ln)">{t}</div>'
hdr=('<div class="wh"><div><h1>Grupe</h1></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>')
WS2=('<div class="win">'+hdr+tabsG('s')+info('64 sportivi în 6 grupe')+simple(SG)+fg+'</table></div>')
WC2=('<div class="win">'+hdr+tabsG('c')+info('27 sportivi în 3 grupe')+simple(CG)+'</table></div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+'<div class="A"><h2>Grupe: două taburi, mai puțin pe ecran</h2><p class="note">Taburi "Școala de patinaj" și "Club" (fără "Toate"). Un singur rând de total sub taburi. Tabelul are doar Grupă, Program, Antrenori, Sportivi; rândul întreg se deschide la click (fără "Deschide"). "Fără grupă" e ultimul rând la Școală. "Grupă nouă" o creează în tabul deschis. Date inventate.</p>'
 '<div class="wcol" style="flex-direction:column"><div><p class="cap2">Tab Școala de patinaj</p>'+screen('scoala',WS2)+'</div><div style="margin-top:18px"><p class="cap2">Tab Club</p>'+screen('scoala',WC2)+'</div></div></div>')
open(OUTSE2,'w').write(html)
