import sys,re,os
OUT3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_flow2.py'), HERE+'/throw/x.html', HERE+'/throw']
exec(open(sys.argv[0]).read())
v2=open(sys.argv[3] if len(sys.argv)>3 else '/Users/codrin/Documents/Programming/edusport_frontend/docs/portal/mockups/screens/admin-cms-v2.html').read()
styles=re.findall(r'<style>.*?</style>',v2,re.S); d2css=''.join(st for st in styles if '.d2' in st)+'<style>@import url(\'https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800&family=Climate+Crisis&display=swap\');</style>'
i=v2.find('<div class="d2"'); depth=0; j=i
for m in re.finditer(r'<div\b|</div>',v2[i:]):
  depth+=1 if m.group()!='</div>' else -1
  if depth==0: j=i+m.end(); break
doc=v2[i:j]
x_css='''<style>.A .two{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}.A .pcard{width:340px;background:#fff;border:1px solid var(--ln);border-radius:4px;padding:14px 16px}
.A .opt2{display:flex!important;flex-direction:row!important;gap:28px;flex-wrap:wrap;align-items:flex-start}.A .opt2>.option{display:block;padding:0;border:0;background:none;max-width:560px}
.A .stp{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0 4px}.A .stp .s{border:1px solid var(--ln2);background:#fff;padding:6px 10px;font-weight:600}.A .stp .s.ok{border-color:#bfe0cc;background:var(--okb);color:var(--ok)}.A .stp .s.cur{border-color:var(--p);background:#ecf0f7;color:var(--p)}.A .stp .a{color:var(--mu)}
.A .sx{overflow-x:auto;max-width:1180px;border:1px solid #c9ccd4}.A .sx .sheet{border:0;width:auto;max-width:none}.A .sx td,.A .sx th{white-space:nowrap}
.A .tabs{display:flex;gap:0;background:#f3f4f6;border-top:1px solid #e1e3e8;font:12px Arial,sans-serif}.A .tabs span{padding:7px 14px;border-right:1px solid #e1e3e8;color:#555}.A .tabs .on{background:#fff;color:#1a73e8;font-weight:700;box-shadow:inset 0 -2px 0 #1a73e8}
.A .hist{margin-top:8px;font-size:12px;color:var(--mu)}.A .hist div{padding:3px 0;border-top:1px solid var(--ln)}</style>'''
stp=('<div class="stp"><span class="s ok">Formular (2 pași)</span><span class="a">/</span><span class="s ok">Ecran de succes + PDF</span><span class="a">/</span><span class="s ok">E-mail prin Brevo</span><span class="a">/</span><span class="s ok">Înscrieri în CMS</span><span class="a">/</span><span class="s cur">Document</span><span class="a">/</span><span class="s cur">Google Sheet</span><span class="a">/</span><span class="s">Documente</span><span class="a">/</span><span class="s">Confirmă și adaugă în club</span><span class="a">/</span><span class="s">Grupe Școală</span><span class="a">/</span><span class="s">Prezență pe ore</span></div>')
card=lambda hist:(f'<div class="pcard"><div class="lb" style="margin-top:0">Document</div><div class="fn" style="font-weight:600;margin:2px 0 6px">{fname}</div><div class="acts"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span><span class="lnk">{ic("refresh")}Regenerează</span></div>'
 f'<div class="lb">E-mail către părinte</div><div class="vl"><span class="bd ok">Trimis</span> 3 oct 2026, 14:23 · parinte@exemplu.ro</div><div style="margin-top:6px"><span class="lnk">{ic("refresh")}Retrimite e-mailul</span></div>{hist}</div>')
hA='<div class="hist"><div>Regenerat 5 oct 2026 de Ana (admin): telefon corectat</div><div>Creat 3 oct 2026 la trimitere</div></div>'
hB='<div class="hist"><div><b>v2</b> · 5 oct 2026 · Ana (admin) · telefon corectat · <span class="lnk">Vezi</span></div><div><b>v1</b> · 3 oct 2026 · trimis părintelui · <span class="lnk">Vezi</span></div></div>'
q1=('<div class="options opt2"><div class="option" data-choice="overwrite" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> Regenerează înlocuiește fișierul (recomandat)</p>'+card(hA)+'<p class="note" style="margin-top:8px">Un singur PDF per înscriere, mereu cu datele corecte. Rămâne doar o notă cine și când a regenerat. Copia semnată pe hârtie e oricum cea valabilă.</p></div>'
 '<div class="option" data-choice="versions" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> Păstrăm toate versiunile</p>'+card(hB)+'<p class="note" style="margin-top:8px">Se vede și ce a primit părintele inițial (v1). Mai mult de stocat și de explicat; Documente arată doar ultima versiune.</p></div></div>')
