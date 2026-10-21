import sys,os
OUTSH=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_docbulk.py'), HERE+'/throw/sh.html']
exec(open(sys.argv[0]).read())
sc2='''<style>.A .anat{position:relative}.A .callout{position:absolute;font-size:11px;font-weight:700;color:#be3330;white-space:nowrap}.A .callout:before{content:"";display:inline-block;width:18px;height:1.5px;background:#be3330;vertical-align:middle;margin-right:4px}
.A .sheet2 .sh-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}.A .sheet2 .sh-f{display:flex;gap:8px;margin-top:14px}.A .sheet2 .sh-f .c40{flex:1}
.A .dmod{position:absolute;inset:0;background:rgba(15,21,34,.45);display:flex;justify-content:center;align-items:flex-start;padding-top:60px;z-index:5}.A .dmod .box{width:420px;background:#fff;border-radius:6px;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.A .dpop{position:absolute;top:150px;left:560px;width:280px;background:#fff;border:1px solid var(--ln);border-radius:4px;box-shadow:0 10px 30px rgba(14,26,60,.15);padding:12px;z-index:5}</style>'''
filt=('<div class="lb" style="margin-top:6px">Tip document</div><div class="ccb" style="margin-top:6px"><input type="checkbox" checked><span>Acord</span></div><div class="ccb" style="margin-top:6px"><input type="checkbox"><span>Cerere de adeziune</span></div>'
 '<div class="lb">Sursă</div><div class="ccb" style="margin-top:6px"><input type="checkbox"><span>Generat</span></div><div class="ccb" style="margin-top:6px"><input type="checkbox"><span>Încărcat</span></div>')
sheet=('<div class="dimm"></div><div class="sheet2"><div class="grab"></div><div class="sh-h"><b style="font-size:15px">Filtre</b>'+ic('x')+'</div>'+filt+'<div class="sh-f"><span class="c40">Șterge</span><span class="c40 pr" style="flex:2">Arată 218 documente</span></div></div>')
PH='<div class="ph anat">'+mob_top+mob_cards()+'</div>'+sheet+'</div>'
deskA=screen('documente',desk(''),'<div class="dmod"><div class="box"><div class="mh" style="display:flex;padding:12px 16px;border-bottom:1px solid var(--ln)"><b style="flex:1;font-size:15px">Filtre</b>'+ic('x')+'</div><div style="padding:6px 16px 14px">'+filt+'</div><div class="ft"><span class="btn">Șterge</span><span class="btn pr">Arată 218 documente</span></div></div></div>')
deskB=screen('documente',desk(''),'<div class="dpop"><b>Tip document</b><div class="ccb" style="margin-top:8px"><input type="checkbox" checked><span>Acord</span></div><div class="ccb" style="margin-top:6px"><input type="checkbox"><span>Cerere de adeziune</span></div><div class="qft"><span class="lnk">Șterge</span><span class="btn sm pr">Gata</span></div></div>')
api=('<div class="sec">Componenta: BottomSheet (src/admin/ui)</div><ul class="note" style="padding-left:18px">'
 '<li><b>Pe telefon (sub 640px):</b> vine de jos, colțuri rotunjite sus, mâner, titlu + X, conținut cu scroll (maxim 85% din ecran), butoane fixe jos, spațiu pentru bara iPhone. Se închide cu X, cu atingere pe fundal, trăgând în jos sau cu Escape.</li>'
 '<li><b>Pe calculator:</b> același conținut, afișat ca fereastră în mijloc (Modal-ul existent) sau ca meniu lângă buton (Popover-ul existent), după caz.</li>'
 '<li><b>La fel ca Drawer și Modal de acum:</b> focusul rămâne în el, revine pe butonul care l-a deschis, folosește aceeași stivă de straturi (o confirmare deschisă din el stă deasupra).</li>'
 '<li><b>Folosit pentru:</b> filtre și sortare, acțiunile unui rând, alegeri scurte (ex. Formulare goale, Încarcă document), orice meniu care pe telefon ar fi prea mic.</li>'
 '<li>Intră în pagina de referință a componentelor din admin, ca restul.</li></ul>')
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+'<div class="A"><h2>Panoul de jos, componentă comună în admin</h2><p class="note">Adminul are deja Drawer (panou din dreapta, pe telefon ecran întreg) și Modal. Propun o componentă nouă, BottomSheet, pentru tot ce pe telefon trebuie să vină de jos. Date inventate.</p>'
 '<div class="wcol"><div><p class="cap2">Pe telefon</p>'+PH+'</div></div>'+api
 +'<div class="sec">Pe calculator, același conținut</div><div class="options wcol" style="flex-direction:column!important">'
 +O('A','modal','Fereastră în mijloc (pentru panouri cu mai multe secțiuni, ex. Filtre) (recomandat pentru Filtre)',deskA)
 +O('B','popover','Meniu lângă buton (pentru alegeri scurte, ex. un singur filtru, Formulare goale)',deskB,'Le folosim pe amândouă, în funcție de conținut: componenta primește "pe calculator: fereastră / meniu".')+'</div>'
 '<div class="sec">De decis</div><div class="options optq">'+Q('A','also-drawer','Și Drawer-ul de acum devine panou de jos pe telefon','Azi e ecran întreg pe telefon; ar arăta la fel peste tot.')+Q('B','keep-drawer','Drawer rămâne ecran întreg pe telefon (recomandat)','Drawer-ul are conținut mare (fișa sportivului); ecranul întreg e mai bun acolo.')+'</div></div>')
open(OUTSH,'w').write(html)
