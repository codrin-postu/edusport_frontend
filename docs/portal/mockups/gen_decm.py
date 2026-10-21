import sys,os
OUTD2=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_match.py'), HERE+'/throw/dm.html']
exec(open(sys.argv[0]).read())
def panel(card):
  head='<div class="ph2"><h2>Maria Dumitrescu <span class="bd nw">Nou</span></h2>'
  if not card: head+=f'<span class="mm ex" style="margin-top:2px">{ic("user")}Sportiv existent</span>'
  head+='<div class="meta2"><span>Nr. <b>2026-0142</b></span><span>Trimis <b>3 oct 2026</b></span></div>'
  if card: head+=f'<div class="mcard" style="margin-top:12px"><span class="av">MD</span><div><b>Sportiv existent</b><div class="hint">Primii Pași în 2025-2026 · 12 ani</div></div><span class="lnk">Vezi fișa</span></div>'
  head+='<div class="ui-tabs"><span class="ui-tab on">Date</span><span class="ui-tab">Abonament</span><span class="ui-tab">Documente<span class="ui-tab-count">2</span></span><span class="ui-tab">Istoric<span class="ui-tab-count">1</span></span></div></div>'
  return '<div class="tp" style="width:360px;min-height:0;border:1px solid var(--ln);border-radius:4px">'+head+'<div class="bd2" style="padding-bottom:12px"><div class="lb">Adresă de e-mail</div><div class="vl">parinte@exemplu.ro</div><div class="lb">Persoana care completează</div><div class="vl">Mihaela Dumitrescu</div><div class="lb">…</div></div><div class="ft"><span class="btn sm">Contactat</span><span class="btn sm pr">Confirmă înscrierea</span></div></div>'
cA2=cA.replace('<b>Maria Dumitrescu</b><div class="hint">14.03.2014','<b>Sportiv existent: Maria Dumitrescu</b><div class="hint">14.03.2014')
cC2=cC
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+'<div class="A"><h2>Două decizii: panoul și fereastra de confirmare</h2><p class="note">În listă rămâne doar "Sportiv existent" sub nume (decis). Aici: unde vezi detaliile și cum confirmi. Date inventate.</p>'
 '<div class="sec">1. Panoul înscrierii</div><div class="options wcol">'
 +O('A','card','Card cu sportivul găsit, deasupra taburilor (recomandat)',panel(True),'Vezi grupa de anul trecut și deschizi fișa dintr-un click, înainte să confirmi.')
 +O('B','line','Doar eticheta, ca în listă',panel(False),'Mai compact; detaliile apar abia în fereastra de confirmare.')+'</div>'
 '<div class="sec">2. Fereastra de confirmare</div><div class="options wcol">'
 +O('A','card-choice','Cardul sportivului + "Sportiv existent / Alt sportiv" + doar ce diferă (recomandat)',shell(cA2),'Clar cine e copilul; doar diferențele (aici telefonul), restul într-un rând "identice".')
 +O('B','two-cols','Două coloane: fișa vs înscrierea',shell(cB),'Comparație completă, diferențele marcate.')
 +O('C','question','Întâi întrebarea "Este același sportiv?"',shell(cC2),'Un pas în plus; diferențele apar după răspuns.')+'</div></div>')
open(OUTD2,'w').write(html)
