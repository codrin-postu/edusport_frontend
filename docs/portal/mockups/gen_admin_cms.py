import sys
N=sys.argv[1]
I={'home':'<path d="M3 11l9-7 9 7v9H3z"/>','bell':'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>','gear':'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
 'grid':'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>','form':'<path d="M4 20h16"/><path d="M14 4l6 6-9 9H5v-6z"/>','cal':'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>','user':'<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/>','book':'<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/>','file':'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>','skate':'<path d="M4 17h14l2-3"/><path d="M6 17V7h6l2 6"/><path d="M5 21h1M10 21h1M15 21h1"/>','check':'<path d="M5 12l5 5L20 7"/>','down':'<path d="M6 9l6 6 6-6"/>','dl':'<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>','eye':'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>','refresh':'<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>','x':'<path d="M6 6l12 12M18 6L6 18"/>','search':'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>','link':'<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>','plus':'<path d="M12 5v14M5 12h14"/>','chev':'<path d="M9 6l6 6-6 6"/>','users':'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9"/>'}
ic=lambda k,c='ic':f'<svg class="{c}" viewBox="0 0 24 24">{I[k]}</svg>'
css='''<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.A{--p:#3d5a8f;--ph:#324b78;--pg:#eef0f4;--w:#fff;--ln:#e0e2e8;--ln2:#c0c0cf;--tx:#1b1d22;--t2:#3a3f4a;--mu:#666c7c;--nav:#131c3d;--ok:#1f7a4d;--okb:#e7f3ec;--inf:#1d5f8f;--infb:#e9f2f9;--dg:#c0392b;--dgb:#fdecea;font:13px/1.45 Inter,system-ui,sans-serif;color:var(--tx)}
.A *{box-sizing:border-box}
.A .ic{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.A .scr{display:flex;width:1180px;max-width:100%;height:auto;min-height:640px;border:1px solid #c9ccd4;box-shadow:0 10px 30px rgba(14,26,60,.12);background:var(--pg);overflow:hidden}
.A .sb{width:210px;flex-shrink:0;background:var(--nav);color:#c9cfe2;padding:14px 0;display:flex;flex-direction:column;gap:2px;font-size:13px}
.A .sb .br{display:flex;align-items:center;gap:10px;padding:0 14px 14px;border-bottom:1px solid #26305a;margin-bottom:8px}
.A .sb .lg{width:32px;height:32px;background:#2138b8;color:#fff;display:grid;place-items:center;font-weight:800;font-size:12px}
.A .sb .br b{color:#fff;font-size:15px;display:block;line-height:1.1}.A .sb .br small{font-size:9px;letter-spacing:.12em;color:#8a93b8}
.A .sb .it{display:flex;align-items:center;gap:10px;padding:8px 14px}
.A .sb .grp{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a93b8;padding:10px 14px 4px;display:flex;align-items:center;gap:10px}
.A .sb .sub{padding:7px 14px 7px 40px}
.A .sb .on{background:#1e2a5c;color:#fff;box-shadow:inset 3px 0 0 #536cb6}
.A .sb .new{margin-left:8px!important;font-size:9px;font-weight:800;background:#536cb6;color:#fff;padding:1px 5px;margin-left:auto}
.A .main{flex:1;padding:16px;min-width:0}
.A .win{background:var(--w);border:1px solid var(--ln);border-radius:4px}
.A .wh{display:flex;align-items:flex-start;gap:12px;padding:16px 18px;border-bottom:1px solid var(--ln)}
.A .wh h1{font-size:19px;font-weight:700;margin:0}.A .wh p{margin:2px 0 0;color:var(--mu)}
.A .wh .sp{flex:1}
.A .tb{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:12px 18px;border-bottom:1px solid var(--ln)}
.A .in{height:36px;border:1px solid var(--ln2);border-radius:4px;display:inline-flex;align-items:center;gap:8px;padding:0 10px;background:#fff;color:var(--mu);min-width:120px;justify-content:space-between}
.A .in.srch{min-width:300px;justify-content:flex-start}
.A .in b{color:var(--tx);font-weight:500}
.A .btn{height:36px;border-radius:4px;display:inline-flex;align-items:center;gap:6px;padding:0 12px;font-weight:600;border:1px solid var(--ln2);background:#fff;color:var(--tx);white-space:nowrap}
.A .btn.pr{background:var(--p);border-color:var(--p);color:#fff}
.A .btn.dg{border-color:#f0b6ae;color:var(--dg)}
.A .btn.sm{height:30px;padding:0 10px;font-size:12px}
.A table{width:100%;border-collapse:collapse}
.A th{text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);padding:10px 12px;border-bottom:1px solid var(--ln);background:#fafbfd}
.A td{padding:11px 12px;border-bottom:1px solid var(--ln);vertical-align:middle}
.A tr.sel td{background:#f3f5fa}
.A td small{display:block;color:var(--mu)}
.A .cb{width:16px;height:16px;border:1.5px solid var(--ln2);border-radius:3px;display:inline-grid;place-items:center;background:#fff}
.A .cb.on{background:var(--p);border-color:var(--p)}.A .cb.on .ic{stroke:#fff;width:12px;height:12px}
.A .bd{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:3px;border:1px solid transparent}
.A .bd.ok{background:var(--okb);color:var(--ok);border-color:#bfe0cc}.A .bd.inf{background:var(--infb);color:var(--inf);border-color:#bfd8ea}.A .bd.nu{background:#f0f1f4;color:var(--t2);border-color:var(--ln)}.A .bd.nw{background:#ecf0f7;color:var(--p);border-color:#cfd9ea}.A .bd.dg{background:var(--dgb);color:var(--dg);border-color:#f3c5bf}
.A .lnk{color:var(--p);font-weight:600;display:inline-flex;align-items:center;gap:4px}
.A .split{display:grid;grid-template-columns:minmax(0,1fr) 320px}.A .split>div:first-child{min-width:0;overflow-x:auto}.A .split td,.A .split th{padding:9px 8px}
.A .pane{border-left:1px solid var(--ln);padding:14px 16px}
.A .pane h2{font-size:15px;margin:0;display:flex;justify-content:space-between;align-items:center}
.A .lb{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);margin-top:12px}
.A .vl{margin-top:2px}
.A .doc{border:1px solid var(--ln);border-left:3px solid var(--p);border-radius:4px;padding:10px 12px;margin-top:14px;background:#fafbfd}
.A .doc .fn{font-weight:600;word-break:break-all;margin:2px 0 6px}
.A .acts{display:flex;gap:14px;flex-wrap:wrap}
.A .ft{display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--ln)}
.A .bulk{display:flex;align-items:center;gap:10px;padding:10px 18px;background:#ecf0f7;border-bottom:1px solid #cfd9ea;font-weight:600;color:var(--p)}
.A .kp{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:14px 18px;border-bottom:1px solid var(--ln)}
.A .kp div{border:1px solid var(--ln);border-left:3px solid var(--p);border-radius:4px;padding:10px 12px}
.A .kp small{display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mu)}
.A .kp b{font-size:24px}
.A .kp .warn{border-left-color:#b45309}.A .kp .warn b{color:#b45309}
.A .bar{height:6px;background:#eef0f4;border-radius:3px;position:relative;width:120px}.A .bar i{position:absolute;inset:0 auto 0 0;background:var(--p);border-radius:3px}
.A .ovl{position:relative}.A .ovl:after{content:"";position:absolute;inset:0;background:rgba(15,21,34,.45)}
.A .modal{position:absolute;z-index:3;left:50%;top:40px;transform:translateX(-50%);width:520px;background:#fff;border-radius:6px;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.A .modal .mh{display:flex;align-items:center;padding:14px 16px;border-bottom:1px solid var(--ln)}.A .modal .mh b{flex:1;font-size:15px}
.A .modal .mb{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.A .fl label{display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);margin-bottom:4px}
.A .fl .in{width:100%;color:var(--tx)}
.A .hint{font-size:12px;color:var(--mu)}
.A .xtra{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#b45309;background:#fdf3e1;border:1px solid #f3dcb0;padding:1px 5px;border-radius:3px;margin-left:6px}
.A .cc{text-align:center}
.A .sec{font:700 20px Inter,sans-serif;margin:40px 0 4px;padding-top:12px;border-top:3px solid #131c3d}
.A .note{color:var(--t2);max-width:1100px;margin:4px 0 12px}
.A .a4{width:560px;background:#fff;border:1px solid #c9ccd4;box-shadow:0 8px 24px rgba(0,0,0,.12);padding:40px 46px;font:9.6px/1.45 Carlito,Calibri,'Segoe UI',Arial,sans-serif;color:#222;text-align:justify}
.A .a4 .a4t{text-align:center;font-size:15px;color:#2b3f6b;margin-bottom:16px}
.A .a4 p{margin:0 0 7px}.A .a4 .pt>span:first-child{display:inline-block;width:46px;padding-left:28px}
.A .pdfw{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}
.A .pdf{width:440px;background:#fff;border:1px solid #c9ccd4;box-shadow:0 8px 24px rgba(0,0,0,.12);padding:34px 36px;font-size:11.5px;line-height:1.55;font-family:Georgia,serif}
.A .pdf .h{text-align:center;font:700 15px Inter,sans-serif}.A .pdf .h2{text-align:center;font:600 11px Inter,sans-serif;color:#666;margin-bottom:14px}
.A .pdf .l{display:flex;gap:6px;margin:4px 0}.A .pdf .l span{white-space:nowrap}.A .pdf .l b{flex:1;border-bottom:1px solid #999;padding-left:4px;font-family:Inter,sans-serif}
.A .mk{background:#fff4c2}
.A .pdf .sg{display:flex;justify-content:space-between;margin-top:24px}.A .pdf .sg div{width:44%;border-top:1px solid #999;padding-top:3px;font-size:10px;color:#666;text-align:center}
.A .sheet{width:1180px;max-width:100%;border:1px solid #c9ccd4;background:#fff;font:12px Arial,sans-serif}
.A .sheet table{border-collapse:collapse}.A .sheet td,.A .sheet th{border:1px solid #e1e3e8;padding:5px 7px;background:#fff;letter-spacing:0;text-transform:none;font-size:12px;color:#222}.A .sheet th{background:#f3f4f6;font-weight:600;color:#555}.A .sheet a{color:#1a5fd0;text-decoration:underline}
.A .flow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0 4px}.A .flow .s{border:1px solid var(--ln2);border-radius:4px;background:#fff;padding:5px 9px;font-weight:600}.A .flow .a{color:var(--p);font-weight:800}
.A .qq{background:#fff;border:1px solid var(--ln);border-left:3px solid var(--p);border-radius:4px;padding:10px 12px;margin-top:8px;max-width:1100px}.A .qq b{display:block}
</style>'''
def side(on):
  def it(k,i,lab,cls=''): return f'<div class="it {cls}{" on" if on==k else ""}">{ic(i)}{lab}</div>'
  def sub(k,lab,new=False): return f'<div class="sub{" on" if on==k else ""}">{lab}{"<span class=new>NOU</span>" if new else ""}</div>'
  return ('<div class="sb"><div class="br"><span class="lg">ES</span><div><b>EduSport</b><small>PANOU</small></div></div>'
   +it('acasa','home','Acasă')+it('anunt','bell','Anunțuri')+it('set','gear','Setări site')
   +'<div class="grp">'+ic('form')+'Formulare</div>'+sub('formulare','Formulare')+sub('inscrieri','Înscrieri')+sub('documente','Documente',True)+sub('vol','Voluntari')
   +'<div class="grp">'+ic('skate')+'Școala de patinaj</div>'+sub('scoala','Grupe și membri',True)+sub('prezenta','Prezență',True)
   +'<div class="grp">'+ic('user')+'Sportivi și echipă</div><div class="grp">'+ic('cal')+'Program și calendar</div><div class="grp">'+ic('grid')+'Pagini site</div></div>')
