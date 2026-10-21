import sys,os
OUTQ=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_decm.py'), HERE+'/throw/dq.html']
exec(open(sys.argv[0]).read())
qc='''<style>.A .cmpt{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}.A .cmpt th,.A .cmpt td{padding:5px 6px;border-bottom:1px solid var(--ln);text-align:left;vertical-align:top}.A .cmpt th{font-size:9.5px;background:#fafbfd}.A .cmpt tr.d td{background:#fffaf0}.A .cmpt td:first-child{color:var(--mu);white-space:nowrap}
.A .mcard2{border:1px solid var(--ln);border-radius:4px;background:#fff;margin-top:12px}.A .mcard2 .top{display:grid;grid-template-columns:36px 1fr auto;gap:10px;align-items:center;padding:10px 12px}.A .mcard2 .body{padding:0 12px 10px}
.A .drw{position:absolute;top:0;right:0;bottom:0;width:470px;background:#fff;box-shadow:-12px 0 30px rgba(14,26,60,.18);z-index:6;display:flex;flex-direction:column}.A .drw .dh{display:flex;align-items:flex-start;gap:10px;padding:16px 18px;border-bottom:1px solid var(--ln)}.A .drw .dh h3{margin:0;font-size:17px}.A .drw .db{padding:14px 18px;overflow:auto;flex:1}
.A .dim{position:absolute;inset:0;background:rgba(15,21,34,.25);z-index:5}.A .scr{min-height:720px;width:1380px;max-width:none}.A .split td:first-child,.A .split td:nth-child(6){white-space:nowrap}</style>'''
rowsL=[('2026-0142','3 oct 2026','Maria Dumitrescu',12,'nw','Nou','Mihaela Dumitrescu',True,True),('2026-0141','2 oct 2026','Andrei Popescu',10,'inf','Contactat','Ioana Popescu',False,False),('2026-0140','1 oct 2026','Sara-Maria Ilie',11,'nw','Nou','Dan Ilie',True,False),('2026-0139','30 sep 2026','David Neagu',10,'ok','Confirmat','Ana Neagu',True,False),('2026-0138','29 sep 2026','Ilinca Matei',7,'nw','Nou','Sorin Matei',False,False)]
tl='<table><tr><th>Nr.</th><th>Trimis la</th><th>Nume copil</th><th>Vârstă</th><th>Status</th><th>Completat de</th></tr>'+''.join(f'<tr class="{"sel" if s else ""}"><td><b>{n}</b></td><td style="white-space:nowrap">{d}</td><td style="white-space:nowrap"><b>{c}</b>{mm_ex if e else ""}</td><td>{a} ani</td><td><span class="bd {k}">{st_}</span></td><td>{p}</td></tr>' for n,d,c,a,k,st_,p,e,s in rowsL)+'</table>'
def ppanel(card):
  return ('<div class="tp" style="border:0;border-left:1px solid var(--ln);border-radius:0;width:auto;min-height:620px"><div class="ph2"><h2>Maria Dumitrescu <span class="bd nw">Nou</span></h2><div class="meta2"><span>Nr. <b>2026-0142</b></span><span>Trimis <b>3 oct 2026</b></span></div>'+card+
   '<div class="ui-tabs"><span class="ui-tab on">Date</span><span class="ui-tab">Abonament</span><span class="ui-tab">Documente<span class="ui-tab-count">2</span></span><span class="ui-tab">Istoric<span class="ui-tab-count">1</span></span></div></div>'
   '<div class="bd2"><div class="lb">Adresă de e-mail</div><div class="vl">parinte@exemplu.ro</div><div class="lb">Persoana care completează</div><div class="vl">Mihaela Dumitrescu</div><div class="lb">Telefon de contact</div><div class="vl">0722 111 222</div></div>'
   '<div class="ft"><span class="btn sm">Contactat</span><span class="btn sm pr">Confirmă înscrierea</span></div></div>')
def page(panel,extra=''):
  w=('<div class="win"><div class="wh"><div><h1>Înscrieri</h1><p>Cererile trimise prin formularul public de înscriere.</p></div><span class="sp"></span><span class="in">Sezon <b>2026-2027 (activ)</b>'+ic('down')+'</span></div>'
     f'<div class="tb"><span class="in srch">{ic("search")}Caută după nr. înscriere, nume, părinte, email sau telefon...</span><span class="fbtn">Status{ic("down")}</span><span class="fbtn">Sportiv existent{ic("down")}</span></div>'
     '<div class="split" style="grid-template-columns:minmax(0,1fr) 380px"><div>'+tl+'</div>'+panel+'</div></div>')
  return screen('inscrieri',w,extra)
