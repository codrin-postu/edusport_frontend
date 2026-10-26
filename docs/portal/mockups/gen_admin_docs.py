import sys,re
S,N=sys.argv[1],sys.argv[2]
code=open(S+'/gen_light.py').read(); code=re.sub(r"\nhtml=\(css.*",'',code,flags=re.S)
ns={'sys':sys}; sys.argv=['x',N]; exec(code,ns); css,ic=ns['css'],ns['ic']
ICON=ns['ICON']; ICON.update({'file':'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>','dl':'<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>','search':'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>','link':'<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>','refresh':'<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>','eye':'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'})
extra='''<style>
.L .cap2{font:800 15px Inter,sans-serif;color:#be3330;margin:30px 0 8px}
.L .sec{font:800 26px "League Spartan",Inter,sans-serif;margin:40px 0 4px;padding-top:14px;border-top:3px solid var(--n)}
.L .desk{width:1060px;max-width:100%;background:#fff;border:1px solid #c9ccd4;box-shadow:0 10px 30px rgba(14,26,60,.10)}
.L .dbar{background:var(--n);height:52px;display:flex;align-items:center;gap:24px;padding:0 20px;color:var(--c)}
.L .dbar .logo{font-size:18px}.L .dbar span.nv{font-weight:700;font-size:13px;color:#b9bfd0}.L .dbar span.on{color:var(--c);box-shadow:inset 0 -3px 0 var(--c);padding:16px 0}
.L .dbody{padding:20px 24px 24px}
.L .tl{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.L .tl .sp{flex:1}
.L .pg{font:800 26px "League Spartan",Inter,sans-serif}
.L .b1{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;background:#000;color:var(--c);font-weight:600;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;border:1.5px solid var(--n)}
.L .b2{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px;border:1.5px solid var(--n);font-weight:600;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;background:#fff}
.L .b1 .i,.L .b2 .i{width:16px;height:16px}
.L .flt{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 10px}
.L .fs{height:40px;border:1.5px solid var(--n);display:flex;align-items:center;gap:8px;padding:0 10px;min-width:150px;justify-content:space-between;font-size:13px}
.L .fs .i{width:16px;height:16px}.L .fs.srch{min-width:260px;justify-content:flex-start;color:var(--mu)}
.L table.t{width:100%;border-collapse:collapse;font-size:13px}
.L table.t th{text-align:left;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);padding:9px 8px;border-bottom:1.5px solid var(--n)}
.L table.t td{padding:11px 8px;border-bottom:1px solid var(--ln);vertical-align:middle}
.L table.t td .sub{display:block;color:var(--mu);font-size:12px}
.L .bx{width:18px;height:18px;border:1.5px solid var(--n);display:inline-grid;place-items:center;background:#fff}.L .bx.on{background:var(--n)}.L .bx.on .i{stroke:var(--c);width:13px;height:13px}
.L .st2{font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:2px 6px;white-space:nowrap}
.L .st2.nou{background:#d3dbef}.L .st2.con{background:#ece8e0}.L .st2.ok{background:#e3f1e8;color:#2f7a4a}.L .st2.memb{background:#ead9e1;color:#6e4256}
.L .icb{display:inline-flex;align-items:center;gap:4px;font-weight:700;font-size:12px;text-decoration:underline}
.L .icb .i{width:14px;height:14px}
.L .bulk{display:flex;align-items:center;gap:10px;background:#0e1a3c;color:var(--c);padding:10px 14px;margin-bottom:10px;font-weight:700;font-size:13px}
.L .bulk .b2{background:transparent;color:var(--c);border-color:var(--c);height:34px}
.L .split{display:grid;grid-template-columns:1fr 360px;gap:20px}
.L .pan{border-left:1px solid var(--ln);padding-left:20px}
.L .kv{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--ln);font-size:13px}.L .kv b{font-weight:700;text-align:right}
.L .docbox{border:1px solid var(--ln);padding:12px;margin-top:12px;display:flex;gap:12px;align-items:flex-start}
.L .docbox .i.big{width:34px;height:34px;stroke:var(--r);stroke-width:1.6}
.L .fn{font-weight:700;font-size:13px;word-break:break-all}
.L .acts{display:flex;gap:12px;margin-top:8px;flex-wrap:wrap}
.L .pdf{width:430px;background:#fff;border:1px solid #c9ccd4;box-shadow:0 10px 30px rgba(14,26,60,.12);padding:34px 36px;font-size:12px;line-height:1.55}
.L .pdf .ph1{text-align:center;font:800 16px "League Spartan",Inter,sans-serif;letter-spacing:.02em}
.L .pdf .ph2{text-align:center;font-size:11px;color:var(--mu);margin-bottom:16px}
.L .pdf .ln2{display:flex;gap:6px;margin:5px 0}.L .pdf .ln2 span{white-space:nowrap}.L .pdf .ln2 b{flex:1;border-bottom:1px solid #999;font-weight:700;padding-left:4px}
.L .pdf .sg{display:flex;justify-content:space-between;margin-top:26px}.L .pdf .sg div{width:44%;border-top:1px solid #999;padding-top:4px;font-size:10px;color:var(--mu);text-align:center}
.L .mk{background:#fff4d6;padding:0 3px}
.L .sheet{width:1060px;max-width:100%;border:1px solid #c9ccd4;background:#fff;font:12px Arial,sans-serif}
.L .sheet table{border-collapse:collapse;width:100%}.L .sheet td,.L .sheet th{border:1px solid #e1e3e8;padding:5px 7px}.L .sheet th{background:#f3f4f6;font-weight:600;color:#555}
.L .sheet a{color:#1a5fd0;text-decoration:underline}
.L .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--ln);border-bottom:1px solid var(--ln);margin:14px 0}
.L .kpi{padding:12px 14px;border-right:1px solid var(--ln)}.L .kpi:last-child{border-right:0}
.L .kpi small{display:block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}
.L .kpi b{font:800 28px "League Spartan",Inter,sans-serif}
.L .bar{height:8px;background:#ece8e0;position:relative}.L .bar i{position:absolute;inset:0 auto 0 0;background:var(--n)}
.L .sel2{height:34px;border:1.5px solid var(--n);display:inline-flex;align-items:center;justify-content:space-between;gap:8px;padding:0 8px;min-width:170px;background:#fff;font-size:13px}.L .sel2 .i{width:16px;height:16px}
.L .ckin td.c{text-align:center}
.L .xtra{font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#6e4256;background:#ead9e1;padding:1px 5px;margin-left:4px}
.L .q{border:1px solid var(--ln);padding:12px 14px;margin-top:10px;max-width:1060px}
.L .q b{display:block;margin-bottom:2px}
.L .flow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0 4px}
.L .flow span.s{border:1.5px solid var(--n);padding:6px 10px;font-weight:700;font-size:12.5px;background:#fff}
.L .flow span.a{color:var(--r);font-weight:800}
</style>'''
ck=lambda on:f'<span class="bx{" on" if on else ""}">{ic("check") if on else ""}</span>'
def desk(on,body):
  nav=''.join(f'<span class="nv{" on" if k==on else ""}">{k}</span>' for k in ['Înscrieri','Documente','Membri','Școala de patinaj','Prezență'])
  return f'<div class="desk"><div class="dbar"><span class="logo">EDUSPORT</span>{nav}</div><div class="dbody">{body}</div></div>'
