import sys,os
OUTSE=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_unassigned.py'), HERE+'/throw/se.html']
exec(open(sys.argv[0]).read())
sc3='''<style>.A .tg{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:3px}.A .tg.s{background:#e6e9f2;color:#0e1a3c}.A .tg.c{background:#f3e3e6;color:#7a1f2b}
.A .shd{display:flex;align-items:center;gap:12px;padding:14px 18px 10px;border-top:1px solid var(--ln);background:#fafbfd}.A .shd b{font-size:15px}.A .shd .st{color:var(--mu);font-size:12.5px}.A .shd .st b{font-size:13px;color:var(--tx)}
.A .segtabs{display:inline-flex;border:1px solid var(--ln2);border-radius:6px;padding:2px;background:#fff}.A .segtabs span{padding:6px 12px;font-weight:600;font-size:12.5px;border-radius:4px;color:var(--t2)}.A .segtabs span.on{background:var(--p);color:#fff}</style>'''
SG=[('Primii Pași','Sâ, Du 10:00','Cristi Vlad',14),('Intermediari Bronze','Sâ, Du 10:00','Andrei Popa',11),('Intermediari Silver','Sâ, Du 11:00','Bianca Ene',16),('Avansați Silver','Sâ, Du 11:00','Andrei Popa',9),('Avansați Gold','Sâ, Du 12:00','Bianca Ene · Cristi Vlad',8),('Adulți','Du 12:00','Cristi Vlad',6)]
CG=[('Performanță Juniori','Lu, Mi, Vi 07:00 · 17:00','Andrei Popa',12),('Performanță Seniori','Ma, Jo 17:00','Bianca Ene',7),('Uscat Juniori','Jo 17:00','Cristi Vlad',10)]
def rows(lst,tag):
  return ''.join(f'<tr><td><b>{g}</b></td><td>{p}</td><td>{a}</td><td><b>{c}</b></td><td><span class="lnk">Deschide{ic("chev")}</span></td></tr>' for g,p,a,c in lst)
head='<tr><th>Grupă</th><th>Program</th><th>Antrenori</th><th>Sportivi</th><th></th></tr>'
secS=('<div class="shd"><span class="tg s">Școală</span><b>Școala de patinaj</b><span class="st"><b>64</b> sportivi · <b>6</b> grupe · <b style="color:#b45309">3</b> fără grupă</span><span style="flex:1"></span><span class="btn sm">'+ic('plus')+'Grupă în Școală</span></div><table class="gt">'+head+rows(SG,'s')
 +'<tr style="background:#fafbfd"><td><b>Fără grupă</b><small style="display:block;color:var(--mu)">confirmați la Școală, nealocați</small></td><td class="hint">—</td><td class="hint">—</td><td><b style="color:#b45309">3</b></td><td><span class="lnk">Alocă'+ic('chev')+'</span></td></tr></table>')
secC=('<div class="shd"><span class="tg c">Club</span><b>Club</b><span class="st"><b>27</b> sportivi · <b>3</b> grupe</span><span style="flex:1"></span><span class="btn sm">'+ic('plus')+'Grupă în Club</span></div><table class="gt">'+head+rows(CG,'c')+'</table>')
W=('<div class="win"><div class="wh"><div><h1>Grupe</h1><p>Toate grupele clubului, pe secțiuni.</p></div><span class="sp"></span><span class="segtabs"><span>Toate</span><span class="on">Școala de patinaj</span><span>Club</span></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span></div>'+secS+secC+'</div>')
WS=W.replace('<span>Toate</span><span class="on">Școala de patinaj</span>','<span class="on">Toate</span><span>Școala de patinaj</span>')
S_all=screen('scoala',WS)
# sportivi with section filter (rich dropdown nav includes Secțiune)
SECS2=[('sect','Secțiune','Școala de patinaj'),('grupa','Grupa','Toate'),('ab','Abonament','Toate'),('date','Date','Toate')]
nav2='<div class="nav">'+''.join(f'<div class="sec2{" on" if k=="sect" else ""}{" set" if v!="Toate" else ""}"><b>{l}</b><span>{v}</span></div>' for k,l,v in SECS2)+'</div>'
paneS=row('Școala de patinaj',True)+row('Club')+row('Fără grupă')
fx2=('<div class="vE" style="position:absolute;top:150px;left:410px;z-index:6"><div class="fx" style="position:static"><div class="body">'+nav2+'<div class="pane">'+paneS+'</div></div><div class="ft2"><span class="cnt">64 sportivi</span><span style="flex:1"></span><span class="lnk">Șterge tot</span><span class="btn sm pr">Gata</span></div></div></div>')
sp_rows=[('Ana Bălan',10,'Primii Pași','s'),('Andreea Popa',11,'Intermediari Silver','s'),('Mara Toma',13,'Avansați Gold','s'),('Ioana Marinescu',14,'Performanță Juniori · Primii Pași (2024)','c')]
spT=('<table class="gt"><tr><th>Nume sportiv</th><th>Vârstă</th><th>Grupe 2026-2027</th><th>Abonament</th></tr>'+''.join(f'<tr><td><b>{n}</b></td><td>{a} ani</td><td><span class="tg {t}" style="margin-right:6px">{"Școală" if t=="s" else "Club"}</span>{g.split(" · ")[0]}</td><td class="hint">—</td></tr>' for n,a,g,t in sp_rows[:3])+'</table>')
WSP=('<div class="win"><div class="wh"><div><h1>Sportivi</h1><p>Toți sportivii clubului.</p></div></div>'
 +f'<div class="tb"><span class="in srch">{ic("search")}Caută...</span><span class="fbtn act" style="box-shadow:0 0 0 3px #dfe6f3">Filtre <b>1</b>{ic("down")}</span></div><div class="tb chips"><span class="chip2">Secțiune: Școala de patinaj ✕</span><span class="sbt-lbl">64 sportivi</span></div>'+spT+'</div>')
S_sp=screen('scoala',WSP+fx2)
side_note=('<div class="qq2" style="max-width:640px">Meniul din stânga: secțiunea "Școala de patinaj" devine <b>"Club și școală"</b> (Grupe, Sportivi, Prezență), pentru că acum conține și grupele clubului. Fiecare pagină are filtrul de secțiune.</div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+'<style>'+CSSV['E']+'</style>'+'<div class="A"><h2>Secțiuni: Școala de patinaj și Club</h2><p class="note">Fiecare grupă aparține unei secțiuni. Grupele Școlii au eticheta ȘCOALĂ (navy, ca în calendarul site-ului); celelalte CLUB (burgundy). Date inventate.</p>'
 '<div class="sec">1. Grupe, pe secțiuni</div><p class="note">Fiecare secțiune cu totalurile ei; "Fără grupă" stă în secțiunea Școlii. Comutatorul de sus arată Toate / doar Școala / doar Clubul.</p>'+S_all
 +'<div class="sec">2. Sportivi: filtrul "Secțiune"</div><p class="note">În Filtre apare "Secțiune" (Școala de patinaj / Club / Fără grupă). Eticheta lângă grupă arată secțiunea dintr-o privire.</p>'+S_sp
 +'<div class="sec">3. Meniul</div>'+side_note+'</div>')
open(OUTSE,'w').write(html)
