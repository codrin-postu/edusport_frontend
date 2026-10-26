import sys,os
OUTG=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_docq.py'), HERE+'/throw/gr.html']
exec(open(sys.argv[0]).read())
gc='''<style>.A .tot{display:flex;gap:28px;padding:12px 18px;border-bottom:1px solid var(--ln);flex-wrap:wrap}.A .tot div{font-size:12px;color:var(--mu)}.A .tot b{display:block;font-size:20px;color:var(--tx);font-weight:700}.A .tot .warn b{color:#b45309}.A .tot a{color:var(--p);font-weight:600;font-size:12px}
.A .gt td{height:56px;padding-top:0;padding-bottom:0}.A .occ{display:flex;align-items:center;gap:8px}.A .occ .b{width:90px;height:6px;background:#eef0f4;border-radius:3px;overflow:hidden}.A .occ .b i{display:block;height:100%;background:var(--p)}.A .occ .b i.full{background:#b45309}
.A .tkt{display:inline-flex;gap:2px;vertical-align:middle;margin-right:6px}.A .tkt i{width:7px;height:9px;border:1px solid var(--p);border-radius:1px}.A .tkt i.u{background:var(--p)}
.A .ung{border:1px solid #f3dcb0;background:#fffcf5;border-radius:6px;margin:14px 18px}.A .ung .h{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #f3dcb0}.A .ung .h b{flex:1}.A .ung .r{display:grid;grid-template-columns:1.2fr .5fr 1.4fr 260px 90px;gap:12px;align-items:center;padding:8px 14px;border-bottom:1px solid #f6e7c8}.A .ung .r:last-child{border-bottom:0}
.A .gh{display:flex;gap:18px;flex-wrap:wrap;color:var(--t2);font-size:13px;margin-top:4px}.A .gh span{display:inline-flex;gap:6px;align-items:center}.A .gh .ic{width:14px;height:14px;color:var(--mu)}
.A .pick{position:absolute;z-index:6;width:520px;background:#fff;border:1px solid var(--ln);border-radius:8px;box-shadow:0 18px 40px rgba(14,26,60,.16)}.A .pick .rh{padding:12px 14px;border-bottom:1px solid var(--ln)}.A .pick .pr{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:center;height:48px;padding:0 14px;border-bottom:1px solid var(--ln)}.A .pick .pr small{display:block;color:var(--mu);font-size:12px}.A .pick .pf{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fafbfd;border-radius:0 0 8px 8px}
.A .tagw{font-size:11px;font-weight:700;color:#8a4b06;background:#fdf3e1;border:1px solid #f3dcb0;padding:1px 6px;border-radius:3px}</style>'''
G=[('Primii Pași','Sâ, Du 10:00','Cristi Vlad',14,16),('Intermediari Bronze','Sâ, Du 10:00','Andrei Popa',11,16),('Intermediari Silver','Sâ, Du 11:00','Bianca Ene',16,16),('Avansați Silver','Sâ, Du 11:00','Andrei Popa',9,14),('Avansați Gold','Sâ, Du 12:00','Bianca Ene · Cristi Vlad',8,12),('Adulți','Du 12:00','Cristi Vlad',6,12)]
gt=('<table class="gt"><tr><th class="srt on">Grupă<span>▲</span></th><th>Program</th><th>Antrenori</th><th class="srt">Sportivi<span>↕</span></th><th>Membri A.C.S.</th><th>Abonament activ</th><th></th></tr>'
 +''.join(f'<tr><td><b>{g}</b></td><td>{p} · 50 min</td><td>{a}</td><td><b>{c}</b></td><td>{c-3}</td><td>{c-2} din {c}</td><td><span class="lnk">Deschide{ic("chev")}</span></td></tr>' for g,p,a,c,mx in G)+'</table>')