def screen(on,body,overlay=''):
  return f'<div class="scr">{side(on)}<div class="main{" ovl" if overlay else ""}" style="position:relative">{body}{overlay}</div></div>'
cb=lambda on=False:f'<span class="cb{" on" if on else ""}">{ic("check") if on else ""}</span>'
fname='Maria_Dumitrescu_Acord_2026-2027.pdf'
# 1 Inscrieri
rows=[('3 oct 2026','Maria Dumitrescu','14.03.2014','nw','Nou','Mihaela Dumitrescu','Da','Abonament 8 ședințe','Începători',True),('2 oct 2026','Andrei Popescu','02.09.2016','inf','Contactat','Ioana Popescu','Nu','1 ședință grup','Nu a participat',False),('1 oct 2026','Sara Ilie','21.06.2015','ok','Confirmat','Dan Ilie','Da','Abonament Avansați Gold 8 ședințe','Avansați',False)]
t='<table><tr><th>'+cb()+'</th><th>Trimis la</th><th>Nume copil</th><th>Status</th><th>Completat de</th><th>Membru A.C.S.</th><th>La primul modul</th><th>Sezonul trecut</th><th>Document</th></tr>'+''.join(
 f'<tr class="{"sel" if s else ""}"><td>{cb()}</td><td>{d}</td><td><b>{n}</b><small>{bd}</small></td><td><span class="bd {k}">{st}</span></td><td>{p}<small>Părinte</small></td><td>{m}</td><td>{ab}</td><td>{sz}</td><td><span class="lnk">{ic("file")}PDF</span></td></tr>' for d,n,bd,k,st,p,m,ab,sz,s in rows)+'</table>'
