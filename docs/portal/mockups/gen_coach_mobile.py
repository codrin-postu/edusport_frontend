import sys
S,D=sys.argv[1],sys.argv[2]
st=open(S+'/st.html').read()
css='''<style>
@import url('https://fonts.googleapis.com/css2?family=Climate+Crisis&display=swap');
.cf .ph{width:300px;min-height:600px;border:1.5px solid var(--n);background:var(--c);box-shadow:6px 6px 0 rgba(14,26,60,.16);display:flex;flex-direction:column}
.cf .hdr{background:var(--n);padding:10px 12px;display:flex;align-items:center;gap:8px}
.cf .logo{font-family:"Climate Crisis",Inter,sans-serif;color:var(--c);font-size:17px;letter-spacing:.04em;line-height:1}
.cf .hdr .sp{flex:1}
.cf .ava{width:26px;height:26px;background:var(--m);color:var(--n);display:grid;place-items:center;font-weight:800;font-size:11px}
.cf .ttl{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--bd);background:var(--c)}
.cf .ttl b{font-family:"League Spartan",Inter,sans-serif;font-size:18px;flex:1;line-height:1.1}
.cf .ttl small{font-size:10px;font-weight:800;letter-spacing:.06em;color:var(--r)}
.cf .bk{font-size:18px;font-weight:800}
.cf .pad{padding:12px;display:flex;flex-direction:column;gap:8px;flex:1}
.cf .tabs4{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--bd);background:var(--w);margin-top:auto}
.cf .tabs4 span{padding:7px 0 6px;text-align:center;font-size:10px;font-weight:700;color:var(--mu);display:flex;flex-direction:column;align-items:center;gap:2px}
.cf .tabs4 span.on{color:var(--n);box-shadow:inset 0 2px 0 var(--n)}
.cf .tabs4 svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2}
.cf .lst{background:var(--w);border:1.5px solid var(--n);box-shadow:4px 4px 0 rgba(14,26,60,.16)}
.cf .ar{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--bd)}
.cf .ar:last-child{border-bottom:0}
.cf .ar.done{background:var(--s)}
.cf .ar.mut{color:var(--mu)}
.cf .at{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:17px;line-height:1;min-width:40px}
.cf .at small{display:block;font-family:Inter;font-size:10px;color:var(--mu);font-weight:700;margin-top:2px}
.cf .an{font-weight:700;line-height:1.25}
.cf .as{font-size:11px;color:var(--mu);margin-top:2px}
.cf .ae{display:flex;align-items:center;gap:6px}
.cf .cmp{font-size:12px;font-weight:700;color:var(--ok)}
.cf .arw{font-size:20px;font-weight:800;color:var(--n)}
.cf .tag{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;background:var(--s);padding:2px 5px;margin-left:4px}
.cf .eyb{margin-top:4px}
.cf .f{display:flex;flex-direction:column;gap:3px}
.cf .f>span{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.cf .in{height:38px;border:1.5px solid var(--n);background:var(--w);padding:0 10px;display:flex;align-items:center;justify-content:space-between}
.cf .in.ph2{color:#9a9ca6}
.cf .chev{width:20px;height:20px;fill:none;stroke:var(--n);stroke-width:2.2;flex-shrink:0}
.cf .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cf .lnk{font-size:12px;font-weight:700;text-decoration:underline}
.cf .hint{font-size:11px;color:var(--mu)}
.cf .btn{display:flex;align-items:center;justify-content:center;height:42px;background:var(--n);color:var(--c);font-weight:700;border:1.5px solid var(--n)}
.cf .btn.o{background:var(--w);color:var(--n)}
.cf .grid3{display:grid;grid-template-columns:1fr 52px 52px;align-items:center}
.cf .gh{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);padding:0 12px}
.cf .gh span:not(:first-child){text-align:center}
.cf .gr{padding:9px 12px;border-bottom:1px solid var(--bd);font-weight:600;font-size:12px}
.cf .gr:last-child{border-bottom:0}
.cf .ck{width:22px;height:22px;border:1.5px solid var(--n);background:var(--w);display:grid;place-items:center;font-weight:800;font-size:12px;margin:0 auto}
.cf .ck.on{background:var(--n);color:var(--c)}
.cf .ban{background:var(--h);border-left:4px solid var(--n);padding:8px 10px;font-weight:700;font-size:12px}
.cf .ban small{display:block;font-weight:400;color:var(--mu)}
.cf .inf{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid var(--bd);font-size:12px}
.cf .inf:last-child{border-bottom:0}
.cf .inf b{font-weight:700;text-align:right}
.cf .tp{border:1.5px solid var(--n);background:var(--w);box-shadow:4px 4px 0 rgba(14,26,60,.16)}
.cf .tpc{display:grid;grid-template-columns:1fr 1fr}
.cf .tc{border-right:1px solid var(--bd)}.cf .tc:last-child{border-right:0}
.cf .tch{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);padding:6px 10px;border-bottom:1px solid var(--bd)}
.cf .tv{padding:6px 10px;font-weight:600;text-align:center}.cf .tv.on{background:var(--n);color:var(--c)}
.cf .tpf{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-top:1px solid var(--bd);font-weight:700}
.cf .tpf .btn{height:30px;padding:0 12px}
.cf .num{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 4px;background:var(--r);color:var(--c);font-weight:800;font-size:11px;margin-right:6px}
.cf .grp{margin:24px 0 8px;padding-top:12px;border-top:2px solid var(--n)}
.cf .menu .inf{padding:12px}
.cf .dchip{display:inline-flex;align-items:center;gap:4px;border:1.5px solid var(--n);background:var(--w);padding:4px 6px;font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--n)}
.cf .dchip svg{width:14px;height:14px;fill:none;stroke:var(--n);stroke-width:2}
.cf .cal{border:1.5px solid var(--n);background:var(--w);box-shadow:4px 4px 0 rgba(14,26,60,.16);padding:8px}
.cf .calh{display:flex;justify-content:space-between;align-items:center;font-weight:800;padding:2px 2px 8px}
.cf .calg{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:12px}
.cf .calg b{font-size:10px;color:var(--mu);padding:3px 0}
.cf .calg span{height:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:600;position:relative}
.cf .calg span.out{color:var(--bd)}
.cf .calg span.has::after{content:"";position:absolute;bottom:3px;width:12px;height:2px;background:var(--n)}
.cf .calg span.sel{background:var(--r);color:var(--c);font-weight:800}
.cf .calg span.sel::after{background:var(--c)}
.cf .calg span.today{box-shadow:inset 0 0 0 1.5px var(--n)}
.cf .legend2{display:flex;gap:12px;font-size:11px;color:var(--mu);margin-top:6px;align-items:center}
.cf .legend2 i{display:inline-block;width:12px;height:2px;background:var(--n);vertical-align:middle;margin-right:4px}
.cf .warn{background:var(--w);border:1.5px solid var(--r);box-shadow:4px 4px 0 rgba(190,51,48,.18);padding:10px 12px}
.cf .warn b{display:block;color:var(--r);margin-bottom:3px}
.cf .warn .btns{display:flex;flex-direction:column;gap:6px;margin-top:10px}

</style>'''
CH='<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'
I={'Azi':'<path d="M3 11l9-7 9 7v9H3z"/>','Grupe':'<path d="M4 6h16M4 12h16M4 18h16"/>','Istoric':'<path d="M12 7v5l3 2M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0"/>','Profil':'<path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>'}
tabs=lambda on:'<div class="tabs4">'+''.join(f'<span class="{"on" if k==on else ""}"><svg viewBox="0 0 24 24">{v}</svg>{k}</span>' for k,v in I.items())+'</div>'
def ph(n,cap,body,title,back=False,tag='',tab=None,ava=True):
  h='<div class="hdr"><span class="logo">EDUSPORT</span><span class="sp"></span>'+('<span class="ava">AP</span>' if ava else '')+'</div>'
  t=f'<div class="ttl">{"<span class=bk>&lsaquo;</span>" if back else ""}<b>{title}</b>{f"<small>{tag}</small>" if tag else ""}</div>'
  return f'<div><p class="cap"><span class="num">{n}</span>{cap}</p><div class="ph">{h}{t}<div class="pad">{body}</div>{tabs(tab) if tab else ""}</div></div>'
