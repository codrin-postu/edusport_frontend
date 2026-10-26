import sys
S,D=sys.argv[1],sys.argv[2]
src=open(D+'/coach-flow-v5.html').read()
head=src[:src.index('<div class="cf"><h2>')]
css='''<style>
.cf .dk{width:1180px;border:1.5px solid var(--n);background:var(--c);box-shadow:6px 6px 0 rgba(14,26,60,.16);position:relative;overflow:hidden}
.cf .dbar{background:var(--n);display:flex;align-items:center;gap:28px;padding:0 24px;height:60px}
.cf .dbar .logo{font-size:20px}
.cf .dnav{display:flex;gap:4px;height:100%}
.cf .dnav span{display:flex;align-items:center;padding:0 14px;color:#b9bfd0;font-weight:700;font-size:13px}
.cf .dnav span.on{color:var(--c);box-shadow:inset 0 -3px 0 var(--c)}
.cf .duser{margin-left:auto;display:flex;align-items:center;gap:10px;color:var(--c);font-weight:700;font-size:13px}
.cf .dbody{padding:22px 24px;display:grid;gap:20px;min-height:560px}
.cf .dbody.md{grid-template-columns:380px 1fr}
.cf .dtitle{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.cf .dtitle b{font-family:"League Spartan",Inter,sans-serif;font-size:26px;line-height:1}
.cf .dtitle .sp{flex:1}
.cf .ar.sel{box-shadow:inset 4px 0 0 var(--r);background:var(--h)}
.cf .panel{background:var(--w);border:1.5px solid var(--n);box-shadow:4px 4px 0 rgba(14,26,60,.16);padding:18px 20px;display:flex;flex-direction:column;gap:12px}
.cf .tbl{width:100%;border-collapse:collapse;font-size:13px}
.cf .tbl th{text-align:left;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);padding:8px 10px;border-bottom:1.5px solid var(--n)}
.cf .tbl td{padding:10px;border-bottom:1px solid var(--bd)}
.cf .tbl tr:last-child td{border-bottom:0}
.cf .tbl td.c,.cf .tbl th.c{text-align:center}
.cf .row2{display:flex;gap:12px;align-items:flex-end}
.cf .row2>*{flex:1}
.cf .btn.w{width:auto;padding:0 20px;display:inline-flex}
.cf .ov{position:absolute;inset:60px 0 0 0;background:rgba(14,26,60,.35);display:flex;align-items:flex-start;justify-content:center;padding-top:50px}
.cf .dlg{width:460px;background:var(--c);border:1.5px solid var(--n);box-shadow:8px 8px 0 rgba(14,26,60,.25)}
.cf .dlgh{display:flex;align-items:center;padding:14px 18px;border-bottom:1px solid var(--bd)}
.cf .dlgh b{font-family:"League Spartan",Inter,sans-serif;font-size:20px;flex:1}
.cf .dlgb{padding:16px 18px;display:flex;flex-direction:column;gap:10px}
.cf .dlgf{display:flex;justify-content:flex-end;gap:8px;padding:12px 18px;border-top:1px solid var(--bd)}
.cf .seg{display:inline-flex;border:1.5px solid var(--n)}
.cf .seg span{padding:6px 14px;font-weight:700;font-size:12px;background:var(--w)}
.cf .seg span.on{background:var(--n);color:var(--c)}
.cf .menu2{position:absolute;right:16px;top:58px;width:220px;background:var(--w);border:1.5px solid var(--n);box-shadow:4px 4px 0 rgba(14,26,60,.16);z-index:3}
.cf .menu2 div{padding:11px 14px;border-bottom:1px solid var(--bd);font-weight:600;font-size:13px}
.cf .menu2 div:last-child{border-bottom:0;color:var(--r)}
.cf .dcap{margin:26px 0 8px;font-weight:800}
.cf .tbl th{background:none!important;color:var(--mu)!important;border:0!important;border-bottom:1.5px solid var(--n)!important;text-align:left!important;white-space:nowrap}
.cf .tbl td{border:0!important;border-bottom:1px solid var(--bd)!important;text-align:left!important;background:none!important}
.cf .tbl tr:last-child td{border-bottom:0!important}
.cf .tbl td.c,.cf .tbl th.c{text-align:center!important}
.cf .dtitle .btn,.cf .dtitle .seg{height:40px;box-sizing:border-box}
.cf .dtitle .seg span{height:100%;display:flex;align-items:center;box-sizing:border-box}
.cf .dtitle .btn{padding:0 16px}
.cf .dlgf .btn{height:40px}
.cf .tbl{border:0!important;box-shadow:none!important;background:none!important}
.cf .dbody .eyb{margin-top:14px;margin-bottom:6px}
.cf .dbody{min-height:660px}

</style>'''
CH='<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'
CAL='<svg viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>'
EYE='<svg class="chev" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>'
dch=lambda d:f'<span class="dchip">{CAL}{d}<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></span>'
def bar(on,menu=False):
  nav=''.join(f'<span class="{"on" if k==on else ""}">{k}</span>' for k in ['Azi','Grupe','Istoric'])
  return f'<div class="dbar"><span class="logo">EDUSPORT</span><div class="dnav">{nav}</div><div class="duser">Andrei Popa<span class="ava">AP</span></div></div>'+('<div class="menu2"><div>Setări cont</div><div>Adaugă pe ecranul principal</div><div>Ieși din cont</div></div>' if menu else '')