# A inline compare
cmpRows=[('Nume','Maria Dumitrescu','Maria Dumitrescu',0),('Data nașterii','14.03.2014','14.03.2014',0),('Părinte','Mihaela Dumitrescu','Mihaela Dumitrescu',0),('Telefon','0722 111 22','0722 111 222',1),('E-mail','parinte@exemplu.ro','parinte@exemplu.ro',0)]
inline=('<div class="mcard2"><div class="top"><span class="av" style="width:36px;height:36px">MD</span><div><b>Sportiv existent</b><div class="hint">Primii Pași 2025-2026</div></div><span class="lnk">Ascunde '+ic('down').replace('class="ic"','class="ic" style="transform:rotate(180deg)"')+'</span></div><div class="body">'
 '<table class="cmpt"><tr><th></th><th>În fișă</th><th>În înscriere</th></tr>'+''.join(f'<tr class="{"d" if d else ""}"><td>{a}</td><td>{b}</td><td>{"<b>"+c+"</b>" if d else c}</td></tr>' for a,b,c,d in cmpRows)+'</table>'
 '<div style="margin-top:8px;display:flex;justify-content:space-between"><span></span><span class="lnk">Deschide fișa completă '+ic('chev')+'</span></div></div></div>')
collapsed=('<div class="mcard2"><div class="top"><span class="av" style="width:36px;height:36px">MD</span><div><b>Sportiv existent</b><div class="hint">Primii Pași 2025-2026</div></div><span class="lnk">Compară '+ic('down')+'</span></div></div>')
SA1=page(ppanel(collapsed)); SA2=page(ppanel(inline))
# B drawer
drawer=('<div class="dim"></div><div class="drw"><div class="dh"><div style="flex:1"><div class="hint">Fișa sportivului</div><h3>Maria Dumitrescu</h3><div class="hint">Primii Pași 2025-2026</div></div><span class="lnk">Deschide pagina '+ic('chev')+'</span><span style="margin-left:8px">'+ic('x')+'</span></div>'
 '<div class="ui-tabs" style="margin:0;padding:0 10px"><span class="ui-tab on">Date</span><span class="ui-tab">Grupe și abonament</span><span class="ui-tab">Istoric</span></div><div class="db">'
 '<div class="lb">Persoana de contact</div><div class="vl">Mihaela Dumitrescu · Părinte</div><div class="lb">Telefon</div><div class="vl">0722 111 22 <span class="hint">· în înscriere: <b style="color:var(--tx)">0722 111 222</b></span></div><div class="lb">E-mail</div><div class="vl">parinte@exemplu.ro</div>'
 '<div class="lb">Grupe</div><div class="vl">2025-2026 · Primii Pași</div><div class="lb">Documente</div><div class="vl"><span class="lnk">'+ic('file')+'Acord 2025-2026</span></div></div>'
 '<div class="ft"><span class="btn">Închide</span><span class="btn pr">Sportiv existent: confirmă înscrierea</span></div></div>')
cardB=('<div class="mcard2"><div class="top"><span class="av" style="width:36px;height:36px">MD</span><div><b>Sportiv existent</b><div class="hint">Primii Pași 2025-2026</div></div><span class="lnk">Vezi fișa</span></div></div>')
SB=page(ppanel(cardB),drawer)
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+'<div class="A"><h2>Verificare rapidă, fără să pleci din Înscrieri</h2>'
 '<p class="note">Da: dacă "Vezi fișa" deschide altă pagină, pierzi înscrierea din ecran și trebuie să te întorci. Două feluri de a verifica pe loc. Ecrane la lățime de desktop. Date inventate.</p>'
 '<div class="sec">A. Comparare direct în card (recomandat)</div><p class="note">"Compară" deschide cardul pe loc: fișa vs înscrierea, câmpurile importante, diferențele marcate. Pagina fișei rămâne un link mic, pentru cine chiar vrea tot.</p>'
 '<p class="cap2">Închis</p>'+SA1+'<p class="cap2" style="margin-top:18px">Deschis</p>'+SA2
 +'<div class="sec">B. Fișa într-un panou lateral peste pagină</div><p class="note">"Vezi fișa" deschide fișa într-un panou din dreapta (componenta Drawer există deja în admin). Lista și înscrierea rămân dedesubt; "Închide" te întoarce exact unde erai, sau confirmi direct de acolo.</p>'+SB
 +'</div>')
open(OUTQ,'w').write(html)
