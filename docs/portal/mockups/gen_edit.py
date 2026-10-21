import sys,os
OUTE=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_flow2.py'), HERE+'/throw/s.html', HERE+'/throw']
exec(open(sys.argv[0]).read())
ecss='''<style>.A .hl{outline:3px solid #be3330;outline-offset:4px;position:relative}.A .hl .tag{position:absolute;top:-26px;right:0;background:#be3330;color:#fff;font-weight:700;font-size:11px;padding:2px 8px}
.A .pn{width:340px;background:#fff;border:1px solid var(--ln);border-radius:4px}.A .pn .pane{border-left:0}
.A .row3{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}.A .cap2{font-size:12px;font-weight:700;color:#666;margin:0 0 6px}
.A .ein{height:34px;border:1px solid var(--ln2);border-radius:4px;background:#fff;display:flex;align-items:center;padding:0 10px;margin-top:3px;color:var(--tx)}.A .ein.ch{border-color:var(--p);box-shadow:0 0 0 2px #dfe6f3}
.A .lock{color:var(--mu);font-size:11px}.A .ok2{background:var(--okb);border:1px solid #bfe0cc;color:var(--ok);padding:8px 10px;border-radius:4px;font-weight:600;margin-top:10px}
.A .his{font-size:12px;color:var(--t2)}.A .his div{padding:6px 0;border-top:1px solid var(--ln)}.A .his b{color:var(--tx)}
.A .opt2{display:flex!important;flex-direction:row!important;gap:28px;flex-wrap:wrap;align-items:flex-start}.A .opt2>.option{display:block;padding:0;border:0;background:none;max-width:560px}
.A .stp{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0 4px}.A .stp .s{border:1px solid var(--ln2);background:#fff;padding:6px 10px;font-weight:600}</style>'''
def fields(edit=False,changed=None):
  rows=[('Adresă de e-mail','parinte@exemplu.ro'),('Persoana care completează','Mihaela Dumitrescu'),('Calitatea față de sportiv','Părinte'),('Telefon de contact','0722 111 222' if changed else '0722 111 22'),('Numele copilului','Maria Dumitrescu'),('Data nașterii copilului','14.03.2014')]
  out=''
  for a,b in rows:
    if edit: out+=f'<div class="lb">{a}</div><div class="ein{" ch" if (changed and a.startswith("Telefon")) else ""}">{b}</div>'
    else: out+=f'<div class="lb">{a}</div><div class="vl">{b}</div>'
  return out+'<div class="lb">…</div>'
def docblock(updated=False):
  line='<div class="hint" style="margin-top:6px">Actualizat 5 oct 2026 de Ana, după corectarea telefonului.</div>' if updated else '<div class="hint" style="margin-top:6px">Creat automat la trimitere, 3 oct 2026.</div>'
  return (f'<div class="doc"><div class="lb" style="margin-top:0">Document</div><div class="fn">{fname}</div><div class="acts"><span class="lnk">{ic("eye")}Vezi</span><span class="lnk">{ic("dl")}Descarcă</span></div>{line}'
   f'<div class="lb">E-mail către părinte</div><div class="vl"><span class="bd ok">Trimis</span> 3 oct 2026, 14:23</div><div style="margin-top:6px"><span class="lnk">{ic("refresh")}Retrimite e-mailul</span></div></div>')
def pane2(mode):
  head=f'<div class="pane"><h2>Maria Dumitrescu <span class="bd nw">Nou</span></h2><div class="lb">Nr. înscriere</div><div class="vl"><b>2026-0142</b> <span class="lock">(nu se modifică)</span></div><div class="lb">Trimis la</div><div class="vl">3 oct 2026, 14:22 <span class="lock">(nu se modifică)</span></div>'
  if mode=='view':
    return head+f'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-bottom:4px;border-bottom:1px solid var(--ln)"><b>Date înscriere</b><span class="btn sm">{ic("form")}Editează</span></div>'+fields()+docblock()+'</div>'
  if mode=='edit':
    return head+'<div style="margin-top:14px;padding-bottom:4px;border-bottom:1px solid var(--ln)"><b>Date înscriere</b> <span class="lock">· editare</span></div>'+fields(True,True)+'<div class="hint" style="margin-top:10px">Acordurile (GDPR, Regulament) nu se pot modifica: sunt date de părinte.</div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><span class="btn sm">Anulează</span><span class="btn sm pr">Salvează</span></div></div>'
  if mode=='saved':
    return head+'<div class="ok2">Salvat. Documentul a fost refăcut cu datele noi.</div>'+f'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-bottom:4px;border-bottom:1px solid var(--ln)"><b>Date înscriere</b><span class="btn sm">{ic("form")}Editează</span></div>'+fields(False,True)+docblock(True)+'<div class="lb">Istoric modificări</div><div class="his"><div><b>5 oct 2026, Ana</b>: Telefon de contact "0722 111 22" → "0722 111 222"</div></div></div>'
