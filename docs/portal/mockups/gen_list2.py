import sys,os
OUTY=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_match.py'), HERE+'/throw/mx.html']
exec(open(sys.argv[0]).read())
R=[('2026-0142','3 oct 2026','Maria Dumitrescu',12,'nw','Nou','Mihaela Dumitrescu','ex','Primii Pași, 2025-2026'),('2026-0141','2 oct 2026','Andrei Popescu',10,'inf','Contactat','Ioana Popescu','',''),('2026-0140','1 oct 2026','Sara-Maria Ilie',11,'nw','Nou','Dan Ilie','pr','Sara Ilie, Avansați Silver 2025-2026'),('2026-0139','30 sep 2026','David Neagu',10,'ok','Confirmat','Ana Neagu','ex','Intermediari Bronze, 2025-2026'),('2026-0138','29 sep 2026','Ilinca Matei',7,'nw','Nou','Sorin Matei','','')]
ex=lambda t:f'<span class="mm ex">{ic("user")}Sportiv existent</span>'
pr=lambda t:f'<span class="mm pr">{ic("user")}Posibil existent</span>'
def tbl(variant):
  head='<tr><th>Nr.</th><th>Trimis la</th><th class="srt">Nume copil<span>↕</span></th><th class="srt">Vârstă<span>↕</span></th><th>Status</th><th>Completat de</th></tr>'
  rows=''
  for n,d,c,a,k,s,p,m,info in R:
    if variant=='A': name=f'<b>{c}</b>'+(ex(info) if m=='ex' else pr(info) if m=='pr' else '')
    else:
      icon=f'<span class="mi2 {m}" title="{"Sportiv existent: " if m=="ex" else "Posibil existent: "}{info}">{ic("user")}</span>' if m else ''
      name=f'<span style="display:inline-flex;align-items:center;gap:6px"><b>{c}</b>{icon}</span>'
    rows+=f'<tr><td><b>{n}</b></td><td>{d}</td><td>{name}</td><td>{a} ani</td><td><span class="bd {k}">{s}</span></td><td>{p}</td></tr>'
  return '<div class="win" style="max-width:860px"><div class="tb" style="gap:6px"><span class="fbtn">Status'+ic('down')+'</span><span class="fbtn">În club'+ic('down')+'</span><span class="fbtn">Membru A.C.S.'+ic('down')+'</span></div><table>'+head+rows+'</table></div>'
tip=('<div style="position:relative;display:inline-block;margin-top:10px"><div class="win" style="padding:8px 12px;font-size:12px;box-shadow:0 8px 20px rgba(0,0,0,.15)"><b>Sportiv existent</b><br>Primii Pași, 2025-2026</div></div>')
x2='<style>.A .mi2{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:3px}.A .mi2 .ic{width:13px;height:13px}.A .mi2.ex{background:#e9f2f9;color:var(--inf)}.A .mi2.pr{background:#fdf3e1;color:#8a4b06}</style>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+x2+'<div class="A"><h2>Lista Înscrieri: copil existent + vârstă</h2><p class="note">Fără data nașterii sub nume (rămâne în panou). Coloană nouă "Vârstă", sortabilă. Filtrul "În club": Existent / Posibil / Nou. Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','text','Text sub nume (recomandat)',tbl('A'),'Doar unde contează: "Sportiv existent" (albastru) sau "Posibil existent" (portocaliu). Cei noi au un singur rând.')
 +O('B','icon','Iconiță lângă nume, text la hover',tbl('B')+'<p class="cap2" style="margin-top:10px">La hover pe iconiță:</p>'+tip,'Cel mai compact; toate rândurile au aceeași înălțime. Mai puțin clar pentru cine nu știe ce înseamnă iconița.')+'</div></div>')
open(OUTY,'w').write(html)
