import sys,os
OUT2=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_email.py'), HERE+'/throw/e.html']
exec(open(sys.argv[0]).read())
x='''<style>.E .tk{background:#fff;border:1.5px solid #0e1a3c;box-shadow:8px 8px 0 rgb(14 26 60/.16)}
.E .big{font:800 44px/1 "League Spartan",Arial,sans-serif;color:#0e1a3c;letter-spacing:-.01em}
.E .kv2{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px}.E .kv2 small{display:block;font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#495269;margin-bottom:2px}.E .kv2 b{color:#0e1a3c}</style>'''
def frame(inner,bg='#ece8e0'):
  return ('<div class="client"><div class="ch"><div class="sj">Înscriere înregistrată: Maria Dumitrescu (nr. 2026-0142)</div><b>Școala de Patinaj EduSport</b> &lt;inscrieri@scoaladepatinaj.com&gt; · către parinte@exemplu.ro</div>'
   '<div class="att"><span><i>PDF</i>Maria_Dumitrescu_Acord_2026-2027.pdf</span><span><i>PDF</i>Maria_Dumitrescu_Adeziune_2026-2027.pdf</span></div>'
   f'<div class="bg" style="background:{bg}"><div class="m">{inner}</div></div></div>')
P='36px'
DOCS_TXT='Documentele vor fi semnate la prima ședință de curs.'
stepsH=('<div class="lab" style="color:#495269;margin:4px 0 4px">Ce urmează</div><ul class="steps"><li><span class="n">1</span><span>Vom confirma înscrierea în cel mai scurt timp.</span></li><li><span class="n">2</span><span>Tipăriți documentele atașate și aduceți-le la prima ședință.</span></li><li><span class="n">3</span><span>Urmăriți programul weekendurilor pe site.</span></li></ul><div style="margin:16px 0 4px"><span class="btn">Vezi programul</span></div>')
waH=('<div style="border-top:1px solid #dfdddb;margin-top:26px;padding-top:20px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap"><div><div style="font-weight:700;color:#0e1a3c">Canalul WhatsApp al Școlii de Patinaj</div><div style="font-size:13px;color:#495269">Anunțuri despre program și anulări.</div></div><span class="btn2">Intră pe canal</span></div>')
footH=lambda bg:(f'<div style="padding:22px {P};background:{bg}" class="ft"><b style="color:#0e1a3c">ACS EduSport</b> · Telefon 0723.623.712 · edusporttrophy@gmail.com<br><span class="lnk" style="font-size:11.5px">scoaladepatinaj.com</span> · facebook.com/EduSportClub<br><br>Ați primit acest e-mail pentru că ați completat formularul de înscriere pe scoaladepatinaj.com. Datele sunt prelucrate conform <span class="lnk" style="font-size:11.5px">Politicii de Confidențialitate</span>.</div>')
docsBox=lambda bg:(f'<div style="background:{bg};border:1.5px solid #0e1a3c;padding:18px 20px;margin:24px 0"><div class="lab" style="color:#495269;margin-bottom:8px">Documente atașate</div><div style="font-weight:600;color:#0e1a3c">Maria_Dumitrescu_Acord_2026-2027.pdf</div><div style="font-weight:600;color:#0e1a3c;margin-top:2px">Maria_Dumitrescu_Adeziune_2026-2027.pdf</div><p style="margin:10px 0 0;color:#495269;font-size:13.5px">{DOCS_TXT}</p></div>')
intro='<p style="margin:0 0 6px">Bună ziua,</p><p style="margin:0 0 18px">Am primit înscrierea pentru <b>Maria Dumitrescu</b> la Școala de Patinaj EduSport.</p>'
# A revised: white CLUBUL SPORTIV
A=body('A').replace('<div class="pre" style="color:#efb22b">','<div class="pre" style="color:#fbf8f1">')
# C hero navy
C=(f'<div style="background:#0e1a3c;color:#fbf8f1;padding:26px {P} 30px"><div class="pre" style="color:#fbf8f1">Clubul Sportiv</div><div class="wm">EDUSPORT</div>'
   '<div style="height:1px;background:#2a3762;margin:22px 0"></div><div class="lab" style="color:#fbf8f1;opacity:.75;margin-bottom:8px">Sezonul 2026-2027</div>'
   '<div style="font:800 32px/1.05 \'League Spartan\',Arial,sans-serif">Înscriere înregistrată</div><div style="margin-top:10px;font-size:15px">Nr. înscriere <b style="font-size:18px">2026-0142</b></div></div>'
   f'<div style="background:#fbf8f1;padding:28px {P}">'+intro+sumt.replace('<tr><td>Nr. înscriere</td><td>2026-0142</td></tr>','')+docsBox('#fff')+stepsH+waH+'</div>'+footH('#ece8e0'))
