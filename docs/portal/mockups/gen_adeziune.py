import sys,re,os
OUTA=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_flow2.py'), HERE+'/throw/x.html', HERE+'/throw']
exec(open(sys.argv[0]).read())
v2=open('/Users/codrin/Documents/Programming/edusport_frontend/docs/portal/mockups/screens/admin-cms-v2.html').read()
d2css=''.join(st for st in re.findall(r'<style>.*?</style>',v2,re.S) if '.d2' in st)+"<style>@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800&family=Climate+Crisis&display=swap');</style>"
i=v2.find('<div class="d2"'); depth=0
for m in re.finditer(r'<div\b|</div>',v2[i:]):
  depth+=1 if m.group()!='</div>' else -1
  if depth==0: j=i+m.end(); break
acord=v2[i:j].replace("iunie 2027","mai 2027")
def blank(html):
  def rep(m):
    v=m.group(1)
    if '2026-2027' in v or 'octombrie' in v: return m.group(0)
    w=max(60,min(150,len(v)*6))
    return f'<span class="bl" style="width:{w}px"></span>'
  return re.sub(r'<b class="v">([^<]*)</b>',rep,html)
xcss='''<style>
.A .d2 .bl{display:inline-block;border-bottom:1px solid #1f2430;height:10px;vertical-align:baseline;margin:0 2px}
.A .d2 .legal{font-size:7.2px;line-height:1.5;color:#4b5263;text-align:left;margin:8px 0 0;padding-bottom:8px;border-bottom:1px solid #c0c4ce}
.A .d2 .dn{display:grid;grid-template-columns:62px 1fr;gap:8px;padding:3px 0;align-items:start}
.A .d2 .dn .bx{display:inline-flex;gap:8px;font-weight:700;white-space:nowrap}
.A .d2 .dn .bx span{display:inline-flex;align-items:center;gap:3px}
.A .d2 .dn .bx span:before{content:"";width:9px;height:9px;border:1.2px solid #0e1a3c;display:inline-block}
.A .d2 .off{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:12px}
.A .d2 .off .ob{border:1px solid #c0c4ce;padding:8px 10px;display:flex;flex-direction:column;gap:8px}.A .d2 .orow{display:flex;align-items:center;gap:6px;white-space:nowrap}.A .d2 .ol{flex:1;border-bottom:1px solid #1f2430;height:10px;min-width:30px}.A .d2 .olab{width:44px}
.A .d2 .off .ob .ck{display:inline-flex;align-items:center;gap:5px;margin-right:18px;font-weight:700;line-height:1}.A .d2 .off .ob .ck:before{content:"";width:9px;height:9px;border:1.2px solid #0e1a3c;display:inline-block}
.A .d2 .ff{font-size:7px;color:#6b6f7d;line-height:1.45;text-align:left}
.A .row2{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}
.A .opt2{display:flex!important;flex-direction:row!important;gap:28px;flex-wrap:wrap;align-items:flex-start}.A .opt2>.option{display:block;padding:0;border:0;background:none;max-width:560px}
.A .fbox{width:390px;background:#fbf8f1;border:1.5px solid #0e1a3c;box-shadow:8px 8px 0 rgb(14 26 60/.16);padding:20px;font-family:Inter,sans-serif}
.A .fbox .lbl{display:block;font-weight:600;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#495269;margin:0 0 8px}
.A .fbox .inp{height:48px;border:1.5px solid #0e1a3c;background:#fff;display:flex;align-items:center;padding:0 16px;font-size:14px;color:#0e1a3c;margin-bottom:20px}
.A .fbox .hl{font-size:12px;color:#495269;margin:-4px 0 12px}
.A .cap2{font-size:12px;font-weight:700;color:#666;margin:0 0 6px}
</style>'''
def V(v,filled,w=90): return f'<b class="v">{v}</b>' if filled else f'<span class="bl" style="width:{w}px"></span>'
def adez(filled=True, addr=False):
  F=filled; A=filled and addr
  dn=lambda t:f'<div class="dn"><span class="bx"><span>Da</span><span>Nu</span></span><span>{t}</span></div>'
  return ('<div class="d2">'
   '<div class="d2h"><div><div class="pre">Clubul Sportiv</div><div class="wm">EDUSPORT</div></div><div class="meta">Sezonul <b class="v">2026-2027</b><br>Nr. înscriere '+V('2026-0142',F,60)+'</div></div>'
   '<div class="legal"><b>Sediul social:</b> str. Slt. Stanescu Gheorghe, nr. 1, bl. 213, sc. A, et. 10, ap. 42, sect. 2, Bucuresti · <b>C.I.F.:</b> 30321550, <b>C.I.S.:</b> B/A2/00159/2012, <b>nr. inreg. in Reg. Asoc. si Fundatiilor:</b> 65/18.05.2012<br><b>CONT:</b> RO89 INGB 0000 9999 0318 6729, <b>deschis</b> la ING Bank, <b>sucursala</b> Gara de Nord · <b>Telefon:</b> 0723.623.712, <b>E-mail:</b> edusporttrophy@gmail.com<br><b>Facebook:</b> www.facebook.com/EduSportClub, <b>Web:</b> http://www.scoaladepatinaj.com</div>'
   '<div class="d2t" style="margin-bottom:2px">Cerere de adeziune</div><div style="font-weight:700;color:#0e1a3c;margin-bottom:8px;text-align:left">pentru a deveni Membru sustinator al Asociatiei Clubul Sportiv EduSport</div>'
   f'<p>Subsemnatul/a {V("Mihaela Dumitrescu",F,130)} cu domiciliul in localitatea {V("Iași",A,90)}, Strada {V("Str. Exemplu",A,110)}, nr {V("9",A,26)} Bl {V("",False,26) if not A else V("–",A)} Sc {V("",False,22) if not A else V("–",A)}, Ap {V("",False,22) if not A else V("–",A)}, Judet/Sector {V("Iași",A,70)}, CNP {V("",False,110)} e-mail {V("parinte@exemplu.ro",F,120)} telefon {V("07xx xxx xxx",F,80)} in calitate de tutore al copilului {V("Maria Dumitrescu",F,130)}, nascut la data de {V("14.03.2014",F,60)}, va solicit aderarea fiului/fiicei mele ca Membru sustinator al Asociatiei Clubul Sportiv EduSport.</p>'
   +dn('Declar pe propria răspundere că am luat la cunoştinţă de prevederile Statutului şi ale Actului Constitutiv ale Asociaţiei pe care le accept fără rezerve, îndeplinesc condiţiile necesare pentru a obţine statutul de Membru al său, mă angajez să acţionez pentru realizarea scopului şi obiectivelor Asociaţiei şi să respect hotărârile / deciziile conducerii acesteia. Mă voi abţine de la orice acţiune care dăunează prestigiului şi intereselor Asociaţiei Clubul Sportiv EduSport. Ma angajez sa nu demarez actiuni si/sau luari de pozitie in numele Asocatiei fara a anunta in prealabil conducerea Asociatiei si fara a avea acordul scris al acesteia.')
   +dn('Mă angajez să achit cotizaţia anuală stabilită de către Adunarea Generală a Asociaţiei Clubul Sportiv EduSport. Înţeleg că neplata cotizaţiei anuale conform Actului Constitutiv şi a Statutului Asociaţiei reprezintă dreptul acesteia de a exclude persoana fizică dintre membrii săi.')
   +dn('Am luat la cunoştinţă faptul că Asociaţia Clubul Sportiv EduSport îşi rezervă dreptul de a fotografia şi înregistra audio-video antrenamentele, cursurile, serbările/spectacolele sau orice alt eveniment organizat de ACS EduSport ori de partenerii acestuia, în care apar membrii, cursanţii sau sportivii ACS EduSport, precum şi de a utiliza imaginile/filmările în scopul promovării activităţii ACS EduSport.')
   +dn('Am luat la cunoştinţă faptul că în prezent cotizatia anuala aferenta perioadei <b class="v">octombrie 2026-mai 2027</b> este de <b class="v">270 ron</b>.')
   +dn('Sunt de acord ca datele cu caracter personal şi datele mele de contact să fie utilizate pentru a primi materiale informative şi/sau înştiinţări cu privire la activitatea Asociaţiei Clubul Sportiv EduSport.')
   +dn('imi exprim acordul cu privire la utilizarea şi prelucrarea datelor mele cu caracter personal de către Asociatia Clubul Sportiv EduSport, cu sediul social: str. Slt. Stanescu Gheorghe, nr. 1, bl. 213, sc. A, et. 10, ap. 42, sect. 2, Bucurest, CIF: 30321550.')
   +'<p style="margin-top:6px">Acestea vor fi folosite în scopul îndeplinirii obiectivelor ACS EduSport, cu respectarea prevederilor legale, conform regulamentului disponibil pe <span class="u">https://scoaladepatinaj.com/protectia-datelor/</span></p>'
   f'<div class="off"><div class="sig" style="grid-template-columns:1fr;gap:8px;margin-top:0"><div><small>Nume</small>{"<b class=v>Mihaela Dumitrescu</b>" if F else ""}<span class="line" style="height:{"4px" if F else "16px"}"></span></div><div><small>Semnătura</small><span class="line"></span></div><div><small>Data</small><span class="line" style="height:16px"></span></div></div>'
   '<div class="ob"><div class="orow"><span>Cererea a fost înregistrată cu nr</span><span class="ol"></span><span>/</span><span class="ol"></span></div><div class="orow"><span class="olab">Membru:</span><span class="ck">admis</span><span class="ck">respins</span></div><div class="orow" style="margin-top:4px"><span>Preşedinte Asociatia Clubul Sportiv EduSport</span></div><span style="display:block;border-bottom:1px solid #1f2430;height:18px"></span></div></div>'
   '<div class="d2f" style="display:block"><div class="ff">Asociaţia Clubul Sportiv EduSport este persoană juridică română de drept privat, fără scop patrimonial, polisportivă, apolitică şi non-profit. Clubul Sportiv este constituit şi funcţionează în conformitate cu prevederile O.G. nr.26/2000 cu privire la asociatii si fundatii si a Legii Educatiei Fizice si Sportului nr.69/2000.</div></div>'
   '</div>')
