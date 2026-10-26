import sys,os
OUTM=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_confirm.py'), HERE+'/throw/m.html']
exec(open(sys.argv[0]).read())
mcss='''<style>.A .warn2{display:flex;align-items:center;gap:10px;padding:10px 18px;background:#fdf3e1;border-bottom:1px solid #f3dcb0;color:#8a4b06;font-weight:600}
.A .bd.wn{background:#fdf3e1;color:#8a4b06;border-color:#f3dcb0}.A .miss{color:#8a4b06;font-size:11.5px;display:block;margin-top:2px}
.A .fchip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border:1px solid var(--ln2);border-radius:4px;font-weight:600;font-size:12px;background:#fff}.A .fchip.on{background:#ecf0f7;border-color:#cfd9ea;color:var(--p)}
.A .rec{display:grid;grid-template-columns:1fr;gap:0}.A .rtabs{display:flex;gap:2px;border-bottom:1px solid var(--ln);padding:0 18px}.A .rtabs span{font-size:12.5px;font-weight:600;color:var(--mu);padding:10px 10px;border-bottom:2px solid transparent;margin-bottom:-1px}.A .rtabs span.on{color:var(--p);border-bottom-color:var(--p)}
.A .rb{padding:16px 18px;display:grid;grid-template-columns:1fr 1fr;gap:14px 24px}.A .rb .full{grid-column:1/-1}
.A .ein2{height:34px;border:1px solid var(--ln2);border-radius:4px;background:#fff;display:flex;align-items:center;padding:0 10px;margin-top:3px}.A .ein2.miss2{border-color:#e7b86a;background:#fffaf0;color:#8a4b06}
.A .cmp{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px}.A .cmp th,.A .cmp td{padding:6px 8px;border-bottom:1px solid var(--ln);text-align:left}.A .cmp th{background:#fafbfd;font-size:10px}.A .cmp .df td{background:#fffaf0}
.A .sw{display:inline-block;width:30px;height:16px;border-radius:8px;background:#c0c0cf;position:relative;vertical-align:middle}.A .sw:after{content:"";position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#fff}.A .sw.on{background:var(--p)}.A .sw.on:after{left:16px}
.A .lvl{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:3px}.A .lvl.s{background:var(--okb);color:var(--ok)}.A .lvl.p{background:#fdf3e1;color:#8a4b06}.A .lvl.v{background:#f0f1f4;color:var(--t2)}</style>'''
# 1 list
rows=[('Maria Dumitrescu','14.03.2014 · 12 ani','Intermediari Bronze','Mihaela Dumitrescu · 0722 111 222','<span class="bd nu">Niciunul</span><small>dorește 8 ședințe</small>','<span class="bd nu">Ascuns</span>',''),
 ('Ana Bălan','05.05.2016 · 10 ani','Primii Pași','Elena Bălan · 0733 222 333','<span class="bd ok">8 ședințe</span><small>5 din 8 · expiră 7 nov</small>','<span class="bd nu">Ascuns</span>',''),
 ('Ioana Marinescu','—','Performanță Juniori','—','<span class="bd nu">Niciunul</span>','<span class="bd ok">Public</span>','data nașterii, persoana de contact, telefon'),
 ('Luca Stoica','—','Performanță Juniori','—','<span class="bd nu">Niciunul</span>','<span class="bd ok">Public</span>','data nașterii, persoana de contact, telefon')]
t=('<table><tr><th>'+cb()+'</th><th>Sportiv</th><th>Grupe 2026-2027</th><th>Contact</th><th>Abonament</th><th>Profil public</th><th></th></tr>'+''.join(
 f'<tr><td>{cb()}</td><td><b>{n}</b><small>{b}</small>{f"<span class=miss>Lipsesc: {ms}</span>" if ms else ""}</td><td>{g}</td><td>{c}</td><td>{ab}</td><td>{pp}</td><td>{"<span class=\'bd wn\'>Date incomplete</span>" if ms else ""}</td></tr>' for n,b,g,c,ab,pp,ms in rows)+'</table>')
winL=('<div class="win"><div class="wh"><div><h1>Sportivi</h1><p>Toți sportivii clubului: Școala de patinaj și grupele clubului. Doar în panou, nu sunt publici.</p></div><span class="sp"></span><span class="btn pr">'+ic('plus')+'Adaugă sportiv</span></div>'
 '<div class="warn2">12 sportivi au date incomplete (din profilurile publice existente).<span style="flex:1"></span><span class="btn sm">Arată-i</span></div>'
 f'<div class="tb"><span class="in srch">{ic("search")}Caută după nume, părinte sau telefon...</span><span class="in">Sezon <b>2026-2027</b>{ic("down")}</span><span class="in">Grupa <b>toate</b>{ic("down")}</span><span class="fchip">Date incomplete <b>12</b></span><span class="fchip">Cu profil public</span><span class="fchip">Fără grupă <b>3</b></span></div>'+t+'</div>')
