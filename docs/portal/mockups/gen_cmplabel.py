import sys,os
OUTCL=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_open9.py'), HERE+'/throw/cl.html']
exec(open(sys.argv[0]).read())
def frag(lbl):
  return ('<div class="cmod" style="width:540px"><div class="mb"><div class="grp2" style="border:0"><h4>Sportiv</h4>'
   f'<div class="mcard"><span class="av">MD</span><div><b>Maria Dumitrescu</b><div class="hint">Primii Pași 2025-2026</div></div><span class="lnk">Vezi fișa</span></div>'
   '<div class="ch2"><div class="chc on"><b>Sportiv existent</b><small>Înscrierea se adaugă la această fișă</small></div><div class="chc"><b>Sportiv nou</b><small>Se creează o fișă nouă: Maria Dumitrescu</small></div></div>'
   f'<div style="margin-top:10px;display:flex;gap:18px"><span class="lnk">{lbl}{ic("down")}</span><span class="lnk">{ic("search")}Caută alt sportiv</span></div></div></div></div>')
L=[('A','verifica','Verifică datele (recomandat)','Verifică datele','Scurt; spune că te uiți înainte să se schimbe ceva.'),
   ('B','actualizari','Date de actualizat','Date de actualizat','Spune exact ce e: ce se va schimba în fișă.'),
   ('C','compara-act','Compară și actualizează','Compară și actualizează','Cele două acțiuni, mai lung.'),
   ('D','ce-se-schimba','Ce se schimbă în fișă','Ce se schimbă în fișă','Formulat ca întrebare implicită; clar pentru oricine.')]
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+'<div class="A"><h2>Numele linkului pentru tabelul cu datele</h2><p class="note">Tabelul arată diferențele și bifele "Actualizează" (bifate din start). Linkul trebuie să spună că acolo alegi ce se actualizează. Când e deschis: "Ascunde". Date inventate.</p><div class="options wcol">'
 +''.join(O(a,b,c,frag(d),e) for a,b,c,d,e in L)+'</div></div>')
open(OUTCL,'w').write(html)
