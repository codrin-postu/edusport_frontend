import sys,os
OUTDM4=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_docmob3.py'), HERE+'/throw/dm5.html']
exec(open(sys.argv[0]).read())
mc4='''<style>.A .dcard3{display:grid;grid-template-columns:20px 1fr;gap:12px;padding:12px 14px;border-bottom:1px solid var(--ln)}.A .dcard3{align-items:start}.A .dcard3 .ccb{align-self:start;margin-top:1px;display:block;line-height:0}.A .dcard3 .ccb input{width:18px;height:18px}.A .dcard3 b{display:block}.A .dcard3 .m{color:var(--mu);font-size:12px;margin-top:2px}.A .dcard3 .la{display:flex;gap:16px;margin-top:8px}.A .dcard3.on{background:#f3f5fa}</style>'''
def cards4(on=()):
  return ''.join(f'<div class="dcard3{" on" if i in on else ""}"><label class="ccb"><input type="checkbox" {"checked" if i in on else ""}></label><div><b>{t}</b><div>{n}</div><div class="m">{m}</div><div class="la"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></div></div>' for i,(t,n,m) in enumerate(D2))
T1='<div class="ph">'+top3+cards4()+'</div></div>'
T2='<div class="ph">'+top3+cards4((0,1))+'</div>'+bar(2)+'</div>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+'<div class="A"><h2>Bifă în loc de iconiță</h2><p class="note">Fără iconița de fișier (toate erau la fel). În stânga fiecărui card e direct bifa, aliniată cu titlul; e clar că servește la selecție. "Vezi / Descarcă" rămân pe card. Date inventate.</p>'
 '<div class="wcol"><div><p class="cap2">Nimic selectat</p>'+T1+'</div><div><p class="cap2">2 selectate: apare bara de jos</p>'+T2+'</div></div>'
 '<p class="note" style="margin-top:14px">Pe desktop, la fel: coloana de bife rămâne, iar iconița din coloana "Tip document" se scoate, ca să fie consecvent.</p></div>')
open(OUTDM4,'w').write(html)
