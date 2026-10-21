import sys,os
OUTW3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_words2.py'), HERE+'/throw/w4.html']
exec(open(sys.argv[0]).read())
def lab(w): return lambda m,info,c:f'<span class="mm ex">{ic("file")}{w} · {(c+", "+info.replace(", "," ")) if m=="ex" else info.replace(", "," ",1).replace(" Avansați",", Avansați")}</span>' if m else ''
W=[('A','fisa','Fișă existentă'),('B','are-fisa','Are fișă'),('C','in-club','În club'),('D','gasit','Găsit în club')]
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+x2+'<div class="A"><h2>Eticheta scurtă</h2><p class="note">Spune doar că avem deja date despre copil, plus cu cine seamănă. Fără "posibil". Date inventate.</p><div class="options wcol" style="flex-direction:column!important">'
 +''.join(O(L,ch,f'"{w}"'+(' (recomandat)' if L=='A' else ''),tbl1(lab(w)).replace('Posibil în club'+ic('down'),w+ic('down'))) for L,ch,w in W)
 +'</div><p class="note" style="margin-top:12px">"În club" se poate confunda cu statusul Confirmat; "Fișă existentă" spune exact ce e: avem deja o fișă cu date.</p></div>')
open(OUTW3,'w').write(html)
