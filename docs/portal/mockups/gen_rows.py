import sys,os
OUTR=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_quick.py'), HERE+'/throw/rq.html']
exec(open(sys.argv[0]).read())
def tb(head,cell):
  h='<tr><th>Nr.</th><th>Trimis la</th>'+head+'<th>Vârstă</th><th>Status</th><th>Completat de</th></tr>'
  r=''.join(f'<tr><td style="white-space:nowrap"><b>{n}</b></td><td style="white-space:nowrap">{d}</td>{cell(c,e)}<td>{a} ani</td><td><span class="bd {k}">{s_}</span></td><td style="white-space:nowrap">{p}</td></tr>' for n,d,c,a,k,s_,p,e,_ in rowsL)
  return '<div class="win" style="max-width:900px"><table class="eq">'+h+r+'</table></div>'
inl=lambda c,e:f'<td style="white-space:nowrap"><b>{c}</b>'+(f'<span class="mm ex" style="display:inline-flex;margin:0 0 0 8px;vertical-align:middle">{ic("user")}Sportiv existent</span>' if e else '')+'</td>'
icn=lambda c,e:f'<td style="white-space:nowrap"><b>{c}</b>'+(f' <span class="mi2 ex" style="vertical-align:middle;margin-left:4px" title="Sportiv existent">{ic("user")}</span>' if e else '')+'</td>'
colh='<th>Nume copil</th><th>Sportiv</th>'
col=lambda c,e:f'<td style="white-space:nowrap"><b>{c}</b></td><td style="white-space:nowrap">'+(f'<span class="mm ex" style="margin:0">{ic("user")}Existent</span>' if e else '<span style="color:var(--mu)">Nou</span>')+'</td>'
tight=lambda c,e:f'<td style="white-space:nowrap;line-height:1.2"><b>{c}</b>'+(f'<span class="mm ex" style="margin-top:1px;line-height:1.2">{ic("user")}Sportiv existent</span>' if e else '')+'</td>'
two=lambda c,e:f'<td style="white-space:nowrap"><b>{c}</b>'+(f'<span class="mm ex">{ic("user")}Sportiv existent</span>' if e else '<span class="mm" style="color:var(--mu)">Sportiv nou</span>')+'</td>'
x3='<style>.A table.eq td{height:50px;padding-top:0;padding-bottom:0}.A .mi2{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:3px}.A .mi2 .ic{width:13px;height:13px}.A .mi2.ex{background:#e9f2f9;color:var(--inf)}</style>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+'<div class="A"><h2>Rânduri de aceeași înălțime</h2><p class="note">Toate rândurile au un singur rând de text (sau toate două). Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('E','under-tight','Sub nume, strâns: toate rândurile au aceeași înălțime (recomandat)',tb('<th>Nume copil</th>',tight),'Ca la început, dar rândul are înălțime fixă și eticheta stă lipită de nume, deci nu mai crește rândul.')
 +O('A','inline','Eticheta pe același rând, după nume',tb('<th>Nume copil</th>',inl),'Se citește direct; numele lungi împing eticheta spre dreapta.')
 +O('B','column','Coloană separată "Sportiv": Existent / Nou',tb(colh,col),'Aliniat, se poate sorta și filtra după coloană; fiecare rând are o valoare.')
 +O('C','icon','Doar iconiță după nume, text la hover',tb('<th>Nume copil</th>',icn),'Cel mai compact; mai puțin clar.')
 +O('D','two-lines','Toate rândurile pe două linii: "Sportiv existent" / "Sportiv nou"',tb('<th>Nume copil</th>',two),'Înălțime egală, dar listele devin mai lungi.')+'</div></div>')
open(OUTR,'w').write(html)