fname='Maria_Dumitrescu_Cerere-adeziune_2026-2027.pdf'
# 0 flow strip
flow=('<div class="flow"><span class="s">Formular pe site</span><span class="a">&rarr;</span><span class="s">Înscriere în CMS</span><span class="a">&rarr;</span><span class="s">Rând în Google Sheet</span><span class="a">&rarr;</span><span class="s">Dacă vrea să fie membru: PDF generat</span><span class="a">&rarr;</span><span class="s">Link în CMS + în Sheet</span><span class="a">&rarr;</span><span class="s">Admin: Confirmat &rarr; Membru</span><span class="a">&rarr;</span><span class="s">Grupă la Școală</span><span class="a">&rarr;</span><span class="s">Prezență</span></div>')
# 1 Înscrieri list + detail
rows=[('Maria Dumitrescu','14.03.2014','Mihaela Dumitrescu','nou','Nou',True),('Andrei Popescu','02.09.2016','Ioana Popescu','con','Contactat',True),('Sara Ilie','21.06.2015','Dan Ilie','ok','Confirmat',False)]
t1='<table class="t"><tr><th>Copil</th><th>Părinte</th><th>Stare</th><th>Vrea să fie membru</th><th>Document</th></tr>'+''.join(
 f'<tr style="{"background:#f7f8fb" if i==0 else ""}"><td><b>{n}</b><span class="sub">{d}</span></td><td>{p}</td><td><span class="st2 {k}">{st}</span></td><td>{"Da" if m else "Nu"}</td><td>{f"<span class=icb>{ic(chr(102)+chr(105)+chr(108)+chr(101))}PDF</span>" if m else "<span class=sub>-</span>"}</td></tr>' for i,(n,d,p,k,st,m) in enumerate(rows))+'</table>'
