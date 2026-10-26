import sys,os
OUTJ=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_legal2.py'), HERE+'/throw/u.html']
exec(open(sys.argv[0]).read())
c4='''<style>.A .d2 .f4{display:grid;grid-template-columns:1fr 1.05fr 1fr 1.35fr;gap:14px;border-top:1px solid #c0c4ce;padding-top:8px;margin:10px 0 8px;text-align:left}
.A .d2 .f4 .h{display:block;font-size:6.6px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6b6f7d;margin-bottom:3px}
.A .d2 .f4 .t{font-size:7.2px;line-height:1.5;color:#1f2430}
.A .d2 .f4 .kv{grid-template-columns:auto 1fr;column-gap:6px}
.A .d2 .f4 .ic2{display:grid;grid-template-columns:9px 1fr;column-gap:5px;row-gap:2px;font-size:7.2px;line-height:1.5;align-items:center}
.A .d2 .f4 .ic2 svg{width:8px;height:8px;fill:none;stroke:#0e1a3c;stroke-width:2}</style>'''
def col(h,body): return f'<div><span class="h">{h}</span>{body}</div>'
t=lambda x:f'<div class="t">{x}</div>'
c1=col('Sediul social',t('str. Slt. Stanescu Gheorghe, nr. 1, bl. 213, sc. A, et. 10, ap. 42, sect. 2, Bucuresti'))
c2=col('Date de înregistrare','<dl class="kv" style="margin:0"><dt>C.I.F.:</dt><dd>30321550</dd><dt>C.I.S.:</dt><dd>B/A2/00159/2012</dd><dt>Reg. Asoc.:</dt><dd>65/18.05.2012</dd></dl>')
c2x=col('Date de înregistrare',t('C.I.F.: 30321550<br>C.I.S.: B/A2/00159/2012<br>nr. inreg. in Reg. Asoc. si Fundatiilor: 65/18.05.2012'))
c3=col('Cont',t('RO89 INGB 0000 9999 0318 6729<br>ING Bank, sucursala Gara de Nord'))
c3x=col('Cont',t('RO89 INGB 0000 9999 0318 6729<br>deschis la ING Bank, sucursala Gara de Nord'))
def contactKV(short): return col('Contact','<dl class="kv" style="margin:0"><dt>Telefon:</dt><dd>0723.623.712</dd><dt>E-mail:</dt><dd>edusporttrophy@gmail.com</dd><dt>Facebook:</dt><dd>'+('facebook.com/EduSportClub' if short else 'www.facebook.com/EduSportClub')+'</dd><dt>Web:</dt><dd>'+('scoaladepatinaj.com' if short else 'http://www.scoaladepatinaj.com')+'</dd></dl>')
SV={'tel':'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>','mail':'<rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/>','fb':'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>','web':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'}
def contactIC(): return col('Contact','<div class="ic2">'+''.join(f'<svg viewBox="0 0 24 24">{SV[k]}</svg><span>{v}</span>' for k,v in [('tel','0723.623.712'),('mail','edusporttrophy@gmail.com'),('fb','facebook.com/EduSportClub'),('web','scoaladepatinaj.com')])+'</div>')
def f4(cols): return '<div class="f4">'+''.join(cols)+'</div>'
VAR={'now':f4([c1,c2x,c3x,col('Contact',t('Telefon: 0723.623.712<br>E-mail: edusporttrophy@gmail.com<br>Facebook: www.facebook.com/EduSportClub<br>Web: http://www.scoaladepatinaj.com'))]),
   'kv':f4([c1,c2x,c3x,contactKV(False)]),
   'kvs':f4([c1,c2x,c3x,contactKV(True)]),
   'ic':f4([c1,c2x,c3x,contactIC()])}
box=lambda k:'<div class="d2" style="min-height:0;padding:16px 40px">'+VAR[k].replace('class="f4"','class="f4" style="margin:0;border:0;padding:0"')+'</div>'
def page(k):
  f=adez(True).replace(LEG,'')
  return f.replace('<div class="d2f" style="display:block">','<div class="d2f" style="display:block">'+VAR[k])
O=lambda L,ch,title,k,desc:f'<div class="option" data-choice="{ch}" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">{L}</span> {title}</p>{box(k)}<p class="note" style="margin-top:8px">{desc}</p></div>'
opts=('<div class="options opt3" style="flex-direction:column!important">'+O('A','kv','Etichetă și valoare aliniate (text exact)','kv','Etichetele într-o coloană, valorile alături; linkurile scrise exact ca acum.')
 +O('B','kvs','Aliniate, cu linkurile scurtate','kvs','Fără "http://www." și "www.": aceleași adrese, mai ușor de citit și nu se mai rup pe 2 rânduri.')
 +O('C','icons','Iconițe mici în loc de etichete','ic','Telefon, e-mail, Facebook, web recunoscute după iconiță; cel mai compact. Linkuri scurtate.')+'</div>')
html=(css+d2css+xcss+lcss+gcss+fcss+c4+'<div class="A"><h2>Subsol în 4 coloane: coloana Contact</h2><p class="note">Varianta C (datele asociației în subsol). Acum etichetele Facebook și Web se rup pe rânduri separate de linkuri.</p><p class="cap2">Acum</p>'+box('now')
 +'<div class="sec">Variante pentru Contact</div>'+opts
 +'<div class="sec">Pagina întreagă cu B</div>'+page('kvs')+'</div>')
open(OUTJ,'w').write(html)
