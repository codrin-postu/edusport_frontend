import sys
OUT=sys.argv[1]
EW,EH=270,46
def actor(x,y,name,sub):
  return (f'<g stroke="#1c2240" stroke-width="2" fill="none"><circle cx="{x}" cy="{y}" r="13"/><line x1="{x}" y1="{y+13}" x2="{x}" y2="{y+48}"/>'
   f'<line x1="{x-22}" y1="{y+26}" x2="{x+22}" y2="{y+26}"/><line x1="{x}" y1="{y+48}" x2="{x-18}" y2="{y+78}"/><line x1="{x}" y1="{y+48}" x2="{x+18}" y2="{y+78}"/></g>'
   f'<text x="{x}" y="{y+100}" font-size="16" font-weight="700" text-anchor="middle" fill="#1c2240">{name}</text><text x="{x}" y="{y+119}" font-size="12.5" text-anchor="middle" fill="#5b6380">{sub}</text>')
def uc(x,y,t,st=''):
  fill,stroke={'':('#eef2ff','#3b4a9a'),'p':('#fffbea','#8a6d00')}[st]
  return f'<ellipse cx="{x}" cy="{y}" rx="{EW/2}" ry="{EH/2}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/><text x="{x}" y="{y+5}" font-size="14" text-anchor="middle" fill="#1c2240">{t}</text>'
line=lambda x1,y1,x2,y2:f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#5b6380" stroke-width="1.3"/>'
A={'viz':(90,110),'par':(90,450),'ant':(1150,170),'adm':(1150,560)}
L=[('viz','Trimite înscriere',430,150,''),('par','Vede prezența copilului',430,430,'p'),('par','Vede abonamentul și plățile',430,500,'p'),('par','Plătește cu cardul',430,570,'p')]
SH=['Notează prezența','Corectează prezența','Adaugă ședință nouă','Lecție individuală','Adaugă sportiv nou']
AD=['Confirmă înscrierea','Gestionează grupele','Adaugă abonament','Înregistrează plăți','Gestionează documente']
s=[f'<svg viewBox="0 0 1260 740" width="1260" height="740" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif">',
 '<rect x="230" y="40" width="800" height="680" rx="4" fill="#fff" stroke="#1c2240" stroke-width="1.6"/><text x="250" y="68" font-size="15" font-weight="700" fill="#1c2240">EduSport: site, portal, panou</text>']
items=[]
for a,t,x,y,st in L:
  ax,ay=A[a]; s.append(line(ax+24,ay+26,x-EW/2,y)); items.append(uc(x,y,t,st))
for i,t in enumerate(SH):
  y=120+i*64; x=830
  ax,ay=A['ant']; s.append(line(ax-24,ay+26,x+EW/2,y))
  items.append(uc(x,y,t))
for i,t in enumerate(AD):
  y=470+i*56; x=830; ax,ay=A['adm']; s.append(line(ax-24,ay+26,x+EW/2,y)); items.append(uc(x,y,t))
ax,ay=A['ant']; dx,dy=A['adm']
s.append(f'<line x1="{dx}" y1="{dy-8}" x2="{ax}" y2="{ay+142}" stroke="#1c2240" stroke-width="1.5"/><path d="M{ax} {ay+128} L{ax-9} {ay+146} L{ax+9} {ay+146} Z" fill="#fff" stroke="#1c2240" stroke-width="1.5"/>')
s+=items
s+=[actor(*A['viz'],'Vizitator','părinte nou, pe site'),actor(*A['par'],'Părinte','cont în portal'),actor(*A['ant'],'Antrenor','cont în portal'),actor(*A['adm'],'Admin','panoul clubului')]
s.append('</svg>')
html=('<style>:root{color-scheme:light}body{background:#fff}.S{font:14px Inter,system-ui,sans-serif;color:#1c2240;padding:8px}.S h2{margin:0 0 4px}.S p{color:#5b6380;margin:0 0 12px}.lg{display:flex;gap:18px;margin-bottom:10px;font-size:13px}.lg i{display:inline-block;width:26px;height:14px;border-radius:7px;vertical-align:middle;margin-right:6px}</style>'
 '<div class="S"><h2>Diagrama cazurilor de utilizare (UML)</h2><p>Cine folosește sistemul și ce face. Săgeata cu triunghi gol: Adminul poate face tot ce face Antrenorul.</p>'
 '<div class="lg"><span><i style="background:#eef2ff;border:1.5px solid #3b4a9a"></i>decis</span><span><i style="background:#fffbea;border:1.5px solid #8a6d00"></i>propus sau mai târziu</span></div>'
 +''.join(s)+'</div>')
open(OUT,'w').write(html)
