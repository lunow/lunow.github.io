---

layout: post
title: "Einer TYPO3 Extension Datenbank weitere Spalten hinzufügen"
abstract: '![typo3-extension-ordner](http://blog.paul-lunow.de/wp-content/uploads/2009/01/typo3-extension-ordner.png)Mal angenommen man hat mit dem **Kickstarter** eine tolle Erweiterung erstellt, fröhlich begonnen zu entwickeln und dann festgestellt man braucht **weitere Felder**.
Oder man hat eine **fremde Extension** schon soweit verbogen, dass man getrost auch noch die Datenbank erweitern könnte, dann braucht man eine ganze Menge Geduld, ein gutes Gedächnis oder **die folgende Anleitung**.
Es ist relativ einfach _neue Spalten zu einer Tabelle der TYPO3 Datenbank_ hinzuzufügen. Man muss gerade mal **4 Dateien** bearbeiten.'
categories: TYPO3
redirect_from: "2009/01/05/einer-typo3-extension-datenbank-weitere-spalten-hinzufugen/"

---

Die Dateien befinden sich natürlich alle im Verzeichnis der Extension. Auf gehts:

## 1\. ext\_tables.sql
Hier ist das pure Datenbankschema gespeichert. Mit pur meine ich die SQL Befehle. Angelegt wie als würde eine neue Datenbank erstellt werden. TYPO3 kann die Änderungen automatisch in UPDATE Befehle umwandeln.

## 2\. ext\_tables.php
Diese Datei beschreibt das verhalten der _kompletten_ _Datenbank_ im TYPO3 Backend. Im unteren Bereich gibt es das Array **feInterface**, hier muss das neue Feld hinzugefügt werden.

        "feInterface" => array (
            "fe_admin_fieldList" => "sys_language_uid, l18n_parent, l18n_diffsource, hidden, title, street, plz, plz_alt, city, tel, fax, asp_name, asp_mail",
        )

## 3\. locallang\_db.xml
Speichert die Namen der Felder für die Eingabe im Backend. Für jede Spalte muss ein _Label_ definiert werden, am besten in jeder Sprache die angeboten wird, wenn mans eilig hat dann nur auf deutsch.

    <label index="tx_kiwidbplz_data.plz_alt">Alternative zur PLZ</label>

Der letzte Teil vom Attribut _index_ ist der neue Spaltenname.

## 4\. tca.php
Das ist die aufwändigste Datei. Hier ist eine Anleitung für jede einzelne Spalte gespeichert. Am besten man sucht sich einen Eintrag von einer Spalte die das gleiche Format hat und ändert zwei Stellen:

            "plz_alt" => Array (
                "exclude" => 1,
                "label" => "LLL:EXT:kiwi_db_plz/locallang_db.xml:tx_kiwidbplz_data.plz_alt",
                "config" => Array (
                    "type" => "input",
                    "size" => "30",
                )
            ),

Zum einen _den Schlüssel_ ("**plz\_alt**" =\> Array...) des Eintrags und die _Referenz zum Label_ ("label" =\> "LLL:EXT:kiwi\_db\_plz/locallang\_db.xml:tx\_kiwidbplz\_data.**plz\_alt**").
Die**zweite Änderung** findet sich ganz unten im Feld **types**. Die hier angegebene Reihenfolge wird im Backend befolgt.

        "types" => array (
            "0" => array("showitem" => "sys_language_uid;;;;1-1-1, l18n_parent, l18n_diffsource ... plz, plz_alt, city, tel, ...")
        )

(ein leicht gekürzter Auszug)

## TYPO3 Backend
Sind diese Anpassungen getan, ins **Backend** von TYPO3 wechseln, den **Extension Manager** aufrufen und die **angepasste Erweiterung** anklicken. Auf der Erweiterungsseite weißt das Script jetzt auf eine nötige**Aktualisierung der Datenbank** hin. Diese durchführen, eventuell den Backend Cache löschen und **fertig**!
Viel Spaß mit der neuen Spalte, in welcher Datenbank auch immer!