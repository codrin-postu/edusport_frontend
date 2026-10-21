import sys
OUT=sys.argv[1]
css='''<style>:root{color-scheme:light;--bg-primary:#f5f5f7!important;--bg-secondary:#fff!important;--bg-tertiary:#e5e5e7!important;--border:#d1d1d6!important;--text-primary:#1d1d1f!important;--text-secondary:#86868b!important;--text-tertiary:#aeaeb2!important;--accent:#0071e3!important;--accent-hover:#0077ed!important;--selected-bg:#e8f4fd!important;--selected-border:#0071e3!important}.brand-logo{filter:invert(1)!important}</style><style>@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800&family=Climate+Crisis&family=Inter:wght@400;600;700&display=swap');
.E{font:14px/1.5 Inter,Arial,sans-serif;color:#1b1d22}.E *{box-sizing:border-box}
.E .row{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}
.E .client{width:680px;max-width:100%;background:#fff;border:1px solid #c9ccd4;box-shadow:0 10px 30px rgba(14,26,60,.12)}
.E .ch{padding:14px 20px;border-bottom:1px solid #e0e2e8;font-size:13px;color:#666c7c}.E .ch .sj{font-size:18px;font-weight:700;color:#1b1d22;margin-bottom:6px}.E .ch b{color:#1b1d22}
.E .att{display:flex;gap:10px;padding:12px 20px;border-bottom:1px solid #e0e2e8;flex-wrap:wrap}.E .att span{display:inline-flex;align-items:center;gap:8px;border:1px solid #c0c0cf;padding:7px 10px;font-weight:600;font-size:12.5px}.E .att i{font-style:normal;font-size:10px;font-weight:800;background:#c0392b;color:#fff;padding:1px 4px}
.E .bg{padding:28px 20px}.E .m{width:600px;max-width:100%;margin:0 auto}
.E .wm{font-family:"Climate Crisis",Impact,sans-serif;font-size:26px;letter-spacing:.04em;line-height:1}.E .pre{font-size:9px;font-weight:700;letter-spacing:.34em;text-transform:uppercase;margin-bottom:4px}
.E h1{font:800 28px/1.1 "League Spartan",Arial,sans-serif;margin:0 0 12px;letter-spacing:-.01em}
.E .lab{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.E table.sum{width:100%;border-collapse:collapse;font-size:14px}.E table.sum td{padding:9px 0;border-bottom:1px solid #dfdddb;vertical-align:top}.E table.sum td:first-child{color:#495269;width:44%}.E table.sum td:last-child{font-weight:600;color:#0e1a3c}
.E .btn{display:inline-block;background:#000;color:#fbf8f1;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;padding:14px 22px;border:1.5px solid #0e1a3c}
.E .btn2{display:inline-block;color:#0e1a3c;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;padding:12px 20px;border:1.5px solid #0e1a3c;background:#fff}
.E .lnk{font-weight:600;color:#0e1a3c;border-bottom:2px solid #be3330}
.E .steps{margin:0;padding:0;list-style:none}.E .steps li{display:grid;grid-template-columns:28px 1fr;gap:10px;padding:8px 0}.E .steps .n{width:28px;height:28px;background:#0e1a3c;color:#fbf8f1;display:grid;place-items:center;font-weight:800;font-size:13px}
.E .ft{font-size:11.5px;line-height:1.55;color:#5f657a}
.E .note{font-size:13px;color:#4b5263;max-width:1100px;margin:4px 0 14px}.E .cap{font-size:12px;font-weight:700;color:#666;margin:0 0 6px}
.E .sec{font:700 20px Inter,sans-serif;margin:40px 0 6px;padding-top:12px;border-top:3px solid #131c3d}
.E .opt2{display:flex!important;flex-direction:row!important;gap:28px;flex-wrap:wrap;align-items:flex-start}.E .opt2>.option{display:block;padding:0;border:0;background:none}
.E .phone{width:375px;border:10px solid #1b1d22;border-radius:0;background:#fff;height:760px;overflow:hidden}
</style>'''
summary=[('Nr. înscriere','2026-0142'),('Copilul','Maria Dumitrescu'),('Data nașterii','14.03.2014'),('Sezonul','2026-2027')]
sumt='<table class="sum">'+''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a,b in summary)+'</table>'
def body(theme, narrow=False):
  P='22px' if narrow else '36px'
  if theme=='A':
    head=f'<div style="background:#0e1a3c;color:#fbf8f1;padding:24px {P}"><div class="pre" style="color:#efb22b">Clubul Sportiv</div><div class="wm">EDUSPORT</div></div>'
    wrap_bg='#fbf8f1'; inner='#fbf8f1'; eyebrow='#be3330'
  else:
    head=f'<div style="background:#fff;padding:24px {P} 18px;border-top:6px solid #0e1a3c"><div class="pre" style="color:#0e1a3c">Clubul Sportiv</div><div class="wm" style="color:#0e1a3c">EDUSPORT</div></div>'
    wrap_bg='#ffffff'; inner='#ffffff'; eyebrow='#be3330'
  docs=(f'<div style="background:{"#fff" if theme=="A" else "#fbf8f1"};border:1.5px solid #0e1a3c;padding:18px 20px;margin:24px 0">'
   '<div class="lab" style="color:#495269;margin-bottom:8px">Documente atașate</div>'
   '<div style="font-weight:600;color:#0e1a3c">Maria_Dumitrescu_Acord_2026-2027.pdf</div><div style="font-weight:600;color:#0e1a3c;margin-top:2px">Maria_Dumitrescu_Adeziune_2026-2027.pdf</div>'
   '<p style="margin:10px 0 0;color:#495269;font-size:13.5px">Documentele vor fi semnate la prima ședință de curs.</p></div>')
  steps=('<div class="lab" style="color:#495269;margin:4px 0 4px">Ce urmează</div><ul class="steps">'
   '<li><span class="n">1</span><span>Vom confirma înscrierea în cel mai scurt timp.</span></li>'
   '<li><span class="n">2</span><span>Tipăriți documentele atașate și aduceți-le la prima ședință.</span></li>'
   '<li><span class="n">3</span><span>Urmăriți programul weekendurilor pe site.</span></li></ul>'
   '<div style="margin:16px 0 4px"><span class="btn">Vezi programul</span></div>')
  wa=('<div style="border-top:1px solid #dfdddb;margin-top:26px;padding-top:20px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap"><div><div style="font-weight:700;color:#0e1a3c">Canalul WhatsApp al Școlii de Patinaj</div><div style="font-size:13px;color:#495269">Anunțuri despre program și anulări.</div></div><span class="btn2">Intră pe canal</span></div>')
  foot=(f'<div style="padding:22px {P};background:{"#ece8e0" if theme=="A" else "#fbf8f1"}" class="ft"><b style="color:#0e1a3c">ACS EduSport</b> · Telefon 0723.623.712 · edusporttrophy@gmail.com<br><span class="lnk" style="font-size:11.5px">scoaladepatinaj.com</span> · facebook.com/EduSportClub<br><br>Ați primit acest e-mail pentru că ați completat formularul de înscriere pe scoaladepatinaj.com. Datele sunt prelucrate conform <span class="lnk" style="font-size:11.5px">Politicii de Confidențialitate</span>.</div>')
  main=(f'<div style="background:{inner};padding:30px {P} 30px"><div class="lab" style="color:{eyebrow};margin-bottom:10px">Sezonul 2026-2027</div><h1 style="color:#0e1a3c">Înscriere înregistrată</h1>'
   '<p style="margin:0 0 6px;color:#1b1d22">Bună ziua,</p><p style="margin:0 0 18px;color:#1b1d22">Am primit înscrierea pentru <b>Maria Dumitrescu</b> la Școala de Patinaj EduSport.</p>'
   +sumt+docs+steps+wa+'</div>')
  return f'<div style="background:{wrap_bg}"><div class="m">{head}{main}{foot}</div></div>'
