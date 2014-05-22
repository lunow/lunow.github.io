---

layout: post
title: "Menü Tutorial für jQuery"
abstract: 'Nachdem die USA einen neuen Präsidenten hat und dessen Team sofort die Seite des [Weißen Haus](http://www.whitehouse.gov/ "Das Weiße Haus nutzt auch jQuery") aktualisiert hat (gefunden im [Designtagebuch](http://www.designtagebuch.de/whitehouse-gov-relaunch/)) und [jQuery Version 1.3.1](http://blog.jquery.com/2009/01/21/jquery-131-released/ "Neue jQuery Version!") erschienen ist, wäre es an der Zeit, den Interaktionsdesigner mit ein paar jQuery Tutorials aufzufrischen.
Das Erste dreht sich um Menüs, bzw. Navigationen. Das JavaScript ist unaufdringlich und ermöglicht dem Nutzer durch ein paar einfache Tricks ein besseres Erlebnis. Benutzer ohne aktiviertes JavaScript werden nicht ausgeschlossen. Es geht um die Funktionen **hover** und **click** und ein bisschen **CSS3**. Fragen sind gern gesehen in den Kommentaren und jQuery auf jeder Seite!'
categories: jQuery, Tutorial
redirect_from: "2009/01/24/menu-tutorial-fur-jquery/"

---

## Ziele festlegen
Bevor man mit einem IT-Projekt beginnt, ist es immer sinnvoll sich darüber klar zu werden, was erreicht werden soll. Und wenn mit Kunden gearbeitet wird, dann sollte man das schriftlich festhalten und solange darüber reden bis allen Parteien klar ist, was an welcher Stelle gemeint ist. Schwierig, aber man **muss es versuchen**!
In diesem Tutorial soll die Navigation verbessert werden, _unaufdringlich_ und für _jedes_ Projekt einsetzbar. Nebenbei lernt man die **Grundfunktionen von jQuery** kennen.

## HTML Grundgerüst
Den Anfang bildet natürlich ein Menü. Für diverse Image Replacement Techniken, sonstigem CSS Schnickschnack bis hin zur IE Kompatibilität, nehme ich mal folgendes, universelles Grundgerüst, welches aus jedem CMS herauszukriegen sein sollte, sei es **TYPO3**, **Typolight** oder **Drupal**.

    <ul class="menu">
        <li>
            <a href="#punkt1" class="active"><span>Punkt 1</span></a>
        </li>
        <li>
            <a href="#punkt2"><span>Punkt 2</span></a>
        </li>
        <li>
            <a href="#punkt3">Punkt 3</a>
        </li>
        <li>
            <a href="#punkt4">Punkt 4</a>
            <span>Ein Hinweistext!</span>
        </li>
    </ul>

Wer genau hinsieht, entdeckt einige fundamentale Unterschiede, die jQuery zu Höchstform auflaufen lassen.
Diese Menü soll funktionieren, ohne dass JavaScript benötigt wird, bevor man anfängt. Das gleiche HTML als **TYPO3 Template** könnte so aussehen: 
    
    <ul class="menu">
        ###MAINMENU###
    </ul>
    <div id="content">
        ###CONTENT###
    </div>

## Das jQuery Grundgerüst
Nach dem Einbinden des Frameworks (zu Testzwecken oder wenn keine aktuelle Version zur Hand ist, auch gerne vom allmächtigen Googleserver: [http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js](http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js "jQuery vom Googleserver")) braucht man ein Plätzchen für das eigene Script. Entweder im Kopf des HTML Dokuments oder in einer externen Datei.
Gestartet wird immer mit einem simplen **Hallo Welt**. 
    
    jQuery(function($) {
        alert("Hallo Welt!");
    });

Die Funktion _jQuery()_ wird aufgerufen, sobald das DOM geladen ist. Als Parameter bekommt sie eine anonyme Funktion, die ausgeführt wird. Dieser wird automatisch als einziger Parameter das jQueryframework übergeben. Mit dem Dollar-Zeichen kann dann wie gewohnt gearbeitet werden. Das Tolle an dieser Syntax - im Gegensatz zu _$(document).ready(function() {});_ -  ist die problemlose Zusammenarbeit mit anderen Frameworks.
Wird man beim Neuladen der Seite nicht von einer fröhlichen Alertbox begrüßt, muss man prüfen, ob alle JavaScripte geladen sind. Das geht am schnellsten mit Firebug und aktiviertem Scriptmodul. Hier testet man nach und nach ob alle Scripte vorhanden sind.

