import sys,os
OUTMG=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_move3.py'), HERE+'/throw/mv3.html']
exec(open(sys.argv[0]).read())
mgc='''<style>
.A .card2{background:#fff;border:1px solid var(--theme-border);border-radius:8px;width:620px}
.A .card2 .h{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--theme-border)}.A .card2 .h b{flex:1;font-size:15px}
.A .card2 .b{padding:12px 16px}
.A .kv{display:grid;grid-template-columns:150px 1fr;gap:8px 12px;font-size:13px}.A .kv dt{color:var(--theme-text-muted)}.A .kv dd{margin:0}
.A .att{width:100%;border-collapse:collapse;font-size:13px}.A .att td,.A .att th{padding:9px 16px;border-bottom:1px solid var(--theme-border);text-align:left}.A .att th{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted)}
.A .att .ex td{background:var(--theme-surface-subtle)}.A .att small{display:block;color:var(--theme-text-muted)}
.A .addrow{display:flex;gap:10px;align-items:center;padding:10px 16px}.A .addrow .ui-cbx{flex:1}
.A .hist{font-size:13px}.A .hist div{display:grid;grid-template-columns:150px 1fr 120px;padding:8px 16px;border-bottom:1px solid var(--theme-border)}.A .hist .m{color:var(--theme-text-muted)}
.A .pt{font-weight:700;font-size:15px;margin:24px 0 6px}
</style>'''
def card(title,body,extra=''): return f'<div class="ui-root card2"><div class="h"><b>{title}</b>{extra}</div>{body}</div>'
REC=card('Maria Dumitrescu',('<div class="ui-tabs" style="margin:0;padding:0 8px"><span class="ui-tab">Date</span><span class="ui-tab on">Grupe</span><span class="ui-tab">Prezență</span><span class="ui-tab">Documente</span><span class="ui-tab">Istoric</span></div>'
 '<div class="b"><dl class="kv"><dt>Grupa principală, Școală</dt><dd>Primii Pași</dd><dt>Grupa principală, Club</dt><dd><span class="hint">Niciuna</span></dd><dt>Grupe anterioare</dt><dd>Primii Pași 2025-2026</dd></dl></div>'))
chk=lambda on:f'<input type="checkbox"{" checked" if on else ""} style="accent-color:var(--theme-primary)">'
ATT=card('Prezență: Intermediari Silver, sâmbătă 10 oct, 11:00',
 ('<table class="att"><tr><th>Sportiv</th><th>Prezent</th><th>Abonament</th></tr>'
  +''.join(f'<tr><td>{n}</td><td>{chk(p)}</td><td>{a}</td></tr>' for n,p,a in [('Ana Bălan',True,'4 din 8 folosite'),('Tudor Enache',True,'8 din 8 folosite'),('Ioana Marin',False,'')])
  +'<tr class="ex"><td>Maria Dumitrescu<small>Grupa principală: Primii Pași</small></td><td>'+chk(True)+'</td><td>a doua ședință azi, încă o căsuță (6 din 8)</td></tr></table>'
  '<div class="addrow">'+cbx('Caută orice sportiv din club')+btn('Adaugă la prezență','ghost')+'</div>'))
HIS=card('Maria Dumitrescu: prezență',('<div class="hist">'
 +''.join(f'<div><span>{d}</span><span>{g}</span><span class="m">{t}</span></div>' for d,g,t in [('sâmbătă 10 oct, 10:00','Primii Pași','grupa principală'),('sâmbătă 10 oct, 11:00','Intermediari Silver','altă grupă'),('duminică 4 oct, 10:00','Primii Pași','grupa principală')])+'</div>'))
