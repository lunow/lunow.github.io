---

layout: post
title: "Besser PHP Programmieren mit Filtern"
abstract: '![](http://blog.paul-lunow.de/wp-content/uploads/2008/09/php.png)Heute gibts im lesenswerten Blog [Nettuts](http://nettuts.com/) den Artikel [10 Principles of the PHP Masters](http://nettuts.com/articles/10-principles-of-the-php-masters/). Gespickt ist er mit interessanten Links und wertvollen Erkentnissen der PHP Gurus. Nett zu lesen definitiv. Für mich neu und wirklich nützlich sind die [Filterfunktionen](http://www.php.net/manual/de/book.filter.php) von PHP.Wie praktisch ist das denn? Im Folgenden ein Schnelleinstieg.'
categories: PHP
redirect_from: "2008/09/09/besser-php-programmieren-mit-filtern/"

---

## Prüfen ob Filter verfügbar sind
Die Funktionen um die es geht sind erst mit PHP 5 dazu gekommen. Deshalb ist vor dem Gebrauch zu überprüfen ob sie überhaupt zur Verfügung stehen:

    if (!function_exists('filter_list')) {
      die('Sorry, dieses PHP ist zu alt.');
    }

(Falls nicht, lassen wir die Filter einfach weg - haha)

## Ach ja, und welche sind da?
Okay, wir sind nicht gestorben. Mit ein paar einfachen Zeilen können wir ausgeben welche Filter im System vorhanden sind:

    $filters = filter_list();
    foreach ($filters as $filter) {
      echo "- ".$filter."<br>";
    }

Mit leuchtenden Augen entdecken wir dann Perlen wie **int**, **email** und **url**. Klingt schon mal gut.

## Filter einsetzen
PHP bietet eine einfache Funktion um eine Variable zu überprüfen. Sie nennt sich [filter\_var](http://www.php.net/manual/de/function.filter-var.php)($daten, FLAG). Die Variable ($daten) beinhaltet die zu überprüfenden Daten. Mit FLAG wird eine Konstante übergeben um anzusagen was geprüft wird. Hier ein einfaches Beispiel um die Eingabe auf ganze Zahlen zu überprüfen:

    if(filter_var($_GET["input"], FILTER_VALIDATE_INT)) {
      echo "Es ist eine Zahl!";
    }

Der letzte, mit Unterstrich getrennte Teil gibt den Filternamen an (siehe Liste oben). Mit FILTER\_VALIDATE weisen wir die Funktion an die Variable zu überprüfen. Aber damit noch nicht genug!

## Daten mit Hilfe von Filtern verändern
Es ist möglich die übergebenen Daten auch **zu verändern**. Dafür nehmen wir statt VALIDATE einfach SANITIZE. Ein Beispiel:

    echo filter_var($_GET["input"], FILTER_SANITIZE_STRING);

Mit dieser Super-Funktion wird bei dem Aufruf

    index.php?input=<script>alert("Böse!");</script>

nichts weiter als **alert("Böse!");** ausgegeben. Schön, nicht wahr?

## Mehr Informationen
Das wars - sehr knapp zusammen gefasst um den ganzen Kram nicht zu vergessen. Ausführliche Informationen, und einen angekündigten zweiten Teil gibt es bei [Devolio](http://nettuts.com/articles/10-principles-of-the-php-masters/) oder direkt im [PHP Manual](http://www.php.net/manual/de/book.filter.php).