# D ticket card
D=(f'<div style="padding:8px 0 0"><div style="text-align:center;margin-bottom:22px"><div class="pre" style="color:#0e1a3c">Clubul Sportiv</div><div class="wm" style="color:#0e1a3c">EDUSPORT</div></div>'
   f'<div class="tk" style="padding:28px {P}"><div class="lab" style="color:#be3330;margin-bottom:10px">Sezonul 2026-2027</div><h1 style="color:#0e1a3c">Înscriere înregistrată</h1>'
   '<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;border-top:1.5px solid #0e1a3c;border-bottom:1.5px solid #0e1a3c;padding:16px 0;margin:18px 0"><div><div class="lab" style="color:#495269">Nr. înscriere</div><div class="big">2026-0142</div></div><div style="text-align:right"><div class="lab" style="color:#495269">Copilul</div><div style="font-weight:700;font-size:16px;color:#0e1a3c">Maria Dumitrescu</div></div></div>'
   +intro+'<div class="kv2"><div><small>Data nașterii</small><b>14.03.2014</b></div><div><small>Sezonul</small><b>2026-2027</b></div></div>'
   +docsBox('#fbf8f1')+stepsH+waH+'</div><div style="padding:22px 4px 0" class="ft"><b style="color:#0e1a3c">ACS EduSport</b> · Telefon 0723.623.712 · edusporttrophy@gmail.com · <span class="lnk" style="font-size:11.5px">scoaladepatinaj.com</span><br>Ați primit acest e-mail pentru că ați completat formularul de înscriere pe scoaladepatinaj.com. Datele sunt prelucrate conform <span class="lnk" style="font-size:11.5px">Politicii de Confidențialitate</span>.</div></div>')
# E letter
E=(f'<div style="background:#fff;padding:36px {P};border-left:6px solid #0e1a3c"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="pre" style="color:#0e1a3c">Clubul Sportiv</div><div class="wm" style="color:#0e1a3c;font-size:20px">EDUSPORT</div></div><div style="text-align:right;font-size:12px;color:#495269;line-height:1.6">Sezonul <b style="color:#0e1a3c">2026-2027</b><br>Nr. înscriere <b style="color:#0e1a3c">2026-0142</b></div></div>'
   '<div style="margin:34px 0 0"><h1 style="color:#0e1a3c;font-size:24px">Înscriere înregistrată</h1>'+intro.replace('margin:0 0 18px','margin:0 0 14px')+
   ''
   f'<p style="margin:0 0 14px">Am atașat formularul de înscriere și cererea de adeziune. {DOCS_TXT}</p><p style="margin:0 0 22px">Vom confirma înscrierea în cel mai scurt timp.</p>'
   '<span class="btn">Vezi programul</span><span style="display:inline-block;width:10px"></span><span class="btn2">Canalul WhatsApp</span>'
   '<p style="margin:30px 0 0;color:#495269">Cu drag,<br><b style="color:#0e1a3c">Echipa Școlii de Patinaj EduSport</b></p></div></div>'+footH('#fff').replace('padding:22px','border-top:1px solid #dfdddb;padding:22px'))
O=lambda L,ch,title,inner,desc,bg='#ece8e0':f'<div class="option" data-choice="{ch}" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">{L}</span> {title}</p><p class="note" style="margin:0 0 8px">{desc}</p>'+frame(inner,bg)+'</div>'
html=(css+x+'<div class="E"><h2>E-mailul: A ajustat + încă 3 variante</h2><p class="note">Același conținut în toate. "Clubul Sportiv" e alb în A. Date inventate.</p><div class="options opt2">'
 +O('A','navy-white','Antet navy, fond crem (ajustat)',A,'"Clubul Sportiv" alb în loc de galben.')
 +O('C','hero','Bloc navy mare cu titlul și numărul',C,'Titlul și nr. înscriere direct pe navy, sus; restul pe crem. Cel mai vizibil număr.')
 +O('D','ticket','Card ca pe site (bordură + umbră retro)',D,'Totul într-un card ca cele de pe site; nr. înscriere mare, ca pe un bilet.','#fbf8f1')
 +O('E','letter','Scrisoare simplă',E,'Text ca o scrisoare, fără tabel; arată mai personal, cel mai ușor la spam.','#f3f4f6')
 +'</div><p class="note" style="margin-top:14px">"Cu drag, Echipa Școlii de Patinaj EduSport" din E e text propus de mine (COPY NEEDED: formula voastră de încheiere).</p></div>')
open(OUT2,'w').write(html)