S_L=screen('scoala',winL).replace('<div class="sub on">Grupe și membri<span class=new>NOU</span></div>','<div class="sub">Grupe și membri<span class=new>NOU</span></div><div class="sub on">Sportivi<span class=new>NOU</span></div>')
# 2 record
RT=['Date','Grupe și abonament','Profil public','Documente','Istoric']
rtabs=lambda on:'<div class="rtabs">'+''.join(f'<span class="{"on" if x==on else ""}">{x}</span>' for x in RT)+'</div>'
f2=lambda l,v,miss=False:f'<div><div class="lb">{l}{" · lipsește" if miss else ""}</div><div class="ein2{" miss2" if miss else ""}">{v}</div></div>'
recD=('<div class="win"><div class="wh"><div><h1>Ioana Marinescu</h1><p>Performanță Juniori · profil public activ</p></div><span class="sp"></span><span class="bd wn">Date incomplete</span></div>'+rtabs('Date')
 +'<div class="rb">'+f2('Nume și prenume','Ioana Marinescu')+f2('Data nașterii','zz.ll.aaaa',True)+f2('Persoana de contact','',True)+f2('Calitate','Părinte')+f2('Telefon','',True)+f2('E-mail (opțional)','')+'<div class="full hint">Obligatorii pentru "complet": nume, data nașterii, persoana de contact, telefon.</div></div><div class="ft"><span class="btn pr">Salvează</span></div></div>')
recG=('<div class="win"><div class="wh"><div><h1>Maria Dumitrescu</h1><p>14.03.2014 · 12 ani</p></div></div>'+rtabs('Grupe și abonament')
 +'<div class="rb"><div><div class="lb">Grupe 2026-2027</div><div class="vl">Intermediari Bronze · Sâ, Du 10:00</div><div style="margin-top:6px"><span class="lnk">'+ic('plus')+'Adaugă în altă grupă</span></div></div>'
 '<div><div class="lb">Membru A.C.S. 2026-2027</div><div class="vl">Da</div></div>'
 '<div class="full"><div class="lb">Abonament</div><div class="vl">Niciunul activ · <span style="color:var(--mu)">dorit la înscriere: Abonament 8 ședințe grup</span></div><div style="margin-top:8px"><span class="btn sm pr">'+ic('plus')+'Adaugă abonament</span></div></div></div></div>')
recP=('<div class="win"><div class="wh"><div><h1>Maria Dumitrescu</h1><p>14.03.2014 · 12 ani</p></div></div>'+rtabs('Profil public')
 +'<div class="rb"><div class="full" style="display:flex;align-items:center;gap:10px"><span class="sw"></span><b>Pagină publică activă</b><span class="hint">Oprită: nimic din acest profil nu apare pe site.</span></div>'
 '<div><div class="lb">Fotografie</div><div class="ein2" style="height:90px;justify-content:center;color:var(--mu)">Adaugă fotografie</div></div><div><div class="lb">Descriere</div><div class="ein2" style="height:90px;align-items:flex-start;padding-top:8px;color:var(--mu)">Text scurt pentru pagina publică</div></div>'
 '<div class="full hint">Aceleași câmpuri ca la profilurile de azi (descriere, poveste, discipline, antrenori, skate-results). Datele de contact și data nașterii nu ajung niciodată aici.</div></div></div>')
# 3 confirm window w/ match levels
cmpT=('<table class="cmp"><tr><th></th><th>În club</th><th>În înscriere</th><th>Actualizează</th></tr>'
 '<tr><td>Nume</td><td>Maria Dumitrescu</td><td>Dumitrescu Maria</td><td></td></tr><tr><td>Data nașterii</td><td>14.03.2014</td><td>14.03.2014</td><td></td></tr>'
 '<tr class="df"><td>Telefon</td><td>0722 111 22</td><td><b>0722 111 222</b></td><td>'+cb(True)+'</td></tr><tr><td>E-mail</td><td>parinte@exemplu.ro</td><td>parinte@exemplu.ro</td><td></td></tr></table>')
modal2=('<div class="cmod"><div class="mh"><b>Confirmă înscrierea 2026-0142</b>'+ic('x')+'</div><div class="mb">'
 '<div class="grp2"><h4>Sportiv</h4><div class="match"><span class="lvl s">Sigur</span> <b>Există deja în club:</b> Maria Dumitrescu, 14.03.2014, Primii Pași în 2025-2026.'
 '<div class="rad"><i class="on"></i><span>Folosește fișa existentă</span></div><div class="rad"><i></i><span>Creează sportiv nou</span></div>'+cmpT+'<div style="margin-top:8px"><span class="lnk">'+ic('search')+'Caută alt sportiv</span></div></div></div>'
 '<div class="grp2"><h4>Școala de patinaj, sezonul 2026-2027</h4><div class="g2">'+sel('Grupa','Intermediari Bronze · Sâ, Du 10:00','Sugestie: sezonul trecut a fost la Începători')+sel('Membru A.C.S. în 2026-2027','Da (din formular)')+'</div>'
 '<div class="lb" style="margin-top:12px">Abonament dorit (din formular)</div><div class="vl">Abonament 8 ședințe grup <span class="hint">· doar intenția părintelui; abonamentul se adaugă când e cumpărat</span></div></div>'
 '</div><div class="ft"><span class="btn">Anulează</span><span class="btn pr">Confirmă înscrierea</span></div></div>')
