import sys
S,D=sys.argv[1],sys.argv[2]
src=open(D+'/coach-flow-v5.html').read()
head=src[:src.index('<div class="cf"><h2>')]
css='''<style>
.cf .big{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:34px;line-height:1}
.cf .due{background:var(--w);border:1.5px solid var(--r);box-shadow:4px 4px 0 rgba(190,51,48,.18);padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.cf .due .big{color:var(--r)}
.cf .ok2{background:var(--w);border:1.5px solid var(--n);box-shadow:4px 4px 0 rgba(14,26,60,.16);padding:12px 14px}
.cf .ok2 .big{color:var(--ok)}
.cf .sum{display:flex;justify-content:space-between;padding:7px 12px;border-bottom:1px solid var(--bd);font-size:13px}
.cf .sum:last-child{border-bottom:0}
.cf .sum.tot{font-weight:800;font-size:14px;border-top:1.5px solid var(--n)}
.cf .prog{height:8px;background:var(--s);border:1px solid var(--n);position:relative;margin:6px 0}
.cf .prog i{position:absolute;left:0;top:0;bottom:0;background:var(--n)}
.cf .st{font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
.cf .st.ok{color:var(--ok)}.cf .st.no{color:var(--r)}
.cf .kidc{display:flex;align-items:center;gap:10px}
.cf .kidc .ava{width:36px;height:36px;font-size:13px}
.cf .proc{background:var(--s);border:1.5px solid var(--bd);padding:10px;display:flex;flex-direction:column;gap:8px}
.cf .seg{display:flex;border:1.5px solid var(--n);height:40px}
.cf .seg span{flex:1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;background:var(--w)}
.cf .seg span.on{background:var(--n);color:var(--c)}
</style>'''
CH='<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'
EYE='<svg class="chev" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>'
I={'Acasă':'<path d="M3 11l9-7 9 7v9H3z"/>','Prezență':'<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>','Plăți':'<path d="M3 7h18v10H3zM3 11h18"/>','Profil':'<path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>'}
tabs=lambda on:'<div class="tabs4">'+''.join(f'<span class="{"on" if k==on else ""}"><svg viewBox="0 0 24 24">{v}</svg>{k}</span>' for k,v in I.items())+'</div>'
def ph(n,cap,body,title,back=False,tag='',tab=None,ava='MD'):
  h='<div class="hdr"><span class="logo">EDUSPORT</span><span class="sp"></span>'+(f'<span class="ava">{ava}</span>' if ava else '')+'</div>'
  t=f'<div class="ttl">{"<span class=bk>&lsaquo;</span>" if back else ""}<b>{title}</b>{f"<small>{tag}</small>" if tag else ""}</div>'
  return f'<div><p class="cap"><span class="num">{n}</span>{cap}</p><div class="ph">{h}{t}<div class="pad">{body}</div>{tabs(tab) if tab else ""}</div></div>'
L=lambda *r:'<div class="lst">'+''.join(r)+'</div>'
E=lambda t:f'<div class="eyb">{t}</div>'
F=lambda l,v,ph2=False:f'<div class="f"><span>{l}</span><div class="in{" ph2" if ph2 else ""}">{v}</div></div>'
PW=lambda l,v='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;':f'<div class="f"><span>{l}</span><div class="in">{v}{EYE}</div></div>'
def ar(t,name,sub,right='',tsub=''):
  return f'<div class="ar"><div class="at">{t}{f"<small>{tsub}</small>" if tsub else ""}</div><div><div class="an">{name}</div><div class="as">{sub}</div></div><div class="ae">{right}</div></div>'
nr=lambda n,s,r='<span class="arw">&rsaquo;</span>':f'<div class="ar" style="grid-template-columns:1fr auto"><div><div class="an">{n}</div><div class="as">{s}</div></div><div class="ae">{r}</div></div>'
sm=lambda a,b,cls='':f'<div class="sum {cls}"><span>{a}</span><b>{b}</b></div>'
ck=lambda on:f'<span class="ck{" on" if on else ""}">{"&#x2713;" if on else ""}</span>'
G=[]
G.append(('Intrare',[
 ph('1','Invitația din email','<div class="hint">Ai primit acces la portalul EduSport pentru Maria Dumitrescu.</div>'+F('Email','parinte@exemplu.ro')+PW('Alege o parolă')+'<div class="btn">Activează contul</div>','Bine ai venit',ava=''),
 ph('1b','Intrare',F('Email','parinte@exemplu.ro')+PW('Parolă')+'<div class="btn">Intră</div><div class="lnk" style="text-align:center">Am uitat parola</div>','Intră în cont',ava='')]))