def client(theme):
  return ('<div class="client"><div class="ch"><div class="sj">Înscriere înregistrată: Maria Dumitrescu (nr. 2026-0142)</div><b>Școala de Patinaj EduSport</b> &lt;inscrieri@scoaladepatinaj.com&gt; · către parinte@exemplu.ro</div>'
   '<div class="att"><span><i>PDF</i>Maria_Dumitrescu_Acord_2026-2027.pdf</span><span><i>PDF</i>Maria_Dumitrescu_Adeziune_2026-2027.pdf</span></div>'
   f'<div class="bg" style="background:{"#ece8e0" if theme=="A" else "#f3f4f6"}">'+body(theme)+'</div></div>')
phone=lambda t:'<div class="phone"><div style="padding:10px 14px;border-bottom:1px solid #e0e2e8;font-size:12px;color:#666c7c"><b style="color:#1b1d22;font-size:14px;display:block">Înscriere înregistrată: Maria Dumitrescu</b>Școala de Patinaj EduSport</div>'+body(t,True)+'</div>'
html=(css+'<div class="E"><h2>E-mailul de după înscriere</h2><p class="note">Trimis prin Brevo imediat după "Trimite înscrierea". Stilul site-ului: navy, crem, accent cărămiziu, titluri League Spartan, butonul negru, fără colțuri rotunjite. Cuvintele sunt cele de pe site și din scriptul ei. Date inventate.</p>'
 '<div class="options opt2"><div class="option" data-choice="navy" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> Antet navy, fond crem</p>'+client('A')+'</div>'
 '<div class="option" data-choice="white" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> Alb, minimal, bară navy sus</p>'+client('B')+'</div></div>'
 '<div class="sec">Pe telefon</div><p class="note">Majoritatea părinților o deschid pe telefon: o coloană, butoane pe toată lățimea ecranului.</p><div class="row"><div><p class="cap">A</p>'+phone('A')+'</div><div><p class="cap">B</p>'+phone('B')+'</div></div>'
 '<div class="sec">Note tehnice</div><ul class="note" style="padding-left:18px"><li>Construit ca e-mail clasic (tabele, stiluri inline, 600px lățime), ca să arate la fel în Gmail, Outlook, Apple Mail.</li><li>Logo-ul EDUSPORT e o imagine (fonturile web nu se încarcă în toate aplicațiile de mail); restul textului e text real.</li><li>Are și variantă text simplu (ajută și la spam).</li><li>Pentru neafiliați apare doar Acordul și rândul "Membru: Nu".</li><li>"Vezi programul" duce la calendarul Școlii; "Intră pe canal" la canalul WhatsApp din setări.</li></ul></div>')
open(OUT,'w').write(html)