cols=['Nr. înscriere','Trimis la','Stare','Adresă de e-mail','Persoana care completează','Calitatea față de sportiv','Telefon de contact','Numele copilului','Data nașterii','Înălțimea (cm)','Măsura bluză','Sezonul trecut','Nivel de experiență','Așteptări','Membru A.C.S.','La primul modul','De unde ați aflat','Acord GDPR','Acord Regulament','Document','E-mail']
r1=['2026-0142','03.10.2026 14:22','Nou','parinte@exemplu.ro','Mihaela Dumitrescu','Părinte','07xx xxx xxx','Maria Dumitrescu','14.03.2014','142','S','Începători','Patinaj înainte, frânare','Să învețe piruete','Da','Abonament 8 ședințe','Recomandare','Da','Da','<a>Deschide documentul</a>','Trimis 03.10 14:23']
r2=['2026-0141','02.10.2026 09:10','Contactat','parinte2@exemplu.ro','Ioana Popescu','Părinte','07xx xxx xxx','Andrei Popescu','02.09.2016','128','XS','Nu a participat','Nimic','Să învețe să patineze','Nu','1 ședință grup','Facebook','Da','Da','<a>Deschide documentul</a>','Trimis 02.10 09:11']
L='ABCDEFGHIJKLMNOPQRSTU'
def sheet(cols,rows,tabs,on):
  return ('<div class="sx"><div class="sheet"><table><tr><th></th>'+''.join(f'<th>{L[k]}</th>' for k in range(len(cols)))+'</tr><tr><th>1</th>'+''.join(f'<th>{c}</th>' for c in cols)+'</tr>'
   +''.join(f'<tr><th>{n+2}</th>'+''.join(f'<td>{v}</td>' for v in r)+'</tr>' for n,r in enumerate(rows))+'</table></div><div class="tabs">'+''.join(f'<span class="{"on" if t==on else ""}">{t}</span>' for t in tabs)+'</div></div>')
sh_new=sheet(cols,[r1,r2],['2026-2027','2025-2026'],'2026-2027')
oldcols=['Nr. înscriere','Trimis la','Stare','Email','Telefon','Nume copil','Data nașterii','Părinte','Mărime tricou','Nivel','Experiență','Așteptări','Cum a aflat','Interes club','Document']
oldr=['2025-0087','14.09.2025 18:02','Confirmat','parinte3@exemplu.ro','07xx xxx xxx','Ana Bălan','05.05.2016','Elena Bălan','S','Începător','1 an','Piruete','Prieteni','Da','<a>Deschide documentul</a>']
sh_old=sheet(oldcols,[oldr],['2026-2027','2025-2026'],'2025-2026')
mixed=cols[:3]+['…']+cols[14:17]+['Nivel (eliminată)','Cum a aflat (eliminată)','Interes club (eliminată)']
mr=r1[:3]+['…']+r1[14:17]+['','','']
sh_mix=sheet(mixed,[mr],['2026-2027','2025-2026'],'2026-2027')
q2=('<div class="options opt2" style="flex-direction:column!important"><div class="option" data-choice="pertab" onclick="toggleSelect(this)" style="max-width:1180px"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> Fiecare sezon are coloanele lui (recomandat)</p><p class="note">Tab 2026-2027: întrebările noului formular, curat. Tab 2025-2026: rămâne cu coloanele vechi, neatins.</p>'+sh_new+'<div style="height:10px"></div>'+sh_old+'</div>'
 '<div class="option" data-choice="global" onclick="toggleSelect(this)" style="max-width:1180px;margin-top:20px"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> Aceleași coloane în toate taburile (cum e acum)</p><p class="note">Sincronizarea de azi calculează coloanele peste toate înscrierile, deci tabul nou ar primi la final coloane goale "(eliminată)" din formularul vechi.</p>'+sh_mix+'</div></div>')
html=(css+d2css+x_css+'<div class="A"><h2>Documentul și Google Sheet</h2><p class="note">Continuarea fluxului. Verde = decis, albastru = pe acest ecran.</p>'+stp
 +'<div class="sec">3. Documentul (design aprobat, generat la trimitere)</div><p class="note">Se generează automat imediat după trimitere, din răspunsurile formularului, și se salvează privat (se deschide doar din panou, după login). Același PDF e atașat în e-mailul Brevo. Nume fișier: Nume_Prenume_Acord_Sezon.pdf, fără diacritice.</p><div class="two">'+card('')+doc+'</div>'
 +'<div class="sec">3b. Dacă admin corectează date și regenerează documentul</div>'+q1
 +'<div class="sec">4. Google Sheet (sincronizarea existentă: un tab per sezon)</div><p class="note">Coloanele urmează întrebările formularului, în ordine, automat (cum face deja sincronizarea). Noi: Nr. înscriere în față; la final Acord GDPR și Acord Regulament (Da / Nu), Document (link în panou, cere login, deci nimic public) și E-mail (stare). Sheet-ul rămâne doar de citit: modificările se fac în CMS.</p>'+q2
 +'</div>')
open(OUT3,"w").write(html)
