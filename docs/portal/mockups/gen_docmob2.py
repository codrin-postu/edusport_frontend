import sys,os
OUTDM2=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_docmob.py'), HERE+'/throw/dm3.html']
exec(open(sys.argv[0]).read())
mc2='''<style>.A .ph .ctl{display:grid;gap:8px;padding:12px 14px}.A .ph .ctl .g2x{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.A .ph .c40{height:40px;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--ln2);border-radius:4px;background:#fff;font-weight:600;font-size:13px;color:var(--tx);padding:0 12px;white-space:nowrap}.A .ph .c40.pr{background:var(--p);border-color:var(--p);color:#fff}.A .ph .c40.sel{justify-content:space-between;font-weight:500}.A .ph .c40 .ic{width:15px;height:15px}.A .ph .c40 .n{background:var(--p);color:#fff;font-size:10.5px;padding:0 5px;border-radius:3px}
.A .dcard2{padding:12px 14px;border-bottom:1px solid var(--ln);display:grid;grid-template-columns:36px 1fr;gap:10px}.A .dcard2 .dic{width:36px;height:36px}.A .dcard2 b{display:block}.A .dcard2 .m{color:var(--mu);font-size:12px;margin-top:2px}.A .dcard2 .la{display:flex;gap:16px;margin-top:8px}.A .dcard2.selm{grid-template-columns:22px 36px 1fr}.A .dcard2.on{background:#f3f5fa}
.A .zbar{position:absolute;left:0;right:0;bottom:0;background:#131c3d;color:#fff;display:flex;align-items:center;gap:10px;padding:12px 14px;z-index:4}.A .zbar b{flex:1}.A .zbar .c40{height:36px;border-color:#fff;background:#fff;color:var(--p)}</style>'''
tabs3=lambda on:'<div class="ui-tabs" style="margin:0;padding:0 8px">'+''.join(f'<span class="ui-tab{" on" if k==on else ""}">{l}<span class="ui-tab-count">{c}</span></span>' for k,l,c in [('s','Sportivi',5),('c','Club',3),('t','Tipuri',6)])+'</div>'
ctl=lambda sel=False:('<div class="ctl"><span class="c40 pr">'+ic('plus')+'Încarcă document</span><div class="g2x"><span class="c40">'+ic('dl')+'Formulare goale'+ic('down')+'</span><span class="c40">'+ic('check')+('Gata' if sel else 'Selectează')+'</span></div>'
 '<div class="g2x"><span class="c40 sel">Sezon 2026-2027'+ic('down')+'</span><span class="c40">Filtre <span class="n">1</span></span></div></div>')
D2=[('Acord','Maria Dumitrescu','5 oct 2026 · Generat · 2026-0142'),('Cerere de adeziune','Maria Dumitrescu','3 oct 2026 · Generat · 2026-0142'),('Adeverință medicală','Maria Dumitrescu','4 oct 2026 · Încărcat'),('Acord','Andrei Popescu','2 oct 2026 · Generat · 2026-0141')]
def cards2(selm=False,on=()):
  out=''
  for i,(t,n,m) in enumerate(D2):
    cbx=f'<label class="ccb" style="margin-top:8px"><input type="checkbox" {"checked" if i in on else ""}></label>' if selm else ''
    acts='' if selm else f'<div class="la"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div>'
    out+=f'<div class="dcard2{" selm" if selm else ""}{" on" if i in on else ""}">{cbx}<span class="dic">{ic("file")}</span><div><b>{t}</b><div>{n}</div><div class="m">{m}</div>{acts}</div></div>'
  return out
top2=lambda sel=False:('<div class="tbar">☰<b>Documente</b>'+ic('search')+'</div><div class="pw"><div class="ph-h"><h1>Documente</h1></div>'+tabs3('s')+ctl(sel)
 +'<div style="padding:0 14px 10px;display:flex;gap:6px;flex-wrap:wrap"><span class="chipx">Tip: Acord, Cerere ✕</span></div>')
Q1='<div class="ph">'+top2()+cards2()+'</div></div>'
Q2='<div class="ph">'+top2(True)+cards2(True,(0,1))+'</div><div class="zbar"><b>2 selectate</b><span class="c40">'+ic('dl')+'Descarcă ZIP</span></div></div>'
CL2=[('Statut ACS EduSport','Act asociație · 12 mai 2012'),('Contract patinoar 2026-2027','Contract · valabil până la 31 mai 2027'),('Regulament Școala de patinaj','Regulament · 1 sep 2026')]
Q3=('<div class="ph"><div class="tbar">☰<b>Documente</b>'+ic('search')+'</div><div class="pw"><div class="ph-h"><h1>Documente</h1></div>'+tabs3('c')
 +'<div class="ctl"><span class="c40 pr">'+ic('plus')+'Încarcă document</span><div class="g2x"><span class="c40">'+ic('check')+'Selectează</span><span class="c40">Filtre</span></div></div>'
 +''.join(f'<div class="dcard2"><span class="dic" style="background:#f0f1f4">{ic("file")}</span><div><b>{t}</b><div class="m">{m}</div><div class="la"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></div></div>' for t,m in CL2)+'</div></div>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+'<div class="A"><h2>Documente pe telefon, corectat</h2><p class="note">Toate butoanele și câmpurile au aceeași înălțime (40px). Niciun "⋯": fiecare acțiune are nume. Trei taburi (decis): Sportivi / Club / Tipuri. Date inventate.</p>'
 '<div class="wcol"><div><p class="cap2">Documente sportivi</p>'+Q1+'</div><div><p class="cap2">"Selectează" pentru ZIP</p>'+Q2+'</div><div><p class="cap2">Documente club</p>'+Q3+'</div></div>'
 '<ul class="note" style="padding-left:18px;margin-top:16px"><li>Sus: "Încarcă document" pe toată lățimea; dedesubt "Formulare goale" și "Selectează" (în loc de "⋯").</li><li>Pe fiecare card: "Vezi" și "Descarcă" scrise, nu ascunse într-un meniu.</li><li>"Selectează" pune bife pe carduri și o bară jos cu "Descarcă ZIP"; butonul devine "Gata".</li><li>Pe desktop "ZIP sezon" rămâne buton separat sus.</li></ul></div>')
open(OUTDM2,'w').write(html)