def ar(t,name,sub,done=False,tsub='',extra='',mut=False,arrow=True):
  return f'<div class="ar{" done" if done else ""}{" mut" if mut else ""}"><div class="at">{t}{f"<small>{tsub}</small>" if tsub else ""}</div><div><div class="an">{name}{extra}</div><div class="as">{sub}</div></div><div class="ae">{"<span class=cmp>Completat</span>" if done else ""}{"<span class=arw>&rsaquo;</span>" if arrow else ""}</div></div>'
def nr(name,sub='',extra='',add=None):
  right='<span class="arw">&rsaquo;</span>' if add is None else add
  return f'<div class="ar" style="grid-template-columns:1fr auto"><div><div class="an">{name}{extra}</div>{f"<div class=as>{sub}</div>" if sub else ""}</div><div class="ae">{right}</div></div>'
L=lambda *r:'<div class="lst">'+''.join(r)+'</div>'
E=lambda t:f'<div class="eyb">{t}</div>'
F=lambda l,v,ph2=False,sel=False:f'<div class="f"><span>{l}</span><div class="in{" ph2" if ph2 else ""}">{v}{CH if sel else ""}</div></div>'
EYE='<svg class="chev" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>'
PW=lambda l,v:f'<div class="f"><span>{l}</span><div class="in">{v}{EYE}</div></div>'
CALI='<svg viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>'
DCH=lambda d:f'<span class="dchip">{CALI}{d}<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></span>'
coach='<div class="f"><span>Antrenor</span><div class="in">Andrei Popa (tu)'+CH+'</div><div class="lnk">+ Adaugă alți antrenori</div></div>'
ck=lambda on:f'<span class="ck{" on" if on else ""}">{"&#x2713;" if on else ""}</span>'
def pres(rows):
  return '<div class="grid3 gh"><span>Sportiv</span><span>Grup</span><span>Uscat</span></div>'+L(*[f'<div class="grid3 gr"><span>{n}</span>{ck(g)}{ck(u)}</div>' for n,g,u in rows])

