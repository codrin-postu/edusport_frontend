import sys,os
OUTB=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_docmob4.py'), HERE+'/throw/db.html']
exec(open(sys.argv[0]).read())
bc='''<style>.A .selban{padding:10px 18px;background:#ecf0f7;border-bottom:1px solid #cfd9ea;color:var(--p);display:flex;gap:10px;align-items:center;flex-wrap:wrap}.A .selban b{color:var(--p)}
.A .more{padding:14px;text-align:center}.A .more .c40{display:inline-flex;width:100%}.A .cnt2{padding:10px 14px;color:var(--mu);font-size:12px;border-bottom:1px solid var(--ln)}
.A .prog{height:6px;background:#eef0f4;border-radius:3px;overflow:hidden;margin-top:8px}.A .prog i{display:block;height:100%;width:62%;background:var(--p)}
.A .pg2{display:flex;gap:4px;align-items:center}.A .pg2 span{min-width:28px;height:28px;display:inline-grid;place-items:center;border:1px solid var(--ln);border-radius:3px;font-weight:600;font-size:12px}.A .pg2 .on{background:var(--p);color:#fff;border-color:var(--p)}</style>'''
names=['Maria Dumitrescu','Andrei Popescu','Sara-Maria Ilie','David Neagu','Ilinca Matei','Ana Bălan']
rows=''.join(f'<tr class="sel"><td><label class="ccb"><input type="checkbox" checked></label></td><td><b>{names[i%6]}</b></td><td>Acord</td><td style="color:var(--t2)">Generat</td><td>2026-0{142-i}</td><td>{5-i%5} oct 2026</td><td><div class="acts2"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></td></tr>' for i in range(5))
tbl='<div style="overflow-x:auto"><table class="dt"><tr><th><label class="ccb"><input type="checkbox" checked></label></th><th>Nume sportiv</th><th>Tip document</th><th>Sursă</th><th>Nr. înscriere</th><th>Actualizat</th><th></th></tr>'+rows+'</table></div>'
def desk(ban):
  return ('<div class="win">'+headA+'<div class="ui-tabs" style="margin:0;padding:0 14px"><span class="ui-tab on">Documente sportivi<span class="ui-tab-count">312</span></span><span class="ui-tab">Documente club<span class="ui-tab-count">3</span></span><span class="ui-tab">Tipuri de documente<span class="ui-tab-count">6</span></span></div>'
   +f'<div class="tb"><span class="in srch">{ic("search")}Caută...</span><span class="in">Sezon <b>2026-2027</b>{ic("down")}</span><span class="fbtn act">Tip document <b>1</b>{ic("down")}</span></div>'
   +'<div class="tb chips"><span class="chip2">Tip document: Acord ✕</span><span class="sbt-lbl">218 documente corespund</span></div>'+ban+tbl
   +'<div class="pgr">1-50 din 218<span style="flex:1"></span><div class="pg2"><span class="on">1</span><span>2</span><span>3</span><span>4</span><span>5</span></div></div></div>')
b1=('<div class="selban">'+ic('check')+'<b>Cele 50 de pe această pagină sunt selectate.</b><span class="lnk">Selectează toate cele 218 care corespund filtrelor</span><span style="flex:1"></span><span class="btn sm pr">'+ic('dl')+'Descarcă ZIP (50)</span><span class="btn sm">Anulează</span></div>')
b2=('<div class="selban">'+ic('check')+'<b>Toate cele 218 documente selectate</b> (Sezon 2026-2027 · Tip: Acord)<span class="lnk">Doar pagina asta</span><span style="flex:1"></span><span class="btn sm pr">'+ic('dl')+'Descarcă ZIP (218)</span><span class="btn sm">Anulează</span></div>')
zipm=('<div class="pv"><div class="pvm" style="width:440px"><div class="mh"><b>Pregătim arhiva</b>'+ic('x')+'</div><div style="padding:16px">218 documente · aprox. 45 MB<div class="prog"><i></i></div><div class="hint" style="margin-top:8px">135 din 218. Poți închide fereastra; primești o notificare în panou când e gata, cu link de descărcare (valabil 24 de ore).</div></div></div></div>')
D1=screen('documente',desk(b1)); D2b=screen('documente',desk(b2)); D3=screen('documente',desk(b2),zipm)
mob_top=('<div class="tbar">☰<b>Documente</b>'+ic('search')+'</div><div class="pw"><div class="ph-h"><h1>Documente</h1></div>'+tabs3('s').replace('<span class="ui-tab-count">5</span>','<span class="ui-tab-count">312</span>')+ctl3
 +'<div style="padding:0 14px 10px;display:flex;gap:6px;flex-wrap:wrap"><span class="chipx">Tip: Acord ✕</span></div><div class="cnt2">218 documente · afișate 30</div>')
