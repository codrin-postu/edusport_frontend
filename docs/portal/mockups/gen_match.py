import sys,os,re
OUTX=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_proto.py'), HERE+'/throw/pp.html']
exec(open(sys.argv[0]).read())
PCSS=re.search(r"pcss='''(.*?)'''",open(os.path.join(HERE,'gen_proto.py')).read(),re.S).group(1).replace('body{margin:0;background:#eef0f4}','').replace('.A .scr{width:100%;min-height:100vh;border:0;box-shadow:none}','')
xc='''<style>.A .mm{display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;margin-top:3px}.A .mm .ic{width:12px;height:12px}.A .mm.ex{color:var(--inf)}.A .mm.pr{color:#8a4b06}
.A .mcard{display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:center;border:1px solid var(--ln);border-radius:4px;padding:12px;background:#fff}.A .av{width:40px;height:40px;border-radius:4px;background:#ecf0f7;color:var(--p);display:grid;place-items:center;font-weight:800}
.A .ch2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.A .chc{border:1.5px solid var(--ln);border-radius:4px;padding:10px 12px;cursor:pointer;background:#fff}.A .chc.on{border-color:var(--p);background:#f3f5fa;box-shadow:0 0 0 2px #dfe6f3}.A .chc b{display:block}.A .chc small{color:var(--mu)}
.A .dif{margin-top:12px;border-top:1px solid var(--ln);padding-top:10px}.A .difr{display:grid;grid-template-columns:110px 1fr auto;gap:10px;align-items:center;padding:6px 0}.A .difr s{color:var(--mu)}.A .same{font-size:12px;color:var(--mu);margin-top:6px}
.A .cols2{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--ln);border-radius:4px;overflow:hidden}.A .cols2>div{padding:10px 12px}.A .cols2>div:first-child{background:#fafbfd;border-right:1px solid var(--ln)}.A .cols2 h5{margin:0 0 6px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--mu)}.A .cols2 .r{padding:3px 0}.A .cols2 .r.d{background:#fffaf0;margin:0 -12px;padding:3px 12px}
.A .q1{font-size:15px;font-weight:700;margin:4px 0 10px}.A .bigb{display:flex;gap:10px;margin-top:12px}.A .wcol{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}</style>'''
mm_ex=f'<span class="mm ex">{ic("user")}Sportiv existent</span>'
mm_pr=f'<span class="mm pr">{ic("user")}Posibil existent</span>'
# list variants
def reglist(variant):
  R=[('2026-0142','3 oct 2026','Maria Dumitrescu','14.03.2014','nw','Nou','Mihaela Dumitrescu','ex'),('2026-0141','2 oct 2026','Andrei Popescu','02.09.2016','inf','Contactat','Ioana Popescu',''),('2026-0140','1 oct 2026','Sara-Maria Ilie','21.06.2015','nw','Nou','Dan Ilie','pr')]
  if variant=='A':
    head='<tr><th>Nr.</th><th>Trimis la</th><th>Nume copil</th><th>Status</th><th>Completat de</th></tr>'
    body=''.join(f'<tr><td><b>{n}</b></td><td>{d}</td><td><b>{c}</b><small>{b}</small>{mm_ex if m=="ex" else mm_pr if m=="pr" else ""}</td><td><span class="bd {k}">{s}</span></td><td>{p}</td></tr>' for n,d,c,b,k,s,p,m in R)
  else:
    head='<tr><th>Nr.</th><th>Trimis la</th><th>Nume copil</th><th>Status</th><th>În club</th><th>Completat de</th></tr>'
    col={'ex':'<span class="sq" style="background:var(--inf)"></span>Existent<small>Primii Pași, 2025-2026</small>','pr':'<span class="sq" style="background:#b45309"></span>Posibil<small>Sara Ilie, Avansați Silver</small>','':'<span class="sq" style="background:#c0c0cf"></span><span style="color:var(--mu)">Nou</span>'}
    body=''.join(f'<tr><td><b>{n}</b></td><td>{d}</td><td><b>{c}</b><small>{b}</small></td><td><span class="bd {k}">{s}</span></td><td>{col[m]}</td><td>{p}</td></tr>' for n,d,c,b,k,s,p,m in R)
  return '<div class="win" style="max-width:820px"><div class="tb" style="gap:6px"><span class="fbtn">Status'+ic('down')+'</span><span class="fbtn">În club'+ic('down')+'</span><span class="fbtn">Membru A.C.S.'+ic('down')+'</span></div><table>'+head+body+'</table></div>'