PRESX=[
 ph('5a','Altă zi: alege data','<div class="hint">Alege ziua pentru care faci prezența.</div>'+'<div class="cal"><div class="calh"><span>&lsaquo;</span><span>Octombrie 2026</span><span>&rsaquo;</span></div><div class="calg">'+''.join(f'<b>{d}</b>' for d in ['L','M','M','J','V','S','D'])+''.join(f'<span class="{c}">{n}</span>' for n,c in [('28', 'out'), ('29', 'out'), ('30', 'out has'), ('1', ''), ('2', ''), ('3', ''), ('4', ''), ('5', ''), ('6', 'today has'), ('7', 'has'), ('8', ''), ('9', ''), ('10', ''), ('11', ''), ('12', ''), ('13', 'has'), ('14', 'has'), ('15', ''), ('16', 'sel'), ('17', ''), ('18', '')])+'</div><div class="legend2"><span><i></i>are prezență salvată</span></div></div>'+'<div class="btn" style="margin-top:auto">Alege vineri 16 oct</div>','Avansați',back=True,tag=DCH('MA 6 OCT')),
 ph('5b','Zi cu prezență deja salvată','<div class="cal"><div class="calh"><span>&lsaquo;</span><span>Octombrie 2026</span><span>&rsaquo;</span></div><div class="calg">'+''.join(f'<b>{d}</b>' for d in ['L','M','M','J','V','S','D'])+''.join(f'<span class="{c}">{n}</span>' for n,c in [('28', 'out'), ('29', 'out'), ('30', 'out has'), ('1', ''), ('2', ''), ('3', ''), ('4', ''), ('5', ''), ('6', 'today has'), ('7', 'has'), ('8', ''), ('9', ''), ('10', ''), ('11', ''), ('12', ''), ('13', 'has sel'), ('14', 'has'), ('15', ''), ('16', ''), ('17', ''), ('18', '')])+'</div><div class="legend2"><span><i></i>are prezență salvată</span></div></div>'+'<div class="warn"><b>Există deja o ședință salvată</b>Ma 13 oct, grup · 8 prezenți, de Bianca Ene.<div class="btns"><span class="btn">Deschide prezența salvată</span><span class="btn o">Adaugă încă o ședință în ziua asta</span></div></div>','Avansați',back=True,tag=DCH('MA 13 OCT'))]
G=[]
G.append(('Intrare',[
 ph('1','Intrare',F('Email','andrei@exemplu.ro')+PW('Parolă','&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;')+'<div class="btn">Intră</div><div class="lnk" style="text-align:center">Am uitat parola</div>','Intră în cont',ava=False),
 ph('1b','Am uitat parola',F('Email','andrei@exemplu.ro')+'<div class="btn">Trimite codul</div>'+F('Cod din email','4 8 2 9 1 7')+PW('Parolă nouă','&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;')+'<div class="btn">Salvează parola</div>','Parolă nouă',back=True,ava=False)]))
