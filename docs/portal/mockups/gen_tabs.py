import sys,os
OUTT=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_edit.py'), HERE+'/throw/r.html']
exec(open(sys.argv[0]).read())
tcss='''<style>.A .mlog{display:flex;flex-direction:column;gap:10px;margin-top:6px}.A .mr{display:grid;grid-template-columns:72px 1fr;align-items:start;gap:8px}.A .mr .bd{text-align:center}.A .mr small{display:block;color:var(--mu);font-size:11.5px;margin-top:1px}
.A .ovw{position:relative}.A .ovw:after{content:"";position:absolute;inset:0;background:rgba(15,21,34,.45);border-radius:4px}.A .cm{position:absolute;z-index:3;left:50%;top:150px;transform:translateX(-50%);width:300px;background:#fff;border-radius:6px;box-shadow:0 20px 50px rgba(0,0,0,.3)}.A .cm .mh{display:flex;padding:14px 16px;border-bottom:1px solid var(--ln)}.A .cm .mh b{flex:1;font-size:15px}.A .cm .mb{padding:14px 16px;line-height:1.5}
.A .ui-tabs{display:flex;gap:2px;border-bottom:1px solid var(--ln);overflow-x:auto;margin:12px -16px 0;padding:0 8px}
.A .ui-tab{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--mu);border-bottom:2px solid transparent;margin-bottom:-1px;padding:9px 8px;white-space:nowrap}
.A .ui-tab.on{color:var(--p);border-bottom-color:var(--p)}.A .ui-tab-count{font-size:10.5px;font-weight:700;color:var(--mu);background:#f0f1f4;border-radius:3px;padding:0 5px}.A .ui-tab.on .ui-tab-count{color:var(--p);background:#ecf0f7}
.A .tp{width:340px;background:#fff;border:1px solid var(--ln);border-radius:4px;display:flex;flex-direction:column;height:640px}.A .tp .ph2{padding:14px 16px 0}.A .tp .bd2{padding:4px 16px 14px;overflow:auto;flex:1}.A .tp .ft{margin-top:auto}
.A .meta2{display:flex;gap:16px;color:var(--mu);font-size:12px;margin-top:4px}.A .meta2 b{color:var(--tx)}
.A .eh{display:flex;justify-content:flex-end;margin-top:10px}</style>'''
T=[('date','Date',None),('abon','Abonament',None),('doc','Documente',2),('ist','Istoric',2)]
def tabs(on): return '<div class="ui-tabs">'+''.join(f'<span class="ui-tab{" on" if k==on else ""}">{l}{f"<span class=ui-tab-count>{c}</span>" if c else ""}</span>' for k,l,c in T)+'</div>'
def kv2(rows,ed=False):
  out=''
  for n,(a,b) in enumerate(rows):
    if n==0 and ed: out+=f'<div class="lb" style="display:flex;justify-content:space-between;align-items:center"><span>{a}</span><span class="lnk" style="text-transform:none;letter-spacing:0;font-size:12.5px">{ic("form")}Editează</span></div><div class="vl">{b}</div>'
    else: out+=f'<div class="lb">{a}</div><div class="vl">{b}</div>'
  return out
