import sys,os
OUTW4=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_words2.py'), HERE+'/throw/w5.html']
exec(open(sys.argv[0]).read())
def lab(w): return lambda m,info,c:f'<span class="mm ex">{ic("user")}{w} · {(c+", "+info.replace(", "," ")) if m=="ex" else info.replace(", "," ",1).replace(" Avansați",", Avansați")}</span>' if m else ''
W=[('A','sportiv','Sportiv existent'),('B','membru','Membru existent')]
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+x2+'<div class="A"><h2>Eticheta scurtă</h2><p class="note">Spune doar că avem deja date despre copil, plus cu cine seamănă. Fără "posibil". Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +''.join(O(L,ch,f'"{w}"'+(' (recomandat)' if L=='A' else ''),tbl1(lab(w)).replace('Posibil în club'+ic('down'),w+ic('down'))) for L,ch,w in W)
 +'</div><p class="note" style="margin-top:12px">"Membru" se poate confunda cu membru A.C.S. (cel care plătește taxa de membru); de aceea recomand "Sportiv existent". Filtrul: "Sportiv existent: Da / Nu".</p></div>')
open(OUTW4,'w').write(html)