pane=(f'<div class="pane"><h2>Maria Dumitrescu <span class="bd nw">Nou</span></h2>'
 +''.join(f'<div class="lb">{a}</div><div class="vl">{b}</div>' for a,b in [('Trimis la','3 oct 2026, 14:22'),('Adresă de e-mail','parinte@exemplu.ro'),('Numele și prenumele persoanei care completează formularul','Mihaela Dumitrescu'),('Calitatea față de sportiv','Părinte'),('Telefon de contact','07xx xxx xxx'),('Data nașterii copilului','14.03.2014'),('Înălțimea copilului (cm)','142'),('Măsura bluză','S'),('Sezonul trecut a participat la cursurile ACS EduSport?','Începători'),('Nivel de experiență / Elemente cunoscute','Patinaj înainte, frânare'),('Așteptări de la cursurile de patinaj','Să învețe piruete'),('Doriți înscrierea ca membru A.C.S. EduSport?','Da, doresc să devin membru'),('La primul modul doriți să achiziționați','Abonament 8 ședințe'),('De unde ați aflat de cursurile noastre?','Facebook')])
 +f'<div class="doc"><div class="lb" style="margin-top:0">Document · Acord (Formular de înscriere)</div><div class="fn">{fname}</div><div class="acts"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span><span class="lnk">{ic("refresh")}Regenerează</span></div></div>'
 +'</div>')