# Documente with templates
docs=[('Maria_Dumitrescu_Acord_2026-2027.pdf','Maria Dumitrescu','Acord (Formular de înscriere)','3 oct 2026'),('Maria_Dumitrescu_Adeziune_2026-2027.pdf','Maria Dumitrescu','Cerere de adeziune (membru)','3 oct 2026'),('Andrei_Popescu_Acord_2026-2027.pdf','Andrei Popescu','Acord (Formular de înscriere)','2 oct 2026')]
t='<table><tr><th>'+cb()+'</th><th>Fișier</th><th>Sportiv</th><th>Document</th><th>Creat</th><th></th></tr>'+''.join(f'<tr><td>{cb()}</td><td><span class="lnk" style="color:var(--tx);font-weight:600">{ic("file")}{f}</span></td><td>{n}</td><td>{d}</td><td>{c}</td><td><span class="lnk">{ic("eye")}Vezi</span>&nbsp;&nbsp;<span class="lnk">{ic("dl")}</span></td></tr>' for f,n,d,c in docs)+'</table>'
tpl=('<div style="padding:14px 18px;border-bottom:1px solid var(--ln);background:#fafbfd"><div style="font-weight:700;margin-bottom:8px">Formulare goale de printat (sezon 2026-2027)</div><div style="display:flex;gap:10px;flex-wrap:wrap">'
 f'<span class="btn">{ic("dl")}Acord (Formular de înscriere), gol</span><span class="btn">{ic("dl")}Cerere de adeziune, goală</span></div><div class="hint" style="margin-top:6px">Pentru înscrieri pe loc, la patinoar. Au deja sezonul, perioada și cotizația din setări; restul se completează de mână.</div></div>')
