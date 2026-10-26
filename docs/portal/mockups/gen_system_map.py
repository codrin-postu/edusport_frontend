import sys
OUT=sys.argv[1]
W,H=220,60
B={ # name: (x,y,subtitle,kind)
 'Înscriere':(20,30,'formular site, Nr. 2026-0142','in'),
 'Document':(20,170,'Acord, Adeziune, încărcate','doc'),
 'Sportiv':(300,115,'fișă privată','core'),
 'Profil public':(580,20,'pagina de pe site, opțional','pub'),
 'Cont părinte':(860,20,'portal','user'),
 'Grupă':(580,200,'Școală sau Club','core'),
 'Listă de prețuri':(860,200,'Standard, Avansați Gold','set'),
 'Antrenor':(860,370,'cont portal','user'),
 'Abonament':(20,300,'8 căsuțe, preț din lista grupei','money'),
 'Ședință':(580,450,'din program sau nouă','core'),
 'Program':(860,520,'calendar site','open'),
 'Prezență':(300,450,'sportiv la ședință','core'),
 'Lecție individuală':(20,600,'antrenor + 1 sportiv','core'),
 'Plată':(20,450,'numerar, POS, transfer','money'),
}
E=[('Înscriere','Sportiv','confirmare'),('Înscriere','Document','PDF'),('Sportiv','Document','are'),('Sportiv','Profil public','legat'),
 ('Cont părinte','Sportiv','vede copiii'),('Sportiv','Grupă','1 principală, n alte'),('Grupă','Listă de prețuri','folosește'),('Antrenor','Grupă','antrenează'),
 ('Abonament','Sportiv','al sportivului'),('Ședință','Grupă','a grupei'),('Ședință','Program','din'),
 ('Antrenor','Ședință','ține'),('Prezență','Sportiv',''),('Prezență','Ședință',''),('Prezență','Abonament','1 căsuță (Școală)'),
 ('Plată','Abonament','achită'),('Plată','Lecție individuală','achită')]
COL={'core':('#eef2ff','#3b4a9a'),'in':('#f2faf5','#1d6b3a'),'doc':('#f6f6f8','#5b6380'),'pub':('#f6f6f8','#5b6380'),'user':('#fff7ed','#9a4b0c'),'set':('#f6f6f8','#5b6380'),'money':('#fdf2f2','#8a2b2b'),'open':('#fffbea','#8a6d00')}
def ctr(n): x,y,_,_=B[n]; return x+W/2,y+H/2
def clip(a,b):
  (x1,y1),(x2,y2)=ctr(a),ctr(b); dx,dy=x2-x1,y2-y1
  def edge(cx,cy,dx,dy):
    t=min((W/2)/abs(dx) if dx else 1e9,(H/2)/abs(dy) if dy else 1e9); return cx+dx*t,cy+dy*t
  return edge(x1,y1,dx,dy),edge(x2,y2,-dx,-dy)