levels=('<div class="card3" style="max-width:560px"><h3>Cum recunoaștem copilul</h3><table><tr><th>Nivel</th><th>Când</th></tr>'
 '<tr><td><span class="lvl s">Sigur</span></td><td>același nume (fără diacritice, orice ordine) și aceeași dată a nașterii</td></tr>'
 '<tr><td><span class="lvl p">Probabil</span></td><td>aceeași dată a nașterii și același telefon sau e-mail, nume puțin diferit</td></tr>'
 '<tr><td><span class="lvl v">Alt sportiv</span></td><td>același telefon sau e-mail, altă dată a nașterii: frate/soră, fișă nouă legată de același contact</td></tr></table>'
 '<div class="hint" style="margin-top:8px">Nu unim nimic automat; admin alege. Dacă la "Sezonul trecut" a răspuns "Nu a participat" dar găsim o potrivire, apare o atenționare.</div></div>')
# 4 add abonament
abm=('<div class="cmod" style="width:460px"><div class="mh"><b>Adaugă abonament: Maria Dumitrescu</b>'+ic('x')+'</div><div class="mb"><div class="grp2" style="border:0">'
 '<div class="g2">'+sel('Tip','Abonament 8 ședințe grup','Dorit la înscriere')+inp('Preț (din Cursuri / Prețuri)','770 RON · membru')+inp('Achitat la','10.10.2026')+sel('Cum','Numerar')+'</div>'
 '<div class="hint" style="margin-top:10px">Primește 8 căsuțe. Valabil 4 săptămâni de la prima ședință bifată. Se trece în Istoric cine l-a adăugat.</div></div></div><div class="ft"><span class="btn">Anulează</span><span class="btn pr">Adaugă abonament</span></div></div>')
O2=lambda L,ch,t,d:f'<div class="option" data-choice="{ch}" onclick="toggleSelect(this)"><div class="qq2"><p style="font-weight:700;margin:0 0 4px"><span class="letter" style="display:inline-grid">{L}</span> {t}</p><div class="hint">{d}</div></div></div>'
qs2=('<div class="sec">De decis</div><p class="note"><b>1. Cine adaugă abonamentul</b></p><div class="options optq">'
 +O2('A','payments','Doar persoana de la plăți','Când intră banii, din pagina de plăți.')+O2('B','any-admin','Orice admin, cu istoric (recomandat)','Și cine face prezența la patinoar, când părintele plătește pe loc. Persoana de la plăți vede tot în listă.')+'</div>'
 '<p class="note" style="margin-top:14px"><b>2. Ce înseamnă "date complete"</b></p><div class="options optq">'+O2('A','min','Nume, data nașterii, persoana de contact, telefon (recomandat)','E-mailul rămâne opțional.')+O2('B','plus-email','Și e-mailul obligatoriu','Necesar dacă trimitem documente pe e-mail tuturor.')+'</div>'
 '<p class="note" style="margin-top:14px"><b>3. Numele butonului din înscriere</b></p><div class="options optq">'+O2('A','confirma','"Confirmă înscrierea" (recomandat)','Nu se confundă cu "membru A.C.S." (taxa de membru).')+O2('B','adauga','"Confirmă și adaugă în club"','Ca până acum.')+'</div>')
html=(css+ecss+tcss+ccss+mcss+'<div class="A"><h2>Sportivii clubului (privat) și profilul public</h2><p class="note">Fiecare sportiv are o fișă privată și un profil public (oprit implicit). În baza de date sunt două tabele legate, create mereu împreună; în panou arată ca o singură fișă. Date inventate.</p>'
 '<div class="sec">1. Lista de sportivi (Școala de patinaj · Sportivi)</div><p class="note">Toți: Școala, grupele clubului, Performanță. Profilurile publice de azi apar cu "Date incomplete" până le completează cineva.</p>'+S_L
 +'<div class="sec">2. Fișa sportivului, cu taburi</div><div class="row3"><div style="width:560px"><p class="cap2">Date (profil existent, date lipsă)</p>'+recD+'</div><div style="width:560px"><p class="cap2">Grupe și abonament (fără abonament încă)</p>'+recG+'</div><div style="width:560px"><p class="cap2">Profil public</p>'+recP+'</div></div>'
 +'<div class="sec">3. Confirmarea înscrierii: recunoașterea copilului</div><p class="note">Fără taxă și fără preț. Abonamentul din formular apare doar ca intenție.</p><div class="row3"><div>'+modal2+'</div><div>'+levels+'</div></div>'
 +'<div class="sec">4. Adaugă abonament (când e cumpărat)</div><p class="note">Din fișa sportivului sau direct din Prezență, când părintele plătește la patinoar. Prețul vine din panou.</p>'+abm+qs2+'</div>')
open(OUTM,'w').write(html)
