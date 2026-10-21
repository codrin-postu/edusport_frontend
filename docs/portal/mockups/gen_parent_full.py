import sys,re
S,D=sys.argv[1],sys.argv[2]
def load(f):
  code=open(S+'/'+f).read()
  code=re.sub(r"\nopen\(D\+'[^']*','w'\)\.write\([^\n]*\)\s*$","\n",code.rstrip()+"\n")
  ns={'sys':sys,'__name__':'x'}; sys.argv=[f,S,D]; exec(code,ns); return ns
P=load('gen_parent.py'); Y=load('gen_pay.py')
ph,L,E,F,PW,nr,sm,ck,ar=[P[k] for k in ['ph','L','E','F','PW','nr','sm','ck','ar']]
head=P['head']; css=P['css']+Y['css2']
G=P['G']  # list of (group,[phones])
groups=dict(G)
# replace Plăți group with full card flow
pay=[Y['s1'],Y['s2'],Y['s3'],Y['s4'],Y['s5'],Y['s6'],Y['s6b']]
hist=[groups['Plăți'][1],groups['Plăți'][2]]  # istoric, detaliu
# personal account (18+)
pers_home=ph('P1','Acasă: cont personal (18+)','<div class="due"><div class="eyb" style="margin:0">De achitat</div><div class="big">160 lei</div><div class="hint">octombrie, până azi</div></div><div class="btn">Plătește cu cardul</div><div class="hint" style="text-align:center">Poți plăti și numerar, la club.</div>'+E('Octombrie')+L(sm('4 x antrenament grup','160 lei'),sm('Total','160 lei','tot'))+E('Grupe')+L(nr('Seniori','Ma, Jo 20:00 · Andrei Popa','')),'Teodora Ionescu',tab='Acasă',ava='TI')
pers_prof=ph('P2','Profil: cont personal','<div style="font-family:League Spartan;font-weight:800;font-size:20px">Teodora Ionescu</div><div class="hint">Sportiv · 19 ani</div>'+L(nr('Setări cont',''),nr('Adaugă pe ecranul principal',''),'<div class="ar" style="grid-template-columns:1fr;color:var(--r)"><div class="an">Ieși din cont</div></div>'),'Profil',tab='Profil',ava='TI')
turn=ph('P1','La 18 ani: invitație proprie','<div class="hint">Ai împlinit 18 ani. De acum ai contul tău în portalul EduSport.</div>'+F('Email','teodora@exemplu.ro')+PW('Alege o parolă')+'<div class="btn">Activează contul</div>','Contul tău',ava='')
order=[('Intrare',groups['Intrare']),('Acasă',groups['Acasă']),('Prezență',groups['Prezență']),('Plată cu cardul (Netopia)',pay),('Istoric plăți',hist),('Profil',groups['Profil']),('Cont personal (sportiv 18+)',[pers_home,pers_prof])]
b='<div class="cf"><h2>Portal părinte / sportiv: fluxul complet</h2><p class="subtitle">Părintele vede sportivii legați de emailul lui. Dacă sportivul are 18+ ani, același cont (același email) se afișează ca personal: fără ecranul "Sportivi", fără formulări de părinte. Prețuri exemplu: grup 40, uscat 30, individuală 80 lei. Numele sunt inventate.</p>'
for g,ps in order: b+=f'<div class="grp"><div class="eyb">{g}</div></div><div class="row">'+''.join(ps)+'</div>'
b+='<div class="grp"><div class="eyb">În spate</div></div>'+Y['adm']+'</div>'
open(D+'/parent-flow-full-v2.html','w').write(head+css+b)
