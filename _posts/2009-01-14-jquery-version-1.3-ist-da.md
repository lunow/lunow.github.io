---

layout: post
title: "jQuery Version 1.3 ist da!!!"
abstract: 'Herrliche Neuigkeiten: eine neue jQuery Version ist erschienen!!! Man beachte den'
categories: jQuery
redirect_from: "2009/01/14/jquery-version-1.3-ist-da/"

---

Herrliche Neuigkeiten: **eine neue jQuery Version ist erschienen**!!! Man beachte den [Blogbeitrag](http://blog.jquery.com/2009/01/14/jquery-13-and-the-jquery-foundation/ "jQuery 1.3 Blogeintrag"), die [Release Notes](http://docs.jquery.com/Release:jQuery_1.3 "Release Notes jQuery 1.3") und dann freuen über die neue, noch **bessere Version**.
Die schönste Neuigkeit für mich ist die neue Funktion**live()**. Schon Ewigkeiten wollte ich über das [Plugin Livequery](http://brandonaaron.net/docs/livequery/ "PlugIn Livequery") schreiben, welches die gleichen Funktionalitäten anbietet. Aber das hat sich jetzt erledigt.
Mit der Funktion **live()** bindet man Events an Elemente, und zwar _an alle Elemente_. Das bedeutet auch an jene, welche per Ajax _nachgeladen_ werden.

    $("button").live("click", function() {
        alert("Button "+$(this).attr("name")+" gedrückt!");
    
    });

Mit diesem Code wird bei Klick auf einen Button eine Nachricht ausgegeben, auch wenn dieser dynamisch **nachgeladen wurde**. Wunderbar!
Und noch eine "neue" Erkenntnis will ich niemanden vorenthalten: Der viel genutzte Ausdruck

    $(document).ready(function() { /* alles geladen! los gehts */ });

ist gar nicht so gut! Ganz im Gegenteil, er ist sogar schlecht.
**Der Grund** ist die _Zusammenarbeit mit anderen JavaScript Frameworks_, die eventuell auch gebrauch der Dollar-Funktion machen.
**Die Lösung** ist zum Glück einfach:

    jQuery(function($) { /* alles geladen, ohne Konflikte!!! */ });

Der Funktion jQuery wird eine individuelle Funktion übergeben. Diese kriegt das komplette Framework als Parameter übergeben - und der wird dann dem Dollar-Zeichen zugewiesen.
Klingt komisch, ist aber so und verhindert lästige Fehlermeldung und Diskussionen mit Kollegen.