pan=('<div class="pan"><div class="pg" style="font-size:20px">Maria Dumitrescu</div><div class="sub" style="color:var(--mu)">trimis 3 oct 2026, 14:22 · sezon 2026-2027</div>'
 +''.join(f'<div class="kv"><span>{a}</span><b>{b}</b></div>' for a,b in [('Data nașterii','14.03.2014'),('Părinte','Mihaela Dumitrescu'),('Telefon','07xx xxx xxx'),('Email','parinte@exemplu.ro'),('Nivel','Începători'),('Membru A.C.S. EduSport','Da')])
 +f'<div class="docbox">{ic("file","i big")}<div><div class="sub" style="font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)">Cerere de adeziune</div><div class="fn">{fname}</div><div class="acts"><span class="icb">{ic("eye")}Vezi</span><span class="icb">{ic("dl")}Descarcă</span><span class="icb">{ic("refresh")}Regenerează</span></div></div></div>'
 +f'<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap"><span class="b2">Contactat</span><span class="b1">Confirmă și adaugă în club</span></div></div>')
D1=desk('Înscrieri','<div class="tl"><span class="pg">Înscrieri</span><span class="sp"></span><span class="b2">Export CSV</span><span class="b2">Google Sheet</span></div>'
 +f'<div class="flt"><span class="fs srch">{ic("search")}Caută după nume, părinte, telefon</span><span class="fs">Sezon 2026-2027{ic("down")}</span><span class="fs">Toate stările{ic("down")}</span></div>'
 +'<div class="split"><div>'+t1+'</div>'+pan+'</div>')
# 2 PDF mock
pdf=('<div class="pdf"><div class="ph1">A.C.S. EDUSPORT</div><div class="ph2">CERERE DE ADEZIUNE · sezonul <span class="mk">2026-2027</span></div>'
 '<p>Subsemnatul(a) <b class="mk">Mihaela Dumitrescu</b>, în calitate de părinte / reprezentant legal al minorului:</p>'
 +''.join(f'<div class="ln2"><span>{a}</span><b class="mk">{b}</b></div>' for a,b in [('Nume și prenume copil:','Maria Dumitrescu'),('Data nașterii:','14.03.2014'),('Telefon părinte:','07xx xxx xxx'),('Email:','parinte@exemplu.ro'),('Nivel declarat:','Începători')])
 +'<p style="margin-top:12px">solicit înscrierea acestuia ca membru al Asociației Clubul Sportiv EduSport și declar că am luat la cunoștință statutul și regulamentul clubului. <span style="color:#be3330">[Text final: de la club]</span></p>'
 '<div class="ln2"><span>Data:</span><b class="mk">03.10.2026</b></div>'
 '<div class="sg"><div>Semnătura părintelui</div><div>Aprobat, conducerea clubului</div></div></div>')
