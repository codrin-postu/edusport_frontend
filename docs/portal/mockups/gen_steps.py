import sys
OUT=sys.argv[1]; sys.argv=[sys.argv[0], sys.argv[2]]
exec(open(sys.argv[0].replace('gen_steps.py','gen_form.py')).read())
def card(n,total,title,qs,last=False):
  pct=int(n/total*100); btn='Trimite înscrierea' if last else 'Continuă'
  return (f'<div class="page" style="padding-top:0"><div class="fcard"><div class="si"><div class="top"><span class="t">{title}</span><span class="c">Pasul {n} din {total}</span></div><div class="bar"><i style="width:{pct}%"></i></div></div>'
   f'<div class="qs">{qs}</div><div class="nav"><span class="back">{"" if n==1 else "Înapoi"}</span><span class="lcta"><span class="face">{btn}</span></span></div></div></div>')
who=(inp('Adresă de e-mail *','adresa@exemplu.ro',True)+inp('Numele și prenumele persoanei care completează formularul *','Mihaela Dumitrescu')+sel('Calitatea față de sportiv: *','Părinte')+inp('Telefon de contact *','+40 7xx xxx xxx',True))
kid=(inp('Numele și prenumele copilului *','Maria Dumitrescu')+inp('Data nașterii copilului *','14.03.2014')+inp('Înălțimea copilului (cm) *','142')+inp('Măsura bluză *','S')+sel('Sezonul trecut fiul/fiica dvs. a participat la cursurile ACS EduSport? *','Începători')+ta('Nivel de experiență / Elemente cunoscute *','Patinaj înainte, frânare').replace('<label class="lbl">Nivel de experiență / Elemente cunoscute *</label>','<label class="lbl">Nivel de experiență / Elemente cunoscute *</label><p class="help">Dacă este prima participare, menționați dacă a mai luat lecții. Dacă a mai fost înscris la ACS EduSport, completați cu \'Nu este cazul\'.</p>')+ta('Așteptări de la cursurile de patinaj *','Să învețe piruete'))
sub=(cal+sel('Doriți înscrierea ca membru A.C.S. EduSport pentru tarife preferențiale? *','Da, doresc să devin membru')+mbox+sel('La primul modul doriți să achiziționați: *','Abonament 8 ședințe'))
fin=(sel('De unde ați aflat de cursurile noastre? *','Recomandare')+cb('<b>Consimțământ GDPR:</b> Confirm citirea documentului <span class="link">Politica de Confidențialitate</span> și sunt de acord cu prelucrarea datelor.')+cb('<b>Acord Regulament:</b> Confirm că am citit, înțeles și acceptat condițiile prezentate în <span class="link">Regulamentul Școlii de Patinaj</span>.'))
subN=(cal+sel('Doriți înscrierea ca membru A.C.S. EduSport pentru tarife preferențiale? *','Nu, optez pentru tarife neafiliați')+nbox+ups+sel('La primul modul doriți să achiziționați: *','Abonament 8 ședințe grup'))
sep='<div style="height:1.5px;background:var(--line-subtle);margin:4px 0"></div>'
def opt(letter,choice,title,desc,cards):
  return (f'<div class="option" data-choice="{choice}" onclick="toggleSelect(this)" style="display:block;padding:0;border:0;background:none;margin-bottom:36px">'
   f'<h3 style="font:700 17px Inter,sans-serif;margin:0 0 4px"><span class="letter" style="display:inline-grid">{letter}</span> {title}</h3><p class="note">{desc}</p><div class="row">{cards}</div></div>')
cap=lambda t:f'<p class="cap">{t}</p>'

done=done.replace('<div><p class="cap">După trimitere</p><div class="page">','<div><p class="cap">După trimitere</p><div class="page" style="padding-top:0">').replace('<div class="eyebrow">Sezonul 2026-2027</div><div class="h">Înscrie-ți copilul</div><div class="fcard">','<div class="fcard" style="margin-top:0">')
css=css.replace('.F .box .pr{display:flex;justify-content:space-between;','.F .box .pr{display:flex;justify-content:space-between;gap:12px;').replace('.F .box s{','.F .box .pr b,.F .box .pr>span:last-child{white-space:nowrap}.F .box s{')
html=(css+'<div class="F"><h2>Formular în 2 pași: Date înscriere, Finalizare înscriere</h2><p class="note">Pasul 1 are toate datele (persoana care completează + copilul). Pasul 2 are programul, abonamentul, tarifele și acordurile. Tarifele, taxa de membru și sezonul vin din panou (Cursuri / Prețuri și Setări site), deci se schimbă singure când le modificați acolo. Mesajul de economie se calculează din aceleași prețuri.</p><div class="row">'
 +'<div>'+cap('Pasul 1')+card(1,2,'Date înscriere',who+sep+kid)+'</div><div>'+cap('Pasul 2 (membru)')+card(2,2,'Finalizare înscriere',sub+sep+fin,True)+'</div><div>'+cap('Pasul 2 (neafiliat)')+card(2,2,'Finalizare înscriere',subN+sep+fin,True)+'</div>'+done+'</div></div>')
open(OUT,'w').write(html)
