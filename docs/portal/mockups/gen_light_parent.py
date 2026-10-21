import sys,re
S,N=sys.argv[1],sys.argv[2]
code=open(S+'/gen_light.py').read()
code=re.sub(r"\nhtml=\(css.*",'',code,flags=re.S)
ns={'sys':sys}; sys.argv=['x',N]; exec(code,ns)
css,ic,tag,go=ns['css'],ns['ic'],ns['tag'],ns['go']
ICON=ns['ICON']; ICON.update({'card':'<path d="M3 6h18v12H3z"/><path d="M3 10h18"/>','cal2':ICON['cal'],'pay':'<path d="M3 6h18v12H3z"/><path d="M3 10h18"/>','file':'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>'})
def phone(cap,body,tab=None,foot='',ava='MD'):
  t=''
  if tab:
    t='<div class="tabs">'+''.join(f'<span class="{"on" if k==tab else ""}">{ic(i)}{k}</span>' for k,i in [('Acasă','home'),('Prezență','cal'),('Plăți','pay'),('Profil','user')])+'</div>'
  return f'<div><p class="cap">{cap}</p><div class="ph"><div class="hdr"><span class="logo">EDUSPORT</span><span class="ava">{ava}</span></div><div class="body">{body}</div>{foot}{t}</div></div>'
prim=lambda t:f'<span class="lcta" style="display:flex;margin-top:12px"><span class="ly l1"></span><span class="ly l2"></span><span class="face">{t}</span></span>'
sec=lambda t,i=None:f'<div class="btn2">{ic(i) if i else ""}{t}</div>'
sm=lambda a,b,cls='':f'<div class="srow {cls}"><span>{a}</span><b>{b}</b></div>'
extra='''<style>
.L .srow{display:flex;justify-content:space-between;gap:10px;padding:11px 0;border-bottom:1px solid var(--ln);font-size:14px}
.L .srow b{font-weight:700;white-space:nowrap}
.L .srow.tot{border-bottom:1.5px solid var(--n);border-top:1.5px solid var(--n);margin-top:-1px;font-weight:800}
.L .srow .muted{color:var(--mu);font-weight:600}
.L .due{margin-top:10px}
.L .due .lbl2{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--r)}
.L .due .big{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:40px;line-height:1;color:var(--r);margin-top:4px}
.L .due .sub{font-size:12.5px;color:var(--mu);margin-top:4px}
.L .cash{font-size:12.5px;color:var(--mu);text-align:center;margin-top:10px}
.L .grp{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:14px 0 0}
.L .inc{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:#ece8e0;padding:2px 6px}
.L .tk{margin-top:12px}
.L .tkh{display:flex;justify-content:space-between;align-items:flex-start}
.L .tkh .k{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--r)}
.L .tkh .cnt{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:30px;line-height:1;text-align:right}
.L .tkh .cnt small{display:block;font-family:Inter;font-size:10px;font-weight:700;color:var(--mu);letter-spacing:.04em}
.L .tkg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px}
.L .tks{height:50px;border:1px solid var(--ln);display:flex;flex-direction:column;justify-content:space-between;padding:5px 6px;font-size:11px;font-weight:700;color:var(--mu)}
.L .tks.u{background:var(--n);border-color:var(--n);color:var(--c)}.L .tks.u .dd{color:var(--c);opacity:.8;font-weight:600}
.L .tks.nx{border:1.5px solid var(--r);color:var(--r)}
.L .tks .dd{font-size:10px}
.L .it.nt.wr{grid-template-columns:1fr auto}.L .it.wr{grid-template-columns:52px 1fr auto}.L .st{white-space:nowrap;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}.L .st.ok{color:var(--ok)}.L .st.no{color:var(--r)}
.L .seg{display:flex;align-items:center;justify-content:space-between;border:1.5px solid var(--n);height:42px;padding:0 10px;margin-top:6px;font-weight:700}
.L .seg .i{width:18px;height:18px}
</style>'''
def it2(name,sub,right,left=None):
  l=f'<div class="tm">{left[0]}<small>{left[1]}</small></div>' if left else ''
  cls='it wr' if left else 'it nt wr'
  return f'<div class="{cls}">{l}<div><div class="nm">{name}</div><div class="mt">{sub}</div></div><div style="display:flex;align-items:center;gap:6px">{right}{go}</div></div>'
# 1 Sportivi
P1=phone('Sportivi (doar cu 2+ sportivi)','<div class="h1">Sportivi</div><div class="hello" style="margin-bottom:10px">Alege sportivul.</div><div class="list">'
 +it2('Maria Dumitrescu','Avansați, Uscat Juniori','<span class="st no">340 lei</span>')+it2('Andrei Dumitrescu','Primii Pași','<span class="st ok">la zi</span>')+'</div>','Acasă')
