import sys,os
OUT4=sys.argv[1]; HERE=os.path.dirname(os.path.abspath(sys.argv[0]))
sys.argv=[os.path.join(HERE,'gen_legal3.py'), HERE+'/throw/t.html']
exec(open(sys.argv[0]).read())
FINAL=acord[:acord.find('<div class="d2f">')]+'<div class="d2f" style="display:block">'+VAR['kvs']+'</div></div>'
EXTRA=css+d2css+xcss+gcss+fcss+c4
src=open(os.path.join(HERE,'gen_flow3.py')).read()
src=src.replace("doc=v2[i:j]","doc=FINAL")
src=src.replace("OUT3=sys.argv[1]; HERE=","OUT3=OUT4; HERE=")
src=src.replace("html=(css+d2css+x_css+","html=(EXTRA+x_css+")
src=src.replace("'<div class=\"sec\">3b. Dacă admin corectează date și regenerează documentul</div>'+q1",
 "'<div class=\"sec\">3b. Când admin corectează o greșeală: ce facem cu PDF-ul vechi?</div><p class=\"note\"><b>Exemplu:</b> părintele a scris greșit telefonul. Admin îl corectează în CMS și apasă <b>Regenerează</b>, ca PDF-ul să aibă telefonul corect. Părintele primise deja pe e-mail PDF-ul cu telefonul greșit.<br><b>Întrebarea:</b> PDF-ul vechi îl înlocuim (A) sau îl păstrăm ca versiune separată (B)?</p>'+q1")
src=src.replace("<div class=\"sec\">4. Google Sheet (sincronizarea existentă: un tab per sezon)</div>",
 "<div class=\"sec\">4. Google Sheet: ce coloane are tabul sezonului nou?</div><p class=\"note\"><b>Situația:</b> Sheet-ul are deja un tab pe sezon (2025-2026, 2026-2027). Formularul nou are alte întrebări decât cel vechi (ex. \"Nivel\" și \"Cum a aflat\" dispar, apar \"Înălțimea\", \"Membru A.C.S.\", \"La primul modul\").<br><b>Întrebarea:</b> fiecare tab arată doar întrebările din sezonul lui (A), sau toate taburile au aceleași coloane, iar în tabul nou rămân la final coloane goale din formularul vechi (B)?</p>")
src=src.replace("Formular (2 pași)","Formular (3 pași)")
exec(src)
