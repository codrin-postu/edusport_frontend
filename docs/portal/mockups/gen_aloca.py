import sys,os
OUTAL=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_pending3.py'), HERE+'/throw/al.html']
exec(open(sys.argv[0]).read())
ac='''<style>.A .cbtn .dot{border-radius:4px!important}
.A .pop4{position:absolute;z-index:6;width:400px;background:#fff;border:1px solid var(--ln);border-radius:8px;box-shadow:0 18px 40px rgba(14,26,60,.16)}
.A .pop4 .r{display:flex;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--ln)}.A .pop4 .r .nm{flex:1;min-width:0}.A .pop4 .r small{display:block;color:var(--mu)}
.A .pop4 .gsel{display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 8px;border:1px solid var(--ln2);border-radius:6px;font-size:12.5px;margin-top:4px;background:#fff}
.A .pop4 .done{background:#f2faf5;color:#1d6b3a}.A .pop4 .done .nm{font-weight:600}
.A .pop4 .hd{font-weight:700;justify-content:space-between}
.A .glist{position:absolute;z-index:8;width:250px;background:#fff;border:1px solid var(--ln);border-radius:8px;box-shadow:0 14px 30px rgba(14,26,60,.18);padding:6px 0;font-size:13px}
.A .glist .gh{padding:6px 12px 2px;font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--mu);text-transform:uppercase}
.A .glist .gi{display:flex;justify-content:space-between;padding:6px 12px}.A .glist .gi.on{background:var(--p);color:#fff;border-radius:6px;margin:0 4px;padding:6px 8px}
.A .glist .gi small{color:var(--mu)}.A .glist .gi.on small{color:#dfe6ff}
.A .toast{position:absolute;z-index:9;left:50%;bottom:18px;transform:translateX(-50%);background:#131c3d;color:#fff;padding:10px 14px;border-radius:6px;font-size:13px;display:flex;gap:14px;align-items:center}.A .toast a{color:#ffd27a;font-weight:700}
.A .drw{position:absolute;z-index:6;top:0;right:0;bottom:0;width:380px;background:#fff;border-left:1px solid var(--ln);box-shadow:-14px 0 30px rgba(14,26,60,.12)}
.A .drw .dh{display:flex;align-items:center;padding:14px 16px;border-bottom:1px solid var(--ln)}.A .drw .dh b{flex:1;font-size:15px}
.A .hl2 td{background:#eef6f0}</style>'''
def cbtn(n): return '<span class="cbtn">'+ic('user')+'Fără grupă<span class="dot">'+str(n)+'</span></span>'
def hdrN(n): return '<div class="wh"><div><h1>Grupe</h1></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span>'+(cbtn(n) if n else '')+'<span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>'
KIDS=[('Maria Dumitrescu','Înscriere Școală · 12 ani','Intermediari Bronze'),('Andrei Popescu','Înscriere Școală · 10 ani','Primii Pași'),('Victor Lungu','Adăugat de antrenor · 19 ani','Performanță Seniori')]
def row(n,s,g,state=''):
  if state=='done': return f'<div class="r done"><span class="nm">✓ {n} alocat în {g}</span><span class="lnk">Anulează</span></div>'
  return f'<div class="r"><span class="nm"><b>{n}</b><small>{s}</small><span class="gsel">{g}{ic("down")}</span></span><span class="btn sm pr">Alocă</span></div>'
def pop(rows,n,foot=True): return ('<div class="pop4" style="top:68px;right:150px"><div class="r hd"><span>'+str(n)+' sportivi fără grupă</span><span class="hint" style="font-weight:400">grupa propusă se poate schimba</span></div>'+''.join(rows)
  +('<div class="r" style="border:0;justify-content:flex-end"><span class="btn sm">Alocă toți în grupele propuse</span></div>' if foot else '')+'</div>')
