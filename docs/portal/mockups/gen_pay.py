import sys
S,D=sys.argv[1],sys.argv[2]
exec(open(S+'/gen_parent.py').read().split("G=[]")[0].replace("S,D=sys.argv[1],sys.argv[2]","S,D=sys.argv[1],sys.argv[2]"))
css2='''<style>
.cf .ext{width:300px;min-height:600px;border:1.5px solid #c9ccd4;background:#fff;box-shadow:6px 6px 0 rgba(14,26,60,.10);display:flex;flex-direction:column;font-family:system-ui,sans-serif}
.cf .extbar{background:#f3f4f6;border-bottom:1px solid #e1e3e8;padding:8px 10px;font-size:11px;color:#555;display:flex;gap:6px;align-items:center}
.cf .extbar i{font-style:normal;background:#fff;border:1px solid #d9dbe0;padding:2px 6px;flex:1;color:#333}
.cf .exth{padding:14px 16px;border-bottom:1px solid #eceef2;display:flex;justify-content:space-between;align-items:center}
.cf .exth b{font-size:15px;color:#222}
.cf .exth span{font-size:11px;color:#777}
.cf .extb{padding:14px 16px;display:flex;flex-direction:column;gap:10px;flex:1;color:#222;font-size:13px}
.cf .ein{height:40px;border:1px solid #cfd3da;border-radius:6px;padding:0 10px;display:flex;align-items:center;color:#9a9da6}
.cf .ebtn{height:42px;border-radius:6px;background:#2b2f36;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600}
.cf .note2{font-size:11px;color:#888}
.cf .spin{width:34px;height:34px;border:3px solid var(--s);border-top-color:var(--n);border-radius:50%;margin:30px auto 10px}
.cf .res{text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center;padding-top:20px}
.cf .res .big{font-size:30px}
.cf .flowarr{display:flex;align-items:center;font-size:22px;font-weight:800;color:var(--r)}
</style>'''
def ext(n,cap,url,title,sub,body):
  return f'<div><p class="cap"><span class="num">{n}</span>{cap}</p><div class="ext"><div class="extbar">&#128274;<i>{url}</i></div><div class="exth"><b>{title}</b><span>{sub}</span></div><div class="extb">{body}</div></div></div>'
