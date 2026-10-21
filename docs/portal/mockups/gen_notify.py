import sys,os
OUTNT=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_sections3.py'), HERE+'/throw/nt.html']
exec(open(sys.argv[0]).read())
nc='''<style>.A .cbtn{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px;border:1px solid var(--ln2);border-radius:6px;background:#fff;font-weight:600}.A .cbtn .dot{min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:#c2410c;color:#fff;font-size:11px;font-weight:800;display:inline-grid;place-items:center}
.A .sbbadge{margin-left:auto;margin-right:12px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#c2410c;color:#fff;font-size:10.5px;font-weight:800;display:inline-grid;place-items:center}
.A .sublink{color:var(--mu);font-size:13px;margin-top:3px}.A .sublink a{color:#c2410c;font-weight:700;text-decoration:none;border-bottom:1.5px solid rgba(194,65,12,.35)}
.A .pop3{position:absolute;z-index:6;width:340px;background:#fff;border:1px solid var(--ln);border-radius:8px;box-shadow:0 18px 40px rgba(14,26,60,.16)}.A .pop3 .r{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--ln)}.A .pop3 .r small{display:block;color:var(--mu)}</style>'''
hdrA=('<div class="wh"><div><h1>Grupe</h1></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="cbtn">'+ic('user')+'Fără grupă<span class="dot">3</span></span><span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>')
WA=('<div class="win">'+hdrA+tabsG('s')+info('64 sportivi în 6 grupe')+simple(SG)+'</table></div>')
pop=('<div class="pop3" style="top:68px;right:150px"><div class="r" style="font-weight:700">3 sportivi fără grupă</div>'+''.join(f'<div class="r"><span><b>{n}</b><small>{s}</small></span><span class="lnk">Alocă</span></div>' for n,s in [('Maria Dumitrescu','Înscriere Școală · propus Intermediari Bronze'),('Andrei Popescu','Înscriere Școală · propus Primii Pași'),('Victor Lungu','Adăugat de antrenor · propus Performanță Seniori')])+'<div class="r" style="border:0"><span></span><span class="btn sm pr">Alocă toți în grupele propuse</span></div></div>')
SA=screen('scoala',WA+pop)
hdrB=('<div class="wh"><div><h1>Grupe</h1><div class="sublink">64 sportivi în 9 grupe · <a>3 fără grupă</a></div></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>')
WB=('<div class="win">'+hdrB+tabsG('s')+simple(SG)+'</table></div>')
SB=screen('scoala',WB).replace('Grupe<span class=new>NOU</span></div>','Grupe<span class="sbbadge">3</span></div>',1)
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+'<div class="A"><h2>"Fără grupă" ca notificare, fără bară galbenă</h2><p class="note">Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','button','Buton "Fără grupă" cu număr, lângă "Grupă nouă"; deschide un dropdown (recomandat)',SA,'Numărul e o bulină portocalie; la 0 butonul dispare. Din dropdown aloci pe rând sau toți deodată, fără să pleci de pe pagină.')
 +O('B','badge','Număr în meniu + link sub titlu',SB,'Bulina apare pe "Grupe" în meniul din stânga (se vede de oriunde din panou); sub titlu, "3 fără grupă" e un link spre pagina de alocare.')+'</div></div>')
open(OUTNT,'w').write(html)