def page(n,tbl,over): return screen('scoala','<div class="win" style="position:relative;min-height:470px">'+hdrN(n)+tabsG('s')+info('64 sportivi în 6 grupe')+tbl+'</table>'+over+'</div>')
T0=simple(SG)
T1=simple(SG).replace('<tr><td><b>Intermediari Bronze</b>','<tr class="hl2"><td><b>Intermediari Bronze</b>',1).replace('<td>Andrei Popa</td><td>11</td>','<td>Andrei Popa</td><td><b>12</b></td>',1)
# A: one click, proposed group preselected
A1=page(3,T0,pop([row(*k) for k in KIDS],3))
A2=page(2,T1,pop([row(*KIDS[0],'done')]+[row(*k) for k in KIDS[1:]],2))
gl=('<div class="glist" style="top:150px;right:250px"><div class="gh">Școala de patinaj</div>'+''.join(f'<div class="gi{" on" if g=="Intermediari Bronze" else ""}"><span>{g}</span><small>{"propus" if g=="Intermediari Bronze" else c}</small></div>' for g,p,a,c in SG)
 +'<div class="gh">Club</div>'+''.join(f'<div class="gi"><span>{g}</span><small>{c}</small></div>' for g,p,a,c in CG)+'</div>')
A3=page(3,T0,pop([row(*k) for k in KIDS],3)+gl)
A4=page(0,T0.replace('<td>Andrei Popa</td><td>11</td>','<td>Andrei Popa</td><td><b>12</b></td>',1),'<div class="toast">3 sportivi alocați în grupele propuse <a>Anulează</a></div>')
# B: Aloca opens group list inline (no preselected group)
def rowB(n,s,g): return f'<div class="r"><span class="nm"><b>{n}</b><small>{s} · propus {g}</small></span><span class="btn sm pr">Alocă{ic("down")}</span></div>'
glB=gl.replace('top:150px;right:250px','top:150px;right:158px')
B1=page(3,T0,pop([rowB(*k) for k in KIDS],3)+glB)
# C: opens member record drawer
drw=('<div class="drw"><div class="dh"><b>Maria Dumitrescu</b>'+ic('x')+'</div><div class="ui-tabs" style="margin:0;padding:0 8px"><span class="ui-tab">Date</span><span class="ui-tab on">Grupe</span><span class="ui-tab">Documente</span><span class="ui-tab">Istoric</span></div><div style="padding:14px 16px"><div class="lb">Grupa 2026-2027</div><div class="vl"><span class="gsel" style="display:inline-flex;align-items:center;gap:4px;height:34px;padding:0 10px;border:1px solid var(--ln2);border-radius:6px">Intermediari Bronze (propus)'+ic('down')+'</span></div><div class="lb" style="margin-top:14px">Grupe anterioare</div><div class="vl">Primii Pași 2025-2026</div></div><div class="ft" style="position:absolute;bottom:0;left:0;right:0"><span class="btn">Anulează</span><span class="btn pr">Salvează</span></div></div>')
C1=page(3,T0,drw)
cap=lambda t:f'<p class="cap2" style="margin-top:14px">{t}</p>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac
 +'<div class="A"><h2>Ce face "Alocă"</h2><p class="note">Decis: butonul "Fără grupă" cu dropdown (Q1 A). Aici: ce se întâmplă la clic pe "Alocă". În toate variantele: nu se trimite e-mail părintelui, nu se creează abonament, totul intră în Istoricul sportivului. Date inventate.</p>'+flow
 +QH(1,'Clic pe "Alocă"')+'<div class="options wcol" style="flex-direction:column!important">'
 +O('A','al-direct','Alocă direct în grupa propusă; grupa se poate schimba înainte (recomandat)',cap('1. Dropdown: fiecare rând are grupa propusă deja aleasă')+A1+cap('2. Clic "Alocă" la Maria: rândul devine verde cu "Anulează", numărul scade la 2, rândul grupei din spate se actualizează (11 → 12)')+A2+cap('3. Altă grupă: clic pe numele grupei din rând, lista pe secțiuni, cea propusă e marcată')+A3+cap('4. "Alocă toți": toți intră în grupele lor, butonul dispare, mesaj jos cu "Anulează"')+A4,'Un clic pentru cazul obișnuit. Rândurile alocate rămân verzi până închizi dropdown-ul, ca să poți anula.')
 +O('B','al-pick','"Alocă" deschide lista grupelor, alegi de fiecare dată',B1,'Un clic în plus la fiecare copil; grupa propusă e doar sugestie în text.')
 +O('C','al-drawer','"Alocă" deschide fișa sportivului, tabul Grupe',C1,'Vezi și grupele anterioare, dar pleci din dropdown și apeși "Salvează".')+'</div>'
 +'<p class="note" style="margin-top:24px">Bulina cu numărul e acum pătrată (colțuri 4px), după regula fără forme rotunde. Mai jos, întrebările rămase de data trecută.</p>'
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
open(OUTAL,'w').write(html)
