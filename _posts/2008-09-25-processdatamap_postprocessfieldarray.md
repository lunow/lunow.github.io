---

layout: post
title: "processDatamap_postProcessFieldArray()"
abstract: '![TYPO3 Entwicklung und Liebe](http://blog.paul-lunow.de/wp-content/uploads/2008/09/logo_save-area_01.jpg)Manchmal hasst man TYPO3 für diese Funktionsnamen. Wenn man dann durchschaut hat, was damit gemeint ist, verliebt man sich wieder in das riesen CMS.
In diesem Beitrag will ich erklären wie es dank Hooks und dem TCEMain Objekt möglich wird, in die TYPO3 internen Speicherfunktionen zu kommen. Das braucht man für seine eigenen Extensions oder wenn man vor dem Speichern die Daten manipulieren möchte.'
categories: Entwicklung, TYPO3
redirect_from: "2008/09/25/processdatamap_postprocessfieldarray/"

---

Vorne weg sei gesagt, dass Robert Lemke schon ein [ausführliches, englisches Tutorial](http://typo3.org/development/articles/how-to-use-existing-hooks/) geschrieben hat welches die Sache sehr gut und ansehnlich erklärt. Wer nicht so viel Zeit hat oder keine Lust auf Englisch, dem wünsche ich viel Spaß!

## Eine eigene Klasse
Wir brauchen eine neue Datei in der wir unsere eigene Funktionalität festhalten. Diese braucht eine einzige Funktion, welche schon im Titel erwähnt ist: **processDatamap\_postProcessFieldArray**.

    class tx_EXTNAME_tcemainprocdm {
    	function processDatamap_postProcessFieldArray($status, $table, $id, &$fieldArray) {
    		// ACTION!
    	}
    }

_EXTNAME_ ist hier wie im folgenden stets entsprechend anzupassen.
Wir erstellen also eine Funktion die eine ganze Reihe Parameter bekommt. Bei Robert Lemke hat sie auch noch ein **&$this** als letzten Parameter, da hat er bei mir aber rumgemeckert.
**$status** beinhaltet die gewählte Aktion (z.B. "update" oder "insert").
In **$table** steht die Tabelle um die es geht.
Und **$id** kennzeichnet den betreffenden Datensatz. Reicht für meine Zwecke.

## Den Hook registrieren
Dafür wechseln wir in die Datei **ext\_localconf.php** und fügen eine Zeile hinzu, welche unsere Klasse referenziert:

    $GLOBALS["TYPO3_CONF_VARS"]["SC_OPTIONS"]["t3lib/class.t3lib_tcemain.php"]["processDatamapClass"][] = "EXT:EXTNAME/class.tx_EXTNAME_tcemainprocdm.php:tx_EXTNAME_tcemainprocdm";

Der Datei **t3lib\_tcemain.php** wird also unser Hook zugeteilt. Es ist darauf zu achten das dem Array ein neues Element hinzugefügt wird und durch das Konstrukt _Dateipfad**:**Klassenname_ die Einbindung mittels _require_ entfällt. Praktisch!

## Das wars!
Nichts leichter als das. Wenn man mit Echo in der eigenen Funktion etwas ausgibt erscheint es nach dem Speichern eines Datensatzes über der Leiste mit den Speichernknöpfen, also keine Hemmungen und viel Spaß mit dem Logikmonster TYPO3!