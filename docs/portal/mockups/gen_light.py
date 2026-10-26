import sys
N=sys.argv[1]
ICON={'clock':'<path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>',
 'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><circle cx="9" cy="7" r="4"/>',
 'user':'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 'plus':'<path d="M12 5v14M5 12h14"/>','chev':'<path d="M9 6l6 6-6 6"/>','down':'<path d="M6 9l6 6 6-6"/>','back':'<path d="M15 6l-6 6 6 6"/>',
 'cal':'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
 'home':'<path d="M3 11l9-7 9 7v9H3z"/>','list':'<path d="M4 6h16M4 12h16M4 18h16"/>','hist':'<path d="M12 7v5l3 2M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0"/>','check':'<path d="M5 12l5 5L20 7"/>'}
ic=lambda k,c='i':f'<svg class="{c}" viewBox="0 0 24 24">{ICON[k]}</svg>'
css='''<style>
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800&family=Inter:wght@400;500;600;700;800&family=Climate+Crisis&display=swap');
.L{--n:#0e1a3c;--r:#be3330;--c:#fbf8f1;--w:#fff;--mu:#6b6f7d;--t2:#4b5263;--ln:#dfdddb;--ok:#2f7a4a;font:14px/1.45 Inter,system-ui,sans-serif;color:var(--n)}
.L *{box-sizing:border-box}
.L .row{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}
.L .cap{font-size:12px;font-weight:700;color:var(--mu);margin:0 0 6px}
.L .ph{width:330px;min-height:700px;background:var(--w);border:1px solid #c9ccd4;box-shadow:0 10px 30px rgba(14,26,60,.12);display:flex;flex-direction:column}
.L .hdr{background:var(--n);height:52px;padding:0 16px;display:flex;align-items:center;justify-content:space-between}
.L .logo{font-family:"Climate Crisis",Inter,sans-serif;color:var(--c);font-size:18px;letter-spacing:.04em}
.L .ava{width:28px;height:28px;background:var(--m,#efb22b);color:var(--n);display:grid;place-items:center;font-weight:800;font-size:11px}
.L .body{padding:18px 16px 12px;flex:1}
.L .hello{font-size:12px;color:var(--mu)}
.L .h1{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:26px;line-height:1.1;letter-spacing:-.02em;margin:2px 0 4px;display:flex;align-items:center;gap:8px}
.L .h1 .bk{width:22px;height:22px;fill:none;stroke:var(--n);stroke-width:2.4}
.L .h2{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:20px;line-height:1.2;margin:26px 0 4px;display:flex;align-items:center;justify-content:space-between}
.L .h2 .n{font-family:Inter;font-size:13px;color:var(--mu);font-weight:600;margin-left:6px}
.L .h2 .i{width:18px;height:18px}
.L .list{border-top:1px solid var(--ln)}
.L .it{display:grid;grid-template-columns:52px 1fr 18px;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid var(--ln)}
.L .it.nt{grid-template-columns:1fr 18px}
.L .it.cl{grid-template-columns:48px 1fr 18px}
.L .tm{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:18px;line-height:1}
.L .tm small{display:block;font-family:Inter;font-size:10px;font-weight:700;letter-spacing:.05em;color:var(--mu);margin-top:3px}
.L .nm{font-weight:700;font-size:15px;line-height:1.25}
.L .mt{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;margin-top:4px;font-size:12.5px;color:var(--t2)}
.L .mt span{display:inline-flex;align-items:center;gap:4px}
.L .i{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.L .go{width:18px;height:18px;fill:none;stroke:#9aa0ac;stroke-width:2.2}
.L .tag{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:2px 6px}
.L .tag.club{background:#ead9e1;color:#6e4256}.L .tag.scoala{background:#d3dbef;color:#0e1a3c}.L .tag.ind{background:#ece8e0;color:#0e1a3c}
.L .btn2{display:flex;align-items:center;justify-content:center;gap:8px;height:48px;margin-top:14px;border:1.5px solid var(--n);background:transparent;color:var(--n);font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase}.L .btn2 .i{width:16px;height:16px}.L .add{display:flex;align-items:center;gap:8px;padding:12px 0;border-bottom:1px solid var(--ln);font-weight:700;color:var(--n)}
.L .add .i{width:16px;height:16px}
.L .past{color:var(--mu);font-size:13px;font-weight:700;margin:6px 0 0}
.L .sheet{width:44px;border:1px solid var(--n);text-align:center;background:var(--w)}
.L .sheet .b{background:var(--n);color:var(--c);font-size:9px;font-weight:800;letter-spacing:.08em;padding:2px 0}
.L .sheet.t{border-color:var(--r)}.L .sheet.t .b{background:var(--r)}
.L .sheet .d{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:20px;line-height:1;padding-top:3px}
.L .sheet .m{font-size:9px;font-weight:800;letter-spacing:.06em;color:var(--mu);padding-bottom:3px}
.L .coach{color:var(--mu)}
.L .tabs{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--ln);background:var(--w)}
.L .tabs span{padding:8px 0 7px;text-align:center;font-size:10.5px;font-weight:700;color:var(--mu);display:flex;flex-direction:column;align-items:center;gap:3px}
.L .tabs span.on{color:var(--n);box-shadow:inset 0 2px 0 var(--n)}
.L .tabs .i{width:18px;height:18px}
.L .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--ln);padding:6px 10px;font-weight:700;font-size:12px}
.L .chip .i{width:14px;height:14px}
.L .lbl{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}
.L .sel{height:42px;border:1.5px solid var(--n);display:flex;align-items:center;justify-content:space-between;padding:0 10px;margin-top:4px}
.L .sel .i{width:18px;height:18px}
.L .lnk{font-size:12.5px;font-weight:700;text-decoration:underline;margin-top:6px;display:inline-block}
.L .tbl{display:grid;grid-template-columns:1fr 54px 54px;align-items:center}
.L .th{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);padding:8px 0;border-bottom:1px solid var(--n)}
.L .th .c,.L .td .c{text-align:center}
.L .td{padding:11px 0;border-bottom:1px solid var(--ln);font-weight:600}
.L .ck{width:24px;height:24px;border:1.5px solid var(--n);display:inline-grid;place-items:center;background:var(--w)}
.L .ck.on{background:var(--n)}.L .ck.on .i{stroke:var(--c);width:16px;height:16px}
.L .foot{display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid var(--ln)}
.L .cnt{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:22px}
.L .lcta{position:relative;isolation:isolate;display:inline-flex;flex:1}
.L .lcta .ly{position:absolute;inset:0;border:1.5px solid var(--n)}
.L .lcta .l1{z-index:2;background:#efb22b}.L .lcta .l2{z-index:1;background:#be3330}
.L .lcta:hover .l1{transform:translate(4px,4px)}.L .lcta:hover .l2{transform:translate(8px,8px)}
.L .lcta .face{position:relative;z-index:3;width:100%;height:48px;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid var(--n);background:#000;color:var(--c);font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase}
.L .note{font-size:13px;color:var(--t2);max-width:1000px;margin:0 0 14px}
</style>'''
def phone(cap,body,tab=None,foot=''):
  t=''
  if tab:
    t='<div class="tabs">'+''.join(f'<span class="{"on" if k==tab else ""}">{ic(i)}{k}</span>' for k,i in [('Azi','home'),('Grupe','list'),('Istoric','hist'),('Profil','user')])+'</div>'
  return f'<div><p class="cap">{cap}</p><div class="ph"><div class="hdr"><span class="logo">EDUSPORT</span><span class="ava">AP</span></div><div class="body">{body}</div>{foot}{t}</div></div>'