win=('<div class="win"><div class="wh"><div><h1>Documente</h1><p>Documentele generate din înscrieri. Nu sunt publice: se deschid doar din panou.</p></div><span class="sp"></span><span class="btn">'+ic('dl')+'Descarcă tot sezonul (ZIP)</span></div>'+tpl
 +f'<div class="tb"><span class="in srch">{ic("search")}Caută după sportiv sau fișier...</span><span class="in">Sezon <b>2026-2027</b>{ic("down")}</span><span class="in">Document <b>toate</b>{ic("down")}</span><span class="in">Sortare <b>cele mai noi</b>{ic("down")}</span></div>'+t+'</div>')
SD=screen('documente',win)
formA=('<div class="fbox"><div class="hl">Apare doar dacă la "Doriți înscrierea ca membru" alege Da.</div>'
 +''.join(f'<label class="lbl">{l}</label><div class="inp">{v}</div>' for l,v in [('Localitatea *','Iași'),('Strada și numărul *','Str. Exemplu nr. 9'),('Bloc / Scară / Apartament','–'),('Județ / Sector *','Iași'),('CNP părinte *','•••••••••••••')])+'</div>')
q1=('<div class="options opt2"><div class="option" data-choice="paper" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> Adresa și CNP-ul se scriu de mână (recomandat)</p><p class="note">Formularul online nu se schimbă. Pe PDF rămân linii goale pentru domiciliu și CNP; părintele le completează la prima ședință, când semnează. CNP-ul nu ajunge niciodată pe server.</p></div>'
 '<div class="option" data-choice="online" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> Le cerem online, în pasul 2, doar pentru membri</p>'+formA+'<p class="note" style="margin-top:10px">PDF complet, dar stocăm CNP-uri (date sensibile: criptare, acces restrâns, ștergere la final). Formularul devine mai lung exact pentru cei care aleg să devină membri.</p></div></div>')
