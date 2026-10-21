import sys,re
S,D=sys.argv[1],sys.argv[2]
def load(f):
  code=open(S+'/'+f).read()
  code=re.sub(r"\nopen\(D\+'[^']*','w'\)\.write\([^\n]*\)\s*$","\n",code.rstrip()+"\n")
  ns={'sys':sys}; sys.argv=[f,S,D]; exec(code,ns); return ns
P=load('gen_parent.py')
C=load('gen_flow.py')
ph_p=P['ph']; ph_c=C['ph']; L=P['L']; E=P['E']; F=P['F']; sm=P['sm']; nr=P['nr']
head=P['head']
css=P['css']+'''<style>
.cf .tk{background:var(--w);border:1.5px solid var(--n);box-shadow:4px 4px 0 rgba(14,26,60,.16);position:relative;overflow:hidden}
.cf .tkb{padding:12px 14px 14px}
.cf .tkt{display:flex;align-items:flex-end;gap:8px}
.cf .tkn{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:46px;line-height:.85}
.cf .tkl{font-family:"League Spartan",Inter,sans-serif;font-weight:800;letter-spacing:.08em;font-size:14px}
.cf .slants{display:flex;gap:3px;margin-bottom:4px}.cf .slants i{width:14px;height:12px;transform:skewX(-20deg);display:block}
.cf .tkg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px}
.cf .tks{height:44px;border:1.5px solid var(--n);position:relative;padding:3px 5px;font-size:10px;font-weight:700}
.cf .tks .d{position:absolute;bottom:3px;left:5px;right:5px;font-size:10px;font-weight:700;color:var(--n)}
.cf .tks.on{background:var(--n);color:var(--c)}.cf .tks.on .d{color:var(--m)}

.cf .bands{display:flex;flex-direction:column;gap:2px}.cf .bands i{height:5px;display:block}
.cf .mini{display:flex;gap:2px}.cf .mini i{width:7px;height:9px;border:1px solid var(--n);display:block}.cf .mini i.on{background:var(--n)}
.cf .w{color:var(--r)}.cf .wo{color:#b05a18}
.cf .opt3{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cf .opt3 div{background:var(--w);border:1.5px solid var(--n);padding:12px;text-align:center}
.cf .opt3 div.on{background:var(--n);color:var(--c)}
.cf .opt3 b{display:block;font-family:"League Spartan",Inter,sans-serif;font-size:28px;line-height:1}
.cf .rules{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0}
.cf .rules .bx{background:var(--w);border:1.5px solid var(--n);padding:10px 12px}
.cf .rules .bx b{display:block;margin-bottom:3px}
.cf .rules .bx small{color:var(--mu);font-size:12px}
.cf .qs .option{margin:0}
.cf .rtag{font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--c);background:var(--r);padding:2px 6px}
</style>'''
COL=['var(--color-burgundy,#6e4256)','#be3330','#ea7233','#efb22b']
stripe=''.join(f'<i style="background:{c}"></i>' for c in COL)
def ticket(n,used,name,dates):
  boxes=''.join(f'<div class="tks{" on" if i<used else ""}" style="--cc:{COL[i%4]}">{i+1}<span class="d">{dates[i] if i<used else ""}</span></div>' for i in range(n))
  return f'<div class="tk"><div class="tkb"><div class="tkt"><span class="tkn">{n}</span><div class="tkl">ȘEDINȚE</div></div><div class="hint" style="margin-top:6px">{name}</div><div class="tkg">{boxes}</div></div><div class="bands">{stripe}</div></div>'
mini=lambda n,u:'<span class="mini">'+''.join(f'<i class="{"on" if i<u else ""}"></i>' for i in range(n))+'</span>'
CH='<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'
ck=lambda on:f'<span class="ck{" on" if on else ""}">{"&#x2713;" if on else ""}</span>'
ar=C['ar']
# coach
c1=ph_c('Ș1','Antrenor: sâmbătă la Școală',E('Școala de patinaj')+L(ar('10:00','Primii Pași','școală · 12 copii · 50 min',done=True),ar('11:00','Intermediari Silver','școală · 10 copii · 50 min'),ar('12:00','Avansați Silver','școală · 9 copii · 50 min')),'Bună, Andrei',tag='SÂ 10 OCT',tab='Azi')
rows=[('Ana Bălan',8,5,'până 24 oct','',1),('Luca Stoica',6,6,'abonament terminat','w',1),('Radu Vasile',8,8,'abonament terminat','w',1),('Irina Nistor',6,3,'până 31 oct','',0),('Mara Toma',0,0,'fără abonament','w',1)]
def line2(t,u,st):
  if st=='terminat': return f'{mini(t,u)}<small style="font-size:11px">{u}/{t}</small><span class="rtag">Terminat</span>'
  if st=='fara': return '<span class="rtag">Fără abonament</span>'
  return f'{mini(t,u)}<small style="font-size:11px">{u}/{t} · până {st}</small>'