def ar(t,name,sub,done=False,sel=False,tsub=''):
  return f'<div class="ar{" done" if done else ""}{" sel" if sel else ""}"><div class="at">{t}{f"<small>{tsub}</small>" if tsub else ""}</div><div><div class="an">{name}</div><div class="as">{sub}</div></div><div class="ae">{"<span class=cmp>Completat</span>" if done else ""}<span class="arw">&rsaquo;</span></div></div>'
L=lambda *r:'<div class="lst">'+''.join(r)+'</div>'
E=lambda t:f'<div class="eyb">{t}</div>'
F=lambda l,v,sel=False,ph=False:f'<div class="f"><span>{l}</span><div class="in{" ph2" if ph else ""}">{v}{CH if sel else ""}</div></div>'
ck=lambda on:f'<span class="ck{" on" if on else ""}">{"&#x2713;" if on else ""}</span>'
coach=F('Antrenor','Andrei Popa (tu)',sel=True)
def frame(cap,on,body,cls='',menu=False,over=''):
  return f'<div class="dcap">{cap}</div><div class="dk">{bar(on,menu)}<div class="dbody {cls}">{body}</div>{over}</div>'
left=E('Grupe')+L(ar('10:00','Primii Pași','grup · 12 copii',done=True),ar('18:15','Avansați','grup · 9 copii',sel=True))+E('Lecții individuale')+L(ar('16:00','Maria Dumitrescu','individuală · 50 min'),ar('17:00','Ioana Marinescu','individuală · 50 min',done=True))+'<div class="btn o">+ Lecție individuală</div>'+E('De făcut')+L(ar('Mi 30','Avansați','grup · 30 sep'))
rows=[('Ioana Marinescu','12 ani',1,1),('Maria Dumitrescu','12 ani',1,0),('Elena Radu','11 ani',0,0),('Sofia Tudor','10 ani',1,1),('Alexia Petrescu','12 ani',1,0),('Daria Constantin','11 ani',1,0)]
pres=('<div class="panel"><div class="dtitle"><b>Avansați</b>'+dch('MA 6 OCT')+'<span class="sp"></span><span class="hint">18:15 - 19:15</span></div>'
 '<div class="row2">'+coach+'<div style="flex:0 0 auto;padding-bottom:10px"><span class="lnk">+ Adaugă alți antrenori</span></div></div>'
 '<table class="tbl"><tr><th>Sportiv</th><th>Vârstă</th><th class="c">Grup</th><th class="c">Uscat</th></tr>'+''.join(f'<tr><td><b>{n}</b></td><td class="hint">{a}</td><td class="c">{ck(g)}</td><td class="c">{ck(u)}</td></tr>' for n,a,g,u in rows)+'</table>'
 '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px"><span class="hint">5 prezenți la grup · 2 la uscat</span><span class="btn w">Salvează prezența</span></div></div>')