# section 1: where
paneHL=pane.replace('<div class="doc">','<div class="hl"><span class="tag">Aici</span><div class="doc">').replace('Regenerează</span></div></div>','Regenerează</span></div></div></div>')
win=win1.replace(pane,paneHL)
S0=screen('inscrieri',win)
modal=('<div class="pn" style="width:420px"><div class="mh" style="display:flex;padding:14px 16px;border-bottom:1px solid var(--ln)"><b style="flex:1;font-size:15px">Trimitem documentul corectat?</b></div><div style="padding:14px 16px;display:flex;flex-direction:column;gap:10px"><div>Ai corectat <b>Telefon de contact</b>. Documentul a fost refăcut. Părintele are pe e-mail varianta veche.</div></div><div class="ft"><span class="btn">Nu acum</span><span class="btn pr">Retrimite e-mailul cu documentul nou</span></div></div>')
q=('<div class="options opt2"><div class="option" data-choice="auto" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">A</span> Fără întrebare: admin apasă Retrimite e-mailul când vrea</p><div class="pn">'+pane2('saved')+'</div><p class="note" style="margin-top:8px">PDF-ul se reface automat la Salvează. Părintele primește documentul nou doar dacă admin apasă singur Retrimite e-mailul.</p></div>'
 '<div class="option" data-choice="manual" onclick="toggleSelect(this)"><p style="font-weight:700;margin:0 0 6px"><span class="letter" style="display:inline-grid">B</span> Întrebăm imediat dacă trimitem documentul nou (recomandat)</p>'+modal+'<p class="note" style="margin-top:8px">PDF-ul se reface automat la Salvează, apoi apare fereastra, doar dacă s-a schimbat un câmp care e în document (nume, telefon, e-mail, data nașterii). Nu se uită trimiterea. "Nu acum" = PDF-ul nou rămâne în CMS.</p></div></div>')
html=(css+ecss+'<div class="A"><h2>Corectarea unei înscrieri și documentul</h2>'
 '<p class="note">Am verificat codul: azi, în panoul Înscrieri, admin poate schimba doar statusul, sezonul și nota internă. Răspunsurile din formular sunt doar de citit. Pentru corecturi (un telefon greșit, un nume scris greșit) trebuie un mod de editare.</p>'
 '<div class="sec">1. Unde apare blocul Document în CMS</div><p class="note">Pagina Înscrieri, panoul din dreapta al înscrierii selectate, sub toate răspunsurile.</p>'+S0
 +'<div class="sec">2. Editarea propusă, în același panou</div><p class="note">Buton <b>Editează</b> lângă titlul "Date înscriere". Câmpurile devin editabile; Nr. înscriere, Trimis la și acordurile rămân blocate. Fiecare modificare intră în <b>Istoric modificări</b> (cine, când, ce valoare veche și nouă), pentru GDPR și ca să știm ce s-a schimbat.</p>'
 '<div class="row3"><div><p class="cap2">Vizualizare</p><div class="pn">'+pane2('view')+'</div></div><div><p class="cap2">Editare</p><div class="pn">'+pane2('edit')+'</div></div><div><p class="cap2">După salvare</p><div class="pn">'+pane2('saved')+'</div></div></div>'
 '<div class="sec">3. De ales: părintele primește documentul corectat?</div>'+q
 +'<p class="note" style="margin-top:14px">Asta înlocuiește întrebarea 3b de pe ecranul anterior: păstrăm un singur PDF, mereu cu datele curente; ce s-a schimbat se vede în Istoric.</p></div>')
open(OUTE,'w').write(html)
