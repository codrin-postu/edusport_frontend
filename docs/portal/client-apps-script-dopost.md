# Formularul de inscriere: functia `doPost` in Google Apps Script

## Mesaj WhatsApp

> Este pentru implementarea formularului de inscriere pe site-ul nou. Ca fiecare inscriere sa ajunga in continuare si in foaia ta, ca acum, scriptul are nevoie de o functie in plus (`doPost`). Restul ramane neschimbat. Iti trimit codul si 3 pasi.

## Mesaj WhatsApp 2 (pasii si codul)

> Pasii:
>
> 1. In Apps Script: Setari proiect > Proprietati script > Adauga proprietate: `EDUSPORT_SECRET`, cu parola pe care ti-o dau separat.
> 2. Lipesti codul de mai jos la finalul `Code.gs` (nu modifica altceva).
> 3. Implementare > Gestioneaza implementarile > creionul > Versiune noua > Implementeaza. Adresa ramane aceeasi.
> 4. Spune-mi cand e gata si facem o inscriere de test.

```javascript
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var secret =
      PropertiesService.getScriptProperties().getProperty("EDUSPORT_SECRET");
    if (!secret || body.secret !== secret) {
      return raspuns({ status: "error", message: "Acces refuzat" });
    }
    return raspuns(processForm(body.form));
  } catch (err) {
    return raspuns({ status: "error", message: String(err) });
  }
}

function raspuns(obiect) {
  return ContentService.createTextOutput(JSON.stringify(obiect)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
```

## Pași detaliați (aprox. 10 minute)

### 1. Parola secretă

1. Deschide proiectul Apps Script și mergi la **Setări proiect** (rotița din stânga), apoi la **Proprietăți script**.
2. Apasă **Adaugă proprietate script**:
   - Proprietate: `EDUSPORT_SECRET`
   - Valoare: parola pe care ți-o trimit separat.
3. Salvează.

### 2. Funcția nouă

Lipește codul de mai jos la finalul fișierului `Code.gs`, fără să modifici altceva. Dacă există deja o funcție `doPost` sau `raspuns`, spune-mi înainte.

```javascript
/**
 * Primește înscrierile trimise de site-ul scoaladepatinaj.com
 * și le procesează cu aceeași funcție ca formularul existent.
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var secret =
      PropertiesService.getScriptProperties().getProperty("EDUSPORT_SECRET");
    if (!secret || body.secret !== secret) {
      return raspuns({ status: "error", message: "Acces refuzat" });
    }
    var rezultat = processForm(body.form);
    return raspuns(rezultat);
  } catch (err) {
    return raspuns({ status: "error", message: String(err) });
  }
}

function raspuns(obiect) {
  return ContentService.createTextOutput(JSON.stringify(obiect)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
```

### 3. Publicarea

1. Apasă **Implementare** și apoi **Gestionează implementările**.
2. La aplicația web existentă, apasă creionul (Editează).
3. La **Versiune** alege **Versiune nouă**, apoi apasă **Implementează**.

Adresa formularului (`.../exec`) și setările de acces rămân aceleași.

### 4. Test

Spune-mi când e gata. Facem o înscriere de test, marcată „TEST”, pe care o ștergi apoi din foaie.

## Ce trimite site-ul

Aceleași câmpuri pe care le trimite formularul tău acum, cu aceleași nume și valori: `email`, `numeParinte`, `calitateSelect`, `altaCalitate`, `telefon`, `numeCopil`, `dataNasterii`, `inaltime`, `masuraBluza`, `sezonTrecut`, `experienta`, `asteptari`, `membruACS` (Da / Nu), `abonament` (de ex. „Abonament 8 sedinte membru”), `sursa`, `altaSursa`, `gdpr` și `regulament` („on”).

Site-ul trimite o înscriere doar după ce a salvat-o. Dacă scriptul nu răspunde, reîncearcă automat mai târziu. Înscrierile de test de pe site nu ajung în foaia ta.