tag=lambda k:{'club':'<span class="tag club">Club</span>','scoala':'<span class="tag scoala">Școală</span>','ind':'<span class="tag ind">Individual</span>'}[k]
go=ic('chev','go')
def it(tm,name,k,small=''):
  return f'<div class="it"><div class="tm">{tm}{f"<small>{small}</small>" if small else ""}</div><div><div class="nm">{name}</div><div class="mt">{tag(k)}</div></div>{go}</div>'
azi=('<div class="hello">Bună, Andrei</div><div class="h1">Azi, marți 6 octombrie</div>'
 '<div class="h2">De făcut azi</div><div class="list">'+it('16:00','Maria Dumitrescu','ind')+it('17:00','Lot național','club')+it('18:15','Avansați','club')+'</div>'
 f'<div class="btn2">{ic("plus")}Lecție individuală</div>'
 '<div class="h2">Completate azi<span class="n" style="margin-right:auto">2</span></div><div class="list">'+it('10:00','Primii Pași','scoala')+it('11:00','Ioana Marinescu','ind')+'</div>'
 '<div class="h2">Zile trecute</div><div class="past">Prezență nefăcută</div><div class="list" style="margin-top:6px">'+it('30','Avansați','club','SEP')+'</div>')
def sheet(today,w,d):
  return f'<div class="sheet{" t" if today else ""}"><div class="b">{"AZI" if today else w}</div><div class="d">{d}</div><div class="m">OCT</div></div>'