# panel card
pcard=('<div class="tp" style="width:360px;min-height:0;border:1px solid var(--ln);border-radius:4px"><div class="ph2"><h2>Maria Dumitrescu <span class="bd nw">Nou</span></h2><div class="meta2"><span>Nr. <b>2026-0142</b></span><span>Trimis <b>3 oct 2026</b></span></div>'
 f'<div class="mcard" style="margin-top:12px"><span class="av">MD</span><div><b>Sportiv existent în club</b><div class="hint">Primii Pași în 2025-2026 · 12 ani</div></div><span class="lnk">Vezi fișa</span></div>'
 '<div class="ui-tabs"><span class="ui-tab on">Date</span><span class="ui-tab">Abonament</span><span class="ui-tab">Documente<span class="ui-tab-count">2</span></span><span class="ui-tab">Istoric<span class="ui-tab-count">1</span></span></div></div><div class="bd2" style="padding-bottom:10px"><div class="lb">Adresă de e-mail</div><div class="vl">parinte@exemplu.ro</div><div class="lb">…</div></div></div>')
O=lambda L,ch,t,body,d='':f'<div class="option" data-choice="{ch}" onclick="toggleSelect(this)" style="display:block;padding:0;border:0;background:none"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">{L}</span> {t}</p>{body}{f"<p class=note style=margin-top:8px>{d}</p>" if d else ""}</div>'
# confirm variants (sportiv section only + rest)
def shell(inner,title='Confirmă înscrierea 2026-0142'):
  return (f'<div class="cmod" style="width:560px"><div class="mh"><b>{title}</b>{ic("x")}</div><div class="mb"><div class="grp2"><h4>Sportiv</h4>{inner}</div><div class="grp2"><h4>Școala de patinaj, sezonul 2026-2027</h4><div class="g2"><div class="fl2"><label>Grupa</label><div class="cdd"><button class="cdd-t"><span class="cdd-v">Intermediari Bronze · Sâ, Du 10:00</span>{ic("down")}</button></div></div><div class="fl2"><label>Membru A.C.S. în 2026-2027</label><div class="cdd"><button class="cdd-t"><span class="cdd-v">Da</span>{ic("down")}</button></div></div></div></div></div><div class="ft"><span class="btn">Anulează</span><span class="btn pr">Confirmă înscrierea</span></div></div>')
cA=(f'<div class="mcard"><span class="av">MD</span><div><b>Maria Dumitrescu</b><div class="hint">14.03.2014 · 12 ani · Primii Pași în 2025-2026 · Mihaela Dumitrescu</div></div><span class="lnk">Vezi fișa</span></div>'
 '<div class="ch2"><div class="chc on"><b>Sportiv existent</b><small>Înscrierea se adaugă la această fișă</small></div><div class="chc"><b>Sportiv nou</b><small>Se creează o fișă nouă</small></div></div>'
 '<div class="dif"><div class="lb" style="margin-top:0">Diferă față de fișă</div><div class="difr"><span>Telefon</span><span><s>0722 111 22</s> → <b>0722 111 222</b></span><label class="ccb"><input type="checkbox" checked><span>Actualizează</span></label></div><div class="same">Nume, data nașterii, e-mail: identice.</div></div>'
 f'<div style="margin-top:8px"><span class="lnk">{ic("search")}Nu e ea? Caută alt sportiv</span></div>')
cB=('<div class="cols2"><div><h5>Fișa din club</h5><div class="r"><b>Maria Dumitrescu</b></div><div class="r">14.03.2014</div><div class="r">Primii Pași 2025-2026</div><div class="r d">0722 111 22</div><div class="r">parinte@exemplu.ro</div></div><div><h5>Înscrierea 2026-0142</h5><div class="r"><b>Maria Dumitrescu</b></div><div class="r">14.03.2014</div><div class="r">&nbsp;</div><div class="r d"><b>0722 111 222</b> <label class="ccb" style="display:inline-flex;margin-left:6px"><input type="checkbox" checked><span>folosește</span></label></div><div class="r">parinte@exemplu.ro</div></div></div>'
 '<div class="ch2"><div class="chc on"><b>Sportiv existent</b><small>Folosește fișa existentă</small></div><div class="chc"><b>Sportiv nou</b><small>Fișă nouă</small></div></div>')
