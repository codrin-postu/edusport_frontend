import sys,os
OUTW2=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_words.py'), HERE+'/throw/w3.html']
exec(open(sys.argv[0]).read())
def tbl1(lab_fn):
  rows=''
  for n,d,c,a,k,s,pp,m,info in R:
    lab=lab_fn(m,info,c)
    rows+=f'<tr><td style="white-space:nowrap"><b>{n}</b></td><td style="white-space:nowrap"><b>{c}</b>{lab}</td><td>{a} ani</td><td><span class="bd {k}">{s}</span></td><td>{pp}</td></tr>'
  return '<div class="win" style="max-width:820px"><div class="tb" style="gap:6px"><span class="fbtn">Status'+ic('down')+'</span><span class="fbtn">Posibil în club'+ic('down')+'</span></div><table><tr><th>Nr.</th><th>Nume copil</th><th>Vârstă</th><th>Status</th><th>Completat de</th></tr>'+rows+'</table></div>'
who={'ex':'Maria Dumitrescu, Primii Pași 2025-2026','pr':'Sara Ilie, Avansați Silver 2025-2026'}
A1=lambda m,info,c:f'<span class="mm ex">{ic("user")}Posibil în club</span>' if m else ''
B1=lambda m,info,c:f'<span class="mm ex">{ic("user")}Posibil în club · {(c+", "+info.replace(", "," ")) if m=="ex" else info.replace(", "," ",1).replace(" Avansați",", Avansați")}</span>' if m else ''
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+x2+'<div class="A"><h2>O singură stare: "Posibil în club"</h2><p class="note">Orice potrivire (sigură sau probabilă) arată la fel. Admin verifică oricum la confirmare, deci nu mai trebuie două culori și două cuvinte. Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','short','Doar eticheta',tbl1(A1),'Cel mai simplu. Cu cine seamănă afli în panou.')
 +O('B','detail','Eticheta + cu cine seamănă (recomandat)',tbl1(B1),'Vezi direct pe cine a găsit sistemul și unde a fost anul trecut.')+'</div>'
 '<div class="sec">Ce se schimbă în rest</div><ul class="note" style="padding-left:18px"><li>Filtrul: "Posibil în club: Da / Nu".</li><li>În fereastra de confirmare: același card al sportivului găsit, cu "Sportiv existent / Alt sportiv".</li><li>"Sportiv existent" e ales din start doar când numele și data nașterii sunt identice; altfel nimic nu e ales și admin trebuie să aleagă. Admin nu vede diferența de "siguranță", doar alegerea făcută sau nu.</li></ul></div>')
open(OUTW2,'w').write(html)
