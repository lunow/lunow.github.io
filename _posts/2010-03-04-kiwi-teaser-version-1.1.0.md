---

layout: post
title: "Kiwi Teaser Version 1.1.0"
abstract: 'Seit gestern steht die neue Version meiner Extension Kiwi Teaser im [Repository](http://typo3.org/extensions/repository/view/kiwi_teaser/current/ "Kiwi Teaser im TYPO3 Repository") bereit. Neben einem Icon für die Teaser Inhaltselemente ist auch ein kleiner Fehler in den generierten Pfaden zu den Ressourcen behoben. Die wirklich interessante, und diesen Post rechtfertigende Neuerung ist die **komplette Konfigurationsmöglichkeit über Typoscript**.
Dadurch ist es möglich einen Teaserport direkt per Typoscript einzubinden und zum Beispiel einem Marker zuzuweisen. Außerdem kann man mit dieser praktischen Extension **jede beliebige Tabelle** auslesen!'
categories: Kiwi Teaser
redirect_from: "2010/03/04/kiwi-teaser-version-1-1-0/"

---

## Einbindung über Typoscript
Nach der Installation steht im Typoscript das Objekt **plugin.tx\_kiwiteaser\_pi1** bereit. Das kann einem Marker zugewiesen werden und über die Eigenschaften **content** und **ports** mit Inhalt befüllt werden.

    page.10.marks.CONTENT < plugin.tx_kiwiteaser_pi1
    page.10.marks.CONTENT {
        content = pages_21, tt_content_123, pages_22, tx_kiwiteaser_content_2
        ports = 4
    }

Und zack findet sich im Frontend statt \#\#\#CONTENT\#\#\# ein cooler Kiwi Teaser mit vier Slots und den ausgelesenen Datensätzen, angegeben in **content**. Das Format ist simpel: Name der Datenbank - Unterstrich - UID des Datensatzes. Extra angelegten Teaserinhalte befinden sich in der Datenbank **tx\_kiwiteaser\_content**.

## Ansprechen von beliebigen Datenbanken
Wenn man die Inhalte einfach per Typoscript beschreibt, lässt sich natürlich jede beliebige Datenbank ansprechen. Ja, das funktioniert! Damit die Extension weiß, welche Spalten sie auslesen soll, muss man diese per Typoscript bekannt geben. Zum Beispiel könnte man die besten Frontend Benutzer teasern:

    plugin.tx_kiwiteaser_pi1 {
    tables.fe_users {
        title = name
        content = address
        image = image
    }
    }

Das Format sollte eigentlich selbsterklärend werden. Der Inhalt aus der Spalte name landet im Marker \#\#\#TITLE\#\#\# usw. Anschließend muss der Datensatz nur noch dem Teaser zugewiesen werden. Dem Beispiel von oben folgend so:

    page.10.marks.CONTENT.content = fe_users_1, fe_users_3, pages_12, tt_content_21

Nett, oder?

## Mehr Komfort für Redakteure
Um **weitere Tabellen** im Teaser zu erlauben, und diese vorallem im Backend auszuwählen muss man im Moment leider noch hart an den Quelltext ran. In der Datei **typo3conf/ext/kiwi\_teaser/ext\_tables.php** wird im Array **$tempColumns** ab Zeile 33 das Feld **tx\_kiwiteaser\_teasers** als Datenbankrelationsfeld definiert. In Zeile 41 werden unter dem Schlüssel **allowed** alle erlaubten Datenbanknamen aufgezählt. Um den Redakteuren die Auswahl von Benutzern zu erlauben, muss der Eintrag erweitert werden:

    $tempColumns['tx_kiwiteaser_teasers']['allowed'] = 'tx_kiwiteaser_content,pages,tt_content,fe_users';

## Ausblick und Weiterentwicklung
Der aufmerksame Betrachter wird die auskommentierte Zeile 40 bemerken, in der tt\_news noch erlaubt war. Daran arbeiten wir im Moment. Verbessert werden muss die **Verlinkung auf ausgewählte Inhalte**.
Außerdem auf der Liste steht eine **dynamische Darstellung von Teaserinhalten**. Das bedeutet zum Beispiel das auslesen aller Seiten ab einem Einstiegspunkt, oder die Angabe von verschiedenen Bedingungen.
Wer diese Funktionen für sein Projekt gut gebrauchen kann oder mehr Ideen hat, ist natürlich herzlich eingeladen mit [uns](http://www.apeunit.com "Webentwicklung aus Berlin") darüber zu reden.