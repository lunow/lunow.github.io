---

layout: post
title: "Ultimative TYPO3 Sitemap ohne Extension aber mit jQuery!"
abstract: 'Mit TYPO3 kann man auf **einfache Art eine Sitemap** für das Projekt erstellen. Dazu fügt man ein neues Contentelement auf eine beliebige Seite ein und wählt den entsprechenden Ausgangspunkt. Fertig ist die verschachtelte und wenig ansehnliche Liste.
Jetzt gibt es eine ganze Reihe Extensions die hier ansetzen um ein bisschen Interaktivität reinzubringen. Aber warum so kompliziert? Wenn jQuery eingebunden ist, benötigt man nichts weiter als ein zusätzliches HTML Element, ein paar JavaScriptzeilen und etwas CSS.
Hier kommt ein **Tutorial** für eine **interaktive**, **mehrsprachige Sitemap**, die auch ohne JavaScript benutzbar bleibt und CSS Sprites benutzt. Getestet unter Firefox, Safari, Internet Explorer 6 und 7\. Anwendbar auf jede verschachtelte Liste, [mit einer dynamischen Demo](http://interaktionsdesigner.de/stuff/sitemap.php "Sitemap Demo").'
categories: jQuery, TYPO3
redirect_from: "2009/02/03/ultimative-typo3-sitemap-ohne-extension-aber-mit-jquery/"

---

## Die Grundlage
Eine Sitemap auf einer Seite hinzufügen ist natürlich grundlegende Vorraussetzung. In der Standardeinstellung erzeugt TYPO3 eine verschachtelte Liste, z.B. so: 
    
    <div class="csc-sitemap">
        <ul>
            <li>
                <a href="index.php?id=8">Oberseite</a>
                <ul>
                    <li>
                        <a href="index.php?id=15">Ein Unterpunkt</a>
                        <ul>
                            <li><a href="index.php?id=342">Ein Unterunterpunkt</a></li>
                            <li><a href="index.php?id=598">Noch ein Unterunterpunkt</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li><a href="index.php?id=345">Bla bla</a></li>
        </ul>
    
    </div>

In "Wirklichkeit" ist die Liste natürlich noch viel länger und ohne Zeilenumbrüche. Seis drum, der Firebug zeigt es alles ordentlich an.
Für die Interaktion muss man sich merken: Hat ein Punkt weitere Unterpunkt, befindet sich eine Liste **im** Listenelement. Die [Demo](http://interaktionsdesigner.de/stuff/sitemap.php "Sitemap Demo") erzeugt bei jedem Aufruf eine neue Liste.
Mehrsprachig ist die Liste schon von alleine. Um einen Knopf im oberen Teil anzubieten um alle Punkte auf- oder zuzuklappen muss ein Inhaltselement eingefügt werden mit folgendem Quelltext: 
    
    <a href='#' id='sitemap-toggleAll' class='open' style='display:none'>
        Alle
        <span class='open'>auf</span>
        <span class='close'>zu</span>
        klappen
    </a>

Auf der englischen Seite dann entsprechend übersetzt. Wichtig sind die Spanelemente mit der Klasse _open_ und _close_ die per jQuery im richtigen Moment ein- und ausgeblendet werden.
Apropos ausblenden: Der Inlinestyle **display:none;** ist auch sehr wichtig um _Besucher ohne JavaScript_ keinen nutzlosen Link anzubieten.

## Und jetzt endlich Aktion!
Ich empfehle eine neue JavaScript Datei anzulegen und auf der entsprechenden Seite einzubinden. In der gewohnten Funktion **jQuery(function($)** { /\* hier! \*/ }); gehts los mit Grundlagen: 
    
    var container = ".csc-sitemap";
    var toggleAll = "#sitemap-toggleAll";
    
    $(container+" ul li>ul").css({display:"none"});

Als erstes werden zwei Variablen definiert. _container_ beinhaltet den Selektor in der die Sitemap untergebracht ist. Normalerweise <div class="csc-sitemap"\>, aber man weiß ja nie.
Die Variable _toggleAll_ speichert den Selektor für den Link welcher alle Punkte ein- oder ausklappt.
Anschließend werden alle Listen, die sich in einem Listenelement befinden, ausgeblendet.
Das war der einfache, übersichtliche Teil. Jetzt geht es weiter mit den Symbolen zum Auf- und Zuklappen von einzelnen Seitenelementen. Dabei kann eine Seite _aufgeklappt_, _zugeklappt_ oder _keine weiteren Unterseiten_ haben. Dann soll beim Klick auf das Icon die entsprechende Seite geladen werden.
Es müssen also **alle Listenelemente** untersucht werden. Dafür wird mit der Funktion _each()_ nach und nach jedes Element behandelt. Nicht erschrecken, es ist einfacher als es aussieht.
    
    $(container+" ul li").each(function() {
        if($("ul", this).length > 0) {
            $(this).prepend("<a href='#' class='folder closed'>auf</a>").find(".folder").click(function() {
                if($(this).is(".closed")) {
                    //Submenü aufklappen
                    $(this).text("zu ").removeClass("closed").addClass("opend").parents("li").find(">ul").slideDown();
                }
                else {
                    //Submenü zuklappen
                    $(this).text("auf").removeClass("opend").addClass("closed").parent("li").find(">ul").slideUp();
                }
                return false;
            });
        }
        else {
            $(this).prepend("<a href='#' class='page'>seite</a>").find(".page").click(function() {
                window.location = $(this).next().attr("href");
            });
        }
    });

Nett oder? Aber was ist passiert?
**Schritt für Schritt:** Als erstes wird geprüft ob sich eine Liste im Listenelement befindet: _if($("ul", this).length \> 0)_.
Wenn das der Fall ist, wird an den Anfang vom Element ein neuer Link eingefügt: _$(this).prepend("<a href='\#' class='folder closed'\>auf</a\>")_.
Dann wird der neue Link ausgewählt _find(".folder")_ und eine Aktion definiert die bei Klick ausgeführt wird _click(function()_.
Das Schlüsselwort **this** bezieht sich jetzt nicht mehr auf das Listenelement sondern auf den angeklickten Link. Hier wird geprüft ob die Seite geschlossen ist, also die Klasse "closed" angegeben ist _if($(this).is(".closed"))_.
Der Linktext wird in "zu" geändert, damit gleich sichtbar ist, das etwas passiert ist (bevor der Text mit CSS ausgeblendet wird). _$(this).text("zu")_, dann wird die Klasse "_closed_" entfernt und statt dessen "_opend_" hinzugefügt _.removeClass("closed").addClass("opend")_.
Dann wirds spaßig: **this** bezieht sich ja noch auf den angklickten Link. Deshalb wird in das umfassende Element gewechselt und hier die direkt beinhaltete Liste gesucht und eingeblendet: _parents("li").find("\>ul").slideDown();_
Wow, und das alles in ein paar Zeilen! Für das zuklappen ist es genau das Gegenteil, sollte klar sein.
Anschließend wird noch mit _return:false_ das Standardverhalten des Browser aufgehoben.
Wenn das Listenelement keine weitere Liste enthält (**this** bezieht sich jetzt wieder auf das Listenelement), dann wird ein anderer Link hinzugefügt, ausgewählt und mit einem Eventhandler versehen: _$(this).prepend("<a href='\#' class='page'\>seite</a\>").find(".page").click(function()_. Die folgende Funktion ist einfach. Sie weißt der Adresszeile des Browser _window.location_ die Adresse des folgenden Links zu _$(this).next().attr("href")_.
Das war die Sitemap an sich. Fehlt noch der **ToggleAll** Button oberhalb der Liste.
    
    $(toggleAll).show().find("span.close").hide().end().click(function() {
        if($(this).is(".open")) {
            $(container+" ul li a.folder").removeClass("closed").addClass("opend")
            $(container+" ul li ul").show();
            $(this).removeClass("open").addClass("close").find("span.open").hide().end().find("span.close").show();
        }
        else {
            $(container+" ul li a.folder").removeClass("opend").addClass("closed");
            $(container+" ul li ul").hide();
            $(this).removeClass("close").addClass("open").find("span.close").hide().end().find("span.open").show();
        }
        return false;
    });

Nur noch dieser Block, dann ist es geschafft. _Nicht aufgeben_!
In der Variable **toggleAll** ist die **ID vom Link** gespeichert. Da es mit einem Inlinestyle ausgeblendet wurde, muss es als erstes wieder angezeigt werden _$(toggleAll).show()_.
Weil die Liste beim jungfräulichen laden geschlossen ist, muss der Text in dem Element angepasst werden_find("span.close").hide().end()_. Durch die Funktion _find()_ wurde der Elementstack verkleinert. Um wieder auf den ursprünglichen zu kommen (also das komplette Linkelement und nicht nur das _Span_ mit der Klasse _close_) wird die Funktion _end()_ aufgerufen.
Danach wird dem ganzen Link ein Eventhandler zugewiesen und eine Funktion dafür definiert _click(function()_.
_if($(this).is(".open"))_ kann man schon fast als Satz lesen und verstehen wenn man die ganzen Sonderzeichen weg lässt.
Die Liste ist also aufgeklappt, deshalb müssen sich die Links vor den Listen verändern (Ordnerbildchen aufklappen) _$(container+" ul li a.folder").removeClass("closed").addClass("opend");_
Und wenn sich das Bild schon geändert hat, dann müssen auch alle Listen angezeigt werden _$(container+" ul li ul").show();_
Als letztes wird der Link (toggleAll) an sich noch verändert _$(this)_.
Die Klasse **open** wird getauscht mit **close**, damit beim nächsten Klick etwas passiert _removeClass("open").addClass("close")_.
Dann wird das entsprechende Spanelement gesucht und aus bzw. eingeblendet damit die Beschreibung stimmt _find("span.open").hide().end().find("span.close").show()_.
**Fertig!** Der If-Zweig wird geschlossen und in der Else-Anweisung passiert das Gleiche, aber entgegen gesetzt.

## Verbesserungen
Jetzt sind ein paar Tage vergangen und es gibt natürlich einige Dinge die man verbessern könnte oder die der Vollständigkeit erwähnt werden sollten:

* Statt der Funktion _is(".open")_ könnte man auch _hasClass("open")_ benutzen. Letztere prüft nur auf eine bestimmte Klasse (deshalb auch kein Punkt vor dem Klassenname). Die Funktion _is()_ kann noch viel mehr, z.B. testen um was für ein Element es sich handel _is("div")_ oder auch _is(":visible")_.
* Würde man die Klassen nicht benötigen um die Elemente zu stylen, ist es eleganter mit der jQueryfunktion _data() _die Attribute zu speichern. _$("\#toggleAll").data("status", "open")_ bindet die Variable **status** an das Element. Mit _$("\#toggleAll").data("status")_ erhält man dann den Status zurück.
* Seit **jQuery 1.3** gibt es die Funktion _closest()_. Diese sucht das nächste Element vom ausgewählten gesehen. _$(this).parents("li").find("\>ul") _könnte dann so aussehen: _$(this).closest("ul")_.
Wer hat noch mehr Vorschläge?