F1=frame('D1. Azi: lista în stânga, prezența în dreapta','Azi','<div>'+'<div class="dtitle"><b>Bună, Andrei</b><span class="sp"></span><span class="hint">Marți, 6 octombrie</span></div>'+left+'</div>'+pres,'md')
glist=E('Grupele mele')+L('<div class="ar sel" style="grid-template-columns:1fr auto"><div><div class="an">Avansați</div><div class="as">Ma, Mi 18:15 · 9 copii</div></div><span class="arw">&rsaquo;</span></div>','<div class="ar" style="grid-template-columns:1fr auto"><div><div class="an">Uscat Juniori</div><div class="as">Jo 17:00 · 7 copii</div></div><span class="arw">&rsaquo;</span></div>')+E('Alte grupe &#x25BE;')+L('<div class="ar" style="grid-template-columns:1fr auto"><div><div class="an">Intermediari Silver</div><div class="as">Antrenor: Bianca Ene</div></div><span class="arw">&rsaquo;</span></div>','<div class="ar" style="grid-template-columns:1fr auto"><div><div class="an">Primii Pași</div><div class="as">Antrenor: Cristi Vlad</div></div><span class="arw">&rsaquo;</span></div>')
kids=[('Ioana Marinescu','12 ani','','92%'),('Maria Dumitrescu','12 ani','Uscat Juniori','83%'),('Elena Radu','11 ani','','58%'),('Sofia Tudor <span class="tag">nou</span>','10 ani','','100%'),('Alexia Petrescu','12 ani','','88%')]
gdet=('<div class="panel"><div class="dtitle"><b>Avansați</b><span class="sp"></span><span class="btn o w">+ Adaugă sportiv</span><span class="btn w">Fă prezența</span></div>'
 '<div class="hint">Ma, Mi 18:15 - 19:15 · Antrenori: Andrei Popa, Bianca Ene</div>'
 '<table class="tbl"><tr><th>Sportiv</th><th>Vârstă</th><th>Și în</th><th class="c">Prezență oct.</th><th></th></tr>'+''.join(f'<tr><td><b>{n}</b></td><td class="hint">{a}</td><td class="hint">{o}</td><td class="c">{p}</td><td class="c"><span class="arw">&rsaquo;</span></td></tr>' for n,a,o,p in kids)+'</table></div>')