win1=('<div class="win"><div class="wh"><div><h1>Înscrieri</h1><p>Cererile trimise prin formularul public de înscriere.</p></div><span class="sp"></span><span class="in">Sezon <b>2026-2027 (activ)</b>'+ic('down')+'</span><span class="btn">Export'+ic('down')+'</span></div>'
 f'<div class="tb"><span class="in srch">{ic("search")}Caută după nume, părinte, email sau telefon...</span><span class="btn">Status{ic("down")}</span><span class="btn">Membru{ic("down")}</span><span class="btn">Primul modul{ic("down")}</span><span class="btn">Sezonul trecut{ic("down")}</span></div>'
 '<div class="split"><div>'+t+'</div>'+pane+'</div><div class="ft"><span class="btn">Contactat</span><span class="btn pr">Confirmă și adaugă în club</span></div></div>')
S1=screen('inscrieri',win1)
# 2 PDF viewer modal
pdf=('<div class="a4"><div class="a4t">Formular de înscriere – Școala de Patinaj EduSport</div><p>Subsemnatul/a <span class="mk">Mihaela Dumitrescu</span>, telefon <span class="mk">07xx xxx xxx</span>, e-mail <span class="mk">parinte@exemplu.ro</span>, in calitate de <span class="mk">Părinte</span> al copilului <span class="mk">Maria Dumitrescu</span>, nascut la data de <span class="mk">14.03.2014</span>, doresc ca <span class="mk">Maria Dumitrescu</span> sa particip/e la cursurile organizate de Asociatia Clubul Sportiv EduSport.</p><p>Îmi exprim acordul liber, informat și necondiționat pentru participarea <span class="mk">Maria Dumitrescu</span> la activitățile organizate de Asociația Clubul Sportiv EduSport. <b><i>De asemenea, declar că am acordul expres al celuilalt părinte pentru participarea la cursuri si accept următoarele responsabilități și condiții de participare:</i></b></p><p class="pt"><span>a.</span>Declar pe propria răspundere, în calitate de cursant sau părinte/tutore legal, că participantul la curs este sănătos din punct de vedere medical și apt pentru efort fizic intens. Prin prezenta, exonerez Asociația Clubul Sportiv EduSport, antrenorii, instructorii, angajații, colaboratorii și partenerii patinoarului de orice responsabilitate legată de participarea mea sau a copilului meu la activitățile sportive desfășurate.</p><p class="pt"><span>b.</span>Sunt conștient(ă) că participarea la cursurile și evenimentele de patinaj implică riscuri specifice acestui sport, inclusiv posibilitatea unor accidentări. Deși ACS EduSport și patinoarul partener iau măsuri pentru a asigura un mediu cât mai sigur, nu pot garanta eliminarea completă a pericolelor. Prin urmare, accept că ACS EduSport nu poate fi tras la răspundere pentru eventuale incidente sau răniri apărute în timpul activităților.</p><p class="pt"><span>c.</span>În calitate de cursant, părinte sau tutore legal, înțeleg importanța respectării regulilor de conduită și a indicațiilor oferite de antrenori, atât pentru siguranța proprie, cât și pentru buna desfășurare a activităților. Mă angajez să urmez aceste reguli cu responsabilitate și să mă asigur că fiul/fiica mea cooperează cu personalul clubului, respectă instrucțiunile primite în timpul cursurilor, regulile patinoarului și regulamentul oficial al ACS EduSport, disponibil la <u style="color:#1a5fd0">www.scoaladepatinaj.com/regulament</u> Regulamentele se completează, dupa caz, cu prevederile legale în vigoare.</p><p class="pt"><span>d.</span>Înțeleg că nerespectarea regulilor sau orice comportament din partea cursantului ori a tutorelui care perturbă desfășurarea cursurilor poate conduce la excluderea cursantului din programul de patinaj și la retragerea calității de membru al clubului, fără obligația de a restitui sumele achitate.</p><p class="pt"><span>e.</span>Înțeleg că, în cazul în care cursantul provoacă daune sau deteriorări în incinta patinoarului, responsabilitatea revine exclusiv acestuia. Asociația Clubul Sportiv EduSport nu poate fi considerată răspunzătoare pentru astfel de prejudicii.</p><p class="pt"><span>f.</span><b>Înțeleg că abonamentele sunt valabile timp de 4 săptămâni de la data primei ședințe, iar ședințele achitate care nu sunt efectuate nu pot fi recuperate sau reportate.</b></p><p class="pt"><span>g.</span>Tarifele pot suferi modificări pe durata acordului (<span class="mk">octombrie 2026 – iunie 2027</span>), cu informarea prealabilă a participanților cu minimum 30 de zile înainte.</p><p class="pt"><span>h.</span>Intervalul orar al cursurilor poate suferi modificări în funcție de evenimentele organizate de patinoar sau de alte situații care impun reprogramarea activităților de către organizator.</p><p class="pt"><span>i.</span>Asociația Clubul Sportiv EduSport își rezervă dreptul de a fotografia și înregistra audio-video antrenamentele, cursurile, spectacolele sau orice alt eveniment organizat de ACS EduSport ori de partenerii săi, în care apar cursanți sau sportivi ai clubului. Imaginile și înregistrările pot fi utilizate în scopul promovării activității ACS EduSport.</p><p><span style="background:#ddd">Da □ Nu □</span> Îmi exprim acordul ca datele mele personale și de contact să fie utilizate, timp de 1 an de la completarea prezentei cereri, pentru transmiterea de materiale informative și notificări legate de activitatea Asociației Clubul Sportiv EduSport. Confirm că am citit Politica de Confidențialitate privind prelucrarea datelor cu caracter personal ale persoanelor fizice, disponibilă la <b>scoaladepatinaj.com/protectia-datelor</b>, și îmi exprim consimțământul pentru furnizarea și prelucrarea acestor date conform celor menționate.</p><p style="margin-top:18px"><b><i>Prin prezenta, confirm că am citit și accept conținutul acestui document și îmi asum toate declarațiile incluse.</i></b></p><p>Data <span class="mk">03.10.2026</span><br>Semnatura………………………………….…………….</p></div>')
modal=('<div class="modal" style="width:640px;top:16px"><div class="mh"><b>'+fname+'</b><span class="btn sm">'+ic('dl')+'Descarcă</span><span style="width:8px"></span><span class="btn sm">'+ic('refresh')+'Regenerează</span><span style="width:8px"></span>'+ic('x')+'</div><div class="mb" style="background:#eef0f4;align-items:center;max-height:600px;overflow:auto">'+pdf+'</div></div>')
S2=screen('inscrieri',win1,modal)
# 3 Documente
docs=[('Maria_Dumitrescu_Acord_2026-2027.pdf','Maria Dumitrescu','Acord (Formular de înscriere)','2026-2027','3 oct 2026',True),('Andrei_Popescu_Acord_2026-2027.pdf','Andrei Popescu','Acord (Formular de înscriere)','2026-2027','2 oct 2026',True),('Sara_Ilie_Acord_2026-2027.pdf','Sara Ilie','Acord (Formular de înscriere)','2026-2027','1 oct 2026',False),('Ana_Balan_Acord_2025-2026.pdf','Ana Bălan','Acord (Formular de înscriere)','2025-2026','12 sep 2025',False)]
t3='<table><tr><th>'+cb()+'</th><th>Fișier</th><th>Sportiv</th><th>Document</th><th>Sezon</th><th>Creat ↓</th><th></th></tr>'+''.join(
 f'<tr><td>{cb(s)}</td><td><span class="lnk" style="color:var(--tx);font-weight:600">{ic("file")}{f}</span></td><td>{n}</td><td>{d}</td><td>{se}</td><td>{c}</td><td><span class="lnk">{ic("eye")}Vezi</span>&nbsp;&nbsp;<span class="lnk">{ic("dl")}</span></td></tr>' for f,n,d,se,c,s in docs)+'</table>'
