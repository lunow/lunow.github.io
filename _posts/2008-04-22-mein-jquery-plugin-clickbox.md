---

layout: post
title: "Mein jQuery Plugin: Clickbox!"
abstract: 'In meinem [ersten Eintrag](http://www.interaktionsdesigner.de/2008/04/03/mehr-klickflache/) bin ich schon auf die Thematik der größeren Klickfläche in Elementen eingegangen.  
Das Ziel ist, grafisch hervorgehobene Boxen komplett anklickbar zu machen. Inspiriert vom [WebDesignerWall](http://www.webdesignerwall.com/tutorials/jquery-tutorials-for-designers/) habe ich die Funktion etwas erweitert und in ein praktisches PlugIn verpackt: Die **Clickbox!**'
categories: jQuery
redirect_from: "2008/04/22/mein-jquery-plugin-clickbox/"

---

## Funktionsweise

Nach der Einbindung von jQuery und dem Clickbox PlugIn werden die einzelnen Elemente wie gewohnt zugewiesen:

    $(document).ready(function() {
    	$("div.news").clickbox();
    });

Jetzt wird bei Mauskontakt der erste Link im Divcontainer gesucht und bei Klick an den Browser gesendet.  
**Außerdem** erhält das Element die Klasse "hover" bei mouseover. Die Klasse kann auch geändert werden:

    $(document).ready(function() {
    	$("div.news").clickbox({hoverClass: "mo"});
    });

Das Plugin bietet aber noch ein paar Extras:

## Erstens: Mehrere Links

In einem Div Container können mehrere Links vorhanden sein und trotzdem(!) soll der ganze Bereich klickbar sein. Bei mir zum Beispiel die einzelnen Kisten mit neuen Einträgen auf der Startseite. Wenn man den Artikel aber schon gelesen hat, dann sollte man auch direkt zu den Kommentaren gelangen können. Möglich wurde das mit dem Clicktarget, welches beim Aufruf der jQueryfunktion mitgeliefert wird.

    $(this).bind("click", function(event) {
    	tar = $(event.target);
    	[...]

In **tar** ist das angeklickte Element gespeichert. Dann prüfen wir ob es sich um einen Link handelt:

    $link = tar.is('a') ? $(tar).attr("href") : firstLink;

## Zweitens: Undefined

Es gab eine hässliche Weiterleitung nach "undefined" wenn kein Link im Container vorhanden war. Deshalb wird in der Variable **firstLink** erstmal ein Link vor dem weiterleiten gesucht und im Zweifelsfall nichts getan. Auch keine Mouseover Effekte!

## Drittens: Tabellenzeilen

Das PlugIn arbeitet super mit Tabellen zusammen und lässt einfache Gestalltungsmöglichkeiten zu:

    $(document).ready(function() {
    	$("table.downloads tr").clickbox();
    });

Damit wird jede Zeile zur Clickbox. Ein bisschen CSS zum verschönern, und fertig ist die Downloadliste!

    table.downloads tr td {
    	background:white;
    	color:black;	
    	cursor:pointer;
    }
    table.downloads tr.hover td {
    	background:yellow;
    }
    

## Demo & Downloads

Die Clickbox in ihrer ganzen Klickbarkeit findet sich auf der [Demoseite](http://www.interaktionsdesigner.de/demo/clickbox/).
  
  
Und natürlich zum [herunterladen](http://www.interaktionsdesigner.de/demo/clickbox/jquery.clickbox.js), als Direktverlinkung. 

Fragen und Anregungen sind herzlich Willkommen.