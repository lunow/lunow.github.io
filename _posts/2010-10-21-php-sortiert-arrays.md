---

layout: post
title: "PHP sortiert Arrays"
abstract: 'Heute stand ich mal wieder vor der Aufgabe ein Array zu **sortieren**. Arrays muss man beim programmieren ständig sortieren. Richtig spannend wird es mit **mehrdimensionalen Arrays** und eigenen Bedingungen nach den sortiert werden soll.
Und immer wieder sucht man die selben Begriffe und landet auf den gleichen Seiten, das hat mit diesem Eintrag ein Ende, **wenn man ein mehrdimensionales Array mit einer eigenen Funktion sortieren will**.'
categories: PHP
redirect_from: "2010/10/21/php-sortiert-arrays/"

---

## Anforderungen
In meinem Projekt stand ich vor folgendem Array:

    $data = array(
        array('title' => 'Ape Unit', 'value' => '5'),
        array('title' => 'faf', 'value' => '1'),
        array('title' => 'Kiwi Service', 'value' => '3')
    );

Aus diesen (dynamisch generierten) Daten wird ein Diagramm erzeugt. Die Daten kommen aus einer **TYPO3 Extension**, und das Diagramm wird ebenfalls über eine Extension eingebunden. Die Redaktion kann verschiedene Datensätze auswählen welche dargestellt werden sollen.
Da sich die Werte ständig ändern, das Corporate Design aber vorschreibt, dass der größte Wert immer am Anfang des Diagramms steht, landete also die Anfrage auf meinem Tisch die D**atensätze nach ihrem Inhalt zu sortieren**.

## Erster Gedanke
Kein Problem, in PHP gibt es eine ganze Menge [Funktionen um Arrays zu sortieren](http://de3.php.net/manual/en/array.sorting.php "Die verschiedenen Sortierfunktionen für Arrays"). Die Funktion [usort](http://de2.php.net/manual/en/function.usort.php "Usort sortiert Arrays") erlaubt es eine **benutzerdefinierte Funktion** zum sortieren zu benutzen. Das sieht dann ungefähr so aus:

    $data = array(); //siehe oben
    function cmp($a, $b) {
        return $a['value'] > $b['value'] ? 1 : -1;
    }
    usort($data, 'cmp');

**Funktioniert.** Aber was wenn das Corporate Design beim nächsten Kunden vorschreibt das der niedrigste Wert als Erstes angezeigt werden soll? Und wir programmieren ja wiederverwendbare Objekte, also auf zum zweiten Gedanken.

## Zweiter Gedanke
Die Sortierung passiert in einer Klasse welche beim Initialisieren eine Variable übergeben bekommt, die die Richtung anzeigt. An diese Variable kommt man aber gar nicht ohne weiteres ran, denn die User Function zum sortieren wird direkt vor dem Aufruf definiert oder muss eine statische Klasse vom Objekt sein.
Aber zum Glück gibt es auch hier eine Lösung, das Zauberwort, respektive die Zauberfunktion ist [create\_function](http://de2.php.net/create_function "PHP Funktion erstellen"). Mit der erstellt man onthefly eine PHP Funktion, die man dann wiederum **usort** als Parameter übergibt:

    $cmp = create_function('$a, $b', 'if('.$order.' == 2) {
        return $a["value"] < $b["value"] ? -1 : 1;
    }
    if('.$order.' == 3) {
        return $a["value"] > $b["value"] ? -1 : 1;
    }');
    usort($table, $cmp);

**Nett, oder?** Das war eine schwere Geburt, und ich bin mir nicht sicher ob ich das Ergebnis perfekt finde. Wirklich schön sieht es im Code nicht aus. Vielleicht hat jemand eine bessere Idee?