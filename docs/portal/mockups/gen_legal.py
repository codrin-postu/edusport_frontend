import sys,os
OUTG=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_logo.py'), HERE+'/throw/w.html']
exec(open(sys.argv[0]).read())
G=[('Sediul social','str. Slt. Stanescu Gheorghe, nr. 1, bl. 213, sc. A, et. 10, ap. 42, sect. 2, Bucuresti'),
   ('Date de înregistrare','C.I.F.: 30321550<br>C.I.S.: B/A2/00159/2012<br>nr. inreg. in Reg. Asoc. si Fundatiilor: 65/18.05.2012'),
   ('Cont','RO89 INGB 0000 9999 0318 6729<br>deschis la ING Bank, sucursala Gara de Nord'),
   ('Contact','Telefon: 0723.623.712<br>E-mail: edusporttrophy@gmail.com<br>Facebook: www.facebook.com/EduSportClub<br>Web: http://www.scoaladepatinaj.com')]
gcss='''<style>.A .d2 .lg4{display:grid;grid-template-columns:1.1fr 1.15fr 1fr 1.15fr;gap:12px;margin:10px 0 0;padding-bottom:10px;border-bottom:1px solid #c0c4ce;text-align:left}
.A .d2 .lg4 small,.A .d2 .lf small{display:block;font-size:6.6px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6b6f7d;margin-bottom:2px}
.A .d2 .lg4 div,.A .d2 .lf div{font-size:7.2px;line-height:1.45;color:#1f2430}
.A .d2 .lf{display:grid;grid-template-columns:1.1fr 1.15fr 1fr 1.15fr;gap:12px;text-align:left;border-top:1px solid #c0c4ce;padding-top:8px;margin-top:10px}
.A .d2 .l2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:10px 0 0;padding-bottom:10px;border-bottom:1px solid #c0c4ce;text-align:left;font-size:7.2px;line-height:1.55}
.A .d2 .l2 b{color:#0e1a3c}</style>'''
grid=lambda cls:f'<div class="{cls}">'+''.join(f'<div><small>{a}</small><div>{b}</div></div>' for a,b in G)+'</div>'
head=f'<div class="d2h">{wm}{meta}</div>'
two=('<div class="l2"><div><b>Sediul social:</b> str. Slt. Stanescu Gheorghe, nr. 1, bl. 213, sc. A, et. 10, ap. 42, sect. 2, Bucuresti<br><b>C.I.F.:</b> 30321550 · <b>C.I.S.:</b> B/A2/00159/2012<br><b>nr. inreg. in Reg. Asoc. si Fundatiilor:</b> 65/18.05.2012</div>'
 '<div><b>CONT:</b> RO89 INGB 0000 9999 0318 6729, <b>deschis</b> la ING Bank, <b>sucursala</b> Gara de Nord<br><b>Telefon:</b> 0723.623.712 · <b>E-mail:</b> edusporttrophy@gmail.com<br><b>Facebook:</b> www.facebook.com/EduSportClub · <b>Web:</b> http://www.scoaladepatinaj.com</div></div>')
hdrA=top(head,grid('lg4'))
hdrB=top(head,two)
full=adez(True)
fullC=full.replace(LEG,'').replace('<div class="d2f" style="display:block">','<div class="d2f" style="display:block">'+grid('lf').replace('class="lf"','class="lf" style="margin-bottom:8px"'))
fullA=full.replace(LEG,grid('lg4'))
opts=('<div class="options opt3">'
 f'<div class="option" data-choice="grid4" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> 4 coloane cu titluri, sub antet</p>{hdrA}<p class="note" style="margin-top:8px">Sediu / Date de înregistrare / Cont / Contact. Se citește dintr-o privire; aceleași date, doar grupate.</p></div>'
 f'<div class="option" data-choice="two" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> 2 coloane: identitate | bani și contact</p>{hdrB}<p class="note" style="margin-top:8px">Mai aproape de originalul de hârtie, dar rânduri mai scurte.</p></div>'
 f'<div class="option" data-choice="footer" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">C</span> Mutate jos, în subsol (ca pe hârtie cu antet)</p>'+top(head)+'<p class="note" style="margin-top:8px">Sus rămân doar EDUSPORT, sezonul și nr. înscriere, apoi direct titlul. Datele asociației stau în subsol, în 4 coloane, lângă textul legal. Vezi pagina întreagă mai jos.</p></div></div>')
html=(css+d2css+xcss+lcss+gcss+'<div class="A"><h2>Datele asociației din antet: cum le organizăm</h2><p class="note">Textul rămâne același; se schimbă doar așezarea. Acum e un bloc de 3 rânduri lungi, greu de citit.</p>'
 '<p class="cap2">Acum</p>'+top(head,LEG)+'<div class="sec">Variante</div>'+opts
 +'<div class="sec">Pagina întreagă: A și C</div><div class="row2"><div><p class="cap2">A, în antet</p>'+fullA+'</div><div><p class="cap2">C, în subsol</p>'+fullC+'</div></div></div>')
open(OUTG,'w').write(html)