pdfnote='<div style="max-width:560px;font-size:13px;color:var(--t2)"><p><b style="color:var(--n)">Machetă provizorie.</b> Câmpurile evidențiate se completează automat din formular. Textul legal, antetul și câmpurile lipsă (CNP, adresă etc.) vin de la club; dacă trebuie, le adăugăm ca întrebări noi în formular (le are deja editorul de formulare din CMS).</p><p>Fișierul se generează automat când cineva bifează "membru", se poate <b>regenera</b> după o corectură, și nu e public: se deschide doar din CMS, după login.</p></div>'
# 3 Sheet
sheet=('<div class="sheet"><table><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr><tr><th>1</th><th>Trimis</th><th>Copil</th><th>Părinte</th><th>Membru</th><th>Stare</th><th>Document</th></tr>'
 '<tr><th>2</th><td>03.10.2026 14:22</td><td>Maria Dumitrescu</td><td>Mihaela Dumitrescu</td><td>Da</td><td>Nou</td><td><a>Deschide documentul</a></td></tr>'
 '<tr><th>3</th><td>02.10.2026 09:10</td><td>Andrei Popescu</td><td>Ioana Popescu</td><td>Da</td><td>Contactat</td><td><a>Deschide documentul</a></td></tr>'
 '<tr><th>4</th><td>01.10.2026 18:40</td><td>Sara Ilie</td><td>Dan Ilie</td><td>Nu</td><td>Confirmat</td><td></td></tr></table></div>'
 '<p class="note" style="margin-top:8px">Coloana nouă "Document" e adăugată de sincronizarea existentă (CMS &rarr; Sheet). Linkul duce la documentul din CMS: cine nu e logat în panou trebuie să se logheze, deci fișa unui minor nu e niciodată publică.</p>')
# 4 Documente page
docs=[('Maria_Dumitrescu_Cerere-adeziune_2026-2027','Maria Dumitrescu','Cerere de adeziune','2026-2027','3 oct 2026',True),('Andrei_Popescu_Cerere-adeziune_2026-2027','Andrei Popescu','Cerere de adeziune','2026-2027','2 oct 2026',True),('Luca_Stoica_Cerere-adeziune_2026-2027','Luca Stoica','Cerere de adeziune','2026-2027','28 sep 2026',False),('Ana_Balan_Cerere-adeziune_2025-2026','Ana Bălan','Cerere de adeziune','2025-2026','12 sep 2025',False)]
t4='<table class="t"><tr><th style="width:30px">'+ck(False)+'</th><th>Fișier</th><th>Sportiv</th><th>Document</th><th>Sezon</th><th>Creat ↓</th><th></th></tr>'+''.join(
 f'<tr><td>{ck(sel)}</td><td><span class="icb" style="text-decoration:none">{ic("file")}<span class="fn" style="font-size:12.5px">{f}.pdf</span></span></td><td>{n}</td><td>{d}</td><td>{s}</td><td>{c}</td><td><span class="icb">{ic("dl")}Descarcă</span></td></tr>' for f,n,d,s,c,sel in docs)+'</table>'
D4=desk('Documente','<div class="tl"><span class="pg">Documente</span><span class="sp"></span></div>'
 +f'<div class="flt"><span class="fs srch">{ic("search")}Caută după nume sau fișier</span><span class="fs">Sezon: toate{ic("down")}</span><span class="fs">Tip: toate{ic("down")}</span><span class="fs">Sortare: cele mai noi{ic("down")}</span></div>'
 +f'<div class="bulk">2 selectate<span style="flex:1"></span><span class="b2">{ic("dl")}Descarcă (ZIP)</span><span class="b2">Deselectează</span></div>'+t4
 +'<p class="note" style="margin-top:10px">Nume: Nume_Prenume_Document_Sezon.pdf (fără diacritice, ca să meargă în orice program). "Descarcă tot sezonul" = un ZIP cu toate documentele filtrate.</p>')