win3=('<div class="win"><div class="wh"><div><h1>Documente</h1><p>Documentele generate din înscrieri. Nu sunt publice: se deschid doar din panou.</p></div><span class="sp"></span><span class="btn">'+ic('dl')+'Descarcă tot sezonul (ZIP)</span></div>'
 f'<div class="tb"><span class="in srch">{ic("search")}Caută după sportiv sau fișier...</span><span class="in">Sezon <b>2026-2027</b>{ic("down")}</span><span class="in">Document <b>toate</b>{ic("down")}</span><span class="in">Sortare <b>cele mai noi</b>{ic("down")}</span></div>'
 '<div class="bulk">2 selectate<span style="flex:1"></span><span class="btn sm pr">'+ic('dl')+'Descarcă selecția (ZIP)</span><span class="btn sm">Deselectează</span></div>'+t3+'</div>')
S3=screen('documente',win3)
# 4 add to club modal
mod4=('<div class="modal"><div class="mh"><b>Adaugă în club: Maria Dumitrescu</b>'+ic('x')+'</div><div class="mb">'
 +'<div class="hint">Date preluate din înscriere. Le poți corecta înainte de salvare.</div>'
 +''.join(f'<div class="fl"><label>{a}</label><span class="in"><b>{b}</b>{ic("down") if dd else ""}</span></div>' for a,b,dd in [('Nume sportiv','Maria Dumitrescu',0),('Acces portal (email părinte)','parinte@exemplu.ro',0),('Membru A.C.S. în sezonul','2026-2027',1),('Grupa la Școala de patinaj','Primii Pași · Sâ, Du 10:00',1)])
 +'<span class="lnk">'+ic('plus')+'Încă o grupă</span><div class="hint">Abonamentul ales în formular (Abonament 8 ședințe) se propune automat; devine activ la plată.</div></div><div class="ft"><span class="btn">Anulează</span><span class="btn pr">Adaugă în club</span></div></div>')