tot=('<div class="tot"><div><b>64</b>Sportivi la Școală</div><div><b>45</b>Membri A.C.S.</div><div><b>6</b>Grupe</div><div class="warn"><b>3</b>Confirmați fără grupă <a>Alocă-i ↓</a></div></div>')
UNG=[('Maria Dumitrescu',12,'Începători (formular) · Primii Pași 2025-2026','Intermediari Bronze · Sâ, Du 10:00'),('Andrei Popescu',10,'Nu a participat','Primii Pași · Sâ, Du 10:00'),('Ilinca Matei',7,'Nu a participat','Primii Pași · Sâ, Du 10:00')]
ung=('<div class="ung"><div class="h">'+ic('user')+'<b>Confirmați fără grupă (3)</b><span class="hint">Grupa e propusă după nivel și vârstă; o poți schimba.</span></div>'
 +''.join(f'<div class="r"><b>{n}</b><span>{a} ani</span><span class="hint">{lvl}</span><div class="cdd"><button class="cdd-t"><span class="cdd-v">{g}</span>{ic("down")}</button></div><span class="btn sm pr">Alocă</span></div>' for n,a,lvl,g in UNG)+'</div>')
W1=('<div class="win"><div class="wh"><div><h1>Grupe</h1><p>Școala de patinaj, un singur loc. Grupele sezonului și câți sportivi are fiecare.</p></div><span class="sp"></span><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="btn pr">'+ic('plus')+'Grupă nouă</span></div>'+tot+gt+ung+'</div>')
S1=screen('scoala',W1)
# group page
K=[('Ana Bălan',10,'activ',5,8,'expiră 7 nov','Da'),('Luca Stoica',8,'gata',8,8,'folosit','Nu'),('Matei Pop',10,'activ',2,6,'expiră 14 nov','Da'),('Sofia Tănase',10,'nou',0,8,'neînceput','Da'),('David Neagu',10,'fara',0,0,'','Nu')]
def ab(st,u,t,e):
  if st=='fara': return '<span class="bd dg">Fără abonament</span>'
  return '<span class="tkt">'+''.join(f'<i class="{"u" if i<u else ""}"></i>' for i in range(t))+f'</span>{u}/{t}<small style="display:block;color:var(--mu)">{e}</small>'
def gk(sel=()):
  return ('<table class="gt"><tr><th><label class="ccb"><input type="checkbox"></label></th><th class="srt on">Nume sportiv<span>▲</span></th><th>Vârstă</th><th>Abonament</th><th>Membru A.C.S.</th><th>Contact</th></tr>'
   +''.join(f'<tr class="{"sel" if i in sel else ""}"><td><label class="ccb"><input type="checkbox" {"checked" if i in sel else ""}></label></td><td><b>{n}</b></td><td>{a} ani</td><td>{ab(st,u,t,e)}</td><td>{m}</td><td class="hint">0721 000 1{i}0</td></tr>' for i,(n,a,st,u,t,e,m) in enumerate(K))+'</table>')
gh=('<div class="wh"><div><span class="lnk">'+ic('chev').replace('class="ic"','class="ic" style="transform:rotate(180deg)"')+'Grupe</span><h1 style="margin-top:6px">Primii Pași</h1><div class="gh"><span>'+ic('cal')+'Sâmbătă și duminică, 10:00 · 50 min</span><span>'+ic('user')+'Cristi Vlad</span><span><b>14</b>&nbsp;sportivi</span></div></div><span class="sp"></span><span class="btn">'+ic('form')+'Editează grupa</span><span class="btn pr">'+ic('plus')+'Adaugă sportivi</span></div>')
gtabs='<div class="ui-tabs" style="margin:0;padding:0 14px"><span class="ui-tab on">Sportivi<span class="ui-tab-count">14</span></span><span class="ui-tab">Prezență</span><span class="ui-tab">Istoric</span></div>'
bulk=('<div class="selban">'+ic('check')+'<b>2 selectați</b><span style="flex:1"></span><div style="width:250px"><div class="cdd open"><button class="cdd-t"><span class="cdd-v">Mută în: Intermediari Bronze</span>'+ic('down')+'</button></div></div><span class="btn sm pr">Mută</span><span class="btn sm">Scoate din grupă</span><span class="btn sm">Anulează</span></div>')
W2=('<div class="win">'+gh+gtabs+bulk+gk((0,2))+'<div class="pgr">14 sportivi<span style="flex:1"></span></div></div>')
S2=screen('scoala',W2)
# add picker anchored under Adaugă sportivi
pick=('<div class="pick" style="top:96px;right:24px"><div class="rh"><div class="in srch" style="min-width:0;width:100%">'+ic('search')+'Caută sportiv...</div><div style="display:flex;gap:6px;margin-top:8px"><span class="chip2">Fără grupă ✕</span><span class="fbtn" style="height:26px">Toți sportivii</span></div></div>'
 +''.join(f'<div class="pr"><label class="ccb"><input type="checkbox" {"checked" if i<2 else ""}></label><div><b>{n}</b><small>{a} ani · {lv}</small></div><span class="hint">{x}</span></div>' for i,(n,a,lv,x) in enumerate([('Andrei Popescu',10,'Nu a participat','fără grupă'),('Ilinca Matei',7,'Nu a participat','fără grupă'),('Maria Dumitrescu',12,'Primii Pași 2025-2026','fără grupă')]))
 +'<div class="pf"><b>2 selectați</b><span style="flex:1"></span><span class="lnk">Anulează</span><span class="btn sm pr">Adaugă în grupă</span></div></div>')