G.append(('Acasă',[
 ph('2','Sportivi (doar dacă are mai mulți)','<div class="hint">Alege sportivul.</div>'+L(nr('Maria Dumitrescu','Avansați, Uscat Juniori','<span class="st no">340 lei</span><span class="arw">&rsaquo;</span>'),nr('Andrei Dumitrescu','Școala de patinaj','<span class="st ok">la zi</span><span class="arw">&rsaquo;</span>')),'Sportivi',tab='Acasă'),
 ph('3','Acasă: copil la club','<div class="due"><div class="eyb" style="margin:0">De achitat</div><div class="big">340 lei</div><div class="hint">octombrie, până azi</div></div><div class="btn">Plătește cu cardul</div><div class="hint" style="text-align:center">Poți plăti și numerar, la club.</div>'+E('Octombrie')+L(sm('5 x antrenament grup','200 lei'),sm('2 x antrenament uscat','60 lei'),sm('1 x lecție individuală','80 lei'),sm('Total','340 lei','tot'))+E('Grupe')+L(nr('Avansați','Ma, Mi 18:15 · Andrei Popa',''),nr('Uscat Juniori','Jo 17:00 · Bianca Ene','')),'Maria Dumitrescu',tab='Acasă'),
 ph('3b','Acasă: copil la Școala de patinaj','<div class="ok2"><div class="eyb" style="margin:0">Abonament</div><div class="big" style="color:var(--n)">5 din 8</div><div class="prog"><i style="width:62%"></i></div><div class="hint">ședințe folosite · valabil până pe 24 oct</div></div><div class="btn">Reînnoiește abonamentul</div>'+E('Grupa')+L(nr('Primii Pași','Sâ 10:00 · Cristi Vlad','')),'Andrei Dumitrescu',tab='Acasă',ava='MD')]))
pres=[('7','MI','Avansați','grup, uscat · Andrei Popa'),('7','MI','Lecție individuală','50 min · Andrei Popa'),('6','MA','Avansați','grup · Andrei Popa'),('1','JO','Uscat Juniori','uscat · Bianca Ene')]
G.append(('Prezență',[
 ph('4','Prezența lunii','<div class="seg"><span>&lsaquo;</span><span class="on" style="flex:4">Octombrie 2026</span><span>&rsaquo;</span></div>'+L(sm('Prezență','83%'),sm('Ședințe','5 grup · 2 uscat · 1 individuală'))+E('Ședințe')+L(*[ar(d,g,s,tsub=w) for d,w,g,s in pres]),'Prezență',tab='Prezență')]))
G.append(('Plăți',[
 ph('5','Plătește',E('Alege ce plătești')+L(f'<div class="ar" style="grid-template-columns:auto 1fr auto"><span>{ck(1)}</span><div><div class="an">Octombrie, până azi</div><div class="as">Maria · 5 grup, 2 uscat, 1 individuală</div></div><b>340 lei</b></div>')+L(sm('Total','340 lei','tot'))+'<div class="btn">Continuă la plată</div><div class="proc"><b style="font-size:12px">Pagina procesatorului de plăți</b><div class="in ph2">Număr card</div><div class="two"><div class="in ph2">LL/AA</div><div class="in ph2">CVC</div></div><div class="hint">3-D Secure. Chitanța vine pe email.</div></div>','Plată',back=True),
 ph('6','Istoric plăți','<div class="due" style="padding:10px 12px"><div class="eyb" style="margin:0">De achitat</div><div class="big" style="font-size:24px">340 lei</div></div><div class="btn">Plătește cu cardul</div>'+E('Plăți')+L(nr('290 lei','3 oct · numerar · septembrie','<span class="st ok">plătit</span><span class="arw">&rsaquo;</span>'),nr('330 lei','4 sep · card · august','<span class="st ok">plătit</span><span class="arw">&rsaquo;</span>'),nr('80 lei','12 iul · card','<span class="st no">respinsă</span><span class="arw">&rsaquo;</span>')),'Plăți',tab='Plăți'),
 ph('6b','Detaliu plată',L(sm('Sumă','290 lei'),sm('Data','3 oct 2026'),sm('Metodă','numerar, la club'),sm('Pentru','septembrie: 6 grup, 1 individuală'),sm('Înregistrată de','Ioana Pop (club)'),sm('Factură','EDS 0131'))+'<div class="btn o">Descarcă factura (PDF)</div>','Plată 290 lei',back=True,tab='Plăți')]))
G.append(('Profil',[
 ph('7','Profil','<div style="font-family:League Spartan;font-weight:800;font-size:20px">Mihaela Dumitrescu</div><div class="hint">Părinte · Maria, Andrei</div>'+L(nr('Setări cont',''),nr('Adaugă pe ecranul principal',''),'<div class="ar" style="grid-template-columns:1fr;color:var(--r)"><div class="an">Ieși din cont</div></div>'),'Profil',tab='Profil'),
 ph('8','Setări cont',F('Nume','Mihaela Dumitrescu')+F('Email','parinte@exemplu.ro')+F('Telefon','07xx xxx xxx')+E('Schimbă parola')+PW('Parola actuală')+PW('Parola nouă')+'<div class="btn">Salvează</div>','Setări cont',back=True,tab='Profil')]))
b='<div class="cf"><h2>Portal părinte / sportiv</h2><p class="subtitle">Același portal, alt rol. Părintele vede doar copiii lui; un sportiv adult își vede doar datele lui (fără ecranul "Sportivi"). Doar citire, plus plată. Prețuri exemplu: grup 40, uscat 30, individuală 80 lei. Numele sunt inventate.</p>'
for g,ps in G: b+=f'<div class="grp"><div class="eyb">{g}</div></div><div class="row">'+''.join(ps)+'</div>'
b+='</div>'
open(D+'/parent-flow-v2.html','w').write(head+css+b)
