import sys
N=sys.argv[1]
CH='<svg class="ch" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>'
CK='<svg viewBox="0 0 24 24" class="tk"><path d="M5 12l5 5L20 7"/></svg>'
css='''<style>:root{color-scheme:light;--bg-primary:#f5f5f7!important;--bg-secondary:#fff!important;--bg-tertiary:#e5e5e7!important;--border:#d1d1d6!important;--text-primary:#1d1d1f!important;--text-secondary:#86868b!important;--text-tertiary:#aeaeb2!important;--accent:#0071e3!important;--accent-hover:#0077ed!important;--selected-bg:#e8f4fd!important;--selected-border:#0071e3!important}.brand-logo{filter:invert(1)!important}</style><style>
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800&family=Inter:wght@400;600;700&display=swap');
.F{--primary:#0e1a3c;--secondary:#495269;--muted:#5f657a;--accent:#be3330;--surface:#fbf8f1;--raised:#fff;--subtle:#ece8e0;--line:#0e1a3c;--line-subtle:#dfdddb;font-family:Inter,system-ui,sans-serif;color:var(--primary)}
.F *{box-sizing:border-box}
.F .row{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}
.F .cap{font-size:12px;font-weight:700;color:#666;margin:0 0 6px}
.F .page{width:390px;background:var(--surface);border:1px solid #c9ccd4;padding:24px 20px 28px}
.F .eyebrow{font-weight:600;font-size:12px;line-height:1.1;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.F .h{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:26px;line-height:1.1;letter-spacing:-.02em;margin:12px 0}
.F .bsm{font-size:14px;line-height:1.55;color:var(--secondary)}
.F .fcard{border-radius:0;margin-top:48px;background:var(--surface);border:1.5px solid var(--line);box-shadow:8px 8px 0 rgb(14 26 60/.16);padding:24px}
.F .si{display:flex;flex-direction:column;gap:8px;margin-bottom:48px}
.F .si .top{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.F .si .t{font-size:14px;color:var(--primary)}
.F .si .c{font-weight:600;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);white-space:nowrap}
.F .bar{position:relative;height:8px;border:1.5px solid var(--line);background:var(--subtle);overflow:hidden}.F .bar i{position:absolute;inset:0 auto 0 0;background:var(--primary)}
.F .qs{display:flex;flex-direction:column;gap:24px}
.F .lbl{display:block;font-weight:600;font-size:12px;line-height:1.3;letter-spacing:.14em;text-transform:uppercase;color:var(--secondary);margin-bottom:8px}
.F .in{width:100%;height:48px;padding:0 16px;font-size:14px;border:1.5px solid var(--line);background:var(--raised);display:flex;align-items:center;justify-content:space-between;color:var(--primary)}
.F .in.ph{color:var(--muted)}
.F .ta{min-height:128px;padding:12px 16px;align-items:flex-start}
.F .ch{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;flex-shrink:0}
.F .help{font-size:12px;line-height:1.4;color:var(--secondary);margin:-4px 0 8px}
.F .cbrow{display:flex;gap:12px;align-items:flex-start}
.F .cb{position:relative;width:20px;height:20px;border:1.5px solid var(--line);flex-shrink:0;background:var(--raised);display:grid;place-items:center}
.F .cb.on{background:var(--accent);border-color:var(--accent)}.F .tk{width:14px;height:14px;fill:none;stroke:#fff;stroke-width:3}
.F .cbl{font-size:12px;font-weight:600;line-height:1.5;color:var(--primary)}
.F .link{font-weight:600;color:var(--primary);background-image:linear-gradient(var(--accent),var(--accent));background-repeat:no-repeat;background-size:100% 2px;background-position:right bottom;padding-bottom:3px}
.F .nav{display:flex;justify-content:space-between;align-items:center;margin-top:32px;padding-top:24px;border-top:1.5px solid var(--line-subtle)}
.F .back{font-size:14px;color:var(--secondary)}
.F .lcta{position:relative;isolation:isolate;display:inline-flex}.F .lcta .face{position:relative;z-index:3;height:48px;padding:0 24px;display:inline-flex;align-items:center;background:#000;color:var(--surface);border:1.5px solid var(--line);font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase}
.F .box{border-radius:0;border:1.5px solid var(--line);background:var(--raised);padding:12px 16px}
.F .box .bt{font-weight:700;font-size:14px;margin-bottom:6px}
.F .box .pr{display:flex;justify-content:space-between;font-size:14px;padding:3px 0}
.F .box s{color:var(--muted)}
.F .box .bn{font-size:12px;color:var(--secondary);margin:8px 0 10px;line-height:1.4}
.F .sec{height:48px;border:1.5px solid var(--line);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase}
.F .wkt{border:1.5px solid var(--line);background:var(--surface)}
.F .wkt .mo{font-weight:600;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:10px 12px;border-bottom:1px solid var(--line-subtle)}
.F .wkt .mo:not(:first-child){border-top:1.5px solid var(--line)}
.F .wr{display:grid;grid-template-columns:10px 1fr auto;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--line-subtle);font-size:14px}
.F .wr:last-child{border-bottom:0}.F .wr i{width:9px;height:9px;background:var(--primary)}
.F .wr .ss{font-size:12.5px;color:var(--secondary)}.F .wr.cur{background:#f9edd1}.F .wr.cur .ss{font-weight:700;color:var(--primary)}
.F .wr.x i{background:var(--accent)}.F .wr.x .dd{text-decoration:line-through;color:var(--muted)}.F .wr.x .ss{color:var(--accent)}
.F .done{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:48px 8px}
.F .done .ic{width:64px;height:64px;background:var(--primary);display:grid;place-items:center}.F .done .ic svg{width:24px;height:24px;fill:none;stroke:#efb22b;stroke-width:2}
.F .done h3{font-family:"League Spartan",Inter,sans-serif;font-weight:800;font-size:20px;margin:0}
.F .note{font:13px/1.5 Inter,sans-serif;color:#4b5263;max-width:1100px;margin:6px 0 14px}
</style>'''
def inp(lbl,val,ph=False): return f'<div><label class="lbl">{lbl}</label><div class="in{" ph" if ph else ""}">{val}</div></div>'
def sel(lbl,val,help=''): return f'<div><label class="lbl">{lbl}</label>{f"<p class=help>{help}</p>" if help else ""}<div class="in">{val}{CH}</div></div>'
def ta(lbl,val): return f'<div><label class="lbl">{lbl}</label><div class="in ta">{val}</div></div>'
def cb(txt,on=True): return f'<div class="cbrow"><span class="cb{" on" if on else ""}">{CK if on else ""}</span><span class="cbl">{txt}</span></div>'
def page(cap,stepn,title,qs,last=False,first=False):
  pct=int(int(stepn)/4*100)
  btn='Trimite înscrierea' if last else 'Continuă'
  return (f'<div><p class="cap">{cap}</p><div class="page"><div class="eyebrow">Sezonul 2026-2027</div><div class="h">Înscrie-ți copilul</div><div class="bsm">Completează pașii de mai jos. Vom confirma înscrierea în cel mai scurt timp.</div>'
   f'<div class="fcard"><div class="si"><div class="top"><span class="t">{title}</span><span class="c">Pasul {stepn} din 4</span></div><div class="bar"><i style="width:{pct}%"></i></div></div>'
   f'<div class="qs">{qs}</div><div class="nav"><span class="back">{"" if first else "Înapoi"}</span><span class="lcta"><span class="face">{btn}</span></span></div></div></div></div>')