mob_cards=lambda on=():''.join(f'<div class="dcard3{" on" if i in on else ""}"><label class="ccb"><input type="checkbox" {"checked" if i in on else ""}></label><div><b>Acord</b><div>{names[i]}</div><div class="m">{5-i} oct 2026 · Generat</div><div class="la"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div></div></div>' for i in range(3))
moreb='<div class="more"><span class="c40">Încarcă încă 30</span></div>'
barM=('<div class="zbar2"><div class="r1"><b>Toate cele 218 selectate</b><span class="lnk">Anulează</span></div><div class="hint" style="margin:-4px 0 10px">Toate documentele care corespund filtrelor, inclusiv cele neîncărcate încă.</div><div class="g2x" style="grid-template-columns:1fr"><span class="c40 pr">'+ic('dl')+'Descarcă ZIP (218)</span></div></div>')
barM1=('<div class="zbar2"><div class="r1"><b>2 selectate</b><span class="lnk">Selectează toate (218)</span></div><div class="g2x"><span class="c40">Anulează</span><span class="c40 pr">'+ic('dl')+'Descarcă ZIP</span></div></div>')
M1='<div class="ph">'+mob_top+mob_cards((0,1))+moreb+'</div>'+barM1+'</div>'
M2='<div class="ph">'+mob_top+mob_cards((0,1,2))+moreb+'</div>'+barM.replace('Toate cele 218 selectate','Toate cele 218 selectate')+'</div>'
rules=('<div class="sec">Regulile</div><ul class="note" style="padding-left:18px"><li><b>Paginare:</b> pe calculator 50 pe pagină (ca la Înscrieri); pe telefon câte 30, cu "Încarcă încă 30" jos.</li>'
 '<li><b>Bifa din antet</b> (calculator) selectează doar pagina vizibilă; imediat apare "Selectează toate cele 218 care corespund filtrelor".</li>'
 '<li><b>"Selectează toate"</b> = tot ce corespunde sezonului, filtrelor și căutării de acum, inclusiv paginile neîncărcate. Numărul e mereu scris (218), ca să știi exact ce descarci.</li>'
 '<li><b>Dacă schimbi un filtru sau căutarea, selecția se golește</b> (cu un mesaj scurt), ca să nu descarci din greșeală documente pe care nu le mai vezi.</li>'
 '<li><b>ZIP mare:</b> arhiva se face pe server, cu progres; dacă durează, primești o notificare în panou cu link valabil 24 de ore.</li></ul>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+'<div class="A"><h2>Multe documente: paginare și "Selectează toate"</h2><p class="note">Exemplu: 312 documente în sezon, filtrat pe "Acord" = 218. Date inventate.</p>'
 +rules+'<div class="sec">Calculator</div><p class="cap2">1. Bifa din antet: pagina selectată</p>'+D1+'<p class="cap2" style="margin-top:16px">2. "Selectează toate cele 218"</p>'+D2b+'<p class="cap2" style="margin-top:16px">3. Descarcă ZIP (218)</p>'+D3
 +'<div class="sec">Telefon</div><div class="wcol"><div><p class="cap2">Câteva bifate</p>'+M1+'</div><div><p class="cap2">"Selectează toate (218)"</p>'+M2+'</div></div></div>')
open(OUTB,'w').write(html)