OPA=card('Maria Dumitrescu: Grupe','<div class="b"><dl class="kv"><dt>Grupa principală, Școală</dt><dd>Primii Pași</dd><dt>Grupa principală, Club</dt><dd>Performanță Juniori</dd></dl><p class="hint" style="margin:10px 0 0">Cel mult una pe secțiune. "Mută" schimbă grupa din aceeași secțiune; în cealaltă secțiune o adaugi separat.</p></div>')
OPB=card('Maria Dumitrescu: Grupe','<div class="b"><dl class="kv"><dt>Grupa principală</dt><dd>Primii Pași</dd></dl><p class="hint" style="margin:10px 0 0">O singură grupă. Antrenamentele de Club apar doar ca prezență, Maria nu e pe lista grupei de Club.</p></div>')
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix+mvc+mgc
 +'<div class="A"><h2>Grupa principală și prezența</h2><p class="note">Cum am înțeles: grupa ține lista sportivilor și prezența. Fiecare sportiv are o grupă principală, pe fișa privată. "Mută" schimbă doar grupa principală. Prezența se notează pe ședință: un sportiv poate veni și la altă oră sau la două grupe în aceeași zi, se adaugă ușor la prezență și rămâne în istoric, fără să-i schimbe grupa. Date inventate.</p>'+flow
 +'<div class="pt">1. Fișa: grupa principală</div>'+REC
 +'<div class="pt">2. Prezența unei ședințe: lista grupei, plus oricine vine în plus</div><p class="note">Sus, sportivii grupei. "Adaugă la prezență" caută în tot clubul. Cine vine din altă grupă apare cu grupa lui principală dedesubt. O a doua ședință în aceeași zi consumă încă o căsuță din abonament (decis).</p>'+ATT
 +'<div class="pt">3. Istoricul de prezență al sportivului</div>'+HIS
 +QH(1,'Câte grupe principale poate avea un sportiv')+'<p class="note">Ai spus că un sportiv poate fi la Școală și la Club în același timp.</p><div class="options wcol">'
 +O('A','main-per-section','Una pe secțiune: una la Școală, una la Club (recomandat)',OPA,'Antrenorul de Club își vede sportivii pe lista grupei. Butonul "Adaugă și în grupă" apare doar când grupa e din cealaltă secțiune.')
 +O('B','main-one','Una singură, în total',OPB,'Cel mai simplu. Tot ce e în afara ei e doar prezență; dispare "Adaugă și în grupă".')+'</div>'
 +'<p class="note" style="margin-top:24px">Notat: varianta A pentru caseta abonamentului. Rămase de pe ecranul anterior:</p>'
 +QH(2,'Ce leagă grupele care împart abonamentul')+'<div class="options wcol">'
 +O('A','assoc-list','Lista de prețuri: aceeași listă = același abonament (recomandat)',gset(),'Nimic nou de setat; o grupă nouă pe Standard împarte automat abonamentul.')
 +O('B','assoc-own','O setare separată, "Abonament comun cu"',SBB,'Mai flexibil, dar încă un câmp de ținut la zi.')+'</div>'
 +QH(3,'"Mută acum" la Avansați Gold: ședințele rămase')+'<div class="options wcol">'
 +O('A','left-lost','Se închid, nu se recuperează',TXT('Ca la clauza f din Acord. Rămân vizibile în Istoric.'),'Dacă vrei mutare fără pierdere, alegi "Termină abonamentul actual".')
 +O('B','left-credit','Se scad din prețul abonamentului Gold',TXT('La "Adaugă abonament": 3 ședințe rămase din Standard, scazi valoarea lor din preț.'),'Mai corect pentru părinte, mai multă muncă la încasare.')+'</div>'
 +QH(4,'Programul grupei')+'<div class="options wcol">'
 +O('A','q5-cal','Vine din calendarul site-ului, seria Școlii (recomandat)',TXT('Schimbi ora o dată în calendar; se vede pe site, la grupă și la prezență.'),'')
 +O('B','q5-own','Se scrie separat la grupă',TXT('Program introdus pe fiecare grupă.'),'Riscă să nu se potrivească cu site-ul.')+'</div></div>')
open(OUTMG,'w').write(html)
