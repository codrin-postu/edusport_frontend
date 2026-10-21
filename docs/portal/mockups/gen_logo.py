import sys,os,base64
OUTL=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_adeziune.py'), HERE+'/throw/z.html']
exec(open(sys.argv[0]).read())
b64=lambda f:'data:image/png;base64,'+base64.b64encode(open(os.path.join(HERE,f),'rb').read()).decode()
LOGO=b64('logo.png'); HDR=b64('hdr.png')
meta='<div class="meta">Sezonul <b class="v">2026-2027</b><br>Nr. înscriere <b class="v">2026-0142</b></div>'
wm='<div><div class="pre">Clubul Sportiv</div><div class="wm">EDUSPORT</div></div>'
logo=lambda px:f'<img src="{LOGO}" style="width:{px}px;height:{px}px;object-fit:cover;display:block" alt="logo">'
legal_short='<div class="legal" style="border:0;margin:0;padding:0;font-size:7.4px">'
def top(h,rest=''):
  return f'<div class="d2" style="min-height:0;padding-bottom:16px">{h}{rest}<div class="d2t" style="margin-bottom:2px">Cerere de adeziune</div><div style="font-weight:700;color:#0e1a3c;text-align:left">pentru a deveni Membru sustinator al Asociatiei Clubul Sportiv EduSport</div></div>'
LEG=re.search(r'<div class="legal">.*?</div>',adez(True),re.S).group(0)
hA=top(f'<div class="d2h">{wm}{meta}</div>',LEG)
hB=top(f'<div class="d2h">{wm}<div style="display:flex;gap:12px;align-items:center">{meta}{logo(54)}</div></div>',LEG)
hC=top('<div class="d2h" style="align-items:center">'+LEG.replace('class="legal"','class="legal" style="border:0;margin:0;padding:0;font-size:7.6px"')+logo(70)+'</div>','<div style="display:flex;justify-content:flex-end;margin-top:6px">'+meta+'</div>')
lcss='<style>.A .orig{max-width:860px;border:1px solid #c9ccd4;display:block}.A .opt3{display:flex!important;flex-direction:row!important;gap:24px;flex-wrap:wrap;align-items:flex-start}.A .opt3>.option{display:block;padding:0;border:0;background:none;width:560px}</style>'
opts=('<div class="options opt3">'
 f'<div class="option" data-choice="wordmark" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> Doar EDUSPORT (cum e acum în machetă)</p>{hA}<p class="note" style="margin-top:8px">Același antet ca la Acord. Logo-ul rotund nu apare.</p></div>'
 f'<div class="option" data-choice="both" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> EDUSPORT + logo-ul rotund în dreapta</p>{hB}<p class="note" style="margin-top:8px">Păstrează și logo-ul asociației, mic, lângă sezon și nr. înscriere.</p></div>'
 f'<div class="option" data-choice="original" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">C</span> Ca pe hârtia actuală: datele asociației + logo</p>{hC}<p class="note" style="margin-top:8px">Fără EDUSPORT; antetul rămâne cel de azi, doar mai ordonat.</p></div></div>')
html=(css+d2css+xcss+lcss+'<div class="A"><h2>Antetul documentelor: ce e "logo-ul rotund"</h2>'
 f'<p class="note">Pe Cererea de adeziune de hârtie, în dreapta sus, e sigla asociației: cercul cu cei doi copii patinatori și textul "Asociatia Clubul Sportiv EduSport · Bucuresti". În macheta mea am pus în locul ei antetul EDUSPORT, ca la Acord.</p><img class="orig" src="{HDR}" alt="antet actual">'
 '<p class="note" style="margin-top:6px">Antetul de pe hârtia actuală (din poza ta). Pentru documentul final ne trebuie fișierul original al siglei (PNG/SVG), nu o poză.</p>'
 '<div class="sec">Alege antetul (se aplică la ambele documente)</div>'+opts
 +'<div class="sec">Documentele acum (varianta A), completate</div><div class="row2"><div><p class="cap2">Acord (Formular de înscriere)</p>'+acord+'</div><div><p class="cap2">Cerere de adeziune</p>'+adez(True)+'</div></div>'
 +'<div class="sec">Și variantele goale, de printat</div><div class="row2"><div>'+blank(acord)+'</div><div>'+adez(False)+'</div></div></div>')
open(OUTL,'w').write(html)