edit=''
B={'date':edit+kv2([('Adresă de e-mail','parinte@exemplu.ro'),('Persoana care completează','Mihaela Dumitrescu'),('Calitatea față de sportiv','Părinte'),('Telefon de contact','0722 111 222'),('Numele copilului','Maria Dumitrescu'),('Data nașterii copilului','14.03.2014'),('Înălțimea copilului (cm)','142'),('Măsura bluză','S'),('Sezonul trecut a participat la cursurile ACS EduSport?','Începători'),('Nivel de experiență / Elemente cunoscute','Patinaj înainte, frânare'),('Așteptări de la cursurile de patinaj','Să învețe piruete')],True),
 'abon':edit+kv2([('Membru A.C.S. EduSport','Da, doresc să devin membru'),('La primul modul','Abonament 8 ședințe grup'),('De unde ați aflat','Recomandare'),('Acord GDPR','Da'),('Acord Regulament','Da')]),
 'doc':f'<div class="lb">Acord (Formular de înscriere)</div><div class="fn" style="font-weight:600;margin:2px 0 6px;word-break:break-all">{fname}</div><div class="acts"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div><div class="hint" style="margin-top:4px">Actualizat 5 oct 2026, după corectarea telefonului.</div>'
  +'<div class="lb" style="margin-top:16px">Cerere de adeziune (membru)</div><div class="fn" style="font-weight:600;margin:2px 0 6px;word-break:break-all">Maria_Dumitrescu_Adeziune_2026-2027.pdf</div><div class="acts"><span class="lnk">'+ic("eye")+'Vezi</span><span class="lnk">'+ic("dl")+'Descarcă</span></div>'
  +'<div class="lb" style="margin-top:18px">E-mail către părinte</div><div class="mlog">'+'<div class="mr"><span class="bd ok">Trimis</span><span>3 oct 2026, 14:23</span></div>'+'<div class="mr"><span class="bd ok">Retrimis</span><span>5 oct 2026, 10:20<small>Retrimis manual de Ana</small></span></div></div>'+f'<div style="margin-top:12px"><span class="btn sm">{ic("refresh")}Retrimite e-mailul</span></div>',
 'ist':'<div class="his" style="margin-top:8px"><div><b>5 oct 2026, 10:20 · Ana</b><br>E-mail retrimis către parinte@exemplu.ro</div><div><b>5 oct 2026, 10:02 · Ana</b><br>Telefon de contact: "0722 111 22" → "0722 111 222"<br>Document refăcut</div><div><b>3 oct 2026, 14:22</b><br>Înscriere înregistrată</div></div>'}
def tpanel(on):
  return ('<div class="tp"><div class="ph2"><h2 style="font-size:15px;margin:0;display:flex;justify-content:space-between;align-items:center">Maria Dumitrescu <span class="bd nw">Nou</span></h2>'
   '<div class="meta2"><span>Nr. <b>2026-0142</b></span><span>Trimis <b>3 oct 2026, 14:22</b></span></div>'+tabs(on)+'</div><div class="bd2">'+B[on]+'</div>'
   '<div class="ft"><span class="btn sm">Contactat</span><span class="btn sm pr">Confirmă și adaugă în club</span></div></div>')
CONF='<div class="ovw" style="position:relative">'+tpanel('doc')+'<div class="cm"><div class="mh"><b>Retrimiți e-mailul?</b>'+ic('x')+'</div><div class="mb">Trimitem din nou e-mailul cu cele 2 documente (Acord și Cerere de adeziune) către <b>parinte@exemplu.ro</b>.</div><div class="ft"><span class="btn sm">Anulează</span><span class="btn sm pr">Retrimite</span></div></div></div>'
html=(css+ecss+tcss+'<div class="A"><h2>Panoul înscrierii cu taburi</h2><p class="note">Folosește componenta Tabs care există deja în admin (aceeași ca în alte pagini). Sus rămân mereu numele, statusul, nr. înscriere și data; jos rămân butoanele. Doar mijlocul se schimbă, deci aproape fără scroll.</p>'
 '<div class="row3">'+''.join(f'<div><p class="cap2">Tab: {l}</p>{tpanel(k)}</div>' for k,l,c in T)+'<div><p class="cap2">Apăsat pe Retrimite e-mailul</p>'+CONF+'</div></div>'
 '<div class="sec">În pagină</div>'+screen('inscrieri',win1.replace(pane,'').replace('<div class="split"><div>','<div class="split" style="grid-template-columns:minmax(0,1fr) 340px"><div>').replace('</table></div></div><div class="ft">','</table></div>'+tpanel('date').replace('class="tp"','class="tp" style="border:0;border-left:1px solid var(--ln);border-radius:0;width:auto"')+'</div><div class="ft" style="display:none">'))+'</div>')
open(OUTT,'w').write(html)
