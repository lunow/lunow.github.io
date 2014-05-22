---

layout: post
title: "Ein automatisches Infofenster mit TYPO3 und jQuery"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/10/overlay.png)Schwieriger zu betiteln als es eigentlich ist: Der Auftrag war für eine aktuelle TYPO3 Präsenz den Besucher auf eine wichtige Tatsache hinzuweisen. Die Seite soll abgedunkelt werden und darüber zentriert der neue Inhalt liegen. Also ein Effekt wie bei der Imagebox.
Spannend wurde das ganze dann durch die Vorgabe, dass der Redakteur die Inhalte einfach über das Backend bearbeiten sollte.
Also los: Das TYPO3 Projekt kriegt einen neuen Pagetype zur Darstellung der Inhalte, jQuery ist natürlich schon eingebunden und für die Darstellung benutze ich das genial [NyroModal](http://nyromodal.nyrodev.com/).'
categories: jQuery, TYPO3
redirect_from: "2008/10/30/ein-automatisches-infofenster-mit-typo3-und-jquery/"

---

## Vorbereitungen
jQuery und NyroModal sind eingebunden und funktionsbereit. Am besten auf einer kleinen Testseite ausprobieren damit es nicht an der grundlegenden Funktionalität scheitert.

## Neue Templates
Um die Inhalte befreit vom Rahmen darstellen zu können spendieren wir dem Projekt einen neuen Typ der Darstellung. Diesen kann man ansprechen über die Variable **&type=XXX**, wobei XXX für eine beliebige Nummer steht. Ich nehme mal 101\.

    nurinhalt = PAGE
    nurinhalt {
      typeNum = 101
    }
    
    # Alles kopieren
    nurinhalt.10 < page.10
    
    # Und das Template anpassen
    nurinhalt.10.template.file = fileadmin/template/nurinhalt.template.html

Wir duplizieren unsere Standardausgabe und machen ihn erreichbar über die Angabe **typeNum** die jeweils nur ein einziges Mal benutzt werden darf. Anschließend wird ein neues Template zugewiesen welches nur noch die benötigten Teile enthält.

    <div class="only">
    ###CONTENT###
    <span class="clear"> </span>
    </div>

Cache löschen und fertig. Über den Parameter **&type=101** kriegen wir jetzt jeden Inhalt ohne den ganzen Kram drum herum. Unbedingt mit einer beliebigen ID testen: **index.php?id=123&type=101**. Wenn es nicht klappt hilft ein Blick in den Object Browser der zeigt was aus unserem Typoscript wird.

## JavaScript
Das Fenster soll nur auf der Startseite erscheinen. Also ein _Extensiontemplate_ für die Seite einrichten und ein externes JavaScript einbinden oder direkt im Template über _headerData_ den Kopfbereich der Seite erweitern.

    $(document).ready(function() {
      $.nyroModalManual({
        type: "ajax",
        url: "index.php?id=123&type=101",
        width: 500,
        height: 400
      });
    });

Hier kommt **NyroModal** ins Spiel, welches eine konfortable Funktion mit unendlich vielen Einstellungen bietet (viel besser als die Thickbox welche mich immer nervt wenn ich sie manuell öffnen möchte). Mit der Funktion _nyroModalManual_ öffnen wir ein neues Fenster mit unserem neuen Inhalt.

## NyroModalManual und TYPO3 PageType für Links
Mit ein paar wenig mehr Zeilen haben wir eine schöne Lösung für Links die ein Nyrofenster öffnen sollen.

    $("a.nyro").click(function() {
      url = $(this).attr("href");
      $.nyroModalManual({
        type: "ajax",
        url: url+"&type=101",
        width: 500,
        height: 400
      });
      return false;
    });

Dieses Script öffnet die angeklickten Links mit der Klasse "_nyro_" in einem netten Fenster, hat der Benutzer kein JavaScript aktiviert kriegt er die Inhalte im Rahmen der Seite präsentiert.
Herrlich! Jetzt mag ich TYPO3 wieder. Ein paar kleine Stolperfallen sind noch drin, z.B. macht URL Rewriting dem ein Strich durch die Rechnung; bleibt nur zu sagen, **mitdenken hilft**!