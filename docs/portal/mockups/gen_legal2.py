import sys,os
OUTH=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_legal.py'), HERE+'/throw/v.html']
exec(open(sys.argv[0]).read())
fcss='''<style>.A .d2 .fb{display:grid;grid-template-columns:1fr 1fr;gap:18px;border-top:1px solid #c0c4ce;padding-top:8px;margin:10px 0 8px;text-align:left}
.A .d2 .kv{display:grid;grid-template-columns:auto 1fr;column-gap:8px;row-gap:1px;font-size:7.2px;line-height:1.5;align-content:start}
.A .d2 .kv dt{font-weight:700;color:#0e1a3c;white-space:nowrap}.A .d2 .kv dd{margin:0;color:#1f2430}
.A .d2 .kv .h{grid-column:1/-1;font-size:6.6px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6b6f7d;margin-bottom:2px}</style>'''
def kv(title,rows): return f'<dl class="kv"><span class="h">{title}</span>'+''.join(f'<dt>{a}</dt><dd>{b}</dd>' for a,b in rows)+'</dl>'
L=kv('Asociația',[('Sediul social:','str. Slt. Stanescu Gheorghe, nr. 1, bl. 213, sc. A, et. 10, ap. 42, sect. 2, Bucuresti'),('C.I.F.:','30321550'),('C.I.S.:','B/A2/00159/2012'),('nr. inreg. in Reg. Asoc. si Fundatiilor:','65/18.05.2012')])
def R(short): return kv('Cont și contact',[('CONT:','RO89 INGB 0000 9999 0318 6729, deschis la ING Bank, sucursala Gara de Nord'),('Telefon:','0723.623.712'),('E-mail:','edusporttrophy@gmail.com'),('Facebook:','facebook.com/EduSportClub' if short else 'www.facebook.com/EduSportClub'),('Web:','scoaladepatinaj.com' if short else 'http://www.scoaladepatinaj.com')])
def page(short):
  f=adez(True).replace(LEG,'')
  return f.replace('<div class="d2f" style="display:block">','<div class="d2f" style="display:block"><div class="fb">'+L+R(short)+'</div>')
foot=lambda short:'<div class="d2" style="min-height:0;padding:18px 40px"><div class="fb" style="margin:0;border:0;padding:0">'+L+R(short)+'</div></div>'
opts=('<div class="options opt3">'
 f'<div class="option" data-choice="exact" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> Etichetă + valoare aliniate, text exact</p>{foot(False)}<p class="note" style="margin-top:8px">Etichetele într-o coloană, valorile în alta, fiecare pe un rând. Linkurile rămân scrise ca acum.</p></div>'
 f'<div class="option" data-choice="short" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> La fel, cu linkurile scurtate</p>{foot(True)}<p class="note" style="margin-top:8px">"http://www." și "www." scoase din Web și Facebook. Adresele rămân aceleași, doar mai scurte de citit.</p></div></div>')
html=(css+d2css+xcss+lcss+gcss+fcss+'<div class="A"><h2>Subsolul cu 2 coloane: Contact mai ordonat</h2><p class="note">Fiecare coloană e o listă etichetă / valoare. Titlurile de coloană: "Asociația" și "Cont și contact".</p>'+opts
 +'<div class="sec">Pagina întreagă</div><div class="row2"><div><p class="cap2">A</p>'+page(False)+'</div><div><p class="cap2">B</p>'+page(True)+'</div></div></div>')
open(OUTH,'w').write(html)
