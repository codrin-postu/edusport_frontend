import sys,os
OUTDM=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_docpage3.py'), HERE+'/throw/dm2.html']
exec(open(sys.argv[0]).read())
mc='''<style>.A .ph{width:390px;border:10px solid #1b1d22;background:#eef0f4;min-height:780px;font-size:13px;position:relative;overflow:hidden}
.A .ph .tbar{background:#131c3d;color:#fff;display:flex;align-items:center;gap:10px;padding:12px 14px}.A .ph .tbar b{flex:1;font-size:15px}.A .ph .tbar .ic{width:20px;height:20px}
.A .ph .pw{background:#fff;margin:10px;border:1px solid var(--ln);border-radius:4px}.A .ph .ph-h{padding:12px 14px}.A .ph h1{font-size:18px;margin:0}
.A .ph .row-b{display:flex;gap:8px;padding:0 14px 12px}.A .ph .row-b .btn{flex:1;justify-content:center}
.A .ph .frow{display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--ln);border-bottom:1px solid var(--ln)}.A .ph .frow .in{flex:1;min-width:0}
.A .dcard{display:grid;grid-template-columns:36px 1fr 28px;gap:10px;align-items:start;padding:12px 14px;border-bottom:1px solid var(--ln)}.A .dcard .dic{width:36px;height:36px}.A .dcard b{display:block}.A .dcard .m{color:var(--mu);font-size:12px;margin-top:2px}.A .dcard .kb{width:28px;height:28px;display:grid;place-items:center;border:1px solid var(--ln);border-radius:4px;font-weight:800;color:var(--t2)}
.A .sheet2{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:10px 10px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.25);padding:14px 16px 18px;z-index:4}.A .sheet2 .grab{width:40px;height:4px;border-radius:2px;background:#c0c0cf;margin:0 auto 12px}.A .sheet2 .opt{display:flex;gap:10px;align-items:center;padding:11px 4px;border-bottom:1px solid var(--ln)}.A .sheet2 .opt .ic{width:18px;height:18px;color:var(--p)}
.A .dimm{position:absolute;inset:0;background:rgba(15,21,34,.45);z-index:3}.A .chipx{display:inline-flex;gap:6px;align-items:center;height:26px;padding:0 8px;border:1px solid #cfd9ea;background:#ecf0f7;color:var(--p);border-radius:3px;font-weight:600;font-size:12px}
.A .grpd{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);padding:12px 14px 4px;background:#fafbfd;border-bottom:1px solid var(--ln)}</style>'''
D=[('Maria Dumitrescu','Acord','5 oct 2026 · Generat · 2026-0142',''),('Maria Dumitrescu','Cerere de adeziune','3 oct 2026 · Generat · 2026-0142',''),('Maria Dumitrescu','Adeverință medicală','4 oct 2026 · Încărcat',''),('Andrei Popescu','Acord','2 oct 2026 · Generat · 2026-0141','')]
cards=lambda lst:''.join(f'<div class="dcard"><span class="dic">{ic("file")}</span><div><b>{t}</b><div>{n}</div><div class="m">{m}</div></div><span class="kb">⋯</span></div>' for n,t,m,_ in lst)
top=('<div class="tbar">☰<b>Documente</b>'+ic('search')+'</div><div class="pw"><div class="ph-h"><h1>Documente</h1></div>'
 '<div class="ui-tabs" style="margin:0;padding:0 8px"><span class="ui-tab on">Documente<span class="ui-tab-count">5</span></span><span class="ui-tab">Tipuri<span class="ui-tab-count">4</span></span></div>'
 '<div class="row-b" style="padding-top:12px"><span class="btn sm">'+ic('plus')+'Încarcă</span><span class="btn sm">'+ic('dl')+'Formulare goale</span><span class="btn sm">⋯</span></div>'
 '<div class="frow"><span class="in">Sezon <b>2026-2027</b>'+ic('down')+'</span><span class="btn sm">Filtre <b style="background:var(--p);color:#fff;padding:0 5px;border-radius:3px;font-size:10.5px">1</b></span></div>'
 '<div style="padding:8px 14px;display:flex;gap:6px;flex-wrap:wrap"><span class="chipx">Tip: Acord, Cerere ✕</span></div>')
P1='<div class="ph">'+top+cards(D)+'</div></div>'
sheet_actions=('<div class="dimm"></div><div class="sheet2"><div class="grab"></div><b style="font-size:15px">Maria Dumitrescu · Acord</b><div class="m" style="color:var(--mu);margin:2px 0 8px">Maria_Dumitrescu_Acord_2026-2027.pdf</div>'
 f'<div class="opt">{ic("eye")}Vezi</div><div class="opt">{ic("dl")}Descarcă</div><div class="opt">{ic("user")}Deschide fișa sportivului</div><div class="opt" style="border:0">{ic("check")}Selectează (pentru ZIP)</div></div>')
