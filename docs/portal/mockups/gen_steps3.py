import sys,os
OUTS=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_steps.py'), HERE+'/throw/y.html', HERE+'/throw']
exec(open(sys.argv[0]).read())
abon=(cal+sel('Doriți înscrierea ca membru A.C.S. EduSport pentru tarife preferențiale? *','Da, doresc să devin membru')+mbox+sel('La primul modul doriți să achiziționați: *','Abonament 8 ședințe grup'))
def opt(letter,choice,title,desc,cards):
  return (f'<div class="option" data-choice="{choice}" onclick="toggleSelect(this)" style="display:block;padding:0;border:0;background:none;margin-bottom:36px">'
   f'<h3 style="font:700 17px Inter,sans-serif;margin:0 0 4px"><span class="letter" style="display:inline-grid">{letter}</span> {title}</h3><p class="note">{desc}</p><div class="row">{cards}</div></div>')
c=lambda t,body:'<div>'+cap(t)+body+'</div>'
B=opt('A','parent-child-final','Date părinte / Date copil / Finalizare înscriere (recomandat)','Pașii sunt mai echilibrați: 4 câmpuri, apoi 7, apoi abonamentul și acordurile. Primul pas e foarte scurt, deci părintele începe ușor.',
  c('1. Date părinte',card(1,3,'Date părinte',who))+c('2. Date copil',card(2,3,'Date copil',kid))+c('3. Finalizare înscriere',card(3,3,'Finalizare înscriere',abon+sep+fin,True)))
A=opt('B','data-abon-final','Date înscriere / Abonament / Finalizare înscriere','Datele rămân împreună (11 câmpuri), abonamentul are pasul lui, iar la final rămân doar sursa și cele două acorduri.',
  c('1. Date înscriere',card(1,3,'Date înscriere',who+sep+kid))+c('2. Abonament',card(2,3,'Abonament',abon))+c('3. Finalizare înscriere',card(3,3,'Finalizare înscriere',fin,True)))
html=(css+'<div class="F"><h2>Formular în 3 pași</h2><p class="note">Aceleași întrebări, aceleași componente, prețuri din panou. Două moduri de a împărți în 3; alege A sau B.</p><div class="options">'+B+A+'</div></div>')
open(OUTS,'w').write(html)