S4=screen('inscrieri',win1,mod4)
# 5 Scoala grupe + totals
grp=[('Primii Pași','Sâ, Du 10:00','Cristi Vlad',14,16),('Intermediari Bronze','Sâ, Du 10:00','Andrei Popa',11,16),('Intermediari Silver','Sâ, Du 11:00','Bianca Ene',11,16),('Avansați Silver','Sâ, Du 11:00','Andrei Popa',9,14),('Avansați Gold','Sâ, Du 12:00','Bianca Ene, Cristi Vlad',8,12),('Adulți','Du 12:00','Cristi Vlad',6,12)]
t5='<table><tr><th>Grupă</th><th>Program</th><th>Antrenori</th><th>Sportivi</th><th>Ocupare</th><th>Membri A.C.S.</th><th></th></tr>'+''.join(
 f'<tr><td><b>{g}</b></td><td>{p}</td><td>{a}</td><td><b>{c}</b> / {mx}</td><td><div class="bar"><i style="width:{int(c/mx*100)}%"></i></div></td><td>{c-3}</td><td><span class="lnk">Deschide{ic("chev")}</span></td></tr>' for g,p,a,c,mx in grp)+'</table>'
win5=('<div class="win"><div class="wh"><div><h1>Școala de patinaj</h1><p>Grupele sezonului și câți sportivi are fiecare.</p></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>'
 '<div class="kp"><div><small>Sportivi la Școală</small><b>59</b></div><div><small>Membri A.C.S.</small><b>41</b></div><div><small>Grupe</small><b>6</b></div><div class="warn"><small>Confirmați fără grupă</small><b>3</b></div></div>'+t5+'</div>')