G.append(('Azi',[
 ph('2','Azi',E('Grupe')+L(ar('10:00','Primii Pași','grup · 12 copii',done=True),ar('18:15','Avansați','grup · 9 copii'))+E('Lecții individuale')+L(ar('16:00','Maria Dumitrescu','individuală · 50 min'),ar('17:00','Ioana Marinescu','individuală · 50 min',done=True))+'<div class="btn o">+ Lecție individuală</div>'+E('De făcut')+L(ar('Mi 30','Avansați','grup · 30 sep')),'Bună, Andrei',tag='MA 6 OCT',tab='Azi')]))
G.append(('Grupe',[
 ph('3','Grupe',E('Grupele mele')+L(nr('Avansați','Ma, Mi 18:15 · 9 copii'),nr('Uscat Juniori','Jo 17:00 · 7 copii'))+E('Alte grupe &#x25BE;')+L(nr('Intermediari Silver','Antrenor: Bianca Ene'),nr('Primii Pași','Antrenor: Cristi Vlad')),'Grupe',tab='Grupe'),
 ph('4','Grupa mea',L('<div class="inf"><span>Program</span><b>Ma, Mi 18:15</b></div><div class="inf"><span>Antrenori</span><b>Andrei Popa, Bianca Ene</b></div>')+'<div class="btn">Fă prezența</div>'+E('Sportivi · 9')+L(nr('Ioana Marinescu','12 ani'),nr('Maria Dumitrescu','12 ani · și în Uscat Juniori'),nr('Sofia Tudor','10 ani',extra='<span class="tag">nou</span>'))+'<div class="btn o">+ Adaugă sportiv</div>','Avansați',back=True,tab='Grupe'),
 ph('5','Prezența grupei',coach+pres([('Ioana Marinescu',1,1),('Maria Dumitrescu',1,0),('Elena Radu',0,0),('Sofia Tudor',1,1)])+'<div class="btn" style="margin-top:auto">Salvează · 3 prezenți</div>','Avansați',back=True,tag=DCH('MA 6 OCT'))]+PRESX))
G.append(('Grupa altui antrenor',[
 ph('6','Grupa altui antrenor','<div class="ban">Grupa altui antrenor</div>'+L('<div class="inf"><span>Program</span><b>Sâ 11:00</b></div>')+'<div class="btn o">Înlocuiesc azi</div>'+E('Sportivi · 11')+L(nr('Ana Bălan','9 ani'),nr('Luca Stoica','8 ani')),'Intermediari Silver',back=True,tab='Grupe'),
 ph('6b','Prezența ca înlocuitor','<div class="ban">Grupa altui antrenor<small>Vei apărea ca antrenor la această ședință.</small></div>'+coach+pres([('Ana Bălan',1,0),('Luca Stoica',1,0)])+'<div class="btn" style="margin-top:auto">Salvează · 2 prezenți</div>','Intermediari Silver',back=True,tag='SÂ 10 OCT')]))
pick='<div class="f"><span>Durată</span><div class="in">1 h 15 min'+CH+'</div><div class="tp"><div class="tpc"><div class="tc"><div class="tch">Ore</div>'+''.join(f'<div class="tv{" on" if v=="1" else ""}">{v}</div>' for v in ['0','1','2','3'])+'</div><div class="tc"><div class="tch">Minute</div>'+''.join(f'<div class="tv{" on" if v=="15" else ""}">{v}</div>' for v in ['00','05','10','15'])+'</div></div><div class="tpf"><span>1 h 15 min</span><span class="btn">OK</span></div></div></div>'
G.append(('Lecție individuală',[
 ph('7','Lecție nouă',F('Sportiv','Maria Dumitrescu',sel=True)+'<div class="two">'+F('Data','06.10.2026')+F('Ora','16:00')+'</div>'+F('Durată','50 min',sel=True)+coach+'<div class="btn" style="margin-top:auto">Salvează lecția</div>','Lecție individuală',back=True),
 ph('7b','Durată',F('Sportiv','Maria Dumitrescu',sel=True)+pick,'Lecție individuală',back=True),
 ph('7c','Prezența lecției',coach+'<div class="grid3 gh" style="grid-template-columns:1fr 70px"><span>Sportiv</span><span>Prezent</span></div>'+L('<div class="grid3 gr" style="grid-template-columns:1fr 70px"><span>Maria Dumitrescu<br><small class="hint">16:00 · 50 min</small></span>'+ck(1)+'</div>')+F('Durată','50 min',sel=True)+'<div class="btn" style="margin-top:auto">Salvează prezența</div>','Lecție individuală',back=True,tag='MA 6 OCT')]))
