import sys,os
OUTSS=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_filter3.py'), HERE+'/throw/ss.html']
exec(open(sys.argv[0]).read())
VAR={
 'A':('Fundal plin discret, fără bară, fără contur','.fx .sec2.on{background:#e9edf5;box-shadow:none;border-radius:0}.fx .sec2.on b{color:var(--tx)}.fx .sec2{border-radius:0}'),
 'B':('Doar bara din stânga, dreaptă, fără fundal','.fx .sec2.on{background:transparent;box-shadow:inset 3px 0 0 var(--p);border-radius:0}.fx .sec2{border-radius:0}.fx .sec2.on b{color:var(--p)}'),
 'C':('Doar text: titlu albastru și bold, plus săgeată la dreapta','.fx .sec2.on{background:transparent;box-shadow:none}.fx .sec2.on b{color:var(--p)}.fx .sec2.on{position:relative}.fx .sec2.on:after{content:"›";position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--p);font-weight:800;font-size:16px}'),
 'E':('Plin, culoare principală, text alb, colțuri rotunjite',''),
 'D':('Plin, culoare principală, text alb','.fx .sec2.on{background:var(--p);box-shadow:none;border-radius:0}.fx .sec2.on b,.fx .sec2.on span{color:#fff!important}.fx .sec2{border-radius:0}'),
}
CSSV={
 'A':'.A .vA .fx .sec2{border-radius:0}.A .vA .fx .sec2.on{background:#e9edf5;box-shadow:none}.A .vA .fx .sec2.on b{color:var(--tx)}',
 'B':'.A .vB .fx .sec2{border-radius:0}.A .vB .fx .sec2.on{background:transparent;box-shadow:inset 3px 0 0 var(--p)}.A .vB .fx .sec2.on b{color:var(--p)}',
 'C':'.A .vC .fx .sec2.on{background:transparent;box-shadow:none;position:relative}.A .vC .fx .sec2.on b{color:var(--p)}.A .vC .fx .sec2.on:after{content:"\\203A";position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--p);font-weight:800;font-size:18px}',
 'E':'.A .vE .fx .sec2{border-radius:6px}.A .vE .fx .sec2.on{background:var(--p);box-shadow:none}.A .vE .fx .sec2.on b,.A .vE .fx .sec2.on span{color:#fff}',
 'D':'.A .vD .fx .sec2{border-radius:0}.A .vD .fx .sec2.on{background:var(--p);box-shadow:none}.A .vD .fx .sec2.on b,.A .vD .fx .sec2.on span{color:#fff}',
}
def scoped(k,c): return '<style>'+CSSV[k]+'</style>'
def fxbox(k):
  return f'<div class="v{k}" style="position:relative;height:330px"><div class="fx" style="top:10px;left:0">'+'<div class="body">'+nav('tip')+'<div class="pane">'+P_tip+'</div></div><div class="ft2"><span class="cnt">218 documente</span><span style="flex:1"></span><span class="lnk">Șterge tot</span><span class="btn sm pr">Gata</span></div></div></div>'
inbox_rows=[('Maria Dumitrescu','Mesaj nou de pe site','3 oct'),('Andrei Popescu','Întrebare despre program','2 oct'),('Dan Ilie','Abonament Gold','1 oct')]
def inbox(k):
  st={'A':'background:#e9edf5','B':'box-shadow:inset 3px 0 0 var(--p)','C':'','D':'background:var(--p);color:#fff','E':'background:var(--p);color:#fff;border-radius:6px;margin:4px;border-bottom:0'}[k]
  rows=''.join(f'<div style="padding:10px 14px;border-bottom:1px solid var(--ln);{st if i==0 else ""}"><b style="{"color:#fff" if (k in "DE" and i==0) else ("color:var(--p)" if (k in "BC" and i==0) else "")}">{a}</b><div style="font-size:12px;{"color:#dfe6f3" if (k in "DE" and i==0) else "color:var(--mu)"}">{b} · {c}</div></div>' for i,(a,b,c) in enumerate(inbox_rows))
  return '<div style="width:300px;background:#fff;border:1px solid var(--ln);border-radius:4px">'+rows+'</div>'
cur=('<div class="wcol" style="align-items:flex-start"><div><p class="cap2">Acum (filtre)</p><div style="position:relative;height:330px;width:560px"><div class="fx" style="top:10px;left:0"><div class="body">'+nav('tip')+'<div class="pane">'+P_tip+'</div></div><div class="ft2"><span class="cnt">218 documente</span></div></div></div></div>'
 '<div><p class="cap2">Acum în admin (Mesaje, rezultate formulare)</p><div style="width:300px;background:#fff;border:1px solid var(--ln);border-radius:4px">'+''.join(f'<div style="padding:10px 14px;border-bottom:1px solid var(--ln);{"background:#ecf0f7;box-shadow:inset 3px 0 0 var(--p)" if i==0 else ""}"><b>{a}</b><div style="font-size:12px;color:var(--mu)">{b} · {c}</div></div>' for i,(a,b,c) in enumerate(inbox_rows))+'</div></div></div>')
WANT=['D','E']
opts=''.join(O(k,'sel-'+k,t,scoped(k,c)+'<div class="wcol" style="align-items:flex-start"><div style="width:560px">'+fxbox(k)+'</div><div>'+inbox(k)+'</div></div>') for k,(t,c) in VAR.items() if k in WANT)
html=(css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+'<div class="A"><h2>Varianta D: colțuri drepte vs rotunjite</h2><p class="note">Același stil nou pentru: secțiunile din Filtre, listele din Mesaje / rezultate formulare (.ui-inbox-item din admin), meniurile laterale din panouri. Fără colțuri rotunjite și fără combinația "contur + bară". Date inventate.</p>'
 +cur+'<div class="sec">Variante</div><div class="options wcol" style="flex-direction:column!important">'+opts+'</div></div>')
open(OUTSS,'w').write(html)