rows2=[('Ana Bălan',8,5,'24 oct',1),('Luca Stoica',6,6,'terminat',1),('Radu Vasile',8,8,'terminat',1),('Irina Nistor',6,3,'31 oct',0),('Mara Toma',0,0,'fara',1)]
pr='<div class="grid3 gh" style="grid-template-columns:1fr 64px"><span>Sportiv</span><span>Prezent</span></div>'+L(*[f'<div class="grid3 gr" style="grid-template-columns:1fr 64px"><span><b>{n}</b><span style="display:flex;gap:6px;align-items:center;margin-top:4px;white-space:nowrap">{line2(t,u,st)}</span></span>{ck(pp)}</div>' for n,t,u,st,pp in rows2])
c2=ph_c('Ș2','Antrenor: prezența la Școală',C['coach']+pr+'<div class="hint">Bifa folosește o ședință din abonament. Fără abonament valid, ședința rămâne "de plătit" pentru recepție.</div><div class="btn" style="margin-top:auto">Salvează · 4 prezenți</div>','Intermediari Silver',back=True,tag='SÂ 10 OCT')
# parent
dates=['3 oct','4 oct','10 oct','11 oct','17 oct']
p1=ph_p('Ș3','Părinte: abonamentul digital',ticket(8,5,'Andrei Dumitrescu · Primii Pași',dates)+L(sm('Început','3 oct'),sm('Sfârșit','7 nov'))+'<div class="hint">Datele se pot schimba dacă școala are un weekend liber.</div>'+'<div class="btn">Cumpără abonamentul următor</div>','Andrei Dumitrescu',tab='Acasă')
p2=ph_p('Ș4','Părinte: cumpără abonament','<div class="opt3"><div class="on"><b>8</b>ședințe<br><small>sâmbătă + duminică</small><br><b style="font-size:18px;margin-top:6px">400 lei</b></div><div><b>6</b>ședințe<br><small>flexibil</small><br><b style="font-size:18px;margin-top:6px">330 lei</b></div></div>'+F('Începe','după abonamentul actual (8 nov)')+'<div class="hint">4 weekenduri de școală. Weekendurile libere din calendar nu se numără.</div><div class="btn" style="margin-top:auto">Plătește 400 lei cu cardul</div><div class="hint" style="text-align:center">Poți plăti și numerar, la club.</div>','Abonament nou',back=True)
# admin desktop snippet
adm=('<div class="lst" style="max-width:820px"><div class="ar" style="grid-template-columns:1fr auto"><div><div class="an" style="font-family:League Spartan;font-size:20px">Intermediari Silver · abonamente</div><div class="as">Sâ, Du 11:00 · Andrei Popa, Bianca Ene</div></div><span class="btn" style="height:40px;padding:0 16px">+ Abonament (numerar)</span></div>'
 +''.join(f'<div class="ar" style="grid-template-columns:200px 120px 1fr 140px auto"><div class="an">{n}</div><div class="as">{t} ședințe</div><div style="display:flex;gap:6px;align-items:center">{mini(t,u)}<span class="as">{u} / {t}</span></div><div class="as {c}">{v}</div><span class="arw">&rsaquo;</span></div>' for n,t,u,v,c in [('Ana Bălan',8,5,'până 7 nov',''),('Luca Stoica',6,6,'terminat','w'),('Radu Vasile',8,8,'terminat','w'),('Irina Nistor',6,3,'până 31 oct','')])
 +'<div class="ar" style="grid-template-columns:200px 1fr auto"><div class="an">Mara Toma</div><div class="as w">fără abonament · 1 ședință de plătit (10 oct)</div><span class="arw">&rsaquo;</span></div></div>')
rules='''<div class="rules">
<div class="bx"><b>Abonament</b><small>6 sau 8 ședințe, plătit înainte. Valabil 4 weekenduri de școală.</small></div>
<div class="bx"><b>Weekend liber</b><small>Un weekend marcat Liber în calendar nu se numără: valabilitatea se prelungește singură cu un weekend.</small></div>
<div class="bx"><b>Prezența</b><small>Antrenorul bifează; bifa consumă o căsuță. Ce era pe biletul fizic e acum pe telefonul părintelui.</small></div>
</div>'''
qs='''<div class="label" style="margin-top:16px">De lămurit</div><div class="options qs" data-multiselect>
<div class="option" data-choice="s-unused" onclick="toggleSelect(this)"><div class="letter">1</div><div class="content"><h3>Ședințele nefolosite la expirare</h3><p>se pierd / se mută pe abonamentul următor / decide adminul</p></div></div>
<div class="option" data-choice="s-start" onclick="toggleSelect(this)"><div class="letter">2</div><div class="content"><h3>De când curg cele 4 weekenduri</h3><p>de la plată / de la prima ședință</p></div></div>
<div class="option" data-choice="s-6" onclick="toggleSelect(this)"><div class="letter">3</div><div class="content"><h3>Abonamentul de 6</h3><p>e pentru o zi pe săptămână sau flexibil (oricare zi, maxim 6)?</p></div></div>
<div class="option" data-choice="s-paper" onclick="toggleSelect(this)"><div class="letter">4</div><div class="content"><h3>Biletul de hârtie</h3><p>rămâne în paralel o perioadă / dispare</p></div></div>
</div>'''
b=('<div class="cf"><h2>Școala de patinaj: abonamentul digital</h2><p class="subtitle">Biletul de hârtie (6 sau 8 căsuțe) devine un abonament în portal. Antrenorul bifează prezența, căsuța se completează singură, părintele vede biletul pe telefon. Prețuri exemplu. Numele sunt inventate.</p>'
 +rules+'<div class="grp"><div class="eyb">Antrenor</div></div><div class="row">'+c1+c2+'</div><div class="grp"><div class="eyb">Părinte</div></div><div class="row">'+p1+p2+'</div><div class="grp"><div class="eyb">Admin (desktop)</div></div>'+adm+qs+'</div>')
open(D+'/scoala-v5.html','w').write(head+css+b)