S5=screen('scoala',win5)
# 6 group detail assign
kids=[('Ana Bălan','9 ani','Da','5/8','7 nov 2026',0),('Luca Stoica','8 ani','Nu','8/8','3 oct 2026',1),('Matei Pop','10 ani','Da','2/6','14 nov 2026',0)]
t6='<table><tr><th>'+cb()+'</th><th>Sportiv</th><th>Membru</th><th>Abonament</th><th>Expiră</th><th></th></tr>'+''.join(f'<tr><td>{cb()}</td><td><b>{n}</b><small>{a}</small></td><td>{m}</td><td>{ab}</td><td><span style="{"color:var(--dg);font-weight:600" if past else ""}">{v}</span></td><td><span class="lnk">Fișa{ic("chev")}</span></td></tr>' for n,a,m,ab,v,past in kids)+'</table>'
win6=('<div class="win"><div class="wh"><div><h1>Primii Pași</h1><p>Sâ, Du 10:00 · Cristi Vlad · 14 sportivi</p></div><span class="sp"></span><span class="btn">Mută în altă grupă</span><span class="btn pr">'+ic('plus')+'Adaugă sportivi</span></div>'
 '<div class="tb"><span class="in srch">'+ic('search')+'Caută sportiv...</span><span class="bd dg" style="margin-left:auto">3 confirmați fără grupă</span><span class="btn sm">Alocă-i</span></div>'+t6+'</div>')
S6=screen('scoala',win6)
# 7 admin check-in multi hours
ck=[('Ana Bălan','Primii Pași',(1,0,0),'5/8'),('Luca Stoica','Primii Pași',(1,1,0),'7/8'),('Radu Vasile','Intermediari Silver',(0,1,0),'3/8'),('Irina Nistor','Intermediari Silver',(0,1,1),'6/8'),('Mara Toma','Avansați Gold',(0,0,1),'fără abonament')]
t7='<table><tr><th>Sportiv</th><th>Grupa</th><th class="cc">10:00</th><th class="cc">11:00</th><th class="cc">12:00</th><th>Abonament</th></tr>'+''.join(
 f'<tr><td><b>{n}</b></td><td>{g}</td>'+''.join(f'<td class="cc">{cb(v)}</td>' for v in h)+f'<td>{"<span class=\'bd dg\'>fără abonament</span>" if "fără" in a else a}{"<span class=xtra>+1 oră</span>" if sum(h)>1 else ""}</td></tr>' for n,g,h,a in ck)+'</table>'
win7=('<div class="win"><div class="wh"><div><h1>Prezență · Școala de patinaj</h1><p>O coloană pe oră. Poți bifa un sportiv și la altă oră decât a grupei lui.</p></div><span class="sp"></span><span class="in">'+ic('cal')+'<b>Sâmbătă 10 oct 2026</b>'+ic('down')+'</span></div>'
 '<div class="tb"><span class="in srch">'+ic('search')+'Caută sportiv...</span><span class="btn">Toate grupele'+ic('down')+'</span><span class="btn">'+ic('plus')+'Adaugă sportiv la o oră</span></div>'+t7
 +'<div class="ft"><span style="margin-right:auto;font-weight:700;align-self:center">7 bife · 2 ore în plus</span><span class="btn pr">Salvează prezența</span></div></div>')