F2=frame('D2. Grupe: lista în stânga, grupa în dreapta','Grupe','<div><div class="dtitle"><b>Grupe</b></div>'+glist+'</div>'+gdet,'md')
plus='<span class="arw" style="font-size:18px">+</span>'
nr=lambda n,s,r=plus,cls='':f'<div class="ar{cls}" style="grid-template-columns:1fr auto"><div><div class="an">{n}</div><div class="as">{s}</div></div><div class="ae">{r}</div></div>'
dlg=('<div class="ov"><div class="dlg"><div class="dlgh"><b>Adaugă în Avansați</b><span class="arw">&#x2715;</span></div><div class="dlgb"><div class="in">Ana|</div>'+E('În club')+L(nr('Ana Bălan','9 ani · Primii Pași'),nr('Ana-Maria Cristea','11 ani · Uscat Juniori','<span class="cmp" style="font-size:16px">&#x2713;</span>'),nr('Ana Pavel','deja în Avansați','',' mut'))+E('Înscrieri noi')+L(nr('Ana Dobre','8 ani · înscrisă 28 sep'))+'<span class="lnk">Nu e în listă: sportiv nou</span></div><div class="dlgf"><span class="btn o w">Anulează</span><span class="btn w">Adaugă 1 sportiv</span></div></div></div>')
F3=frame('D3. Adaugă sportiv: fereastră peste grupă','Grupe','<div><div class="dtitle"><b>Grupe</b></div>'+glist+'</div>'+gdet,'md',over=dlg)
tp='<div class="tp" style="margin-top:4px"><div class="tpc"><div class="tc"><div class="tch">Ore</div>'+''.join(f'<div class="tv{" on" if v=="0" else ""}">{v}</div>' for v in ['0','1','2'])+'</div><div class="tc"><div class="tch">Minute</div>'+''.join(f'<div class="tv{" on" if v=="50" else ""}">{v}</div>' for v in ['40','45','50'])+'</div></div><div class="tpf"><span>50 min</span><span class="btn">OK</span></div></div>'
dlg2=('<div class="ov"><div class="dlg"><div class="dlgh"><b>Lecție individuală</b><span class="arw">&#x2715;</span></div><div class="dlgb">'+F('Sportiv','Maria Dumitrescu',sel=True)+'<div class="two">'+F('Data','06.10.2026')+F('Ora','16:00')+'</div>'+F('Durată','50 min',sel=True)+coach+'<span class="lnk">+ Adaugă alți antrenori</span></div><div class="dlgf"><span class="btn o w">Anulează</span><span class="btn w">Salvează lecția</span></div></div></div>')
F4=frame('D4. Lecție individuală: fereastră peste Azi','Azi','<div><div class="dtitle"><b>Bună, Andrei</b></div>'+left+'</div>'+pres,'md',over=dlg2)
hist=[('Mi 7 oct','Avansați','grup','8','Andrei Popa'),('Mi 7 oct','Maria Dumitrescu','individuală · 50 min','1','Andrei Popa'),('Ma 6 oct','Avansați','grup','9','Andrei Popa, Bianca Ene'),('Sâ 4 oct','Intermediari Silver','grup · înlocuitor','10','Andrei Popa'),('Jo 1 oct','Uscat Juniori','grup','6','Andrei Popa')]
F5=frame('D5. Istoric: tabel','Istoric','<div><div class="dtitle"><b>Istoric</b><span class="sp"></span><span class="seg"><span class="on">Toate</span><span>Grupe</span><span>Individuale</span></span><span class="btn o w">&lsaquo; Octombrie 2026 &rsaquo;</span></div><div class="panel" style="padding:4px 8px"><table class="tbl"><tr><th>Data</th><th>Ce</th><th>Tip</th><th class="c">Prezenți</th><th>Antrenori</th><th></th></tr>'+''.join(f'<tr><td><b>{d}</b></td><td><b>{g}</b></td><td class="hint">{t}</td><td class="c">{n}</td><td class="hint">{c}</td><td class="c"><span class="arw">&rsaquo;</span></td></tr>' for d,g,t,n,c in hist)+'</table></div></div>')
PW=lambda l:f'<div class="f"><span>{l}</span><div class="in">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;{EYE}</div></div>'
F6=frame('D6. Setări cont (din meniul de lângă nume)','','<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px"><div class="panel"><div class="eyb">Date</div>'+F('Nume','Andrei Popa')+F('Email','andrei@exemplu.ro')+F('Telefon','07xx xxx xxx')+'<span class="btn w" style="align-self:flex-start">Salvează</span></div><div class="panel"><div class="eyb">Schimbă parola</div>'+PW('Parola actuală')+PW('Parola nouă')+'<span class="btn w" style="align-self:flex-start">Schimbă parola</span></div></div>',menu=True)
b='<div class="cf"><h2>Portal antrenor: desktop</h2><p class="subtitle">Aceleași pagini ca pe telefon. Bara de jos devine meniu sus (Azi, Grupe, Istoric); Profil intră în meniul de lângă nume. Pe ecran lat, lista și detaliul stau unul lângă altul.</p>'+F1+F2+F3+F4+F5+F6+'</div>'
open(D+'/coach-desktop-v4.html','w').write(head+css+b)