plus='<span class="arw" style="font-size:18px">+</span>'
G.append(('Adaugă sportiv',[
 ph('8','Caută întâi','<div class="in">Ana|</div>'+E('În club')+L(nr('Ana Bălan','9 ani · Primii Pași',add=plus),nr('Ana-Maria Cristea','11 ani · Uscat Juniori',add=plus),'<div class="ar mut" style="grid-template-columns:1fr auto"><div><div class="an">Ana Pavel</div><div class="as">deja în Avansați</div></div><div></div></div>')+E('Înscrieri noi')+L(nr('Ana Dobre','8 ani · înscrisă 28 sep',add=plus))+'<div class="btn o" style="margin-top:auto">Nu e în listă: sportiv nou</div>','Adaugă în Avansați',back=True),
 ph('8b','Ales din listă',L(nr('Ana-Maria Cristea','11 ani · Uscat Juniori',add='<span class="cmp" style="font-size:16px">&#x2713;</span>'),nr('Ana Bălan','9 ani · Primii Pași',add=plus))+F('Din data','06.10.2026')+'<div class="btn" style="margin-top:auto">Adaugă 1 sportiv</div>','Adaugă în Avansați',back=True),
 ph('8c','Sportiv nou',F('Nume și prenume','ex. Ana Popescu',ph2=True)+F('Data nașterii','zz.ll.aaaa',ph2=True)+F('Telefon părinte','07xx xxx xxx',ph2=True)+'<div class="f"><span>Email părinte</span><div class="in ph2">opțional</div><div class="hint">Părintele primește acces la prezență, istoric și plăți.</div></div><div class="btn" style="margin-top:auto">Adaugă în Avansați</div>','Sportiv nou',back=True)]))
G.append(('Sportiv, istoric, cont',[
 ph('9','Fișa sportivului',L('<div class="inf"><span>Grupe</span><b>Avansați, Uscat Juniori</b></div><div class="inf"><span>Octombrie</span><b>5 grup · 2 uscat · 1 individuală</b></div><div class="inf"><span>Prezență</span><b>83%</b></div>')+E('Ultimele')+L(ar('7','Avansați','grup, uscat',tsub='MI',arrow=False),ar('6','Individuală','50 min',tsub='MA',arrow=False),ar('6','Avansați','grup',tsub='MA',arrow=False)),'Maria Dumitrescu',back=True,tag='12 ANI',tab='Grupe'),
 ph('10','Istoric',L(ar('7','Avansați','grup · 8 prezenți',tsub='MI'),ar('7','Maria Dumitrescu','individuală · 50 min',tsub='MI'),ar('6','Avansați','grup · 9 prezenți',tsub='MA'),ar('4','Intermediari Silver','înlocuitor · 10 prezenți',tsub='SÂ')),'Istoric',tag='OCTOMBRIE',tab='Istoric'),
 ph('11','Profil','<div style="font-family:League Spartan;font-weight:800;font-size:20px">Andrei Popa</div><div class="hint">Antrenor</div>'+L('<div class="inf"><span>Setări cont</span><b>&rsaquo;</b></div><div class="inf"><span>Adaugă pe ecranul principal</span><b>&rsaquo;</b></div><div class="inf" style="color:var(--r)"><span>Ieși din cont</span><b></b></div>'),'Profil',tab='Profil'),
 ph('12','Setări cont',F('Nume','Andrei Popa')+F('Email','andrei@exemplu.ro')+F('Telefon','07xx xxx xxx')+E('Schimbă parola')+PW('Parola actuală','&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;')+PW('Parola nouă','&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;')+'<div class="btn">Salvează</div>','Setări cont',back=True,tab='Profil')]))
b='<div class="cf"><h2>Portal antrenor: fluxul complet</h2><p class="subtitle">Toate deciziile de până acum. Numele sunt inventate.</p>'
for g,ps in G: b+=f'<div class="grp"><div class="eyb">{g}</div></div><div class="row">'+''.join(ps)+'</div>'
b+='</div>'
open(D+'/coach-flow-v5.html','w').write(st+css+b)
