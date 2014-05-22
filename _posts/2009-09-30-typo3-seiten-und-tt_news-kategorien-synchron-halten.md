---

layout: post
title: "TYPO3 Seiten und tt_news Kategorien synchron halten"
abstract: 'Heute mal wieder ein richtig schönes Thema: Es geht um Seiten in einem TYPO3 Projekt und Nachrichten, die zu diesen Seiten gehören. Die Anforderung besteht darin, beim **anlegen** oder **verändern** von Seiten **tt\_news Kategorien** auf dem gleichen Stand zu halten.
Legt der Redakteur eine neue Seite Namens "_Zimmerschlacht_" an, könnte er anschließend in die Listenansicht wechseln und eine neue **News Kategorie** anlegen. Aber mach das mal einem _DAR_ (analog zu DAU) klar. Und warum den Mund fusselig reden, wenn das auch **automatisch** geht?!
Es gibt in TYPO3 eine Möglichkeit mit einem Hook in das **Speichern von Datensätzen** einzugreifen. Da kann man sich dann austoben. Es funktioniert auch mit **DAM Kategorien** und jeder anderen vorstellbaren **Datenbankanforderung**.'
categories: TYPO3
redirect_from: "2009/09/30/typo3-seiten-und-tt_news-kategorien-synchron-halten/"

---

## Vorbereitung
Wenn der Redakteur in einem bestimmten Zweig des Seitenbaums eine Aktion auslöst (neue Seite erstellen, bearbeiten oder löschen) muss mit einem Script darauf reagiert werden. Dafür legt man an seinem **Lieblingsplatz** eine Datei an und merkt sich sowohl Pfad und Namen. Mein Vorschlag:

    fileadmin/template/hooks/class.tx_createCategories_tcemainprocdm.php

In dieser Datei sucht TYPO3 später eine Klasse deren Namen wir auch selbst bestimmen können.

    class tx_createCategories_tcemainprocdm {
    }

## Hooks verstehen
Hooks sind Funktionen die während der Abarbeitung eines Scripts aufgerufen werden. Meistens erstellt TYPO3 ein **Objekt von der übergebenen Klasse** und das Script sucht nach einer passenden Funktion mit **fest definiertem Namen**.

