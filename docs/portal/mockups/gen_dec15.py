import sys,os
OUTD=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
# form styles
sys.argv=[os.path.join(HERE,'gen_steps.py'), HERE+'/throw/q.html', HERE+'/throw']
exec(open(sys.argv[0]).read())
FCSS=css
# admin styles + sheet helper
sys.argv=[os.path.join(HERE,'gen_flow3.py'), HERE+'/throw/p.html']
exec(open(sys.argv[0]).read().replace("OUT3=sys.argv[1]","OUT3=HERE+'/throw/p.html'"))
ACSS=css+x_css
dc='''<style>.Q{font:14px/1.5 Inter,sans-serif;color:#1b1d22}.Q .qh{font:700 20px Inter,sans-serif;margin:44px 0 4px;padding-top:12px;border-top:3px solid #131c3d}.Q .qn{color:#4b5263;max-width:1100px;margin:4px 0 12px;font-size:13.5px}
.Q .o2{display:flex!important;flex-direction:row!important;gap:28px;flex-wrap:wrap;align-items:flex-start}.Q .o2>.option{display:block;padding:0;border:0;background:none;max-width:560px}
.Q .ot{font-weight:700;margin:0 0 6px}.Q .chip{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#666c7c;background:#fafbfd;border:1px solid #e0e2e8;padding:8px 10px;margin:0 6px 6px 0}
.Q .doc{background:#fff;border:1px solid #c9ccd4;padding:14px 16px;font-size:12.5px;line-height:1.6;max-width:540px}.Q .old{background:#fdecea;text-decoration:line-through;color:#8a2a22;padding:0 2px}.Q .new{background:#e7f3ec;color:#1f7a4d;font-weight:600;padding:0 2px}
.Q table.tw{border-collapse:collapse;font-size:13px}.Q table.tw td,.Q table.tw th{border:1px solid #e0e2e8;padding:6px 10px;text-align:left}.Q table.tw th{background:#fafbfd;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#666c7c}</style>'''
opt=lambda L,ch,t,body,note='',w='':f'<div class="option" data-choice="{ch}" onclick="toggleSelect(this)" style="{w}"><p class="ot"><span class="letter" style="display:inline-grid">{L}</span> {t}</p>{body}{f"<p class=qn style=margin-top:8px>{note}</p>" if note else ""}</div>'
# 1 sheet
q1=('<div class="qh">1. Google Sheet: coloanele tabului 2026-2027</div><p class="qn">Formularul nou are alte întrebări decât cel vechi. Tabul fiecărui sezon arată doar întrebările lui, sau toate taburile au aceleași coloane?</p><div class="A">'+q2+'</div>')
# 2 naming
def heads(lbl): return ''.join(f'<span class="chip">{c}</span>' for c in ['Nr.','Trimis la','Nume copil','Status',lbl,'La primul modul'])
q2b=('<div class="qh">2. "Membru A.C.S." în CMS și în Sheet</div><p class="qn">În e-mail scrie deja "Membru EduSport". Întrebarea din formular rămâne cu textul ei ("Doriți înscrierea ca membru A.C.S. EduSport..."), oricum.</p><div class="options o2">'
 +opt('A','rename','Redenumim în "Membru EduSport" (recomandat)','<div>'+heads('Membru EduSport')+'</div>','Același nume peste tot: CMS, Sheet, e-mail.')
 +opt('B','keep','Păstrăm "Membru A.C.S."','<div>'+heads('Membru A.C.S.')+'</div>','Ca în formularul ei.')+'</div>')
# 3 laptop
top=lambda line:('<div class="F"><div class="page" style="padding-bottom:20px"><div class="eyebrow">Sezonul 2026-2027</div><div class="h">Înscrie-ți copilul</div><div class="bsm">Completează pașii de mai jos. Vom confirma înscrierea în cel mai scurt timp.</div>'
 +('<div class="bsm" style="margin-top:10px;font-weight:600;color:var(--primary)">Vă recomandăm să faceți înscrierea de pe laptop/desktop.</div>' if line else '')+'</div></div>')