S3=screen('scoala',('<div class="win">'+gh+gtabs+gk()+'</div>')+pick)
# mobile
mg=''.join(f'<div class="dcard3" style="grid-template-columns:1fr auto"><div><b>{g}</b><div class="m">{p} · {a}</div></div><div style="text-align:right"><b>{c}</b><div class="m">sportivi</div></div></div>' for g,p,a,c,mx in G)
PMG=('<div class="ph"><div class="tbar">☰<b>Grupe</b>'+ic('search')+'</div><div class="pw"><div class="ph-h"><h1>Grupe</h1><div class="hint">2026-2027 · 64 sportivi · 6 grupe</div></div>'
 +'<div class="ctl"><div class="g2x"><span class="c40 pr">'+ic('plus')+'Grupă nouă</span><span class="c40 sel">Sezon 2026-2027'+ic('down')+'</span></div></div>'
 +'<div style="margin:0 14px 10px;border:1px solid #f3dcb0;background:#fffcf5;border-radius:6px;padding:10px 12px;display:flex;align-items:center;gap:8px"><b style="flex:1">3 fără grupă</b><span class="lnk">Alocă-i</span></div>'+mg+'</div></div>')
qs=('<div class="sec">De decis</div>'
 '<p class="note" style="margin-top:14px"><b>1. Mutarea în altă grupă în timpul sezonului</b></p><div class="options optq">'+Q('A','keep','Abonamentul merge cu sportivul (recomandat)','Abonamentul e al sportivului, nu al grupei; prezența veche rămâne la grupa veche, în Istoric.')+Q('B','reset','Abonamentul rămâne la grupa veche','Mai complicat pentru părinte.')+'</div>'
 '<p class="note" style="margin-top:14px"><b>2. Programul grupei</b></p><div class="options optq">'+Q('A','calendar','Vine din calendarul site-ului (seria Școlii), recomandat','Schimbi ora o dată, se vede pe site și la prezență.')+Q('B','own','Se scrie separat la grupă','Riscă să nu se potrivească cu site-ul.')+'</div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+'<div class="A"><h2>Școala de patinaj · Grupe</h2><p class="note">Un singur loc. Totaluri pe școală și pe grupă, alocarea celor fără grupă, mutări. Date inventate.</p>'
 '<div class="sec">1. Lista grupelor + cei fără grupă</div><p class="note">Sus totalurile școlii. Fiecare grupă: program, antrenori, numărul de sportivi (fără limită), membri, câți au abonament activ. Jos: "Confirmați fără grupă" cu grupa propusă și "Alocă" pe loc.</p>'+S1
 +'<div class="sec">2. Pagina unei grupe: selectezi și muți</div><p class="note">Abonamentul ca mini-bilet (căsuțe pline = folosite). Bifezi sportivi, apare bara: "Mută în: ..." + "Mută", "Scoate din grupă".</p>'+S2
 +'<div class="sec">3. "Adaugă sportivi": dropdown sub buton</div><p class="note">Pornește cu filtrul "Fără grupă"; poți căuta în toți. Bifezi mai mulți și "Adaugă în grupă". (Un sportiv poate fi în mai multe grupe, decis la portal.)</p>'+S3
 +'<div class="sec">4. Pe telefon</div><div class="wcol"><div>'+PMG+'</div></div>'+qs+'</div>')
open(OUTG,'w').write(html)