html=(css+d2css+xcss+'<div class="A"><h2>Al doilea document: Cererea de adeziune (membru susținător)</h2>'
 '<p class="note">Același text, cuvânt cu cuvânt, inclusiv datele asociației din antet. Aspect ca la Acordul aprobat (antet EDUSPORT, sezon și nr. înscriere în dreapta). Câmpurile marcate vin din formular; restul rămân de completat de mână. Se generează doar când la "Doriți înscrierea ca membru" răspunde Da. Perioada și cotizația (270 ron) vin din setările sezonului.</p>'
 '<div class="row2"><div><p class="cap2">Completată automat</p>'+adez(True)+'</div><div><p class="cap2">Goală, de printat</p>'+adez(False)+'</div></div>'
 '<div class="sec">Ambele documente au și varianta goală</div><p class="note">Acordul gol: aceleași rânduri, fără date. Sezonul și perioada rămân tipărite.</p><div class="row2"><div><p class="cap2">Acord, completat</p>'+acord+'</div><div><p class="cap2">Acord, gol</p>'+blank(acord)+'</div></div>'
 '<div class="sec">Documente: formularele goale se descarcă de aici</div>'+SD
 +'<div class="sec">De ales: adresa și CNP-ul de pe cererea de adeziune</div><p class="note">Formularul ei din script nu le cere; pe hârtie sunt obligatorii.</p>'+q1
 +'<div class="sec">Propus, de confirmat</div><ul class="note" style="padding-left:18px"><li>Bifele Da / Nu de pe cerere rămân goale, pentru hârtie (ca la Acord). Formularul online nu le pune.</li><li>"Cererea a fost înregistrată cu nr ___/___" și "admis / respins" rămân goale: le completează președintele.</li><li>Logo-ul rotund cu copiii e înlocuit de antetul EDUSPORT, ca la Acord. Dacă vreți logo-ul, îl punem în dreapta sus.</li><li>Tariful de membru din machetele anterioare (200 lei) era inventat: cotizația reală e 270 ron.</li></ul>'
 '</div>')
open(OUTA,'w').write(html)