# 2 club child
P2=phone('Acasă: sportiv la club','<div class="hello">Avansați, Uscat Juniori</div><div class="h1">Maria Dumitrescu</div>'
 '<div class="due"><div class="lbl2">De achitat</div><div class="big">340 lei</div><div class="sub">octombrie, până azi</div></div>'
 +prim('Plătește cu cardul')+'<div class="cash">Poți plăti și numerar, la club.</div>'
 '<div class="h2">Octombrie</div><div class="grp">Avansați</div>'+sm('5 x antrenament grup','200 lei')+sm('1 x lecție individuală','80 lei')
 +'<div class="grp">Uscat Juniori</div>'+sm('2 x antrenament uscat','60 lei')+sm('Total','340 lei','tot'),'Acasă')
# 3 Școala child ticket
used=['3 oct','4 oct','10 oct','11 oct','17 oct']
boxes=''.join(f'<div class="tks{" u" if i<5 else (" nx" if i==5 else "")}"><span>{i+1}</span><span class="dd">{used[i] if i<5 else ("următoarea" if i==5 else "")}</span></div>' for i in range(8))
P3=phone('Acasă: sportiv la Școala de patinaj','<div class="hello">Primii Pași</div><div class="h1">Andrei Dumitrescu</div>'
 '<div class="tk"><div class="tkh"><div><div class="k">Abonament Școala de patinaj</div><div class="nm" style="margin-top:2px">8 ședințe</div></div><div class="cnt">5/8<small>FOLOSITE</small></div></div><div class="tkg">'+boxes+'</div></div>'
 '<div style="margin-top:12px">'+sm('Prima ședință','Sâ 3 oct')+sm('Valabil până la','7 nov')+'</div><div class="cash" style="text-align:left">Data se poate prelungi dacă școala are un weekend liber.</div>'
 +prim('Cumpără abonamentul următor'),'Acasă',ava='MD')
# 4 Prezență
rows=[('7','OCT','Avansați','grup, uscat · Andrei Popa'),('7','OCT','Lecție individuală','Andrei Popa'),('6','OCT','Avansați','grup · Andrei Popa'),('1','OCT','Uscat Juniori','uscat · Bianca Ene')]
P4=phone('Prezență','<div class="h1">Prezență</div><div class="seg">'+ic('back')+'<span>Octombrie 2026</span>'+ic('chev')+'</div>'
 '<div style="margin-top:10px">'+sm('Prezență','83%')+sm('Ședințe','5 grup · 2 uscat · 1 individuală')+'</div>'
 '<div class="h2">Ședințe</div><div class="list">'+''.join(f'<div class="it"><div class="tm">{d}<small>{m}</small></div><div><div class="nm">{g}</div><div class="mt">{s_}</div></div><span></span></div>' for d,m,g,s_ in rows)+'</div>','Prezență')
# 5 Plăți
P5=phone('Plăți','<div class="h1">Plăți</div><div class="due"><div class="lbl2">De achitat</div><div class="big" style="font-size:32px">340 lei</div></div>'+prim('Plătește cu cardul')
 +'<div class="h2">Istoric</div><div class="list">'+it2('290 lei','3 oct · numerar · factura EDS 0131','<span class="st ok">plătit</span>')+it2('330 lei','4 sep · card · factura EDS 0118','<span class="st ok">plătit</span>')+it2('80 lei','12 iul · card','<span class="st no">respinsă</span>')+'</div>','Plăți')
# 6 Confirm
P6=phone('Confirmă plata',f'<div class="h1">{ic("back","bk")}Confirmă plata</div><div style="margin-top:10px">'+sm('Avansați','280 lei')+sm('Uscat Juniori','60 lei')+sm('Total','340 lei','tot')+'</div>'
 '<div class="lbl" style="margin-top:16px">Factura pe email</div><div class="sel">parinte@exemplu.ro</div><div class="cash" style="text-align:left">Vei fi trimis pe pagina securizată Netopia. EduSport nu vede datele cardului.</div>'
 +prim('Plătește 340 lei cu cardul'))
html=(css+extra+'<div class="L"><h2>Părinte / sportiv: design alb, fără cutii</h2><p class="note">Același sistem ca la antrenor: fundal alb, liste cu linii fine, titluri mari, butoanele site-ului (negru = principal, conturat = secundar). Sume exemplu. Numele sunt inventate.</p>'
 '<div class="row">'+P1+P2+P3+'</div><div class="row" style="margin-top:28px">'+P4+P5+P6+'</div></div>')
open(N+'/light-parent-v1.html','w').write(html)
