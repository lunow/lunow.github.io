---

layout: post
title: "CSS Dateien mit jQuery nachladen"
abstract: 'Diesmal kurz und knackig ein wirklich praktischer Tipp! Als verantwortungsvoller Webentwickler lege ich natürlich eine print.css an und versuche dem Kunden zu erklären, dass ein Ausdruck der Seite anders, aber super gut aussieht und das der aktuelle Webstandard ist und unbedingt eingesetzt werden sollte.
Aber die Antwort ist dann: "Das versteht doch kein Mensch. Können Sie nicht einfach einen Button einrichten um die Vorschau anzeigen zu lassen? Nach meinen Erfahrungen müsste das einfach zu machen sein."
Jaja... nicht aufregen. Lieber über die neue Aufgabe freuen und darüber bloggen: **Wie und warum man eine CSS Datei dynamisch nachladen kann**. Getestet in Firefox, Safari, IE6 und 7\.'
categories: jQuery
redirect_from: "2009/02/13/css-dateien-mit-jquery-nachladen/"

---

## Warum
Mit [TYPO3](http://www.interaktionsdesigner.de/category/typo3/ "Das schönste CMS der Welt in Pauls Blog") ist es ein leichtes per zustätzlichem Parameter nur die_print.css _anzeigen zu lassen. Fertig ist die Vorschau. Was aber wenn man **dynamisch nachgeladene Inhalte** ausdrucken möchte? Bzw. erstmal in der Druckansicht sehen? Dann wären eine ganze Menge mehr zusätzlicher Parameter notwendig.

## Nachladen!
Deshalb wird eine vorbereitete Datei einfach per _jQuery_ nachgeladen. Wer jetzt ein langes und kompliziertes Script erwartet wird leider enttäuscht.
    
    
    $("#getcss").click(function() {
        $.get("new-style.css", function(css) {
            $("head").append("<style>"+css+"</style>");
            $("#getcss").fadeOut();
        });
    });

Per **$.get** wird mit Ajax eine beliebige Datei geladen und der Inhalt der angehängten Funktion als Parameter übergeben.
Mit der Funktion **append()** wird dem angesprochenen Element (**$("head")**) zustätzliches HTML hinzugefügt. In diesem Fall schlicht und einfach ein _<style\> Tag_ welches die ausgelesen Inhalte beinhaltet.

## Fertig!
Mit **$("\#getcss").fadeOut()** wird der Button noch ausgeblendet damit die fleißigen Klicker nicht zweimal auf den Knopf  klicken. Ich liebe jQuery!
PS: JavaScript Dateien lädt man mit der Funktion **$.getScript("new-script.js")** nach.