q3=('<div class="qh">3. "Va recomandam sa faceti inscrierea de pe laptop/desktop"</div><p class="qn">Rândul de sub titlu din formularul ei. Formularul nostru e făcut și pentru telefon (un câmp pe rând, butoane mari).</p><div class="options o2">'
 +opt('A','drop','Îl scoatem (recomandat)',top(False),'Majoritatea părinților intră de pe telefon; mesajul i-ar face să renunțe.')
 +opt('B','keep','Îl păstrăm',top(True))+'</div>')
# 4 calitate
selbox=lambda opts:'<div class="F"><div class="page" style="padding:16px 20px"><label class="lbl">Calitatea față de sportiv: *</label><div style="border:1.5px solid var(--line);background:#fff">'+''.join(f'<div style="padding:10px 16px;font-size:14px;border-top:{"0" if i==0 else "1px solid var(--line-subtle)"};{"font-weight:700;background:#e7f3ec" if "Persoana" in o else ""}">{o}</div>' for i,o in enumerate(opts))+'</div></div></div>'
q4=('<div class="qh">4. "Calitatea față de sportiv": adăugăm "Persoana proprie"?</div><p class="qn">Azi, în formularul ei: Părinte, Tutore Legal, Alta (Vă rugăm specificați). Școala are și grupa <b>Adulți</b>, unde adultul se înscrie singur.</p><div class="options o2">'
 +opt('A','keep','Rămâne ca acum (recomandat pentru moment)',selbox(['Părinte','Tutore Legal','Alta (Vă rugăm specificați)']),'Adultul alege "Alta" și scrie "Eu" sau "Sportivul". Totul rămâne ca în script.')
 +opt('B','self','Adăugăm "Persoana proprie (sportiv adult)"',selbox(['Părinte','Tutore Legal','Persoana proprie (sportiv adult)','Alta (Vă rugăm specificați)']),'Mai clar pentru adulți. <b>Atenție:</b> Acordul spune "în calitate de ... al copilului ..., nascut la data de ..." și "declar că am acordul expres al celuilalt părinte"; pentru un adult textul nu se potrivește, deci clubul ar trebui să aibă un text de acord pentru adulți.')+'</div>')
# 5 typos
q5=('<div class="qh">5. Greșelile din textul legal al Acordului</div><p class="qn">Textul e al clubului; schimbăm doar dacă ei sunt de acord. Sensul nu se schimbă, doar scrierea.</p><div class="options o2">'
 +opt('A','keep','Păstrăm exact textul de acum','<div class="doc">... al copilului Maria Dumitrescu, <b>nascut</b> la data de 14.03.2014, doresc ca Maria Dumitrescu <b>sa particip/e</b> la cursurile organizate de <b>Asociatia</b> Clubul Sportiv EduSport. ... Regulamentele se completează, <b>dupa caz</b>, cu prevederile legale în vigoare. ... <b>Semnatura</b></div>','Zero risc juridic, dar arată neglijent lângă un design nou.')
 +opt('B','fix','Corectăm, cu acordul clubului (recomandat)','<div class="doc">... al copilului Maria Dumitrescu, <span class="old">nascut</span> <span class="new">născut/ă</span> la data de 14.03.2014, doresc ca Maria Dumitrescu <span class="old">sa particip/e</span> <span class="new">să participe</span> la cursurile organizate de <span class="old">Asociatia</span> <span class="new">Asociația</span> Clubul Sportiv EduSport. ... Regulamentele se completează, <span class="old">dupa caz</span> <span class="new">după caz</span>, cu prevederile legale în vigoare. ... <span class="old">Semnatura</span> <span class="new">Semnătura</span></div>','Doar diacritice și o formă gramaticală; trimitem clubului lista ca să aprobe.')+'</div>')
html=(FCSS+ACSS+dc+'<div class="Q"><h2>5 decizii mici</h2><p class="qn">Alege A sau B la fiecare. Recomandarea mea e marcată.</p>'+q1+q2b+q3+q4+q5
 +'<p class="qn" style="margin-top:30px">Corectat între timp în machete, după formularul ei: "Calitatea față de sportiv" are Părinte / Tutore Legal / Alta (nu "Mamă", cum pusesem), iar "Nivel de experiență" are textul ajutător al ei: "Dacă este prima participare, menționați dacă a mai luat lecții. Dacă a mai fost înscris la ACS EduSport, completați cu \'Nu este cazul\'."</p></div>')
open(OUTD,'w').write(html)
