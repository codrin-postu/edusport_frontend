import sys,os
OUTPNEW=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_prez_menu.py'), HERE+'/throw/pm.html']
exec(open(sys.argv[0]).read())
CLK='<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.2" stroke="currentColor" stroke-width="1.4"/><path d="M7 4.2V7l2 1.3" stroke="currentColor" stroke-width="1.4"/></svg>'
tin=lambda v:f'<span class="ui-root ui-time"><button type="button" class="ui-time-btn">{CLK}</button><input class="ui-input" value="{v}" readonly></span>'
din=lambda v:f'<input class="ui-input" value="{v}" readonly>'
hdN='<div class="wh"><div><h1>Prezență</h1></div><span class="sp"></span><span class="ui-root">'+btn('+ Ședință nouă','primary',False)+'</span></div>'
P1=mp(hdN+dayA)
def drw(body,foot=True): return ('<div class="ui-root ui-drawer-layer"><div class="ui-drawer"><div class="ui-drawer-h"><h2 class="ui-drawer-title">Ședință nouă</h2>'
 f'<button type="button" class="ui-btn ui-btn--ghost ui-btn--sm ui-btn--icon">{CLOSE}</button></div><div class="ui-drawer-b"><div class="drb">'+body+'</div></div>'
 +('<div class="ui-drawer-f"><span style="flex:1"></span>'+btn('Anulează','ghost',False)+btn('Salvează','primary',False)+'</div>' if foot else '')+'</div></div>')
F=lambda l,c:f'<div><div class="lb2">{l}</div>{c}</div>'
top=lambda g,d,t,a:F('Grupă',cbx(g))+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+F('Data',din(d))+F('Ora',tin(t))+'</div>'+F('Antrenor',cbx(a))
kids=''.join(f'<tr><td>{n}</td><td>{chk(False)}</td></tr>' for n in ['Ana Bălan','Maria Dumitrescu','Tudor Enache','Ioana Marin'])
D1=drw(top('Primii Pași','10.10.2026','16:00','Cristi Vlad')+'<div><div class="lb2">Prezență</div><table class="pl">'+kids+'</table></div><div style="display:flex;gap:8px">'+cbx('Caută sportiv din club')+btn('Adaugă doar la ședința asta','ghost')+'</div>')
WARN=('<div class="ui-notice ui-notice--warning" role="alert"><span class="ui-notice-mark"></span><div class="ui-notice-text"><b class="ui-notice-title">Există deja o ședință la ora asta</b><span class="ui-notice-body">Primii Pași, 10 oct, 10:00, 12 prezenți</span></div><div class="ui-notice-action">'+btn('Deschide','ghost')+'</div></div>')
D2=drw(top('Primii Pași','10.10.2026','10:00','Cristi Vlad')+WARN)
P2=mp(hdN+dayA,D1); P3=mp(hdN+dayA,D2)
G1=page(TB.replace('<table class="ui-root sl">','<div class="ui-root" style="padding:10px 18px;display:flex;justify-content:flex-end;border-bottom:1px solid var(--theme-border)">'+btn('+ Ședință nouă','ghost')+'</div><table class="ui-root sl">',1))
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix+mvc+mgc+pqc+ptc+pmc
 +'<div class="A"><h2>Ședință nouă</h2><p class="note">Pentru o ședință care nu e în program. Date inventate.</p>'
 +'<div class="qh">1. Buton în pagina Prezență</div>'+P1
 +'<div class="qh">2. Grupă, dată, oră, antrenor, apoi bifele</div>'+P2
 +'<div class="qh">3. Aceeași grupă, aceeași zi și oră</div>'+P3
 +'<div class="qh">4. Și din tabul Prezență al grupei (grupa deja aleasă)</div>'+G1+'</div>')
open(OUTPNEW,'w').write(html)