def git(today,w,d,name,k,h,c,coach=None):
  co=f'<span class="coach">{ic("user")}{coach}</span>' if coach else ''
  return f'<div class="it cl">{sheet(today,w,d)}<div><div class="nm">{name}</div><div class="mt">{tag(k)}<span>{ic("clock")}{h}</span><span>{ic("users")}{c}</span></div>{f"<div class=mt>{co}</div>" if coach else ""}</div>{go}</div>'
grupe=('<div class="h1">Grupe</div>'
 '<div class="h2" style="margin-top:14px">Grupele mele</div><div class="list">'
 +git(1,'','6','Lot național','club','17:00','4')+git(1,'','6','Avansați','club','18:15','9')+git(0,'JOI','8','Grupa Mixtă','club','17:00','10')+git(0,'SÂM','10','Primii Pași','scoala','10:00','14')+'</div>'
 f'<div class="h2">Alte grupe{ic("down")}</div><div class="list">'
 +git(0,'SÂM','10','Intermediari Silver','scoala','11:00','11','Bianca Ene')+git(0,'SÂM','10','Avansați Gold','scoala','12:00','8','Cristi Vlad')+'</div>')
ck=lambda on:f'<span class="ck{" on" if on else ""}">{ic("check") if on else ""}</span>'
rows=[('Ioana Marinescu',1,1),('Maria Dumitrescu',1,0),('Elena Radu',0,0),('Sofia Tudor',1,1),('Alexia Petrescu',1,0),('Daria Constantin',1,0)]
prez=(f'<div class="h1">{ic("back","bk")}Avansați</div><div style="margin:6px 0 14px"><span class="chip">{ic("cal")}Marți 6 oct · 18:15{ic("down")}</span></div>'
 f'<div class="lbl">Antrenor</div><div class="sel">Andrei Popa (tu){ic("down")}</div><span class="lnk">+ Adaugă alți antrenori</span>'
 '<div style="margin-top:16px"><div class="tbl th"><span>Sportiv</span><span class="c">Grup</span><span class="c">Uscat</span></div>'
 +''.join(f'<div class="tbl td"><span>{n}</span><span class="c">{ck(g)}</span><span class="c">{ck(u)}</span></div>' for n,g,u in rows)+'</div>')
foot='<div class="foot"><span class="cnt">5/9</span><span class="lcta"><span class="ly l1"></span><span class="ly l2"></span><span class="face">Salvează</span></span></div>'
html=(css+'<div class="L"><h2>Antrenor: design alb, fără cutii</h2><p class="note">Pornind de la varianta 3: fundal alb, liste ca tabelul site-ului (doar linii fine), titluri mari ca ierarhie, "Lecție individuală" ca rând cu +, săgeți gri discrete, aceleași date pe Azi și Grupe (azi e marți 6 oct). Bordura navy rămâne doar pe ce apeși sau completezi (dropdown, bife).</p>'
 '<div class="row">'+phone('Azi',azi,'Azi')+phone('Grupe',grupe,'Grupe')+phone('Prezența grupei',prez,None,foot)+'</div></div>')
open(N+'/light-v4.html','w').write(html)
