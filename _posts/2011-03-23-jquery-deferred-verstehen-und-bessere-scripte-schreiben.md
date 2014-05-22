---

layout: post
title: "jQuery Deferred verstehen und bessere Scripte schreiben"
abstract: '**jQuery 1.5** ist schon eine Weile draußen und hat ein neues tolles Konzept mitgebracht das ich unbedingt vorstellen möchte, denn damit schreibt man bessere Scripte, die übersichtlicher sind und zuverlässiger funktionieren. Es heißt: **Deferred** und ist eigentlich sehr leicht zu verstehen.
Mit **jQuery.Deferred** lassen sich Objekte erzeugen, die beim erreichen eins Zustandes bescheid geben, damit andere Objekte darauf reagieren können. Klingt verworren ist aber ganz einfach, zum Beispiel sollen die Bilder angezeigt werden wenn sie fertig geladen sind.'
categories: jQuery
redirect_from: "2011/03/23/jquery-deferred-verstehen-und-bessere-scripte-schreiben/"

---

## Ohne $.Deferred
Vor jQuery 1.5 musste man sich mit Callbacks oder \[pre\]window.setTimeout()\[/pre\] helfen um auf Ereignisse zu reagieren.

    $('#elem').fadeIn(function() {
        // do something when #elem is visible
    });

Bei einem Element ist das leicht, aber wenn es sich um **mehrere Elemente** handelt, oder man nicht genau sagen kann wann ein Element einen Status erreicht hat, dann wirds kritisch.

## Mit $.Deferred
Die großartigen Funktionen heißen \[pre\]$.when()\[/pre\] und \[pre\]$.then()\[/pre\]. In meinem letzten Projekt musste ich warten bis mehrere Bilder geladen wurden. So sieht der Aufruf aus:

    $.when(loadImg('#img1')).then(function() {
        //do stuff, the image is loaded
    });

Zugegeben, das kann auch leichter haben mit \[pre\]$('\#img1').load(function() { /\* action \*/ })\[/pre\], richtig schön wird es auch bei mehreren Bildern:

    $.when(
        loadImg('#img1'),
        loadImg('#img2'),
        loadImg('#img3'))
    .then(function() {
        //do stuff, all images are loaded
    });

Die Funktion \[pre\]$.then()\[/pre\] wird erst ausgeführt wenn alle Funktionen in \[pre\]$.when()\[/pre\] ihr okay gegeben haben. Genial oder?
Die Funktion \[pre\]loadImg()\[/pre\] muss natürlich entsprechend vorbereitet werden, damit sie okay sagen kann.

    function loadImg(selector) {
        var dfd = $.Deferred();
        $(selector).load(function() { dfd.resolve(); });
        return dfd.promise();
    }

In der Variable \[pre\]dfd\[/pre\] wird ein neues **Deferred Objekt** erzeugt. Die Rückgabe der Funktion muss von diesem Objekt die Funktion \[pre\]promise()\[/pre\] ausgeben.
Und wenn die Funktion ihr erklärtes Ziel erreicht hat, wird die Funktion \[pre\]resolve()\[/pre\] aufgerufen. Damit ist der Funktion \[pre\]$.when()\[/pre\] klar das sie ggf. weitermachen kann.

## Fazit
jQuery Magic vom feinsten! Das war ein sehr kleiner Einstieg in dieses großartige Konzept, **Deferred** kann noch einiges mehr und die [offizielle jQuery Dokumentation](http://api.jquery.com/category/deferred-object/ "Deferred in jQuery") verrät was.
Ich wünsche viel Spaß beim programmieren und coole neue Scripte.