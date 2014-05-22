---

layout: post
title: "Einfache Druckfunktion für TYPO3"
abstract: 'Ich bin kein Freund davon hunderte Extensions zu installieren und damit Tonnen von fremden Code in das eigene Projekt zu schmeißen. Mit seinen 33MB bringt TYPO3 da schon genug mit. Also möchte ich einfache Aufgaben mit einfachen Boardmitteln lösen.
Zum Beispiel dir Druckfunktion. Als verantwortungsvolle Webagentur erstellen wir ordnungsgemäß eine print.css. Doch trotz aller Erklärungen möchte [der Kunde](http://www.degi.com) nicht auf das kleine Druckersymbol und die Vorschau verzichten.
Folgenden Lösungsweg möchte ich Vorschlagen, ohne Extensions, nur mit ein paar Zeilen Typoscript.'
categories: TYPO3
redirect_from: "2008/07/04/einfache-druckfunktion-fur-typo3/"

---

**1\. Im Template** platzieren wir einen Marker PRINT und definieren diesen als Link auf die gleiche Seite mit einem weiteren Parameter: print=1

    PRINT = TEXT
    PRINT.typolink {
        value = drucken
        parameter.data = page:uid
        additionalParams = &print=1
        target = _new
    }

Sehr schön. Weiter zur Einbindung der CSS Dateien.
**2\. Die Standardcss Datei** lassen wir beim einbinden einfach leer:

    page.includeCSS {
        file1.media = screen
        file2 = fileadmin/template/css/print.css
        file2 {
            title = Druckversion
            media = print
        }
    }

Und am Ende vom Typoscript kommen wir zu Punkt drei.
**3\. Mit einer einfachen Bedingung** fragen wir unseren Parameter ab und definieren je nach dem die CSS Datei "file1":

    # Standard CSS Datei - wird ggf. überschrieben
    page.includeCSS.file1 = fileadmin/template/css/style.css
    [globalVar = GP:print=1]
    # Wenn &print=1 an die Adresse angehängt wird, läd das Print.css
    page.includeCSS.file1 = fileadmin/template/css/print.css
    [global]

**Das wars! **Und schon haben wir eine einfache und wirkungsvolle Druckfunktion. Ohne Extensions, ohne ein Drucktemplate, neue Fenster und JavaScript.
Und Typoscript bietet noch so viel mehr. Zum Beispiel können wir die Variable "print" in die allgemeinen LinkVars mit aufnehmen. Damit schleift TYPO3 den Parameter durch alle ordentlich erzeugten Links und wir können in der Druckfunktion rumsurfen als wäre es eine eigene Webseite:

    config.linkVars = L, print

Apropos "L". **Mehrsprachigkeit** ist natürlich auch kein Problem, sollte man den Linktext nicht per Image Replacement verstecken.

    [globalVar = GP:L=1]
      page.10.marks.PRINT.value = print
    [global]

Selbsterklärend...
Ein Styleswitcher ist genau so einfach zu realisieren.