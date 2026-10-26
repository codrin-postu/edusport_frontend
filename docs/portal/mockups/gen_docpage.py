import sys,os
OUTDP=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_open9.py'), HERE+'/throw/dp.html']
exec(open(sys.argv[0]).read())
dcss='''<style>.A .dt td,.A .dt th{white-space:nowrap}.A .dt td{height:50px;padding-top:0;padding-bottom:0}.A .dtyp{display:flex;align-items:center;gap:8px}.A .dtyp .dic{width:28px;height:28px}.A .dtyp .dic .ic{width:15px;height:15px}
.A .dic{border-radius:4px;background:#ecf0f7;display:grid;place-items:center}.A .dic .ic{color:var(--p)}.A .dic.ad{background:#e9f2f9}.A .dic.ad .ic{color:var(--inf)}
.A .blk{display:flex;align-items:center;gap:12px;padding:10px 18px;background:#ecf0f7;border-bottom:1px solid #cfd9ea;font-weight:600;color:var(--p)}
.A .tpl{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 18px;border-bottom:1px solid var(--ln);background:#fafbfd}.A .tpl b{margin-right:4px}
.A .pv{position:absolute;inset:0;background:rgba(15,21,34,.45);z-index:5;display:flex;justify-content:center;align-items:flex-start;padding-top:24px}.A .pvm{width:760px;background:#fff;border-radius:6px;box-shadow:0 20px 50px rgba(0,0,0,.3);overflow:hidden}.A .pvm .mh{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--ln)}.A .pvm .mh b{flex:1}.A .pvb{background:#eef0f4;padding:20px;display:flex;justify-content:center;max-height:560px;overflow:hidden}
.A .acts2{display:flex;gap:14px;justify-content:flex-end}</style>'''
DOCS=[('2026-0142','Maria Dumitrescu','Acord','Maria_Dumitrescu_Acord_2026-2027.pdf','5 oct 2026','actualizat'),('2026-0142','Maria Dumitrescu','Cerere de adeziune','Maria_Dumitrescu_Adeziune_2026-2027.pdf','3 oct 2026',''),('2026-0141','Andrei Popescu','Acord','Andrei_Popescu_Acord_2026-2027.pdf','2 oct 2026',''),('2026-0140','Sara-Maria Ilie','Acord','Sara-Maria_Ilie_Acord_2026-2027.pdf','1 oct 2026',''),('2026-0140','Sara-Maria Ilie','Cerere de adeziune','Sara-Maria_Ilie_Adeziune_2026-2027.pdf','1 oct 2026',''),('2026-0139','David Neagu','Acord','David_Neagu_Acord_2026-2027.pdf','30 sep 2026',''),('2026-0138','Ilinca Matei','Acord','Ilinca_Matei_Acord_2026-2027.pdf','29 sep 2026','')]
chk=lambda on=False:f'<label class="ccb"><input type="checkbox" {"checked" if on else ""}></label>'
def table(sel=()):
  h='<tr><th>'+chk()+'</th><th class="srt">Nr. înscriere<span>↕</span></th><th class="srt on">Nume sportiv<span>▲</span></th><th>Document</th><th>Fișier</th><th class="srt">Actualizat<span>↕</span></th><th></th></tr>'
  r=''
  for i,(n,nm,t,f,d,u) in enumerate(DOCS):
    ad=t!='Acord'
    r+=(f'<tr class="{"sel" if i in sel else ""}"><td>{chk(i in sel)}</td><td><b>{n}</b></td><td><b>{nm}</b></td><td><span class="dtyp"><span class="dic{" ad" if ad else ""}">{ic("file")}</span>{t}</span></td><td style="color:var(--t2)">{f}</td><td>{d}{"<small>refăcut după corectare</small>" if u else ""}</td><td><div class="acts2"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></td></tr>')
  return '<table class="dt">'+h+r+'</table>'
