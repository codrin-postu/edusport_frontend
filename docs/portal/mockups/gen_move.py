import sys,os
OUTMV=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
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
.A .gtag{display:inline-block;font-size:11px;font-weight:700;padding:1px 6px;border:1px solid var(--theme-border-strong);border-radius:4px;color:var(--theme-text-secondary);margin-left:6px}
</style>'''
def tk(u,n=8): return '<span class="tk">'+''.join(f'<i class="{"u" if i<u else ""}"></i>' for i in range(n))+'</span>'
KG=[('Maria Dumitrescu',5,'7 nov',True),('Ioana Marin',2,'21 nov',False),('Tudor Enache',8,'31 oct',False),('Sara-Maria Ilie',0,'',False)]
def gtable(kg=None):
  r=''.join(f'<tr{" class=hl2" if sel else ""}><td><label class="ccb"><input type="checkbox"{" checked" if sel else ""}></label></td><td><b>{n}</b></td><td>'+(f'{tk(u)}{8-u} rămase</td><td>{e} 2026' if e else '<span class="hint">Fără abonament</span></td><td>')+'</td></tr>' for n,u,e,sel in (kg or KG))
  return '<table class="gt"><tr><th style="width:40px"></th><th>Nume sportiv</th><th>Abonament</th><th>Expiră</th></tr>'+r+'</table>'
def gpage(target,over='',after=False):
  head=('<div class="wh"><div><h1>Primii Pași <span class="gtag">ȘCOALĂ</span><span class="gtag">Listă Standard</span></h1><div class="ghint"><span>Sâmbătă și duminică, 10:00</span><span>Antrenor: Cristi Vlad</span><span>'+('13' if after else '14')+' sportivi</span></div></div></div>')
  bar=f'<div class="ui-root mvbar"><b>1 selectat</b><span class="hint">Mută în</span>{cbx(target)}{btn("Mută")}{btn("Anulează","ghost")}</div>'
  return screen('scoala','<div class="win" style="position:relative;min-height:470px">'+head+(gtable(KG[1:]) if after else gtable())+('' if after else bar)+over+'</div>')
def modal(title,body,ok='Mută'):
  return (f'<div class="ui-root ui-modal-layer"><div class="ui-modal ui-modal--md" role="dialog"><div class="ui-modal-h"><h2 class="ui-modal-title">{title}</h2></div><div class="ui-modal-b">{body}</div>'
   f'<div class="ui-modal-f">{btn("Anulează","ghost",False)}{btn(ok,"primary",False)}</div></div></div>')
who='Maria Dumitrescu, din <b>Primii Pași</b>.'
ABA=('<div class="ab"><div class="abt">Abonament Școala de patinaj, 8 ședințe</div><div class="abm">'+tk(5)+'<b>3 ședințe rămase</b></div><div class="abe">Expiră pe 7 noiembrie 2026</div></div>')
ABB=('<div class="ab"><dl class="abr"><dt>Abonament</dt><dd>Școala de patinaj, 8 ședințe</dd><dt>Folosite</dt><dd>5 din 8</dd><dt>Rămase</dt><dd><b>3</b></dd><dt>Expiră</dt><dd>7 noiembrie 2026</dd></dl></div>')
cur=ABA
M1=modal('Mută în Intermediari Bronze',who+'<div class="ibox"><b>Abonamentul continuă.</b> Ambele grupe folosesc lista de prețuri Standard.</div><div class="ibox">'+cur+'</div>')
M2=modal('Mută în Avansați Gold',who+' Avansați Gold are alt abonament (lista Avansați Gold).<div class="ibox">'+cur+'</div>'
 '<div style="margin-top:12px;font-weight:700;color:var(--theme-text)">Ce faci cu abonamentul actual?</div>'
 '<label class="rad on"><input type="radio" checked><span><b>Termină abonamentul actual</b>Folosește cele 3 ședințe rămase în Avansați Gold, până la 7 nov. După, se adaugă abonamentul Avansați Gold.</span></label>'
 '<label class="rad"><input type="radio"><span><b>Mută acum, cu abonament Avansați Gold</b>Abonamentul actual se închide azi; cele 3 ședințe rămase apar în Istoric. Adaugi acum abonamentul Avansați Gold.</span></label>')
M3=modal('Mută în Performanță Juniori',who+'<div class="ibox"><b>Grupă de Club, fără abonament.</b> Prezența se socotește pe ședință, după lista de prețuri a grupei.</div><div class="ibox">'+cur+'<div class="abe" style="margin-top:8px">Rămâne în fișă până expiră. Nu se folosește în Club.</div></div>')
G1=gpage('Intermediari Bronze',M1); G2=gpage('Avansați Gold',M2); G3=gpage('Performanță Juniori',M3)
G0=gpage('Intermediari Bronze')
T1=gpage('Intermediari Bronze',after=True,over=toast('Maria Dumitrescu este acum în Intermediari Bronze. Abonamentul continuă.'))
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
 +'<div class="A"><h2>Mutarea în altă grupă în timpul sezonului</h2><p class="note">Regula ta: grupele Școlii cu același abonament (Primii Pași, Intermediari Bronze, Intermediari Silver, Avansați Silver) îl continuă; la Avansați Gold alegi la mutare; grupele din afara Școlii nu au abonament de felul ăsta. Componente reale din panou: SearchableSelect, Modal, Toast, butoane. Radio-ul e desenat simplu (componenta Radio se face odată cu fluxul). Date inventate, fără prețuri.</p>'+flow
 +'<div class="qh">Fluxul</div><div class="wcol" style="flex-direction:column">'
 +cap('1. Pagina grupei: bifezi sportivul, bara de jos: "Mută în" + grupa (SearchableSelect) + "Mută"')+G0
 +cap('2a. Aceeași listă de prețuri (Intermediari Bronze): confirmare scurtă, abonamentul continuă')+G1
 +cap('2b. Avansați Gold: alegi ce se întâmplă cu abonamentul actual')+G2
 +cap('2c. Grupă de Club (Performanță Juniori): fără abonament, doar informație')+G3
 +cap('3. După mutare: toast-ul din panou')+T1+'</div>'
 +QH(1,'Cum arată abonamentul în fereastră')+'<div class="options wcol">'+O('A','ab-card','Titlu, căsuțe cu "3 ședințe rămase", data de expirare dedesubt (folosit mai sus)','<div class="ui-root" style="width:420px"><div class="ibox">'+ABA+'</div></div>','Se vede din prima cât a rămas.')+O('B','ab-rows','Rânduri etichetă / valoare','<div class="ui-root" style="width:420px"><div class="ibox">'+ABB+'</div></div>','Totul aliniat, ca în fișă.')+'</div>'
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
open(OUTMV,'w').write(html)
