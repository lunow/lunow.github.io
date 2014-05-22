---

layout: post
title: "PDFs erstellen mit TYPO3"
abstract: 'Aus irgendeinem Grund möchten so viele Kunden **PDFs zum Download** auf ihren Seiten anbieten. Vermutlich haben sie keinen Mac.
Als [Fullservice Agentur](http://www.kiwi-service.de "Coole Agentur aus Berlin") scheut man sich natürlich nicht vor der Arbeit, sondern stürzt sich voller Freude hinein.
Mit der Extension [pdf\_generator2](http://typo3.org/extensions/repository/view/pdf_generator2/current/ "pdf_generator2 download") wird das zum **Kinderspiel**! Und das mit **CSS Support**, inklusive Hintergrundbildern! Dieser Beitrag zeigt wie.'
categories: TYPO3
redirect_from: "2009/06/04/pdfs-erstellen-mit-typo3/"

---

## Installation
Mal eine aktuelle **TYPO3** und **PHP** Version auf dem Server vorausgesetzt benötigt man nur noch die Extension **pdf\_generator2**. Bei der Installation gibt man einen **Pagetype** an (Standard ist 123), den man sich merken sollte.
**Fertig!** Auf einer beliebigen Seite im Projekt kann man jetzt "_type=123_" an die URL anhängen und bekommt ein schlichtes PDF zum Download angeboten.
**Ohne RealUrl** index.php?id=12&type=123
**Mit RealUrl **meine/klasse/struktur/seite-zwei.html?type=123 (bzw. einer erweiterten Anpassung der RealUrl Konfiguration)

## Anpassung
Die PDF sieht noch nicht so schön aus. Deshalb muss das Pageobjekt erweitert werden. Dazu wird als erstes ein **HTML Template** und eine neue **CSS Datei** angelegt. Ich schlage vor im Ordner _fileadmin/template/pdf/_.
In beiden Dateien muss man natürlich etwas eintragen. Nehmen wir an, die Marker \#\#\#BREADCRUMB\#\#\#, \#\#\#CONTENT\#\#\# und \#\#\#FOOTER\#\#\# sollen im PDF erscheinen.
Also gehts ins **Typoscript**. Am besten auf Rootebene, damit sich die Einstellungen für das gesamte Projekt durchsetzen. Hat man einen Unterbereich, in dem das PDF anders aussehen soll, kann man das aber natürlich beliebig verschachteln.
Der pdf\_generator2 hat **automatisch** ein neues Pageobjekt mit dem Namen **pdf\_generator** angelegt. Das wird erweitert:

    pdf_generator {
        # passende CSS Dateien laden
        includeCSS {
            file1 = fileadmin/template/pdf/style.css
            file1.media = screen
        }
        
        # eigenes Template erstellen zur optimierten Ausgabe
        10 = TEMPLATE
        10 {
            template = FILE
            template.file = fileadmin/template/pdf/template.html
            
            # benötigte Marker kopieren
            marks {
                BREADCRUMB < page.10.marks.BREADCRUMB
                CONTENT < page.10.marks.CONTENT
                FOOTER < page.10.marks.FOOTER
            }
        }
        
        # Standard PDF Generatorkram entfernen
        50 >
    }

CSS und Template sollten klar sein. Interessant wird es bei den **marks**. Aus dem **Standardobjekt page** werden alle Marker kopiert, damit sie im PDF Template zur Verfügung stehen.
Am Ende wird mit **50 \>** das Standardtyposcript der Extension gelöscht. Hier war eine Datenbankabfrage angegeben, die sehr einfach die Inhalte der Seite ausgelesen hat. Vergisst man diese Zeile hat man seinen **Inhalt doppelt im PDF**.

## PDF Downloadlink
Es gibt in der [Doku der Extension](http://typo3.org/documentation/document-library/extension-manuals/pdf_generator2/0.5.1/view/1/3/#id3921246 "Links zur PDF Generierung hinzufügen") verschiedene Wege einen Downloadlink vom PDF der aktuellen Seite anzugeben. Zum Beispiel mit einer **Benutzerfunktion,** die aus dem Typoscript ein PHP Script aufruft.
Da das **CONTENT Objekt** nach den meisten Anleitungen schon ein Element vom**Typ COA** ist, füge ich einfach eine neue Ebene hinzu:

    CONTENT = COA
    CONTENT {
        20 = CONTENT
        # ... usw usf ....
    
        50 = TEXT
        50 {
            value = Download als PDF
            postUserFunc = tx_pdfgenerator2->makePdfLink
            postUserFunc.target = _blank
        }
    }

Und schon findet sich auf jeder Seite ein Downloadlink. Wenn man es auf diese Art macht, sollte man allerdings die Ebene bei der PDF Generierung wieder entfernen, z.B. so:

    pdf_generator.10.marks.CONTENT.50 >

## Die PDF Ansicht testen
Es ist natürlich äußerst unpraktisch bei jeder Änderung ein PDF zu generieren, herunter zu laden, anzusehen, nur um dann wieder von vorne anzufangen. Deshalb empfehle ich **temporär einen weiteren Seitentyp anzulegen**, der die gleichen Eigenschaften hat, aber kein PDF generiert sondern einfach die Vorlage anzeigt.
Als erstes erhält der neue Seitentyp **pdf\_generator\_preview** alle Eigenschaften von **pdf\_generator**. Damit kein PDF erzeugt wird, muss die Eigenschaft **config** entfernt werden.

    pdf_generator_preview < pdf_generator
    pdf_generator {
        config >
        typeNum = 272
    }

Damit die Seite ansprechbar ist, wird eine neue Typennummer angegeben. Mit 272 erfolgt der Aufruf dann über
index.php?id=12&type=272
Auf dieser Seite kann man in Ruhe ausprobieren. Es bietet sich auch an darauf zu achten, dass die Seite [validiert](http://validator.w3.org/ "Immer schön validieren lassen!") und weder HTML noch CSS Fehler enthält, dann klappts auch mit der **PDF Erstellung**.

## Downloadname anpassen
Das mieseste Problem war der **Name im Downloaddialog**. Der Browser hat immer "_index.php_" vorgeschlagen was bei unkundigen Benutzern schon leichte Schwierigkeiten hervorrufen könnte.
Leider habe ich im Zusammenspiel mit **RealURL** nur einen harten Weg gefunden den Namen anzupassen. Und der geht direkt in die Extension unter**typo3conf/ext/pdf\_generator2/class.tx\_pdfgenerator2.php** ab Zeile **83**:
Hier wird die Variable **$filename** mit einer Get/Post-Variable belegt. Bitte fragt mich nicht wo die herkommt, sondern ersetzt die Definition der Variable einfach durch den Titel der aktuellen Seite:

    $filename = '; filename = "'.t3lib_div::convUmlauts($GLOBALS['TSFE']->page['title']).'.pdf"';

Der eigentliche Name ist verpackt um per Header dem Browser übergeben zu werden, der Name steht in **$GLOBALS\['TSFE'\]-\>page\['title'\]**. Und die Funktion **t3lib\_div::convUmlauts($string)** ersetzt Umlaute in normale Buchstaben, also wird ä zu ae usw. Das spart schon mal ein bisschen Ärger.
**Achtung**: Es ist nicht klug Extensions auf diese Art anzupassen, da die Änderungen beim nächsten Update verloren gehen. Da man die Änderung mit Beginn des nächsten Projekts wahrscheinlich _vergessen_ hat, sollte man sich selbst daran erinnern, und zwar in der Datei **ext\_emconf.php**. Die hier gespeicherten Inhalte werden im **TYPO3 Backend** dargestellt.

## Eigene Schriftarten benutzen
Jetzt wird die Sache richtig spannend. Der Kunde möchte in den **PDFs seine Hausschrift** verwendet sehen und nach seiner Erfahrung sollte das ganz einfach zu machen sein (_grrrrr..._).
**Dann mal los!**
Wir haben auf dem Server die [PDFlib](http://www.pdflib.com/de/ "PDFlib zur Generierung von PDFs") installiert mit der es funktioniert hat und für die diese Anleitung ist. Ich vermute aber der Weg ist ein ähnlicher für fpdf. _Und so gehts:_
**1\. pdf\_generator2 erklären, dass es die PDFlib benutzen soll.**
Das passiert über den _Constant Editor_ in der Kategorie _PDF\_GENERATOR2_ unter _Others_ der Eintrag _Use pdflib_.
**2\. Extension pdf\_generator2\_fonts installieren.**
[Datei herunterladen](http://typo3.org/extensions/repository/view/pdf_generator2_fonts/current/ "Fonts for PDF_Generator2"), Extension installieren, fertig. Keine große Sache.
**3\. Eigene Schrift hochladen.**
Mit der Installation der Extension _pdf\_generator2\_fonts_ schnallt die _pdf\_generator2_ Extension automatisch, dass sie in dem neuen Ordner nach Schriften suchen soll. Von der gewünschten Schrift braucht man eine **\*.ttf Datei**, diese kommt in den Ordner **typo3conf/ext/pdf\_generator2\_fonts/fonts/**.****
**4\. Neue Schriftart bekannt machen.** (das ist der nervigste Schritt, durchhalten!)
Zurück zum Generator: in der Datei **typo3conf/ext/pdf\_generator2/html2ps/html2ps.config** befindet sich eine **XML Struktur** in der die zur Verfügung stehenden Schriftarten gespeichert sind. Hier muss man den Knoten **<fonts-pdf\>** suchen und ein neues Kindelement namens **<family\>** anlegen. Am besten man kopiert einen vorhandenen Eintrag.
Im Attribut **name** wird der Name der Schriftfamilie angegeben. Eine Schriftfamilie besteht aus unterschiedlichen Schriftschnitten, z.B. _normal_ und _fett_. Diese Schriftschnitte bekommen jeder ein weiteres Kindelement.

    <family name="compatil">
        <normal normal="Compatil" italic="Compatil-Italic" oblique="Compatil-Oblique" />
        <bold normal="Compatil-Bold" italic="Compatil-BoldOblique" oblique="Compatil-BoldOblique"/>
    </family>

Der im Attribut **normal** angegebene Name ist wichtig. Schreibweise merken und weiter runter scrollen.
In den Elementen **<ttf\>** wird der eben definierte Name einer **TTF Datei** zugeordnet. Braucht man also die Schnitte _normal_ und _fett_, fügt man hier zwei Einträge hinzu:

    <ttf typeface="Compatil" embed="0" file="COMMECFR.TTF"/>
    <ttf typeface="Compatil-Bold" embed="0" file="COMMECFB.TTF"/>

Groß- und Kleinschreibung spielt hierbei eine Rolle! Auch die Schreibweise der Dateiextension.
**5\. Schriftart zuweisen.**
Das passiert ganz entspannt in der CSS Datei, wie gewohnt:

    body {
        font-family: "Compatil";
    }

**Fertig! **Ich drücke die Daumen, dass es bei dir genau so gut klappt und die Besucher bald Tausende interessante PDF Dateien herunterladen können.

## Erweiterung
David Will hat eine Lösung entwickelt für den Fall, das verschiedene PDFs von einer Seite generiert werden müssen. [Mehrere PDFs mit pdfgenerator2](http://blog.paul-lunow.de/wp-content/uploads/2009/06/Mehrere-PDFs-mit-pdfgenerator2.pdf "Mit pdf_generator2 mehrere PDFs erzeugen"). Vielen Dank!