## Mehr Klassen
Mit **:hover**, **:active**, **:focus** und **:link** gibt es schon ein paar Möglichkeiten für Links, aber wenn es um die ganzen Listenelemente geht, hört es (z.B. im IE6) schon wieder auf. Aber nicht mit jQuery! Die Funktion **hover** gibt uns genau das was wir brauchen.
    
    $(".menu li").hover(function() {
        $(this).addClass("hover");
    }, function() {
        $(this).removeClass("hover");
    });

Die Funktion erwartet zwei weitere Funktionen als Parameter. Die erste wird ausgeführt wenn die Maus das Element berührt, die zweite wenn der Zeiger es wieder verlässt.
Im Schlüsselwort **this** ist das Element gespeichert, welches die Funktion gerade ausgelöst hat. Mit der Übergabe an jQuery **$(this)** stehen dann wieder alle gewohnten Funktionen zur Verfügung.

## CSS3 Selektoren für jeden Browser
Der Hinweistext im span soll nur bei Mouseover gezeigt werden. Das lässt sich schnell und einfach per CSS lösen. 
    
    li>span {
        display:none;
    }
    li:hover>span {
        display:inline;
    }

Dem geübten Internet Explorer 6 "Optimierer" stehen jetzt schon die Haare zu Berge, die Webstandardsverfechter freuen sich und der Designer sagt: "das sollte aber sanft eingeblendet werden".
Und die Kunden surfen alle mit dem uralten, schlechten Browser aus dem Firmennetzwerk und können noch nicht mal was dafür.
Das erste Problem ist das **\>** Zeichen. Die Anweisung trifft auf alle Spanelemente zu, die sich direkt in einem Listenelement befinden. Würde man es weglassen, würde es auf alle Spanelemente zutreffen, die sich in einem Listenelement befinden. Dies hätte zur Folge, dass Punkt 1 und 2 ebenfalls verschwinden würden.
Die Lösung ist super einfach! jQuery unterstützt die meisten Eigenschaften von CSS3 und kümmert sich alleine darum, dass sie in jedem Browser funktionieren.
    
    $("li>span").hide();

Zuverlässig versteckt.
Um den Hinweistext wieder sichtbar zu machen, wird die hover Funktion erweitert. Die meisten Funktionen haben als Rückgabewert wieder ein jQuery-Objekt. Das bedeutet man kann sie einfach verknüpfen. Bei Mouseover sieht das z.B. so aus: 
    
    $(this).addClass("hover").find(">span").show();

**$(this)** bezieht sich auf das aktuelle Element.
**addClass("hover")** fügt eine Klasse hinzu.
**find("\>span")** sucht in dem aktuellen Element nach einem Span. Mit dem \> Zeichen wird deutlich gemacht das es sich direkt im Listenelement befinden muss, also nicht das Span im A-Element (das wäre _li\>a\>span_).
**show()** zeigt das Element an. Um ein bisschen anzugeben, oder den Designer zu erfreuen, könnte man auch _fadeIn()_ benutzen.
Die Funktion bei Mouseout sieht, bis auf die letzte Funktion, genau so aus.

## Der aktive Menüpunkt
Wenn das verwendete CMS dem Link die Klase _active_ zuweist wenn sie angezeigt wird, dann ist es ein schöner Effekt, diese Klasse schon vor dem Neuladen  der Seite zuzuweisen: 
    
    $(".menu a").click(function() {
        $(this).addClass("active");
    });

Jetzt gibt es zwei aktive Menüpunkt, außerdem hat der angeklickte Menüpunk eine hässliche Umrandung.
    
    $(".menu a").click(function() {
        $(".menu a.active").removeClass("active");
        $(this).addClass("active").blur();
    });

Die erste Zeile (innerhalb der Click-Function) entfernt die Klasse vom aktuellen Menüpunkt. Anschließend wird dem anklickten Punkt die Klasse zugewiesen und mit der Funktion blur() der Rahmen entfernt.

## Fazit
Das war ein kleiner Ausblick in das jQuery Universum. Eigentlich wollte ich noch viel mehr schreiben, aber das ging schon länger als geplant. Deshalb mache ich lieber Schluss, freue mich auf Fragen und empfehle jedem Webentwickler sich mit jQuery auseinander zu setzen. Es macht Spaß und hier kommt bald die nächste Anleitung!