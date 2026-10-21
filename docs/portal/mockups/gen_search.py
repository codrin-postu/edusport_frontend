import sys,os
OUTSR=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_pending.py'), HERE+'/throw/sr.html']
exec(open(sys.argv[0]).read())
sc='''<style>.A .srch2{display:flex;align-items:center;gap:8px;height:36px;border:1px solid var(--p);box-shadow:0 0 0 3px #dfe6f3;border-radius:4px;padding:0 10px;background:#fff}.A .srch2 .ic{color:var(--mu)}.A .srch2 b{font-weight:500}.A .caret{display:inline-block;width:1px;height:16px;background:var(--tx);margin-left:-6px}
.A .res{border:1px solid var(--ln);border-radius:4px;margin-top:4px;box-shadow:0 10px 30px rgba(14,26,60,.12);background:#fff;padding:4px}.A .ro{display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:center;padding:8px;border-radius:3px;cursor:pointer}.A .ro:hover,.A .ro.hv{background:#f3f5fa}.A .ro .av{width:32px;height:32px;font-size:11px}.A .ro small{display:block;color:var(--mu)}.A .ro mark{background:#fff2c2;padding:0}
.A .rempty{padding:14px 10px;color:var(--mu)}.A .three{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-start}</style>'''
top=lambda inner:shell(inner)
link=f'<div style="margin-top:8px"><span class="lnk">{ic("search")}Caută alt sportiv</span></div>'
s1=cA3
s2=(f'<div class="srch2">{ic("search")}<b>Dumit</b><span class="caret"></span><span style="flex:1"></span><span class="lnk" style="font-size:12px">Anulează</span></div>'
 '<div class="res">'
 '<div class="ro hv"><span class="av">MD</span><div><b><mark>Dumit</mark>rescu Maria</b><small>14.03.2014 · Primii Pași 2025-2026 · Mihaela Dumitrescu</small></div></div>'
 '<div class="ro"><span class="av">AD</span><div><b><mark>Dumit</mark>rescu Andrei</b><small>02.11.2011 · Avansați Silver 2024-2025 · Mihaela Dumitrescu</small></div></div>'
 '<div class="ro"><span class="av">ID</span><div><b><mark>Dumit</mark>ru Ioana</b><small>19.07.2015 · Intermediari Bronze 2025-2026 · Radu Dumitru</small></div></div>'
 '</div><div class="hint" style="margin-top:8px">Caută după nume, data nașterii, părinte sau telefon. Sportivul propus inițial rămâne primul.</div>')
s3=(f'<div class="srch2">{ic("search")}<b>Popescu Andrei</b><span class="caret"></span><span style="flex:1"></span><span class="lnk" style="font-size:12px">Anulează</span></div>'
 '<div class="res"><div class="rempty">Niciun sportiv găsit pentru "Popescu Andrei".</div></div>'
 '<div class="ch2" style="grid-template-columns:1fr"><div class="chc on"><b>Sportiv nou</b><small>Se creează o fișă nouă: Andrei Popescu, 02.09.2016</small></div></div>')
s4=(f'<div class="mcard"><span class="av">AD</span><div><b>Andrei Dumitrescu</b><div class="hint">Avansați Silver 2024-2025</div></div><span class="lnk">Vezi fișa</span></div>'
 '<div class="ch2"><div class="chc"><b>Sportiv existent</b><small>Înscrierea se adaugă la această fișă</small></div><div class="chc"><b>Sportiv nou</b><small>Se creează o fișă nouă</small></div></div>'
 '<table class="cmpt" style="margin-top:12px"><tr><th></th><th>În fișă</th><th>În înscriere</th><th></th></tr>'
 '<tr class="d"><td>Nume</td><td>Andrei Dumitrescu</td><td><b>Maria Dumitrescu</b></td><td></td></tr><tr class="d"><td>Data nașterii</td><td>02.11.2011</td><td><b>14.03.2014</b></td><td></td></tr>'
 '<tr><td>Părinte</td><td>Mihaela Dumitrescu</td><td>Mihaela Dumitrescu</td><td></td></tr><tr class="d"><td>Telefon</td><td>0722 111 22</td><td><b>0722 111 222</b></td><td><label class="ccb" style="white-space:nowrap"><input type="checkbox" checked><span>Actualizează</span></label></td></tr>'
 '<tr><td>E-mail</td><td>parinte@exemplu.ro</td><td>parinte@exemplu.ro</td><td></td></tr></table>'
 f'<div style="margin-top:8px"><span class="lnk">{ic("search")}Caută alt sportiv</span></div><div class="hint" style="margin-top:6px">Numele și data nașterii diferă (aici e fratele), deci nimic nu e ales din start: admin alege, iar butonul Confirmă e activ abia după alegere.</div>')
cap=lambda t:f'<p class="cap2">{t}</p>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+sc+'<div class="A"><h2>"Caută alt sportiv" în fereastra de confirmare</h2><p class="note">Căutarea apare pe loc, în locul cardului; nu se deschide altă fereastră. Date inventate.</p>'
 '<div class="three"><div>'+cap('1. Propunerea sistemului')+shell(s1)+'</div><div>'+cap('2. Apasă "Caută alt sportiv" și scrie')+shell(s2)+'</div></div>'
 '<div class="three" style="margin-top:22px"><div>'+cap('3. Ales alt sportiv din listă')+shell(s4)+'</div><div>'+cap('4. Nu găsește pe nimeni')+shell(s3)+'</div></div></div>')
open(OUTSR,'w').write(html)