cC=('<div class="q1">Este același sportiv cu cel din club?</div><div class="mcard"><span class="av">MD</span><div><b>Maria Dumitrescu</b><div class="hint">14.03.2014 · Primii Pași în 2025-2026 · părinte Mihaela Dumitrescu</div></div><span class="lnk">Vezi fișa</span></div>'
 '<div class="bigb"><span class="btn pr">Da, sportiv existent</span><span class="btn">Nu, sportiv nou</span><span class="lnk" style="align-self:center">Caută alt sportiv</span></div>'
 '<div class="hint" style="margin-top:10px">După răspuns: dacă e același sportiv, apare doar ce diferă (aici telefonul), cu bifă de actualizare.</div>')
cPr=(f'<div class="mcard" style="border-color:#f3dcb0;background:#fffcf5"><span class="av" style="background:#fdf3e1;color:#8a4b06">SI</span><div><b>Posibil același sportiv: Sara Ilie</b><div class="hint">21.06.2015 · Avansați Silver în 2025-2026 · același telefon și e-mail, nume diferit (Sara-Maria Ilie)</div></div><span class="lnk">Vezi fișa</span></div>'
 '<div class="ch2"><div class="chc"><b>Sportiv existent</b><small>Înscrierea se adaugă la această fișă</small></div><div class="chc"><b>Sportiv nou</b><small>Se creează o fișă nouă</small></div></div><div class="hint" style="margin-top:8px">Nimic nu e ales din start: admin trebuie să aleagă.</div>')
cNew=(f'<div class="mcard" style="background:#fafbfd"><span class="av" style="background:#f0f1f4;color:var(--t2)">AP</span><div><b>Sportiv nou</b><div class="hint">Nu am găsit pe nimeni cu acest nume și această dată a nașterii.</div></div><span class="lnk">Caută</span></div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+'<div class="A"><h2>Copil existent: cum îl arătăm</h2><p class="note">Fără tabelul "În club / În înscriere" cu toate rândurile. Date inventate.</p>'
 '<div class="sec">1. Încă din lista Înscrieri</div><p class="note">Potrivirea se calculează la trimiterea formularului, deci se vede înainte de confirmare. Și un filtru "În club": Existent / Posibil / Nou.</p><div class="options wcol">'
 +O('A','list-under','Sub numele copilului',reglist('A'),'Discret: "Sportiv existent" (albastru) sau "Posibil existent" (portocaliu), nimic pentru cei noi.')
 +O('B','list-col','Coloană separată "În club"',reglist('B'),'Se vede și grupa de anul trecut; se poate sorta și filtra după coloană.')+'</div>'
 '<div class="sec">2. Sus în panoul înscrierii</div><p class="note">Un card mic deasupra taburilor, cu link spre fișă.</p>'+pcard
 +'<div class="sec">3. În fereastra de confirmare</div><div class="options wcol">'
 +O('A','card-choice','Cardul sportivului + "Sportiv existent / Alt sportiv" + doar ce diferă (recomandat)',shell(cA),'Clar cine e copilul; arată doar diferențele (aici telefonul), restul într-un rând "identice".')
 +O('B','two-cols','Două coloane: fișa vs înscrierea',shell(cB),'Comparație vizuală; diferențele marcate.')
 +O('C','question','Întâi întrebarea "Este același sportiv?"',shell(cC),'Un pas în plus, dar decizia e foarte explicită.')+'</div>'
 '<div class="sec">Celelalte cazuri, în varianta A</div><div class="wcol"><div><p class="cap2">Posibil același sportiv</p>'+shell(cPr,'Confirmă înscrierea 2026-0140')+'</div><div><p class="cap2">Copil nou</p>'+shell(cNew,'Confirmă înscrierea 2026-0141')+'</div></div></div>')
open(OUTX,'w').write(html)
