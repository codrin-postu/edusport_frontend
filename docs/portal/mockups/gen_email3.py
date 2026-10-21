import sys,os
OUT3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_email2.py'), HERE+'/throw/e2.html']
exec(open(sys.argv[0]).read())
y='''<style>.E .st2{margin:6px 0 0;padding:0;list-style:none;counter-reset:s}.E .st2 li{display:grid;grid-template-columns:26px 1fr;gap:8px;padding:10px 0;border-top:1px solid #dfdddb}.E .st2 li:last-child{border-bottom:1px solid #dfdddb}
.E .st2 .k{font:800 18px/1.2 "League Spartan",Arial,sans-serif;color:#be3330}.E .st2 b{display:block;color:#0e1a3c}.E .st2 span.d{color:#495269;font-size:13.5px}</style>'''
S3=[('Confirmăm înscrierea','Vom confirma înscrierea în cel mai scurt timp.'),('Aduceți documentele','Tipăriți documentele atașate și aduceți-le la prima ședință. Documentele vor fi semnate la prima ședință de curs.'),('Urmăriți programul','Programul weekendurilor e pe site.')]
sq='<ul class="steps" style="margin:4px 0 0">'+''.join(f'<li><span class="n">{i+1}</span><span><b style="color:#0e1a3c;display:block">{t}</b><span style="color:#495269;font-size:13.5px">{d}</span></span></li>' for i,(t,d) in enumerate(S3))+'</ul>'
tx='<ol class="st2">'+''.join(f'<li><span class="k">{i+1}</span><span><b>{t}</b><span class="d">{d}</span></span></li>' for i,(t,d) in enumerate(S3))+'</ol>'
def letter(steps,narrow=False):
  P='22px' if narrow else '36px'
  return (f'<div style="background:#fff;padding:{"26px" if narrow else "36px"} {P};border-left:6px solid #0e1a3c"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div><div class="pre" style="color:#0e1a3c">Clubul Sportiv</div><div class="wm" style="color:#0e1a3c;font-size:20px">EDUSPORT</div></div><div style="text-align:right;font-size:12px;color:#495269;line-height:1.6;white-space:nowrap">Sezonul <b style="color:#0e1a3c">2026-2027</b><br>Nr. înscriere <b style="color:#0e1a3c;white-space:nowrap">2026-0142</b></div></div>'
   f'<div style="margin:{"26px" if narrow else "34px"} 0 0"><h1 style="color:#0e1a3c;font-size:24px">Înscriere înregistrată</h1><p style="margin:0 0 6px">Bună ziua,</p><p style="margin:0 0 18px">Am primit înscrierea pentru <b>Maria Dumitrescu</b> la Școala de Patinaj EduSport. Am atașat formularul de înscriere și cererea de adeziune.</p>'
   '<div class="lab" style="color:#495269">Ce urmează</div>'+steps+
   ('<div style="margin-top:22px;display:flex;flex-direction:column;gap:10px"><span class="btn" style="display:block;text-align:center">Vezi programul</span><span class="btn2" style="display:block;text-align:center">Canalul WhatsApp</span></div>' if narrow else '<div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap"><span class="btn">Vezi programul</span><span class="btn2">Canalul WhatsApp</span></div>')+
   '<p style="margin:28px 0 0;color:#495269">Cu drag,<br><b style="color:#0e1a3c">Echipa Școlii de Patinaj EduSport</b></p></div></div>'+footH('#fff').replace('padding:22px 36px','border-top:1px solid #dfdddb;padding:22px '+P))
phone2=lambda st:'<div class="phone"><div style="padding:10px 14px;border-bottom:1px solid #e0e2e8;font-size:12px;color:#666c7c"><b style="color:#1b1d22;font-size:14px;display:block">Înscriere înregistrată: Maria Dumitrescu</b>Școala de Patinaj EduSport</div>'+letter(st,True)+'</div>'
html=(css+x+y+'<div class="E"><h2>Varianta E (scrisoare) cu cei 3 pași</h2><p class="note">Pașii înlocuiesc frazele separate de dinainte (confirmarea și semnarea), deci textul nu se repetă. Date inventate.</p><div class="options opt2">'
 +O('E1','e-squares','Pași cu pătrate navy numerotate',letter(sq),'Ca pe site: pătrat navy cu cifra, titlu scurt + o frază.','#f3f4f6')
 +O('E2','e-text','Pași ca listă simplă, cifre cărămizii',letter(tx),'Mai discret, potrivit cu stilul de scrisoare: cifre mari, linii subțiri între pași.','#f3f4f6')
 +'</div><div class="sec">Pe telefon</div><div class="row"><div><p class="cap">E1</p>'+phone2(sq)+'</div><div><p class="cap">E2</p>'+phone2(tx)+'</div></div>'
 +'<p class="note" style="margin-top:14px">Pe telefon butoanele sunt pe toată lățimea, unul sub altul (prin media query; Gmail, Apple Mail și Outlook pe telefon îl respectă). Pe calculator rămân unul lângă altul.</p><p class="note">Titlurile pașilor ("Confirmăm înscrierea", "Aduceți documentele", "Urmăriți programul") și "Cu drag, Echipa…" sunt propuse de mine (COPY NEEDED dacă vreți altă formulare). Pentru neafiliați: "Am atașat formularul de înscriere."</p></div>')
open(OUT3,'w').write(html)
