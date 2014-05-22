---

layout: post
title: "Einen Mini-Blog mit TYPO3 realisieren"
abstract: 'Der [Kiwi Service](http://www.kiwi-service.de "Computer und Medienservice aus Berlin") (meine Firma) hat mit großer Freude sein neustes Projekt realisert: Der Internetauftritt der [Lauscherlounge](http://www.lauscherlounge.de "Kiwi realisiert den Relaunch der Lauscherlounge") erstrahlt in schönem neuen Design und bietet mit TYPO3 im Hintergrund den gewohnten Komfort, die Trauer aber vorallem die Freude und Effizienz!
Eine von vielen schönen Kleinigkeiten ist **Olis Notziblog** auf der rechten Seite. Es handelt sich um ein Widget in dem immer mal wieder, unkompliziert neue Inhalte eingetragen werden sollen. Das Besondere ist, dass ein Inhalt aus einem Bild (der Handschrift) und der Abschrift besteht. Sprich **Text mit Bild**. Das kommt dem geschulten TYPO3 Ohr natürlich bekannt vor. Und genauso werden die Daten vorgehalten. **In Contentelementen.**
Dieses Tutorial beschreibt die **Einrichtung**, **Verwaltung** und **Ausgabe** eines Miniblogs, der einfach zu pflegen ist und Informationen ohne große Funktionen zur Verfügung stellt.'
categories: TYPO3
redirect_from: "2009/10/11/einen-mini-blog-mit-typo3-realisieren/"

---

## Backend
Es wird eine **nicht im Menü sichtbare Seite** angelegt, dem Redakteur freigegeben und die ID (z.B. _50_) notiert. Hier sollte man jetzt testweise einen Inhalt anlegen. Soweit sehr einfach.

## Typoscript
Entweder wird ein **eigener Marker** im Template festgelegt, oder, was ich empfehlen würde, der Marker für die rechte Spalte wird als **COA** angelegt. COA beschreibt eine Sammlung von Objekten die nacheinander ausgegeben werden. Im ersten Schritt soll schlicht der **Inhalt der rechten Spalte** aus dem Backend ausgegeben werden:

    page.10.marks.RIGHT = COA
    page.10.marks.RIGHT.50 = CONTENT
    page.10.marks.RIGHT.50 {
        table = tt_content
        select.orderBy = sorting
        select.where = colPos = 2
        select.languageField = sys_language_uid
    }

Mit dieser Struktur, die man auch bedenkenlos für die linke und die Hauptspalte benutzen kann, hat man **absolute Flexibilität** auf den Unterseiten. Olis Blog erscheint nur auf der Startseite. Also wird ein **Extensiontemplate** angelegt und der Marker _RIGHT_ erweitert:

    page.10.marks.RIGHT.40 = PHP_SCRIPT
    page.10.marks.RIGHT.40.file = fileadmin/template/scripts/olis_notizblog.php

Vor dem Menü wird dem Marker ein **PHP Script **hinzugefügt.

## PHP Script
Jetzt ist es nicht mehr weit. Hinter oben angegebenen Pfad erstellt man eine Datei. Zwei Dinge muss man beachten:

1. Alle Inhalte die später im Marker erscheinen sollen, müssen in die Variable _$content _geschrieben werden
2. Auch wenn der Testserver die PHP Kurzschreibweise _<? ... ?\>_ unterstützt, sollte man diese nicht mehr verwenden! In PHP 6 soll sie abgeschafft werden und etliche Konfigurationen verbieten sie jetzt schon, was zur Folge hat, dass der Code einfach als Text ausgegeben wird.
Die erste Aufgabe besteht darin, das neuste Element aus der **tt\_content Tabelle** auszulesen. Es muss also nach Zeit sortiert werden und das Element muss auf der richtigen Seite gespeichert werden (_ID 50_). Das erreicht man über die Abfrage der Spalte **PID**.

    $posts = $GLOBALS['TYPO3_DB']->exec_SELECTgetRows(
        'uid, header, bodytext, image',
        'tt_content',
        'pid = "50" AND deleted = "0" AND hidden = "0"',
        '',
        'sorting ASC',
        1
    );

Der äußerst praktische Befehl _exec\_SELECTgetRows_ erwartet folgende Parameter: auszulesende Felder, gewünschte Tabelle, WHERE-Bedingung, eventuell Gruppierung, Bedingung zum Sortieren und die Anzahl der erwarteten Ergebnisse.
Das kann man sich natürlich nur schwer merken, aber dafür gibt es zum Glück eine [Dokumentation](http://typo3.org/fileadmin/typo3api-4.2.6/ "TYPO3 API") zum nachsehen.
_exec\_SELECTgetRows_ liefert im Gegensatz zu _exec\_SELECTquery_ keine Datenbankressource zurück, sondern ein Objekt über alle gefundenen Zeilen. In unserem Fall ist das nur eine und es wird auch immer eine bleiben, deshalb kann man immer so an sie herankommen:

    $post = $posts[0];

Jetzt ist es nur noch eine Frage der Anforderung und einer testweisen Ausgabe mit _print\_r($post)_ um ein Ergebnis zu erhalten:

    $content = '<div class="blog">';
    $content.= '<h3>'.$post['header'].'</h3>';
    $content.= '<p>'.$post['bodytext'].'</p>';
    $content.= '</div>';

## Fazit
Fertig ist der Lack/**Blog**! Über dem Hauptmenü erscheint jetzt immer das neuste Element aus der versteckten Seite. Sicher hätte man das ganze auch mit puren Typoscript lösen können, aber meiner Ansicht nach ist diese Lösung flexibler. Eventuell sollen die Inhalte demnächst auf Twitter, Facebook, MySpace und SpiegelOnline erscheinen. Da ist es dann schön ein Script zur Verfügung zu haben, in dem man sich austoben kann.
Bleibt noch zu sagen, [hört mehr Hörbücher](http://www.lauscherlounge.de "Hörbücher, großartige Literatur bei der Lauscherlounge!")!!!