# 5 Confirm -> member
conv=('<div style="display:flex;gap:20px;flex-wrap:wrap">'
 '<div class="desk" style="width:460px"><div class="dbody"><div class="pg" style="font-size:20px">Adaugă în club</div><p class="note">Date preluate din înscriere. Le poți corecta.</p>'
 +''.join(f'<div class="kv"><span>{a}</span><b>{b}</b></div>' for a,b in [('Sportiv','Maria Dumitrescu'),('Data nașterii','14.03.2014'),('Acces părinte','parinte@exemplu.ro'),('Membru A.C.S. (cotizație)','Da · sezon 2026-2027')])
 +f'<div class="lbl" style="margin-top:14px">Grupa la Școala de patinaj</div><div class="sel" style="margin-top:4px">Primii Pași · Sâ, Du 10:00{ic("down")}</div><span class="lnk">+ încă o grupă</span>'
 +'<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px"><span class="b2">Anulează</span><span class="b1">Adaugă în club</span></div></div></div>'
 '<div style="max-width:520px;font-size:13px;color:var(--t2)"><p>După "Adaugă în club": înscrierea devine <span class="st2 ok">Confirmat</span>, se creează <b>membrul de club</b> (lista privată Sportivi), părintele primește invitația în portal, copilul apare în grupa aleasă la antrenor și la prezență.</p><p>Înscrierile fără "membru" pot fi adăugate la fel (ex. doar cursant la Școală); documentul de adeziune se generează doar pentru cei care vor să fie membri.</p></div></div>')
# 6 Școala overview
grp=[('Primii Pași','Sâ, Du 10:00','Cristi Vlad',14,16),('Intermediari Bronze','Sâ, Du 10:00','Andrei Popa',11,16),('Intermediari Silver','Sâ, Du 11:00','Bianca Ene',11,16),('Avansați Silver','Sâ, Du 11:00','Andrei Popa',9,14),('Avansați Gold','Sâ, Du 12:00','Bianca Ene, Cristi Vlad',8,12),('Adulți','Du 12:00','Cristi Vlad',6,12)]
t6='<table class="t"><tr><th>Grupă</th><th>Program</th><th>Antrenori</th><th>Copii</th><th style="width:160px">Ocupare</th><th>Membri club</th><th></th></tr>'+''.join(
 f'<tr><td><b>{g}</b></td><td>{p}</td><td>{a}</td><td><b>{c}</b> / {mx}</td><td><div class="bar"><i style="width:{int(c/mx*100)}%"></i></div></td><td>{max(c-3,0)}</td><td><span class="icb">Vezi</span></td></tr>' for g,p,a,c,mx in grp)+'</table>'
D6=desk('Școala de patinaj','<div class="tl"><span class="pg">Școala de patinaj</span><span class="sp"></span><span class="fs">Sezon 2026-2027'+ic('down')+'</span><span class="b1">+ Grupă</span></div>'
 +'<div class="kpis"><div class="kpi"><small>Copii la Școală</small><b>59</b></div><div class="kpi"><small>Membri A.C.S.</small><b>41</b></div><div class="kpi"><small>Grupe</small><b>6</b></div><div class="kpi"><small>Fără grupă</small><b style="color:#be3330">3</b></div></div>'+t6
 +'<p class="note" style="margin-top:10px">"Fără grupă" = confirmați, dar încă nealocați. Click pe ei pentru a-i pune într-o grupă.</p>')
