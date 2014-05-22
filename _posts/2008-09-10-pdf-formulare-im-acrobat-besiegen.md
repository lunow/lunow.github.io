---

layout: post
title: "PDF Formulare im Acrobat besiegen"
abstract: 'Der (verdammte) Acrobat bietet die Möglichkeit interaktive Formulare zu erstellen. Und kaum erstellt jemand ein Formular, fallen ihm diverse Abhängigkeiten und Sonderfunktionen ein, die es abzubilden gilt. Zum Glück ist es möglich mit JavaScript dynamisch auf die Eingaben zu reagieren, aber einfacher macht es die Sache nicht gerade.
Hier kommt eine kleine Anleitung wie man den Inhalt auf Buchstaben und Leerzeichen überprüft und eine Abhängigkeit von mehreren "Kontrollkästchen" - auch Checkboxen genannt - erzeugt.'
categories: Entwicklung
redirect_from: "2008/09/10/pdf-formulare-im-acrobat-besiegen/"

---

## Grundlegend
In den JavaScripten gibt es zwei Objekte die für mich interessant sind.

    this

Bezieht sich auf das gesamte Dokument und beinhaltet u.a. alle Formularfelder.

    event

Beinhaltet das aktuelle, angeklickte Element und erlaubt den Status zu setzen.

## 1\. Inhalt auf "echte Zeichen" überprüfen
Wir haben ein Textfeld zur Eingabe von Formulardaten. Hinter einem Doppelklick verstecken sich die Feldeigenschaften. Hinter dem Button "Validierung" gibt es die Möglichkeit ein "Benutzerdefiniertes Validierungsscript aus(zu)führen". Perfekt. Nehmen wir, und so siehts aus:

    if(event.value.search(/[^a-z ]/gi) == -1) {
        event.rc = true;
    }
    else {
      event.rc = false;
      app.alert("Bitte geben Sie nur Buchstaben ein.");
    }

Über die Eigenschaft **event.value** bekommen wir den Inhalt des Formularfeldes nach der Eingabe (das regelt das PDF für uns). Mit der Funktion [search()](http://de.selfhtml.org/javascript/objekte/string.htm#search) wende ich einen regulären Ausdruck auf den Inhalt an. _\[a-z \]_ trifft auf alle Buchstaben und das Leerzeichen zu. Mit "i" wird die Groß- und Kleinschreibung ignoriert und "g" durchsucht den String bis zum Ende. Mit dem Dach (^) negieren wir die Auswahl - wird also nichts anderes außer Buchstaben oder das Leerzeichen gefunden, ist alles in Ordnung und der **Return Code (rc)** wird positiv; der Inhalt hat die Validierung bestanden ([bei AddedBytes gibts ein gutes Cheat Sheet zu regulären Ausdrücken](http://www.addedbytes.com/cheat-sheets/regular-expressions-cheat-sheet/)).
Ist dies **nicht** der Fall, negieren wir den Return Code, was ein verlassen des Feldes verhindert, bzw. den Standardwert setzt. Über **app.alert()** wird der Benutzer noch darauf hingewiesen (ohne **app** funktioniert es nicht).

## 2\. Abhängigkeiten von Checkboxen
Das Problem: Wenn eine Checkbox gewählt ist, dann dürfen eine ganze Reihe **anderer** Felder **nicht** ausgewählt werden. Alltäglich...
Bei den Checkboxen gibt es keine Validierung, deshalb fügen wir eine neue Aktion hinzu: Bei _"Maustaste loslassen"_ wird ein JavaScript ausgeführt, undzwar folgendes.

    if(this.getField("FELDNAME_1").value == "VALUE_1") {
      this.resetForm(["FELDNAME_2"]);
    }

Bedeutet: über **this.getField().value** bekommen wir den Inhalt der ersten Checkbox (mit Namen FELDNAME\_1), welche die Abhängigkeit auslösen soll. Ist sie nicht ausgewählt, besitzt sie auch keinen Inhalt (VALUE\_1).
Falls doch, wird mit **this.resetForm()** der Standard wieder hergestellt. Als Parameter wird der Feldname als Array übergeben. Es könnten also auch mehrere Felder zurück gesetzt werden mit _resetForm(\["FELD\_1", "FELD\_2"\])_ - man achte auf die korrekte Klammerung.

## Fazit
Alles in allem eine ehr anstrengende Geschichte, aber ich denke sie funktioniert. Die Informationen im Netz sind spärlich, geholfen hat mir aber das endlose PDF[JavaScript in Acrobar API](http://www.adobe.com/devnet/acrobat/javascript.html). Die [offizielle Acrobat Hilfe](http://help.adobe.com/de_DE/Acrobat/9.0/Standard/WS58a04a822e3e50102bd615109794195ff-7e1e.w.html) bietet einen ersten Einstieg - und setzt erfreulicher Weise auf jQuery :)