s1=ph('1','Alege ce plătești',E('De achitat')+L(f'<div class="ar" style="grid-template-columns:auto 1fr auto"><span>{ck(1)}</span><div><div class="an">Septembrie</div><div class="as">Maria · 6 grup, 1 individuală</div></div><b>320 lei</b></div>',f'<div class="ar" style="grid-template-columns:auto 1fr auto"><span>{ck(1)}</span><div><div class="an">Octombrie, până azi</div><div class="as">Maria · 5 grup, 2 uscat, 1 individuală</div></div><b>340 lei</b></div>')+L(sm('Total','660 lei','tot'))+'<div class="btn" style="margin-top:auto">Continuă</div>','Plată',back=True)
s2=ph('2','Confirmă',L(sm('Sportiv','Maria Dumitrescu'),sm('Pentru','septembrie, octombrie'),sm('Sumă','660 lei','tot'))+F('Factura pe email','parinte@exemplu.ro')+'<div class="hint">Vei fi trimis pe pagina securizată Netopia Payments ca să introduci cardul. EduSport nu vede și nu păstrează datele cardului.</div><div class="btn" style="margin-top:auto">Plătește 660 lei cu cardul</div>','Confirmă plata',back=True)
s3=ph('3','Redirecționare','<div class="spin"></div><div style="text-align:center;font-weight:700">Te ducem la Netopia Payments...</div><div class="hint" style="text-align:center">Nu închide pagina.</div>','Plată',ava='MD')
s4=ext('4','Pagina Netopia (aspect orientativ)','secure.netopia-payments.com/...','Netopia Payments','plată securizată','<div style="display:flex;justify-content:space-between"><span>Comerciant</span><b>Club Sportiv EduSport</b></div><div style="display:flex;justify-content:space-between"><span>Sumă</span><b>660,00 RON</b></div><div class="ein">Număr card</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div class="ein">LL/AA</div><div class="ein">CVV</div></div><div class="ein">Nume pe card</div><div class="ebtn">Plătește 660,00 RON</div><div class="note2">Card Visa / Mastercard. Verificare 3-D Secure la banca ta.</div>')
s5=ext('5','Confirmare la bancă (3-D Secure)','banca-ta.ro/3ds','Banca ta','confirmare plată','<div>Confirmă plata de <b>660,00 RON</b> către <b>Club Sportiv EduSport</b>.</div><div class="note2">Confirmă din aplicația băncii sau cu codul primit prin SMS.</div><div class="ein">Cod SMS</div><div class="ebtn">Confirmă</div>')
s6=ph('6','Înapoi în portal: reușită','<div class="res"><div class="eyb" style="margin:0;color:var(--ok)">Plată reușită</div><div class="big" style="color:var(--ok)">660 lei</div><div class="hint">Factura fiscală EDS 0142 a fost trimisă pe parinte@exemplu.ro</div></div>'+L(sm('De achitat acum','0 lei'))+'<div class="btn o">Descarcă factura (PDF)</div><div class="btn" style="margin-top:auto">Înapoi la Acasă</div>','Plată',tab='Plăți')
s6b=ph('6b','Înapoi în portal: eșuată','<div class="res"><div class="eyb" style="margin:0">Plata nu a reușit</div><div class="big" style="color:var(--r)">660 lei</div><div class="hint">Banca a refuzat plata. Nu s-a retras niciun ban.</div></div><div class="btn" style="margin-top:auto">Încearcă din nou</div><div class="hint" style="text-align:center">Poți plăti și numerar, la club.</div>','Plată',tab='Plăți')
s7=ph('7','Istoric plăți, după',E('Plăți')+L(nr('660 lei','7 oct · card · sep, oct · factura EDS 0142','<span class="st ok">plătit</span><span class="arw">&rsaquo;</span>'),nr('290 lei','3 sep · numerar · august','<span class="st ok">plătit</span><span class="arw">&rsaquo;</span>')),'Plăți',tab='Plăți')
adm='<div style="max-width:620px"><div class="lst">'+sm('Ce primește clubul','')+'<div class="sum"><span>Netopia anunță serverul (notificare IPN) că plata e confirmată</span></div><div class="sum"><span>Plata apare singură în CMS, la Maria Dumitrescu: 660 lei, card, sep + oct</span></div><div class="sum"><span>Lunile acoperite devin "plătit"; corecturile pe ele trec doar prin admin</span></div><div class="sum"><span>Se emite automat factura fiscală (serviciu de facturare, cu raportare e-Factura), PDF pe email și în istoric</span></div><div class="sum"><span>La numerar: persoana de la Plăți înregistrează plata, factura se emite la fel</span></div><div class="sum"><span>Banii ajung în contul clubului, conform contractului Netopia</span></div></div></div>'
arr='<div class="flowarr">&rsaquo;</div>'
b=('<div class="cf"><h2>Plata cu cardul: exemplu complet cu Netopia</h2><p class="subtitle">Ecranele 4 și 5 nu sunt ale noastre: sunt pagina Netopia și pagina băncii (aspectul real diferă). Sume exemplu. Numele sunt inventate.</p>'
 '<div class="row" style="margin-top:12px;align-items:flex-start">'+s1+s2+s3+'</div><div class="row" style="margin-top:16px">'+s4+s5+'</div><div class="row" style="margin-top:16px">'+s6+s6b+s7+'</div><div class="grp"><div class="eyb">În spate</div></div>'+adm+'</div>')
open(D+'/pay-netopia-v3.html','w').write(head+css+css2+b)