wk=lambda d,c='',st='Curs':f'<div class="wr {c}"><i></i><span class="dd">{d}</span><span class="ss">{st}</span></div>'
cal=('<div><label class="lbl">Programul pe următoarea lună</label><div class="wkt"><div class="mo">Octombrie 2026</div>'+wk('10 oct - 11 oct','cur')+wk('17 oct - 18 oct')+wk('24 oct - 25 oct','x','Curs anulat')+wk('31 oct - 1 noi')+'<div class="mo">Noiembrie 2026</div>'+wk('7 noi - 8 noi')+'</div><div style="margin-top:10px"><span class="link" style="font-size:14px">Calendar complet</span></div></div>')
p1=page('Pasul 1','1','Persoana care completează',inp('Adresă de e-mail *','adresa@exemplu.ro',True)+inp('Numele și prenumele persoanei care completează formularul *','Mihaela Dumitrescu')+sel('Calitatea față de sportiv: *','Alta (Vă rugăm specificați)')+inp('Specificați calitatea (ex: Bunic, Frate): *','Bunic')+inp('Telefon de contact *','+40 7xx xxx xxx',True),first=True)
p2=page('Pasul 2','2','Copilul',inp('Numele și prenumele copilului *','Maria Dumitrescu')+inp('Data nașterii copilului *','14.03.2014')+inp('Înălțimea copilului (cm) *','142')+inp('Măsura bluză *','S')+sel('Sezonul trecut fiul/fiica dvs. a participat la cursurile ACS EduSport? *','Începători')+ta('Nivel de experiență / Elemente cunoscute *','Patinaj înainte, frânare')+ta('Așteptări de la cursurile de patinaj *','Să învețe piruete'))
mbox='<div class="box"><div class="bt">Pentru Membri</div><div class="pr"><span>Abonament 6 ședințe grup</span><b>660 RON</b></div><div class="pr"><span>Abonament 8 ședințe grup</span><b>770 RON</b></div><div class="pr"><span>Abonament 8 ședințe Avansați Gold</span><b>1080 RON</b></div><div class="pr"><span>Taxa de membru (o dată/sezon)</span><b>270 RON</b></div><div style="margin-top:10px"><span class="link" style="font-size:14px">Vezi toate tarifele</span></div></div>'
nbox='<div class="box"><div class="bt">Pentru Neafiliați</div><div class="pr"><span>1 ședință grup <small style="display:block;color:var(--secondary);font-size:12px">Disponibil doar pentru prima ședință</small></span><b>180 RON</b></div><div class="pr"><span>Abonament 6 ședințe grup</span><b>790 RON</b></div><div class="pr"><span>Abonament 8 ședințe grup</span><b>890 RON</b></div><div style="margin-top:10px"><span class="link" style="font-size:14px">Vezi toate tarifele</span></div></div>'
ups='<div class="box"><div class="bt">Ca membru plătești mai puțin</div><div class="pr"><span>Abonament 8 ședințe grup</span><span><s>890</s> <b>770 RON</b></span></div><div class="pr"><span>Abonament 6 ședințe grup</span><span><s>790</s> <b>660 RON</b></span></div><div class="bn">Economisești 120 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la al treilea abonament. Doar membrii au acces la Avansați Gold.</div><div class="sec">Vreau să devin membru</div></div>'
p3=page('Pasul 3 (membru)','3','Abonament',cal+sel('Doriți înscrierea ca membru A.C.S. EduSport pentru tarife preferențiale? *','Da, doresc să devin membru')+mbox+sel('La primul modul doriți să achiziționați: *','Abonament 8 ședințe'))
p3b=page('Pasul 3 (neafiliat)','3','Abonament',cal+sel('Doriți înscrierea ca membru A.C.S. EduSport pentru tarife preferențiale? *','Nu, optez pentru tarife neafiliați')+nbox+ups+sel('La primul modul doriți să achiziționați: *','Abonament 8 ședințe'))
p4=page('Pasul 4','4','Confirmare',sel('De unde ați aflat de cursurile noastre? *','Recomandare')+cb('<b>Consimțământ GDPR:</b> Confirm citirea documentului <span class="link">Politica de Confidențialitate</span> și sunt de acord cu prelucrarea datelor.')+cb('<b>Acord Regulament:</b> Confirm că am citit, înțeles și acceptat condițiile prezentate în <span class="link">Regulamentul Școlii de Patinaj</span>.'),last=True)
done=('<div><p class="cap">După trimitere</p><div class="page"><div class="eyebrow">Sezonul 2026-2027</div><div class="h">Înscrie-ți copilul</div><div class="fcard"><div class="done"><div class="ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg></div><h3>Înscriere trimisă!</h3>'
 '<p class="bsm">Nr. înscriere <b style="color:var(--primary)">2026-0142</b>. Puteți descărca de mai jos formularul completat de dvs. Documentele vor fi semnate la prima ședință de curs.</p><span class="lcta"><span class="face">Descarcă formularul (PDF)</span></span><span class="link" style="font-size:14px">Fă o altă înscriere</span></div></div></div></div>')
html=(css+'<div class="F"><h2>Formularul de înscriere: componentele actuale ale site-ului</h2><p class="note">Făcut din clasele componentelor reale: Card (bordură + umbră retro), StepIndicator (titlu, "Pasul X din 4", bară), etichete text-label, Input / Select h-12 pe alb, Textarea min-h-32, Checkbox (bifă cărămizie), navigare cu "Înapoi" + butonul negru, ecranul de succes existent. Întrebările sunt cele din formularul ei. Date inventate.</p>'
 '<div class="row">'+p1+p2+p3+'</div><div class="row" style="margin-top:28px">'+p3b+p4+done+'</div></div>')
open(N+'/form-match-v9.html','w').write(html)