tpl=('<div class="tpl"><b>Formulare goale de printat</b><span class="btn sm">'+ic('dl')+'Acord, gol</span><span class="btn sm">'+ic('dl')+'Cerere de adeziune, goală</span><span class="hint">Pentru înscrieri pe loc. Au deja sezonul 2026-2027, perioada și taxa de membru din setări.</span></div>')
tb=(f'<div class="tb"><span class="in srch">{ic("search")}Caută după sportiv, nr. înscriere sau fișier...</span><span class="in">Sezon <b>2026-2027</b>{ic("down")}</span><span class="fbtn">Document{ic("down")}</span><span style="flex:1"></span><span class="sbt-lbl">Sortare:</span><div style="min-width:180px"><div class="cdd"><button class="cdd-t"><span class="cdd-v">Nume A-Z</span>{ic("down")}</button></div></div></div>')
head=('<div class="wh"><div><h1>Documente</h1><p>Documentele generate din înscrieri. Nu sunt publice: se deschid doar din panou.</p></div><span class="sp"></span><span class="btn">'+ic('dl')+'Descarcă tot sezonul (ZIP)</span></div>')
pager='<div class="pgr">7 documente · 5 sportivi<span style="flex:1"></span><span class="pg on">1</span></div>'
W1='<div class="win">'+head+tpl+tb+table()+pager+'</div>'
blk=('<div class="blk"><label class="ccb"><input type="checkbox" checked></label>3 selectate<span style="flex:1"></span><span class="btn sm pr">'+ic('dl')+'Descarcă selecția (ZIP)</span><span class="btn sm">Deselectează</span></div>')
W2='<div class="win">'+head+tpl+tb+blk+table((0,1,3))+pager+'</div>'
# preview
import re as _re
_v=open(os.path.join(HERE,'screens','flow-doc-sheet-v3.html')).read()
_i=_v.find('<div class="d2"');_d=0
for _m in _re.finditer(r'<div\b|</div>',_v[_i:]):
  _d+=1 if _m.group()!='</div>' else -1
  if _d==0: _j=_i+_m.end(); break
FINAL=_v[_i:_j].replace('iunie 2027','mai 2027')
DOCCSS=''.join(st for st in _re.findall(r'<style>.*?</style>',_v,_re.S) if '.d2' in st or '.f4' in st or '.kv' in st)
doc=acord if 'acord' in dir() else ''
pv=('<div class="pv"><div class="pvm"><div class="mh">'+ic('file')+'<b>Maria_Dumitrescu_Acord_2026-2027.pdf</b><span class="btn sm">'+ic('dl')+'Descarcă</span><span style="cursor:pointer">'+ic('x')+'</span></div><div class="pvb"><div style="transform:scale(.9);transform-origin:top center">'+FINAL+'</div></div></div></div>') if 'FINAL' in dir() else ''
S1=screen('documente',W1); S2=screen('documente',W2)
S3=screen('documente',W1,pv) if pv else ''
qs=('<div class="sec">De decis</div>'
 '<p class="note" style="margin-top:6px"><b>1. Urmărim dacă documentul semnat pe hârtie a fost primit?</b></p><div class="options optq">'
 +Q('A','no','Nu, deocamdată (recomandat)','Hârtia rămâne la club; în panou sunt doar PDF-urile generate.')
 +Q('B','yes','Da: coloană "Semnat" (Da / Nu) și filtru','Admin bifează când primește hârtia la prima ședință; vezi cine mai trebuie să aducă documentul.')+'</div>'
 '<p class="note" style="margin-top:14px"><b>2. Ce e în ZIP</b></p><div class="options optq">'
 +Q('A','flat','Toate fișierele direct în arhivă (recomandat)','Numele lor spun deja sportivul, documentul și sezonul.')
 +Q('B','folders','Câte un folder pe tip: Acord / Cerere de adeziune','Util la printat separat.')+'</div>')
html=("<style>@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800&family=Climate+Crisis&display=swap');</style>"+DOCCSS+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+'<div class="A" style="--dummy:0"><h2>Pagina Documente</h2><p class="note">Ecran de desktop, în stilul Sportivi: rânduri egale, filtre în dropdown, sortare. Date inventate.</p>'
 '<div class="sec">1. Lista</div><p class="note">Sus: formularele goale de printat. Filtre: Sezon, Document (Acord / Cerere de adeziune). Căutare după sportiv, nr. înscriere, fișier. Iconița diferă puțin la Cerere.</p>'+S1
 +'<div class="sec">2. Selecție pentru ZIP</div><p class="note">Bifezi rânduri; apare bara albastră cu "Descarcă selecția (ZIP)". Bifa din antet selectează tot ce e filtrat.</p>'+S2
 +('<div class="sec">3. Vezi: previzualizare fără să descarci</div>'+S3 if S3 else '')+qs+'</div>')
open(OUTDP,'w').write(html)
