import sys,os
OUTMV3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_aloca2.py'), HERE+'/throw/al2.html']
exec(open(sys.argv[0]).read())
mvc='''<style>
.A .ui-root.ui-modal-layer{position:absolute!important}
.A .mvbar{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;padding:10px 18px;border-top:1px solid var(--theme-border);background:var(--theme-surface)}
.A .mvbar .ui-cbx{width:260px}
.A .ibox{border:1px solid var(--theme-border);border-radius:6px;padding:10px 12px;margin-top:10px;background:var(--theme-surface-subtle)}
.A .ibox b{color:var(--theme-text)}
.A .rad{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--theme-border-strong);border-radius:6px;padding:10px 12px;margin-top:8px}
.A .rad input{accent-color:var(--theme-primary);margin-top:3px}.A .rad.on{border-color:var(--theme-primary);box-shadow:0 0 0 1px var(--theme-primary)}
.A .rad b{display:block;color:var(--theme-text)}
.A .tk{display:inline-flex;gap:2px;vertical-align:middle;margin-right:6px}.A .tk i{width:9px;height:12px;border:1px solid #9aa3b8}.A .tk i.u{background:#3b4a7a;border-color:#3b4a7a}
.A .ab .abt{font-weight:700;color:var(--theme-text)}.A .ab .abm{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:14px;color:var(--theme-text)}.A .ab .abm .tk i{width:12px;height:16px}.A .ab .abe{margin-top:4px;color:var(--theme-text-muted)}.A .abr{display:grid;grid-template-columns:110px 1fr;gap:6px 12px;margin:0}.A .abr dt{color:var(--theme-text-muted)}.A .abr dd{margin:0;color:var(--theme-text)}
.A .ghint{display:flex;gap:18px;margin-top:4px;color:var(--theme-text-muted);font-size:12.5px}
.A .seg{display:flex;gap:3px;margin-top:8px}.A .seg i{flex:1;height:8px;background:var(--theme-border);border-radius:2px}.A .seg i.u{background:var(--theme-primary)}
.A .ab .row{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.A .ab .row.cap{margin-top:5px;font-size:12px;color:var(--theme-text-muted)}
.A .ab.v2{display:flex;justify-content:space-between;align-items:center;gap:14px}.A .ab.v2 .rt{text-align:right}.A .ab.v2 .rt .abe{margin-top:4px}
.A .ab.v3 .mid{justify-content:flex-start;align-items:center;margin-top:8px}.A .ab.v3 .sp2{flex:1}
.A .ab.v4{display:flex;gap:14px;align-items:center}.A .ab.v4 .big{font-size:26px;font-weight:600;color:var(--theme-text);line-height:1;min-width:52px}.A .ab.v4 .big small{font-size:14px;color:var(--theme-text-muted);font-weight:400}.A .ab.v4 .abe{margin-top:3px}
.A .gtag{display:inline-block;font-size:11px;font-weight:700;padding:1px 6px;border:1px solid var(--theme-border-strong);border-radius:4px;color:var(--theme-text-secondary);margin-left:6px}
</style>'''
def tk(u,n=8): return '<span class="tk">'+''.join(f'<i class="{"u" if i<u else ""}"></i>' for i in range(n))+'</span>'
KG=[('Maria Dumitrescu',5,'7 nov',True),('Ioana Marin',2,'21 nov',False,'Și în Uscat Juniori'),('Tudor Enache',8,'31 oct',False),('Sara-Maria Ilie',0,'',False)]
def gtable(kg=None):
  r=''.join(f'<tr{" class=hl2" if sel else ""}><td><label class="ccb"><input type="checkbox"{" checked" if sel else ""}></label></td><td><b>{n}</b></td><td>'+(f'{tk(u)}{8-u} rămase</td><td>{e} 2026' if e else '<span class="hint">Fără abonament</span></td><td>')+'</td></tr>' for n,u,e,sel,*x in (kg or KG))
  return '<table class="gt"><tr><th style="width:40px"></th><th>Nume sportiv</th><th>Abonament</th><th>Expiră</th></tr>'+r+'</table>'