svg=[f'<svg viewBox="0 0 1100 680" width="1100" height="680" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a91a8"/></marker></defs>']
for a,b,l in E:
  (x1,y1),(x2,y2)=clip(a,b)
  svg.append(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="#8a91a8" stroke-width="1.4" marker-end="url(#ar)"/>')
  if l:
    mx,my=(x1+x2)/2,(y1+y2)/2; w=len(l)*6.2+10
    svg.append(f'<rect x="{mx-w/2:.0f}" y="{my-9:.0f}" width="{w:.0f}" height="18" rx="3" fill="#fff"/><text x="{mx:.0f}" y="{my+4:.0f}" font-size="11" fill="#5b6380" text-anchor="middle">{l}</text>')
for n,(x,y,s,k) in B.items():
  bg,fg=COL[k]
  svg.append(f'<rect x="{x}" y="{y}" width="{W}" height="{H}" rx="6" fill="{bg}" stroke="{fg}" stroke-width="1.4"/><text x="{x+12}" y="{y+25}" font-size="14" font-weight="700" fill="{fg}">{n}</text><text x="{x+12}" y="{y+44}" font-size="11.5" fill="#5b6380">{s}</text>')
svg.append('</svg>')
R=['Vizitator site','Părinte','Antrenor','Admin']
CAP=[ # capability, per role
 ('Trimite înscriere',['da','','','']),
 ('Confirmă înscriere, potrivește sportivul',['','','','da']),
 ('Editează fișa sportivului',['','','','da']),
 ('Adaugă sportiv nou',['','','da, marcat "nou"','da, confirmă']),
 ('Creează grupe, mută, adaugă în listă',['','','','da']),
 ('Vede grupele',['','','toate, ale altora marcate','toate']),
 ('Notează prezența',['','','orice grupă','orice grupă']),
 ('Adaugă la ședință un sportiv din altă grupă',['','','deschis','da']),
 ('Corectează prezența',['','','până la sfârșitul lunii','oricând']),
 ('Ședință nouă, în afara programului',['','','da','da']),
 ('Lecție individuală',['','','da','da']),
 ('Program grupă',['','','deschis','deschis']),
 ('Adaugă abonament',['','','','da']),
 ('Înregistrează plăți',['','','','da']),
 ('Documente: tipuri, încărcare, ZIP',['','','','da']),
 ('Vede prezența, abonamentul, plățile copilului',['','propus','','da']),
 ('Plătește cu cardul',['','mai târziu','','']),
]
cell=lambda v:f'<td class="{"op" if v in ("deschis","propus","mai târziu") else ""}">{v}</td>'
tbl='<table class="m"><tr><th></th>'+''.join(f'<th>{r}</th>' for r in R)+'</tr>'+''.join(f'<tr><td class="c">{c}</td>'+''.join(cell(v) for v in vs)+'</tr>' for c,vs in CAP)+'</table>'
FL=[('Înscriere','părintele trimite formularul; primește PDF pe e-mail; rândul apare în Înscrieri și în Sheet'),
 ('Confirmare','adminul potrivește cu un sportiv existent sau creează unul nou; alege grupa principală (sau mai târziu)'),
 ('Grupă','sportivul e pe lista unei grupe principale și, opțional, pe lista altor grupe'),
 ('Ședință','vine din program sau e adăugată; antrenorul notează prezența; adminul poate adăuga pe oricine doar la ședința asta'),
 ('Abonament','la Școală, fiecare prezență consumă o căsuță; la Club se plătește pe ședință'),
 ('Plată','adminul înregistrează plata; părintele vede (propus)')]
fl='<ol class="f">'+''.join(f'<li><b>{a}</b> {b}</li>' for a,b in FL)+'</ol>'
OPEN=['Programul grupei: de unde vine și cine îl schimbă','Antrenorul: poate adăuga la ședință un sportiv din altă grupă?','Portalul părintelui (pus pe pauză)','Plăți online, chitanță sau factură']
html=f'''<style>:root{{color-scheme:light}}body{{background:#fff}}.S{{font:14px/1.45 Inter,system-ui,sans-serif;color:#1c2240;padding:8px 8px 40px}}
.S h2{{margin:0 0 4px;font-size:22px}}.S h3{{margin:30px 0 8px;font-size:17px;border-top:3px solid #131c3d;padding-top:10px}}.S p{{margin:0 0 10px;color:#5b6380}}
.m{{border-collapse:collapse;font-size:13px}}.m th,.m td{{border-bottom:1px solid #e3e5ec;padding:7px 12px;text-align:left;vertical-align:top}}.m th{{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#5b6380}}.m .c{{font-weight:600}}.m .op{{color:#8a6d00}}
.f{{margin:0;padding-left:20px}}.f li{{margin:4px 0}}.o{{margin:0;padding-left:20px;color:#8a6d00}}</style>
<div class="S"><h2>Harta sistemului</h2><p>Din ce am decis până acum. Galben = deschis sau propus.</p>
<h3>Date și legături</h3>{"".join(svg)}
<h3>Cine ce poate face</h3>{tbl}
<h3>Drumul unui sportiv</h3>{fl}
<h3>Deschise</h3><ul class="o">{"".join(f"<li>{o}</li>" for o in OPEN)}</ul></div>'''
open(OUT,'w').write(html)
