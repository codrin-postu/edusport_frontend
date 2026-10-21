import sys,os
OUTW=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_list2.py'), HERE+'/throw/w2.html']
exec(open(sys.argv[0]).read())
SETS=[('A','deja','Deja în club / De verificat','Deja în club','De verificat'),
 ('B','deja-info','Cu detaliu: grupa de anul trecut / cu cine seamănă','Deja în club · Primii Pași 2025-2026','De verificat · poate fi Sara Ilie'),
 ('C','revine','Revine / Posibil revine','Revine în club','Posibil revine'),
 ('D','fisa','Despre fișă: Are fișă / Posibilă fișă','Are fișă în club','Posibil are fișă')]
def tblw(e,p):
  rows=''
  for n,d,c,a,k,s,pp,m,info in R[:3]:
    lab=f'<span class="mm ex">{ic("user")}{e}</span>' if m=='ex' else f'<span class="mm pr">{ic("user")}{p}</span>' if m=='pr' else ''
    rows+=f'<tr><td style="white-space:nowrap"><b>{n}</b></td><td style="white-space:nowrap"><b>{c}</b>{lab}</td><td>{a} ani</td><td><span class="bd {k}">{s}</span></td><td>{pp}</td></tr>'
  return '<div class="win" style="max-width:760px"><table><tr><th>Nr.</th><th>Nume copil</th><th>Vârstă</th><th>Status</th><th>Completat de</th></tr>'+rows+'</table></div>'
body=''.join(O(L,ch,t+(' (recomandat)' if L=='B' else ''),tblw(e,p)) for L,ch,t,e,p in SETS)
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+x2+'<div class="A"><h2>Cum numim copilul găsit în club</h2><p class="note">Același loc (sub nume), alte cuvinte. "Membru" nu folosim, ca să nu se confunde cu membru A.C.S. Filtrul se numește la fel ca eticheta aleasă. Date inventate.</p><div class="options wcol">'+body+'</div></div>')
open(OUTW,'w').write(html)
