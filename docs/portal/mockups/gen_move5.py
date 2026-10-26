import sys,os
OUTM5=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_move3.py'), HERE+'/throw/mv3b.html']
exec(open(sys.argv[0]).read())
h=html[:html.index('<div class="qh">1.')]
h=h.replace('<h2>Mutare sau adăugare în altă grupă</h2>','<h2>Mutare sau adăugare în altă grupă: varianta decisă</h2>')
open(OUTM5,'w').write(h+'<p class="note" style="margin-top:24px">Decis: o singură grupă principală, poate fi și pe lista altor grupe; legătura dintre grupe e lista de prețuri; la Avansați Gold abonamentul actual continuă; programul grupei se discută separat. Nimic de ales pe acest ecran.</p></div>')