P2='<div class="ph">'+top+cards(D)+'</div>'+sheet_actions+'</div>'
sheet_f=('<div class="dimm"></div><div class="sheet2"><div class="grab"></div><b style="font-size:15px">Filtre</b>'
 '<div class="lb">Tip document</div><div class="ccb" style="margin-top:6px"><input type="checkbox" checked><span>Acord</span></div><div class="ccb" style="margin-top:6px"><input type="checkbox" checked><span>Cerere de adeziune</span></div><div class="ccb" style="margin-top:6px"><input type="checkbox"><span>Adeverință medicală</span></div>'
 '<div class="lb">Sursă</div><div class="ccb" style="margin-top:6px"><input type="checkbox"><span>Generat</span></div><div class="ccb" style="margin-top:6px"><input type="checkbox"><span>Încărcat</span></div>'
 '<div class="lb">Sortare</div><div class="cdd" style="margin-top:6px"><button class="cdd-t"><span class="cdd-v">Nume A-Z</span>'+ic('down')+'</button></div>'
 '<div style="display:flex;gap:8px;margin-top:16px"><span class="btn" style="flex:1;justify-content:center">Șterge</span><span class="btn pr" style="flex:2;justify-content:center">Arată 3 documente</span></div></div>')
P3='<div class="ph">'+top+cards(D)+'</div>'+sheet_f+'</div>'
# club docs
CL=[('Club','Statut ACS EduSport','Încărcat · 12 mai 2012'),('Club','Contract patinoar 2026-2027','Încărcat · 20 sep 2026 · expiră 31 mai 2027'),('Club','Regulament Școala de patinaj','Încărcat · 1 sep 2026')]
rowsC=''.join(f'<tr><td>{chk()}</td><td><span style="color:var(--mu)">Club</span></td><td><span class="dtyp"><span class="dic" style="background:#f0f1f4">{ic("file")}</span>{t}</span></td><td style="color:var(--t2)">Încărcat</td><td>—</td><td>{m.split(" · ",1)[1]}</td><td><div class="acts2"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></td></tr>' for _,t,m in CL)
tA=('<div style="overflow-x:auto"><table class="dt"><tr><th>'+chk()+'</th><th>Nume sportiv</th><th>Tip document</th><th>Sursă</th><th>Nr. înscriere</th><th>Actualizat</th><th></th></tr>'
 +''.join(f'<tr><td>{chk()}</td><td><b>{nm}</b></td><td><span class="dtyp"><span class="dic">{ic("file")}</span>{t}</span></td><td style="color:var(--t2)">{src}</td><td>{n}</td><td>{d}</td><td><div class="acts2"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></td></tr>' for n,nm,t,src,f,d in DOCS2[:3])
 +rowsC+'</table></div>')
WA=('<div class="win">'+headA+ptabs('docs')+f'<div class="tb"><span class="in srch">{ic("search")}Caută...</span><span class="fbtn">Tip document{ic("down")}</span><span class="fbtn act">Aparține de <b>2</b>{ic("down")}</span></div>'+tA+'</div>')
WB2=('<div class="win">'+headA+'<div class="ui-tabs" style="margin:0;padding:0 14px"><span class="ui-tab">Documente sportivi<span class="ui-tab-count">5</span></span><span class="ui-tab on">Documente club<span class="ui-tab-count">3</span></span><span class="ui-tab">Tipuri de documente<span class="ui-tab-count">6</span></span></div>'
 '<div style="overflow-x:auto"><table class="dt"><tr><th>'+chk()+'</th><th>Document</th><th>Tip</th><th>Actualizat</th><th>Valabil până</th><th></th></tr>'
 +''.join(f'<tr><td>{chk()}</td><td><span class="dtyp"><span class="dic" style="background:#f0f1f4">{ic("file")}</span><b>{t}</b></span></td><td>{"Contract" if "Contract" in t else "Act asociație" if "Statut" in t else "Regulament"}</td><td>{m.split(" · ")[1]}</td><td>{m.split("expiră ")[1] if "expiră" in m else "—"}</td><td><div class="acts2"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></td></tr>' for _,t,m in CL)+'</table></div></div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+'<div class="A"><h2>Documente: telefon și documente fără sportiv</h2><p class="note">Decis: taburi "Documente / Tipuri de documente". Date inventate.</p>'
 '<div class="sec">1. Pe telefon</div><p class="note">Tabelul devine o listă de carduri: tip, sportiv, dată, sursă. Filtrele și sortarea într-un panou de jos. Acțiunile unui document în meniul "⋯".</p>'
 '<div class="wcol"><div><p class="cap2">Lista</p>'+P1+'</div><div><p class="cap2">"Filtre"</p>'+P3+'</div><div><p class="cap2">"⋯" pe un document</p>'+P2+'</div></div>'
 '<div class="sec">2. Documente fără sportiv (ale clubului)</div><p class="note">Ex.: statutul asociației, contractul cu patinoarul, regulamentul. La fiecare tip alegem "Se atașează la: Sportiv / Club".</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','same-list','În aceeași listă, cu "Club" în coloana sportivului și filtrul "Aparține de: Sportivi / Club" (recomandat)',screen('documente',WA),'O singură listă și o singură căutare; filtrul le separă când trebuie.')
 +O('B','own-tab','Tab separat "Documente club"',screen('documente',WB2),'Separare clară; coloane potrivite pentru club (ex. valabil până). Trei taburi.')+'</div></div>')
open(OUTDM,'w').write(html)