# 7 Check-in admin with multiple hours
kids=[('Ana Bălan','Primii Pași',(1,0,0),'5/8'),('Luca Stoica','Primii Pași',(1,1,0),'7/8'),('Radu Vasile','Intermediari Silver',(0,1,0),'3/8'),('Irina Nistor','Intermediari Silver',(0,1,1),'6/8'),('Mara Toma','Avansați Gold',(0,0,1),'2/8')]
t7='<table class="t ckin"><tr><th>Sportiv</th><th>Grupa lui</th><th style="text-align:center">10:00</th><th style="text-align:center">11:00</th><th style="text-align:center">12:00</th><th>Abonament</th></tr>'+''.join(
 f'<tr><td><b>{n}</b></td><td>{g}</td>'+''.join(f'<td class="c">{ck(v)}</td>' for v in h)+f'<td>{a}{"<span class=xtra>+1 oră</span>" if sum(h)>1 else ""}</td></tr>' for n,g,h,a in kids)+'</table>'
D7=desk('Prezență','<div class="tl"><span class="pg">Prezență · Școala de patinaj</span><span class="sp"></span><span class="fs">'+ic('cal')+'Sâmbătă 10 oct 2026'+ic('down')+'</span></div>'
 +f'<div class="flt"><span class="fs srch">{ic("search")}Caută sportiv</span><span class="fs">Toate grupele{ic("down")}</span><span class="fs">Doar cu abonament{ic("down")}</span></div>'+t7
 +'<p class="note" style="margin-top:10px">O coloană pe oră. Bifa de bază e la ora grupei lui; adminul poate bifa și altă oră (ex. Luca a stat și la 11:00). Fiecare bifă e o ședință separată.</p>'
 +'<div style="display:flex;justify-content:flex-end;gap:12px;align-items:center;margin-top:8px"><b style="font:800 20px League Spartan,Inter">7 bife</b><span class="b1">Salvează</span></div>')
qs=('<div class="q"><b>1. A doua oră consumă o căsuță din abonament?</b>Ex. Luca la 10:00 și 11:00 în aceeași zi: 2 căsuțe, 1 căsuță, sau se plătește separat?</div>'
 '<div class="q"><b>2. Ce document(e) generăm?</b>Doar "Cerere de adeziune" pentru membri, sau și altele (fișa de înscriere la prima ședință, acord foto)? Ne trimiteți modelul real sau textul?</div>'
 '<div class="q"><b>3. "Per școală"</b>: există mai multe școli (locații / patinoare) sau o singură Școală de patinaj cu mai multe grupe?</div>'
 '<div class="q"><b>4. Semnătura</b>: documentul se tipărește și se semnează pe hârtie, sau vreți semnare online mai târziu?</div>')
html=(css+extra+'<div class="L"><h2>CMS admin: înscriere &rarr; document &rarr; membru &rarr; grupă &rarr; prezență</h2>'
 '<p class="note">Formularul de pe site trimite deja datele în CMS, iar CMS-ul le copiază singur în Google Sheet (fără Apps Script). Pașii noi se adaugă peste ce există. Design alb, același sistem. Numele și datele sunt inventate.</p>'+flow
 +'<div class="sec">1. Înscrieri</div><p class="note">Lista existentă, plus coloanele "Vrea să fie membru" și "Document". În panou: documentul cu Vezi / Descarcă / Regenerează și butonul nou "Confirmă și adaugă în club".</p>'+D1
 +'<div class="sec">2. Documentul generat (PDF)</div><div class="row">'+pdf+pdfnote+'</div>'
 +'<div class="sec">3. În Google Sheet</div>'+sheet
 +'<div class="sec">4. Pagina Documente</div>'+D4
 +'<div class="sec">5. Confirmare &rarr; membru de club</div>'+conv
 +'<div class="sec">6. Școala de patinaj: grupe și totaluri</div>'+D6
 +'<div class="sec">7. Prezență de la admin (și la mai multe ore)</div>'+D7
 +'<div class="sec">De lămurit</div>'+qs+'</div>')
open(N+'/admin-docs-v1.html','w').write(html)
