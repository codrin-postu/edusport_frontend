import sys,os
OUTF3=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_sheet2.py'), HERE+'/throw/f3.html']
exec(open(sys.argv[0]).read())
fc='''<style>.A .fx{position:absolute;z-index:6;width:540px;background:#fff;border:1px solid var(--ln);border-radius:8px;box-shadow:0 18px 40px rgba(14,26,60,.16),0 2px 6px rgba(14,26,60,.06)}
.A .fx:before{content:"";position:absolute;top:-7px;left:40px;width:12px;height:12px;background:#fff;border-left:1px solid var(--ln);border-top:1px solid var(--ln);transform:rotate(45deg)}
.A .fx .body{display:grid;grid-template-columns:190px 1fr;min-height:236px}.A .fx .nav{border-right:1px solid var(--ln);padding:8px;background:#fafbfd;border-radius:8px 0 0 0}
.A .fx .sec2{padding:9px 12px;border-radius:5px;cursor:pointer;margin-bottom:2px}.A .fx .sec2 b{display:block;font-size:13px;color:var(--tx)}.A .fx .sec2 span{display:block;font-size:12px;color:var(--mu);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.A .fx .sec2.on{background:#fff;box-shadow:0 0 0 1px var(--ln),inset 3px 0 0 var(--p)}.A .fx .sec2.on b{color:var(--p)}.A .fx .sec2.set span{color:var(--p);font-weight:600}
.A .fx .pane{padding:10px 12px}.A .fx .row{display:flex;align-items:center;gap:10px;height:36px;padding:0 8px;border-radius:4px;cursor:pointer}.A .fx .row:hover{background:#f3f5fa}.A .fx .row .ccb input{width:16px;height:16px}
.A .fx .seg{display:grid;grid-template-columns:1fr 1fr;gap:6px}.A .fx .seg span{height:36px;display:flex;align-items:center;justify-content:center;border:1px solid var(--ln2);border-radius:4px;font-weight:600;font-size:12.5px}.A .fx .seg span.on{border-color:var(--p);background:#ecf0f7;color:var(--p)}
.A .fx .ft2{display:flex;align-items:center;gap:12px;padding:10px 14px;border-top:1px solid var(--ln)}.A .fx .ft2 .cnt{font-weight:700}
.A .msh .navm div{display:flex;align-items:center;justify-content:space-between;padding:12px 2px;border-bottom:1px solid var(--ln)}.A .msh .navm small{display:block;color:var(--mu);font-size:12px}.A .msh .navm small.set{color:var(--p);font-weight:600}</style>'''
SECS=[('tip','Tip document','Acord'),('sursa','Sursă','Toate'),('grupa','Grupa','Toate'),('act','Actualizat','Ultimele 7 zile')]
def nav(on):
  return '<div class="nav">'+''.join(f'<div class="sec2{" on" if k==on else ""}{" set" if v!="Toate" else ""}"><b>{l}</b><span>{v}</span></div>' for k,l,v in SECS)+'</div>'
row=lambda l,on=False:f'<div class="row"><label class="ccb"><input type="checkbox" {"checked" if on else ""}></label><span>{l}</span></div>'
P_tip=row('Acord',True)+row('Cerere de adeziune')+row('Adeverință medicală')+row('Acord competiție')
P_act='<div class="seg"><span>Oricând</span><span>Azi</span><span class="on">Ultimele 7 zile</span><span>Luna asta</span></div><div style="margin-top:8px"><span class="lnk" style="font-size:12.5px">Alege perioada...</span></div>'
def panel(on,pane,left=478):
  return (f'<div class="fx" style="top:168px;left:{left}px"><div class="body">{nav(on)}<div class="pane">{pane}</div></div>'
   '<div class="ft2"><span class="cnt">218 documente</span><span style="flex:1"></span><span class="lnk">Șterge tot</span><span class="btn sm pr">Gata</span></div></div>')
dsk=lambda p:screen('documente',desk('').replace('<span class="fbtn act">Tip document <b>1</b>','<span class="fbtn act" style="box-shadow:0 0 0 3px #dfe6f3">Filtre <b>2</b>')+p)
# mobile sheet: section list -> drill
msh1=('<div class="dimm"></div><div class="sheet2 msh"><div class="grab"></div><div class="sh-h"><b style="font-size:15px">Filtre</b>'+ic('x')+'</div><div class="navm">'
 +''.join(f'<div><span><b>{l}</b><small class="{"set" if v!="Toate" else ""}">{v}</small></span>{ic("chev")}</div>' for k,l,v in SECS)
 +'</div><div class="sh-f"><span class="c40">Șterge tot</span><span class="c40 pr" style="flex:2">Arată 218 documente</span></div></div>')
msh2=('<div class="dimm"></div><div class="sheet2 msh"><div class="grab"></div><div class="sh-h"><span class="lnk">'+ic('chev').replace('class="ic"','class="ic" style="transform:rotate(180deg)"')+'Filtre</span>'+ic('x')+'</div><b style="font-size:15px;display:block;margin:4px 0 8px">Tip document</b>'
 +'<div class="fx" style="position:static;width:auto;border:0;box-shadow:none"><div class="pane" style="padding:0">'+P_tip+'</div></div>'
 +'<div class="sh-f"><span class="c40">Șterge</span><span class="c40 pr" style="flex:2">Arată 218 documente</span></div></div>')
PM1='<div class="ph">'+mob_top+mob_cards()+'</div>'+msh1+'</div>'
PM2='<div class="ph">'+mob_top+mob_cards()+'</div>'+msh2+'</div>'
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+'<div class="A"><h2>Filtre: combinația dintre 1 și 2</h2><p class="note">Secțiunile în stânga, fiecare cu ce e ales sub nume (din 1: vezi tot dintr-o privire; din 2: ordonat, puțin text). Opțiunile secțiunii alese în dreapta, rânduri egale de 36px. Fără numere pe fiecare opțiune; doar totalul jos. Date inventate.</p>'
 '<div class="sec">Calculator</div><p class="cap2">Tip document</p>'+dsk(panel('tip',P_tip))+'<p class="cap2" style="margin-top:16px">Actualizat</p>'+dsk(panel('act',P_act))
 +'<div class="sec">Telefon (același conținut)</div><div class="wcol"><div><p class="cap2">Lista secțiunilor</p>'+PM1+'</div><div><p class="cap2">O secțiune deschisă</p>'+PM2+'</div></div>'
 '<ul class="note" style="padding-left:18px;margin-top:14px"><li>Secțiunea cu ceva ales are valoarea în albastru ("Acord", "Ultimele 7 zile"); celelalte arată "Toate".</li><li>Se aplică pe loc; totalul "218 documente" se schimbă imediat.</li><li>Căutarea în opțiuni apare doar când o secțiune are multe opțiuni (peste 8, ex. Grupa).</li></ul></div>')
open(OUTF3,'w').write(html)
