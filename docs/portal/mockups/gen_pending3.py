import sys,os
OUTP3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_notify.py'), HERE+'/throw/p3.html']
exec(open(sys.argv[0]).read())
pc='''<style>.A .flow{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 6px}.A .flow span{padding:6px 10px;border:1px solid var(--ln);border-radius:6px;background:#fff;font-size:12.5px}
.A .flow .ok{color:#1d6b3a;border-color:#bfe0cb;background:#f2faf5}.A .flow .now{background:var(--p);color:#fff;border-color:var(--p);font-weight:700}.A .flow .nx{color:var(--mu)}
.A .qh{font:700 20px Inter,sans-serif;margin:40px 0 4px;padding-top:12px;border-top:3px solid #131c3d}</style>'''
QH=lambda n,t:f'<div class="qh">{n}. {t}</div>'
TXT=lambda t:f'<div class="qq2">{t}</div>'
steps=[('ok','Formular 3 pași'),('ok','PDF Acord + Adeziune'),('ok','E-mail Brevo'),('ok','Înscrieri + panou'),('ok','Membri + Sportiv existent'),('ok','Documente'),('now','Grupe (aici)'),('nx','Prezență pe ore'),('nx','Spec + plan'),('nx','Implementare')]
flow='<div class="flow">'+''.join(f'<span class="{k}">{"✓ " if k=="ok" else ""}{t}</span>' for k,t in steps)+'</div>'
# Q1: Fara grupa signal (4 options, from sections-v3 A + notify A/B + combo)
WAf=('<div class="win">'+hdr+tabs3g('f')+info('Sportivi confirmați din tot clubul care nu sunt încă într-o grupă.')+fgT+'</div>')
SC=SB.replace('<span class="btn pr">'+ic('plus')+'Grupă nouă</span>','<span class="cbtn">'+ic('user')+'Fără grupă<span class="dot">3</span></span><span class="btn pr">'+ic('plus')+'Grupă nouă</span>',1)
# Q2: confirm section tabs (sections-v2 layout)
WAs=('<div class="win">'+hdr+tabsG('s')+info('64 sportivi în 6 grupe')+simple(SG)+'</table></div>')
# Q3: menu name
M1=screen('scoala',WAs); M2=M1.replace('Școala de patinaj</div><div class="sub','Club și școală</div><div class="sub',1)
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc
 +'<div class="A"><h2>Ce mai e de aprobat: Grupe</h2><p class="note">Fluxul de administrare a înscrierilor, de la formular la implementare. Totul până la Documente e decis (DECISIONS.md). Ne-am oprit la Grupe. Date inventate.</p>'+flow
 +QH(1,'Cum semnalăm sportivii fără grupă (fără bară galbenă)')+'<p class="note">Ai respins bara galbenă. Un sportiv fără grupă poate veni din Școală sau de la un antrenor de Club, deci ține de tot clubul.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','q1-button','Buton "Fără grupă" cu număr, lângă "Grupă nouă"; dropdown cu alocare (recomandat)',SA,'La 0 butonul dispare. Aloci pe rând sau toți deodată, fără să pleci de pe pagină.')
 +O('B','q1-badge','Număr pe "Grupe" în meniu + link sub titlu',SB,'Se vede de oriunde din panou; linkul deschide pagina de alocare.')
 +O('C','q1-both','A și B împreună',SC,'Numărul din meniu atrage atenția de oriunde, butonul de pe pagină face alocarea.')
 +O('D','q1-tab','Primul tab "Fără grupă"',screen('scoala',WAf),'Alocarea direct în tab; tabul rămâne și la 0, cu 0 gri.')+'</div>'
 +QH(2,'Taburi pe secțiuni: Școala de patinaj / Club')+'<p class="note">Varianta simplificată pe care ai cerut-o (fără "Toate", 4 coloane: Grupă, Program, Antrenori, Sportivi; clic pe rând deschide grupa). Plus filtrul "Secțiune" în Sportivi.</p><div class="options wcol" style="flex-direction:column!important">'
 +O('A','q2-ok','Da, așa',screen('scoala',WAs),'"+ Grupă nouă" creează grupa în tabul deschis.')
 +O('B','q2-change','Mai e de schimbat',TXT('Spune ce în chat.'),'')+'</div>'
 +QH(3,'Numele secțiunii din meniu')+'<p class="note">Acum conține și grupele clubului (Grupe, Sportivi, Prezență).</p><div class="options wcol">'
 +O('A','q3-keep','Rămâne "Școala de patinaj"',M1,'')
 +O('B','q3-club','"Club și școală"',M2,'Spune corect ce e înăuntru.')+'</div>'
 +QH(4,'Mutarea unui sportiv în altă grupă în timpul sezonului')+'<div class="options wcol">'
 +O('A','q4-keep','Abonamentul merge cu sportivul (recomandat)',TXT('Abonamentul e al sportivului, nu al grupei. Ședințele rămase se folosesc în grupa nouă; prezența veche rămâne la grupa veche, în Istoric.'),'')
 +O('B','q4-stay','Abonamentul rămâne la grupa veche',TXT('În grupa nouă trebuie cumpărat alt abonament.'),'Mai complicat pentru părinte.')+'</div>'
 +QH(5,'Programul grupei')+'<div class="options wcol">'
 +O('A','q5-cal','Vine din calendarul site-ului, seria Școlii (recomandat)',TXT('Schimbi ora o dată în calendar; se vede pe site, la grupă și la prezență.'),'')
 +O('B','q5-own','Se scrie separat la grupă',TXT('Program introdus pe fiecare grupă.'),'Riscă să nu se potrivească cu site-ul.')+'</div>'
 +'<p class="note" style="margin-top:30px">După acestea: Prezența pe zi (o coloană pe oră; altă oră în aceeași zi folosește altă căsuță de abonament; "Adaugă abonament" din prezență), apoi spec + plan de implementare.</p></div>')
open(OUTP3,'w').write(html)