def gpage(target,over='',after=False,kg=None):
  head=('<div class="wh"><div><h1>Primii Pași <span class="gtag">ȘCOALĂ</span><span class="gtag">Listă Standard</span></h1><div class="ghint"><span>Sâmbătă și duminică, 10:00</span><span>Antrenor: Cristi Vlad</span><span>'+('13' if after and not kg else '14')+' sportivi</span></div></div></div>')
  bar=f'<div class="ui-root mvbar"><b>1 selectat</b><span class="hint">Grupa</span>{cbx(target)}{btn("Mută")}{btn("Adaugă și în grupă","ghost")}<span style="flex:1"></span>{btn("Anulează","ghost")}</div>'
  return screen('scoala','<div class="win" style="position:relative;min-height:470px">'+head+(gtable(kg) if kg else gtable(KG[1:]) if after else gtable())+('' if after else bar)+over+'</div>')
def modal(title,body,ok='Mută'):
  return (f'<div class="ui-root ui-modal-layer"><div class="ui-modal ui-modal--md" role="dialog"><div class="ui-modal-h"><h2 class="ui-modal-title">{title}</h2></div><div class="ui-modal-b">{body}</div>'
   f'<div class="ui-modal-f">{btn("Anulează","ghost",False)}{btn(ok,"primary",False)}</div></div></div>')
who='Maria Dumitrescu, din <b>Primii Pași</b>.'
ABA=('<div class="ab"><div class="abt">Abonament Școala de patinaj, 8 ședințe</div><div class="abm">'+tk(5)+'<b>3 ședințe rămase</b></div><div class="abe">Expiră pe 7 noiembrie 2026</div></div>')
ABB=('<div class="ab"><dl class="abr"><dt>Abonament</dt><dd>Școala de patinaj, 8 ședințe</dd><dt>Folosite</dt><dd>5 din 8</dd><dt>Rămase</dt><dd><b>3</b></dd><dt>Expiră</dt><dd>7 noiembrie 2026</dd></dl></div>')

SEG=lambda u,n=8:'<span class="seg">'+''.join(f'<i class="{"u" if i<u else ""}"></i>' for i in range(n))+'</span>'
V1=('<div class="ab v1"><div class="row"><span class="abt">Abonament Școala de patinaj, 8 ședințe</span><span class="abe">Expiră pe 7 nov 2026</span></div>'+SEG(5)+'<div class="row cap"><span>5 folosite</span><span>3 rămase</span></div></div>')
V2=('<div class="ab v2"><div><div class="abt">Abonament Școala de patinaj</div><div class="abe">8 ședințe, expiră pe 7 noiembrie 2026</div></div><div class="rt">'+tk(5)+'<div class="abe">3 din 8 rămase</div></div></div>')
V3=('<div class="ab v3"><div class="row"><span class="abt">Abonament Școala de patinaj, 8 ședințe</span></div><div class="row mid">'+tk(5)+'<span class="abe">3 din 8 rămase</span><span class="sp2"></span><span class="abe">Expiră pe 7 nov 2026</span></div></div>')
V4=('<div class="ab v4"><div class="big">3<small>/8</small></div><div><div class="abt">Abonament Școala de patinaj, 8 ședințe</div><div class="abe">3 ședințe rămase din 8, expiră pe 7 noiembrie 2026</div></div></div>')
cur=V1
M1=modal('Mută în Intermediari Bronze',who+'<div class="ibox"><b>Abonamentul continuă.</b> Ambele grupe folosesc lista de prețuri Standard.</div><div class="ibox">'+cur+'</div>')
M2=modal('Mută în Avansați Gold',who+' Avansați Gold are altă listă de prețuri.<div class="ibox"><b>Abonamentul actual rămâne valabil în Avansați Gold.</b> Următorul se cumpără la prețul Avansați Gold.</div><div class="ibox">'+cur+'</div>')
M3=modal('Mută în Performanță Juniori',who+'<div class="ibox"><b>Grupă de Club, fără abonament.</b> Prezența se socotește pe ședință, după lista de prețuri a grupei.</div><div class="ibox">'+cur+'<div class="abe" style="margin-top:8px">Nu poate fi folosit decât în antrenamentele de la Școala de patinaj.</div></div>')
G1=gpage('Intermediari Bronze',M1); G2=gpage('Avansați Gold',M2); G3=gpage('Performanță Juniori',M3)
G0=gpage('Intermediari Bronze')
M4=modal('Adaugă și în Performanță Juniori',who+'<div class="ibox"><b>Rămâne și în Primii Pași.</b> Va fi în două grupe din sezonul 2026-2027.</div><div class="ibox">'+cur+'<div class="abe" style="margin-top:8px">Se folosește în continuare la Primii Pași. În Club prezența se socotește pe ședință.</div></div>','Adaugă')
G4=gpage('Performanță Juniori',M4)
KG4=[('Maria Dumitrescu',5,'7 nov',False,'Și în Performanță Juniori')]+KG[1:]
T4=gpage('Performanță Juniori',after=True,kg=KG4,over=toast('Maria Dumitrescu este acum și în Performanță Juniori.',True))
T1=gpage('Intermediari Bronze',after=True,over=toast('Maria Dumitrescu este acum în Intermediari Bronze.',True))
# group settings: price list field
def gset(extra=''):
  return ('<div class="win" style="max-width:560px"><div class="wh"><div><h1>Editează grupa</h1></div></div><div class="ui-root" style="padding:14px 18px;display:grid;gap:12px">'
   '<div><div class="lb">Nume</div><input class="ui-input" value="Intermediari Silver" readonly style="width:100%"></div>'
   '<div><div class="lb">Secțiune</div>'+cbx('Școala de patinaj')+'</div>'
   '<div><div class="lb">Listă de prețuri</div>'+cbx('Standard')+'<div class="hint" style="margin-top:4px">Grupele cu aceeași listă împart abonamentul: la mutare, abonamentul continuă. Acum pe Standard: Primii Pași, Intermediari Bronze, Intermediari Silver, Avansați Silver.</div></div>'+extra+'</div></div>')