S7=screen('prezenta',win7)
sheet=('<div class="sheet"><table><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th></tr><tr><th>1</th><th>Trimis</th><th>Nume copil</th><th>Completat de</th><th>Membru</th><th>La primul modul</th><th>Status</th><th>Document</th></tr>'
 '<tr><th>2</th><td>03.10.2026 14:22</td><td>Maria Dumitrescu</td><td>Mihaela Dumitrescu</td><td>Da</td><td>Abonament 8 ședințe</td><td>Nou</td><td><a>Deschide documentul</a></td></tr>'
 '<tr><th>3</th><td>02.10.2026 09:10</td><td>Andrei Popescu</td><td>Ioana Popescu</td><td>Nu</td><td>1 ședință grup</td><td>Contactat</td><td><a>Deschide documentul</a></td></tr>'
 '<tr><th>4</th><td>01.10.2026 18:40</td><td>Sara Ilie</td><td>Dan Ilie</td><td>Da</td><td>Abonament Avansați Gold 8 ședințe</td><td>Confirmat</td><td><a>Deschide documentul</a></td></tr></table></div>')
flow=('<div class="flow"><span class="s">Formular pe site</span><span class="a">&rarr;</span><span class="s">Înscriere în CMS</span><span class="a">&rarr;</span><span class="s">Rând în Google Sheet (există deja)</span><span class="a">&rarr;</span><span class="s">PDF "Acord (Formular de înscriere)"</span><span class="a">&rarr;</span><span class="s">Link în CMS + Sheet + pentru părinte</span><span class="a">&rarr;</span><span class="s">Confirmă &rarr; membru</span><span class="a">&rarr;</span><span class="s">Grupă</span><span class="a">&rarr;</span><span class="s">Prezență</span></div>')
qs=''.join(f'<div class="qq"><b>{a}</b>{b}</div>' for a,b in [
 ('1. A doua oră într-o zi consumă o căsuță din abonament?','Ex. Luca la 10:00 și 11:00: 2 căsuțe, 1 căsuță sau plată separată?'),
 ('2. Documentul: doar "Acord (Formular de înscriere)" pentru toți (ca în scriptul actual) sau și altele?','Ne trimiteți modelul real (Word/PDF) ca să-l reproducem exact.'),
 ('3. "Per școală": o singură Școală de patinaj sau mai multe locații?',''),
 ('4. Interimar: adăugăm un doPost în scriptul ei ca să primească înscrierile noastre până e gata PDF-ul nostru?','')])
html=(css+'<div class="A"><h2>CMS admin: înscriere &rarr; document &rarr; membru &rarr; grupă &rarr; prezență</h2><p class="note">În designul panoului de admin (meniul navy, ferestre albe, butoane albastru-oțel, insignele existente). Elementele noi din meniu sunt marcate NOU. Datele sunt inventate.</p>'+flow
 +'<div class="sec">1. Înscrieri (pagina existentă, extinsă)</div><p class="note">Coloanele sunt răspunsuri din formularul din script (cine completează, membru A.C.S., ce ia la primul modul, sezonul trecut) plus Document. În panoul din dreapta: toate întrebările formularului, cu răspunsurile. Jos: "Confirmă și adaugă în club".</p>'+S1
 +'<div class="sec">2. Vezi documentul (PDF, completat automat)</div><p class="note">Copia documentului actual ("Formular de înscriere – Școala de Patinaj EduSport"), cu același text. Câmpurile galbene se completează din formular. Data nașterii apare ca zz.ll.aaaa (în fișierul actual apare 1998-02-24). Bifele Da/Nu și semnătura rămân pentru hârtie.</p>'+S2
 +'<div class="sec">3. Google Sheet (sincronizarea existentă + coloana Document)</div><p class="note">Linkul duce în panou (cere login), deci documentul unui minor nu e niciodată public.</p>'+sheet
 +'<div class="sec">4. Documente (pagină nouă)</div>'+S3
 +'<div class="sec">5. Confirmă și adaugă în club</div>'+S4
 +'<div class="sec">6. Școala de patinaj: grupe și totaluri (pagină nouă)</div>'+S5
 +'<div class="sec">7. O grupă: sportivi și alocare</div>'+S6
 +'<div class="sec">8. Prezență de la admin, pe ore (pagină nouă)</div>'+S7
 +'<div class="sec">De lămurit</div>'+qs+'</div>')
open(N+'/admin-cms-v1.html','w').write(html)
