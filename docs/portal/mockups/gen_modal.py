import sys,os
OUTMD=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_move3.py'), HERE+'/throw/mv3c.html']
exec(open(sys.argv[0]).read())
mdc='''<style>
.A .ui-modal-b .lead{color:var(--theme-text);font-size:14px;margin:0}
.A .ui-modal-b .note2{margin:12px 0 0;color:var(--theme-text-muted)}
.A .ui-modal-b hr{border:0;border-top:1px solid var(--theme-border);margin:14px -15px}
.A .ft3{display:grid;grid-template-columns:1fr 1fr;gap:14px}.A .ft3 .l{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);margin-bottom:3px}.A .ft3 .v{font-size:15px;font-weight:600;color:var(--theme-text)}
.A .kv2{display:grid;grid-template-columns:96px 1fr;gap:10px 14px;align-items:start}.A .kv2 dt{color:var(--theme-text-muted)}.A .kv2 dd{margin:0;color:var(--theme-text)}
.A .mframe{position:relative;width:640px;height:var(--h,330px);background:#9aa3b5;border-radius:6px;overflow:hidden}
.A .mframe .ui-modal-layer{background:transparent!important}
</style>'''
BAR=V1
def mod(title,body,h=330): return f'<div class="mframe" style="--h:{h}px">'+modal(title,body)+'</div>'
SA_=mod('Mută în Intermediari Bronze','<p class="lead">Maria Dumitrescu trece din Primii Pași în Intermediari Bronze.</p><hr>'+BAR+'<p class="note2">Abonamentul continuă: ambele grupe folosesc lista de prețuri Standard.</p>')
SB_=mod('Mută în Intermediari Bronze','<div class="ft3"><div><div class="l">Din</div><div class="v">Primii Pași</div></div><div><div class="l">În</div><div class="v">Intermediari Bronze</div></div></div><hr>'+BAR+'<p class="note2">Abonamentul continuă, aceeași listă de prețuri (Standard).</p>',350)
VC=('<div style="flex:1">'+SEG(5)+'<div class="row cap" style="display:flex;justify-content:space-between;margin-top:5px;font-size:12px;color:var(--theme-text-muted)"><span>3 rămase din 8</span><span>expiră pe 7 nov 2026</span></div></div>')
SC_=mod('Mută în Intermediari Bronze','<dl class="kv2"><dt>Sportiv</dt><dd>Maria Dumitrescu</dd><dt>Din</dt><dd>Primii Pași</dd><dt>În</dt><dd>Intermediari Bronze</dd><dt>Abonament</dt><dd>Școala de patinaj, 8 ședințe, continuă'+VC+'</dd></dl>',360)
# the same layout A applied to Gold and Club
GA=mod('Mută în Avansați Gold','<p class="lead">Maria Dumitrescu trece din Primii Pași în Avansați Gold.</p><hr>'+BAR+'<p class="note2">Abonamentul actual rămâne valabil în Avansați Gold. Următorul se cumpără la prețul Avansați Gold.</p>',350)
CA=mod('Mută în Performanță Juniori','<p class="lead">Maria Dumitrescu trece din Primii Pași în Performanță Juniori.</p><hr>'+BAR+'<p class="note2">Nu poate fi folosit decât în antrenamentele de la Școala de patinaj. În Club prezența se socotește pe ședință.</p>',350)


G='<p class="note2">Abonamentul actual rămâne valabil. Următorul, la prețul Avansați Gold.</p>'
GA=mod('Mută în Avansați Gold','<p class="lead">Maria Dumitrescu trece din Primii Pași în Avansați Gold.</p><hr>'+BAR+G,320)
GB=mod('Mută în Avansați Gold','<div class="ft3"><div><div class="l">Din</div><div class="v">Primii Pași</div></div><div><div class="l">În</div><div class="v">Avansați Gold</div></div></div><hr>'+BAR+G,340)
GC=mod('Mută în Avansați Gold','<dl class="kv2"><dt>Sportiv</dt><dd>Maria Dumitrescu</dd><dt>Din</dt><dd>Primii Pași</dd><dt>În</dt><dd>Avansați Gold</dd><dt>Abonament</dt><dd>Rămâne valabil. Următorul, la prețul Avansați Gold.'+VC+'</dd></dl>',370)
FT=lambda a,b:'<div class="ft3"><div><div class="l">Din</div><div class="v">'+a+'</div></div><div><div class="l">În</div><div class="v">'+b+'</div></div></div>'
B1=mod('Mută: Maria Dumitrescu',FT('Primii Pași','Avansați Gold')+'<hr>'+BAR+G,340)
B2=mod('Mută în altă grupă','<div class="l" style="font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);margin-bottom:3px">Sportiv</div><div class="v" style="font-size:15px;font-weight:600;color:var(--theme-text);margin-bottom:14px">Maria Dumitrescu</div>'+FT('Primii Pași','Avansați Gold')+'<hr>'+BAR+G,400)
B3=mod('Mută în altă grupă','<p class="lead" style="font-weight:600;margin-bottom:12px">Maria Dumitrescu</p>'+FT('Primii Pași','Avansați Gold')+'<hr>'+BAR+G,380)
S0=mod('Mută în Intermediari Bronze','<p class="lead">Maria Dumitrescu trece din Primii Pași în Intermediari Bronze.</p>',200)
DIRECT=gpage('Intermediari Bronze',after=True,over=toast('Maria Dumitrescu este acum în Intermediari Bronze.',True))
NM='<div class="l" style="font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--theme-text-muted);margin-bottom:3px">Sportiv</div><div class="v" style="font-size:15px;font-weight:600;color:var(--theme-text);margin-bottom:14px">Maria Dumitrescu</div>'
W=lambda to,extra,h:mod('Mută în altă grupă',NM+FT('Primii Pași',to)+'<hr>'+BAR+extra,h)
html=('<style>'+ADMIN+'</style>'+css+ecss+tcss+ccss+mcss+'<style>'+PCSS+'</style>'+xc+qc+x3+oc+dcss+xc2+mc+mc2+mc3+mc4+bc+sc2+rc+fc+qc2+gc+sc3+nc+pc+ac+fix+mvc+mdc
 +'<div class="A"><h2>Fereastra de mutare, decisă</h2><div class="wcol" style="flex-direction:column;gap:14px">'
 +'<p class="cap2">Aceeași listă de prețuri</p>'+W('Intermediari Bronze','',360)
 +'<p class="cap2">Avansați Gold</p>'+W('Avansați Gold',G,400)
 +'<p class="cap2">Grupă de Club</p>'+W('Performanță Juniori','',360)+'</div></div>')
open(OUTMD,'w').write(html)
