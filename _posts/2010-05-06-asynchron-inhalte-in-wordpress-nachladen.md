---

layout: post
title: "Asynchron Inhalte in WordPress nachladen"
abstract: 'Neben der Gründung einer neuen Firma die sich um Webentwicklungsthemen und Medienproduktion kümmert ([Die Ape Unit GmbH Berlin](http://www.apeunit.com "Webentwicklung und Medienproduktion")) hatte ich eine Menge mit **WordPress** zu tun. Ein guter Grund hier mal wieder etwas Leben in den Blog zu bringen.
Es geht natürlich um den heißen Scheiß: **Ajax**. Mit aktiviertem JavaScript soll bei einem Klick auf einen Eintrag der **Eintrag dynamisch nachgeladen** werden anstatt auf die Einzelansicht zu verlinken. Mit **TYPO3** und Typoscript baut man sich dafür ein weiteres **Page Objekt** und passt die Ausgabe an, [darüber hatte ich schon berichtet](http://www.interaktionsdesigner.de/2008/12/12/typo3-seiten-dynamisch-nachladen-mit-jquery/ "Ajax und TYPO3"). Bei WordPress gibt es aber kein Typoscript.
Mein erster Gedanke war ein alternatives Template per URL Parameter zu laden in dem nur die Inhalte angezeigt werden. Die Anleitungen waren allerdings allesamt nicht besonders ergiebig. Der nächste Ansatz war den gesamten Inhalt abzufragen und per jQuery nur den entsprechenden Container mit den Inhalten auszugeben. Das finde ich aber irgendwie unelegant.
Und nach einmal drüber schlafen kam dann der rettende und **sehr simple Einfall**.'
categories: Tutorial, WordPress
redirect_from: "2010/05/06/asynchron-inhalte-in-wordpress-nachladen/"

---

## functions.php
Mit meinem [CakePHP](http://www.cakephp.org "Mein Lieblingsframework") verwöhntem Blick würde ich die functions.php mal mit einer Art **Controller** vergleichen. Der Aufruf geht also durch diese Datei, in der Variablen gesetzt und Funktionen definiert werden können, die anschließend in den Views zur Verfügung stehen.
Und hier steckt schon das ganze Geheimnis, ist die Servervariable **HTTP\_X\_REQUESTED\_WITH** gesetztz, handelt es sich um eine asynchrone Anfrage:

    if(isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        $ajax = true;
    }
    else {
        $ajax = false;
    }

## Die Views
In den üblichen Verdächtigen des Themes, damit meine ich die _single.php_, _page.php_, _index.php_ usw. steht jetzt die Variable **$ajax** zur Verfügung. Bisher fand ich die Arbeitsweise von WordPress nicht sehr elegant in jeder Datei Header, Sidebar und Footer einbinden zu müssen, aber jetzt finde ich sie gut. Denn wenn bei einem Ajaxaufruf **nur der Inhalt** zurück gegeben werden soll, dann lässt man das überflüssige HTML Gerüst einfach draußen:

    if(!$ajax) {
        get_header();
    }

## Fazit
**Das war einfach.** WordPress ist ein tolles System und ich kann es kaum erwarten endlich die neue Version 3.0 stable zu sehen. Wie das ganze drum herum mit jQuery funktioniert, steht im bereits oben erwähnten [Eintrag zu TYPO3](http://www.interaktionsdesigner.de/2008/12/12/typo3-seiten-dynamisch-nachladen-mit-jquery/). Frohes bloggen!