## Hooks suchen
Google ist natürlich Anlaufpunkt Nummer eins, aber auch der **Quelltext** der betreffenden Datei bietet gute Anhaltspunkte. Wie die Vorschläge oben schon deutlich machen geht es mir um _class.t3lib\_tcemain.php_ welches sich um sämtliche Datenbankoperationen kümmert. Die [Core API](http://typo3.org/documentation/document-library/core-documentation/doc_core_api/4.2.0/view/) bietet einen guten Anlaufpunkt. Nach einigem hin und her weiß man dann, dass man den Hook Namens _processDatamap\_afterDatabaseOperations_ braucht.

## Hooks registrieren
Über die Datei _localconf.php_ wird das _$GLOBALS Array_ erweitert. Die genauen Bezeichnungen findet man meistens in der Dokumentation oder dem Quelltext. Um auf das verändern von Seiten zu reagieren muss man folgende Zeile hinzufügen:

    $GLOBALS["TYPO3_CONF_VARS"]["SC_OPTIONS"]["t3lib/class.t3lib_tcemain.php"]["processDatamapClass"][] = "fileadmin/template/hooks/class.tx_createCategories_tcemainprocdm.php:tx_createCategories_tcemainprocdm";

Der Inhalt dieser Angabe ist in zwei Teile durch ein Doppelpunkt geteilt: Der erste gibt den **Pfad zur Datei** an, der zweite den **Namen der zu initalisierenden Klasse**.
**Nicht vergessen den Cache zu löschen!!!** Sonst ärgert man sich zu tode!

## Logik hinzufügen
Bis hierher alles klar? TYPO3 erstellt eine neue Seite, initalisiert anschließend das eben angegebene Objekt und sucht darin die Funktion _processDatamap\_afterDatabaseOperations_ und führt sie aus. In dem Script im fileadmin legt man also los und führt aus was man ausführen muss:

    class tx_createCategories_tcemainprocdm {
        function processDatamap_afterDatabaseOperations($status, $table, $id, $fieldArray, &$reference) {
        }
    }

Spannend sind die Parameter:

* **$status** gibt an, was der User getan hat. z.B. "new"
* **$table** sagt, in welcher Tabelle der User es getan hat. z.B. "pages"
* **$id** beinhaltet die UID des Datensatzes (aber mit Einschränkungen! Siehe unten).
* **$fieldArray** enthält die neuen Felder. Wenn der Redakteur nur den Titel geändert hat, dann steht hier nur der neue Titel in einem assoziativen Array drin.
* **$reference** ist ein Objekt und beinhaltet die ggf. schon vorhandenen Inhalte.
Mit diesen Informationen ausgerüstet kann man schon eine ganze Menge erreichen. Mit einem _echo_ kann man sich auch ohne Probleme Daten ausgeben. Die erscheinen dann über dem Formular im Backend. Sieht nicht schön aus, aber man kann etwas lesen.

## Die richtige UID erkennen
Das Problem ist, dass bei einem neuen Datensatz im Parameter _$id_ eine temporäre UID gespeichert ist. Irgendwas wie_NEW\_2352_. Also definitiv keine Integer sondern ein **String**. Der Hook wird aber nach dem Speichern ausgeführt, deshalb muss man sich über _$reference_ die richtige UID besorgen:

    if(!is_numeric($id)) {
        $id = $reference->substNEWwithIDs[$id];
    }

Das habe ich auch nur in irgendeiner Mailingliste aufgeschnappt. Selbsterklärend ist etwas anderes.

## Neue Kategorien anlegen
Zurück zur Anforderung. Wenn ein Redakteur eine neue Seite anlegt, muss **eine neue Kategorie angelegt** werden. Dafür muss als erstes geprüft werden, ob überhaupt eine Seite angelegt wurde und der Titel geändert wurde:

    if($table == 'pages' && $id > 0 && !empty($fieldArray['title']) {
        //hier gehts weiter
    }

In dieser Abfrage muss auch noch geklärt werden, ob sich die Seite an der richtigen Stelle befindet. Das kann man über die **PID** erreichen oder wie in meinem Fall über einen eigenen Seitentyp. Beide Angaben findet man im Array _$reference-\>checkValue\_currentRecord_.

    if($status == 'new')

Endlich mal wieder etwas schönes. Alternativ könnte man auch mit Switch auf die verschiedenen Operationen reagieren. Je nach Vorliebe. Wurde also eine neue Seite an der richtigen Position angelegt, wird nichts weiter getan als eine Zeile in der Tabelle _tt\_news\_cat_ zu speichern:

    $GLOBALS['TYPO3_DB']->exec_INSERTquery(
        'tt_news_cat',
        array(
            'pid' => 194,
            'title' => $fieldArray['title'],
            'shortcut' => $id
        )
    );

## Seiten und Kategorien umbenennen
Da kommt nochmal das Array _$reference-\>checkValue\_currentRecord_ zum Einsatz. Wird eine Seite aktualisiert steht dort der alte Titel drin und im _$fieldArray_ der neue. Schöne Sache das und nur eine handvoll Zeilen um die entsprechende Kategorie zu **identifizieren** und **umzubenennen**:

    $GLOBALS['TYPO3_DB']->exec_UPDATEquery(
        'tt_news_cat',
        'title = "'.$reference->checkValue_currentRecord['title'].'"',
        array(
            'title' => $fieldArray['title']
        )
    );

Nach diesen beiden Beispielen sollte das Löschen auch keine Schwierigkeiten mehr bereiten. Der Redakteur wird es gar nicht bemerken, aber der effektive Teil vom Webentwicklerherz schlägt jetzt schon schneller.
Mit ein bisschen PHP Erfahrung sollte man sich unbedingt mit den **Hooks** auseinander setzen.