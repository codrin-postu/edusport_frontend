import sys,os
OUTPN=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_rows.py'), HERE+'/throw/pn.html']
exec(open(sys.argv[0]).read())
tl='<table class="eq"><tr><th>Nr.</th><th>Trimis la</th><th>Nume copil</th><th>Vârstă</th><th>Status</th><th>Completat de</th></tr>'+''.join(f'<tr class="{"sel" if s_ else ""}"><td style="white-space:nowrap"><b>{n}</b></td><td style="white-space:nowrap">{d}</td>{tight(c,e)}<td>{a} ani</td><td><span class="bd {k}">{st_}</span></td><td style="white-space:nowrap">{p}</td></tr>' for n,d,c,a,k,st_,p,e,s_ in rowsL)+'</table>'
SA1=page(ppanel(collapsed)); SA2=page(ppanel(inline)); SB=page(ppanel(cardB),drawer)
cA3=(f'<div class="mcard"><span class="av">MD</span><div><b>Maria Dumitrescu</b><div class="hint">Primii Pași 2025-2026</div></div><span class="lnk">Vezi fișa</span></div>'
 '<div class="ch2"><div class="chc on"><b>Sportiv existent</b><small>Înscrierea se adaugă la această fișă</small></div><div class="chc"><b>Sportiv nou</b><small>Se creează o fișă nouă</small></div></div>'
 '<table class="cmpt" style="margin-top:12px"><tr><th></th><th>În fișă</th><th>În înscriere</th><th></th></tr>'
 '<tr><td>Nume</td><td>Maria Dumitrescu</td><td>Maria Dumitrescu</td><td></td></tr><tr><td>Data nașterii</td><td>14.03.2014</td><td>14.03.2014</td><td></td></tr>'
 '<tr><td>Părinte</td><td>Mihaela Dumitrescu</td><td>Mihaela Dumitrescu</td><td></td></tr><tr class="d"><td>Telefon</td><td>0722 111 22</td><td><b>0722 111 222</b></td><td><label class="ccb" style="white-space:nowrap"><input type="checkbox" checked><span>Actualizează</span></label></td></tr>'
 '<tr><td>E-mail</td><td>parinte@exemplu.ro</td><td>parinte@exemplu.ro</td><td></td></tr></table>'
 f'<div style="margin-top:8px"><span class="lnk">{ic("search")}Caută alt sportiv</span></div>')
Q=lambda L,ch,t,d:f'<div class="option" data-choice="{ch}" onclick="toggleSelect(this)"><div class="qq2"><p style="font-weight:700;margin:0 0 4px"><span class="letter" style="display:inline-grid">{L}</span> {t}</p><div class="hint">{d}</div></div></div>'
small=lambda title,opts:f'<p class="note" style="margin-top:16px"><b>{title}</b></p><div class="options optq">'+''.join(Q(*o) for o in opts)+'</div>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+'<div class="A"><h2>Decizii rămase: verificare, confirmare, detalii</h2><p class="note">Lista folosește deja varianta E (rânduri egale, "Sportiv existent" sub nume). Date inventate.</p>'
 '<div class="sec">1. Verificarea rapidă a unui sportiv existent</div><div class="options wcol" style="flex-direction:column!important">'
 +O('A','compare','Compară direct în card (recomandat)','<p class="cap2">Închis</p>'+SA1+'<p class="cap2" style="margin-top:14px">Deschis</p>'+SA2,'Rămâi în Înscrieri; tabel mic fișă vs înscriere, diferențele marcate.')
 +O('B','drawer','Fișa într-un panou lateral peste pagină',SB,'Vezi mai mult din fișă; "Închide" te întoarce unde erai.')+'</div>'
 '<div class="sec">2. Fereastra de confirmare</div><div class="options wcol">'
 +O('A','card-choice','Card + "Sportiv existent / Alt sportiv" + tabel cu diferențele colorate (recomandat)',shell(cA3))
 +O('B','two-cols','Două coloane: fișa vs înscrierea',shell(cB))
 +O('C','question','Întâi întrebarea "Este același sportiv?"',shell(cC))+'</div>'
 '<div class="sec">3. Detalii la confirmare</div>'
 +small('Grupa la confirmare',[('A','optional','Se poate alege și mai târziu (recomandat)','Opțiunea "Fără grupă deocamdată"; apare la filtrul "Fără grupă".'),('B','required','Obligatorie','Nu poți confirma fără grupă.')])
 +small('E-mail la confirmare',[('A','none','Fără e-mail deocamdată (recomandat)','Clubul anunță părintele ca acum. Se poate adăuga mai târziu.'),('B','email','E-mail "Înscriere confirmată"','Grupa, programul, prima ședință; designul E1; textul îl dă clubul.')])
 +small('Numele butonului',[('A','confirma','"Confirmă înscrierea" (recomandat)','Nu se confundă cu membru A.C.S.'),('B','adauga','"Confirmă și adaugă în club"','Ca la început.')])
 +'<div class="sec">4. Sportivi și abonamente</div>'
 +small('Cine adaugă abonamentul când e cumpărat',[('A','payments','Doar persoana de la plăți','Din pagina de plăți.'),('B','any-admin','Orice admin, cu istoric (recomandat)','Și cine face prezența, când se plătește la patinoar.')])
 +small('Ce înseamnă "date complete" la un sportiv',[('A','min','Nume, data nașterii, persoana de contact, telefon (recomandat)','E-mailul opțional.'),('B','plus-email','Și e-mailul obligatoriu','')])
 +'<p class="note" style="margin-top:16px"><b>Și o întrebare deschisă:</b> ce metode de plată folosește clubul la abonamente? (în prototip: Numerar, Card, Transfer bancar)</p></div>')
open(OUTPN,'w').write(html)
