import sys,os
OUTDM3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_docmob2.py'), HERE+'/throw/dm4.html']
exec(open(sys.argv[0]).read())
mc3='''<style>.A .dic.chk{background:var(--p)}.A .dic.chk .ic{color:#fff;stroke:#fff;width:18px;height:18px}.A .dcard2.on{background:#f3f5fa}
.A .zbar2{position:absolute;left:0;right:0;bottom:0;background:#fff;border-top:1px solid var(--ln);box-shadow:0 -8px 24px rgba(14,26,60,.12);padding:12px 14px;z-index:4}.A .zbar2 .r1{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.A .zbar2 .g2x{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.A .tap{position:absolute;width:30px;height:30px;border-radius:50%;background:rgba(61,90,143,.25);border:2px solid rgba(61,90,143,.6)}</style>'''
ctl3=('<div class="ctl"><div class="g2x"><span class="c40 pr">'+ic('plus')+'Încarcă</span><span class="c40">'+ic('dl')+'Formulare goale'+ic('down')+'</span></div>'
 '<div class="g2x"><span class="c40 sel">Sezon 2026-2027'+ic('down')+'</span><span class="c40">Filtre <span class="n">1</span></span></div></div>')
def cards3(on=()):
  out=''
  for i,(t,n,m) in enumerate(D2):
    sel=i in on
    icon=f'<span class="dic chk">{ic("check")}</span>' if sel else f'<span class="dic">{ic("file")}</span>'
    acts='' if on else f'<div class="la"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div>'
    out+=f'<div class="dcard2{" on" if sel else ""}">{icon}<div><b>{t}</b><div>{n}</div><div class="m">{m}</div>{acts}</div></div>'
  return out
top3=('<div class="tbar">☰<b>Documente</b>'+ic('search')+'</div><div class="pw"><div class="ph-h"><h1>Documente</h1></div>'+tabs3('s')+ctl3
 +'<div style="padding:0 14px 10px;display:flex;gap:6px;flex-wrap:wrap"><span class="chipx">Tip: Acord, Cerere ✕</span></div>')
bar=lambda n:('<div class="zbar2"><div class="r1"><b>'+(str(n)+" selectat" if n==1 else str(n)+" selectate")+'</b><span class="lnk">Selectează toate (5)</span></div><div class="g2x"><span class="c40">Anulează</span><span class="c40 pr">'+ic('dl')+'Descarcă ZIP</span></div></div>')
R1='<div class="ph">'+top3+cards3()+'</div><span class="tap" style="left:27px;top:307px"></span></div>'
R2='<div class="ph">'+top3+cards3((0,))+'</div>'+bar(1)+'</div>'
R3='<div class="ph">'+top3+cards3((0,1))+'</div>'+bar(2)+'</div>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+'<div class="A"><h2>Selecție multiplă pe telefon, fără buton "Selectează"</h2><p class="note">Iconița documentului e și bifa: atingi iconița și documentul e selectat (ca în Gmail). Iconița își păstrează locul și mărimea, devine albastră cu bifă. Apare bara de jos. Atingerea lungă pe card face același lucru. Date inventate.</p>'
 '<div class="wcol"><div><p class="cap2">1. Atingi iconița</p>'+R1+'</div><div><p class="cap2">2. Primul selectat: apare bara de jos</p>'+R2+'</div><div><p class="cap2">3. Mai multe</p>'+R3+'</div></div>'
 '<ul class="note" style="padding-left:18px;margin-top:16px"><li>Sus: "Încarcă" și "Formulare goale" pe un rând, "Sezon" și "Filtre" pe altul; toate 40px.</li><li>Cât timp e ceva selectat, "Vezi / Descarcă" de pe carduri se ascund, ca să nu încurce; atingerea cardului bifează/debifează.</li><li>Bara de jos: numărul, "Selectează toate (5)" (tot ce e filtrat), "Anulează", "Descarcă ZIP".</li><li>Pe desktop rămân bifele din tabel; aceeași bară apare deasupra tabelului.</li></ul></div>')
open(OUTDM3,'w').write(html)