SBB=('<div class="win" style="max-width:560px"><div class="wh"><div><h1>Editează grupa</h1></div></div><div class="ui-root" style="padding:14px 18px;display:grid;gap:12px">'
   '<div><div class="lb">Listă de prețuri</div>'+cbx('Standard')+'</div>'
   '<div><div class="lb">Abonament comun cu</div>'+cbx('Școala, nivel de bază')+'<div class="hint" style="margin-top:4px">Setare separată de prețuri: grupele din același "abonament comun" își continuă abonamentul, chiar dacă au liste diferite.</div></div></div></div>')
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix+mvc
 +'<div class="A"><h2>Mutare sau adăugare în altă grupă</h2><p class="note">Regula ta: grupele Școlii cu același abonament (Primii Pași, Intermediari Bronze, Intermediari Silver, Avansați Silver) îl continuă; la Avansați Gold alegi la mutare; grupele din afara Școlii nu au abonament de felul ăsta. Componente reale din panou: SearchableSelect, Modal, Toast, butoane. Radio-ul e desenat simplu (componenta Radio se face odată cu fluxul). Date inventate, fără prețuri.</p><p class="note">Un sportiv poate fi în mai multe grupe (decis: fiecare apartenență are dată de început și de sfârșit), mai ales Școală + Club. "Fără grupă" înseamnă zero grupe. O ședință făcută o dată în altă grupă sau la altă oră e o excepție și se notează la Prezență (pasul următor), nu schimbă grupele.</p>'+flow
 +'<div class="qh">Fluxul</div><div class="wcol" style="flex-direction:column">'
 +cap('1. Pagina grupei: bifezi sportivul, alegi grupa; "Mută" (iese din grupa asta) sau "Adaugă și în grupă" (rămâne în ambele). ')+G0
 +cap('2a. Aceeași listă de prețuri (Intermediari Bronze): confirmare scurtă, abonamentul continuă')+G1
 +cap('2b. Avansați Gold: abonamentul actual merge mai departe, următorul e Gold')+G2
 +cap('2c. Grupă de Club (Performanță Juniori): fără abonament, doar informație')+G3
 +cap('3. După mutare: toast-ul din panou, Maria iese din listă')+T1+cap('4. "Adaugă și în grupă" (Performanță Juniori): rămâne în Primii Pași')+G4+cap('5. După adăugare: rămâne în listă')+T4+'</div>'
 +QH(1,'Cum arată abonamentul în fereastră (varianta A, refăcută)')+'<p class="note">Fără text îngroșat pentru ședințele rămase. Toate stau în aceeași casetă din fereastra de mutare.</p><div class="options wcol" style="flex-wrap:wrap">'+O('A','ab-v1','Bară subțire pe toată lățimea; expirarea sus în dreapta; dedesubt "5 folosite" și "3 rămase"','<div class="ui-root" style="width:460px"><div class="ibox">'+V1+'</div></div>','Data și numărul de ședințe se citesc separat, fără să se amestece.')+O('B','ab-v2','Două coloane: stânga numele și expirarea, dreapta căsuțele cu "3 din 8 rămase"','<div class="ui-root" style="width:460px"><div class="ibox">'+V2+'</div></div>','Compact, pe două rânduri.')+O('C','ab-v3','Titlu pe un rând; dedesubt căsuțele, "3 din 8 rămase" și expirarea în dreapta','<div class="ui-root" style="width:460px"><div class="ibox">'+V3+'</div></div>','Ca acum, dar totul pe un singur rând sub titlu.')+O('D','ab-v4','Numărul mare în stânga (3/8), textul în dreapta','<div class="ui-root" style="width:460px"><div class="ibox">'+V4+'</div></div>','Numărul rămas sare în ochi fără bold pe text.')+'</div>'
 +QH(2,'Ce leagă grupele care împart abonamentul')+'<div class="options wcol">'
 +O('A','assoc-list','Lista de prețuri: aceeași listă = același abonament (recomandat)',gset(),'Listele de prețuri sunt deja decise (Standard, Avansați Gold). Nimic nou de setat; o grupă nouă pe Standard împarte automat abonamentul.')
 +O('B','assoc-own','O setare separată, "Abonament comun cu"',SBB,'Mai flexibil (prețuri diferite, abonament comun), dar încă un câmp de ținut la zi.')+'</div>'
 +QH(3,'"Mută acum" la Avansați Gold: ședințele rămase')+'<div class="options wcol">'
 +O('A','left-lost','Se închid, nu se recuperează',TXT('Ca la clauza f din Acord: ședințele nefolosite nu se recuperează. Rămân vizibile în Istoric.'),'Simplu; dacă vrei mutare fără pierdere, alegi "Termină abonamentul actual".')
 +O('B','left-credit','Se scad din prețul abonamentului Gold',TXT('La "Adaugă abonament" apare: "3 ședințe rămase din Standard, scazi valoarea lor din preț". Adminul decide suma.'),'Mai corect pentru părinte, dar mai multă muncă la încasare.')+'</div>'
 +QH(4,'Abonamentul Școlii la mutarea într-o grupă de Club')+'<div class="options wcol">'
 +O('A','club-keep','Rămâne în fișă până expiră (recomandat)',TXT('Dacă sportivul revine la Școală înainte de 7 nov, îl folosește în continuare.'),'')
 +O('B','club-close','Se închide la mutare',TXT('Ședințele rămase apar în Istoric ca nefolosite.'),'')+'</div>'
 +'<p class="note" style="margin-top:24px">Notat din ecranul anterior: Anulează în toast (A), taburi Școala / Club (A), meniul devine "Club și școală". Rămas:</p>'
 +QH(5,'Programul grupei')+'<div class="options wcol">'
 +O('A','q5-cal','Vine din calendarul site-ului, seria Școlii (recomandat)',TXT('Schimbi ora o dată în calendar; se vede pe site, la grupă și la prezență.'),'')
 +O('B','q5-own','Se scrie separat la grupă',TXT('Program introdus pe fiecare grupă.'),'Riscă să nu se potrivească cu site-ul.')+'</div></div>')
open(OUTMV3,'w').write(html)
