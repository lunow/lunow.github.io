---

layout: post
title: "Die eine Zeile zum jQuery Tab"
abstract: '**jQuery** ist ein großartiges **Javascript Framework**. Mit einer einzigen Zeile kann man ein komplettes **Tab Widget** bauen.
In meinem aktuellen Projekt kann der Benutzer unter einer großen Auswahl Elementen wählen. Jedes Element gehört in eine Kategorie. Also wäre es doch nett oben eine Kategorie anzuklicken und anschließend nur die Einträge dieser Kategorie zu sehen.

Nichts leichter als das! Es gibt natürlich großartige und weniger gute Plugins zu dem Thema, aber es ist **in einer Zeile selbst geschrieben**. Macht Spaß und verdeutlicht die **Verkettung in jQuery**.'
categories: jQuery
redirect_from: "2011/01/17/die-eine-zeile-zum-jquery-tab/"

---

## Das HTML Gerüst
Damit fängt es immer an. So sieht es leicht gekürzt aus:


    <div class="categories">
        <ul>
            <li data-id="1">Kategorie 1</li>
            <li data-id="2">Kategorie 2</li>
        </ul>
    
        <div id="category_1" class="category">
            <!-- jede Menge Inhalt -->
        </div>
        <div id="category_2" class="category">
            <!-- noch  mehr Inhalt in Kategorie 2 -->
        </div>
    </div>



Es gibt also einen umfassenden Container, darin befindet sich eine unsortierte Liste als Menü und darunter die einzelnen Kategorien. Die Listenpunkte sind mit dem HTML5 Attribut \[pre\]data-id\[/pre\] ausgestattet um klar zu machen, welchen Punkt sie einblenden.

jQuery arbeitet auf grandiose Art und Weise damit zusammen, dazu gleich mehr.

## Eine Zeile jQuery
Hier kommt sie:


    $('.categories>ul li').live('click', function() { $(this).closest('.categories').find('.category').hide().filter('#category'+$(this).data('id')).show().end().end().end().siblings('li').removeClass('active').end().addClass('active');}).filter(':first').click();



Auch wenn ich große Töne gespuckt habe von wegen eine einzige Zeile, würde ich doch empfehlen ein paar Zeilenumbrüche einzubauen. In Javascript müssen die Zeilen nicht mit einem Simikolon beendet werden, deshalb kann man diese Zeile auch übersichtlicher notieren:


    $('.categories>ul li')
            .live('click', function() {
                $(this)
                    .closest('.categories')
                        .find('.category')
                            .hide()
                            .filter('#category_'+$(this).data('id'))
                                .show()
                            .end()
                        .end()
                    .end()
                    .siblings('li')
                        .removeClass('active')
                        .end()
                    .addClass('active');
            })
            .filter(':first')
            .click();



## Einzelerklärung
Jetzt gehts los! jQuery basiert immer auf einem **Elementstack**. Das bedeutet man wählt per CSS Selektor eine beliebige Anzahl Elemente aus und wendet darauf beliebig viele Befehle an. In diesem Beispiel werden alle Listenelemente ausgewählt die sich in einer Liste befindet, welche wiederum ein direktes Kindelement eines Elements mit der Klasse \[pre\].categories\[/pre\] ist.


    $('.categories>ul li')



Würde man das \[pre\]\>\[/pre\] Zeichen weglassen, würden sich die folgenden Anweisungen auf alle Listen im Element \[pre\].categories\[/pre\] beziehen, was natürlich nicht gewünscht ist.

Jedem Listenelement wird der Eventhandler \[pre\]click\[/pre\] zugewiesen:


    .live('click', function() {



Die großartige Funktion \[pre\]live(event, callback)\[/pre\] arbeitet im Gegensatz zu \[pre\]click(callback)\[/pre\] auch mit Elementen die nachträglich dem Dom hinzugefügt wurden.

Innerhalb eines Callbacks bezieht sich \[pre\]$(this)\[/pre\] auf das spezifische Element welches den Funktionsaufruf ausgelöst hat. Sprich: das angeklickte Listenelement. Das dient als Ausgangspunkt um das umfassende Element \[pre\].categories\[/pre\] in den Elementstack zu laden:


    $(this).closest('.categories')



Vom Ausgangspunkt \[pre\]$(this)\[/pre\] wird das nächstgelegene Element ausgewählt. Sollten sich mehrere Elemente mit der Klasse \[pre\].categories\[/pre\] auf der Seite befinden können wir so sicherstellen, dass das richtige Element behandelt wird.

Aus dem richtigen Element werden alle Elemente der Klasse \[pre\].category\[/pre\] gesucht und ausgeblendet:


    .find('.category').hide()



Mit \[pre\]find(selector)\[/pre\] wird innerhalb der Objekte im Elementstack gesucht. Im Gegensatz zu der Funktion \[pre\]filter(selector)\[/pre\] welche die Elemente im Stack durchgeht und nur jene zurück liefert auf die der Selector zutrifft.

Die großartige Methode \[pre\]data(key, value)\[/pre\] greift automatisch auf das \[pre\]data\[/pre\] Attribut aus dem HTML zu und stellt es zur Verfügung.

Mit diesem Wissen müsste der nächste Schritt klar sein:


    .filter('#category_'+$(this).data('id')).show()



Aus allen ausgewählten und versteckten \[pre\].category\[/pre\] Elementen wird das mit der ID des angeklickten Listenelements ausgewählt und angezeigt.

Mit \[pre\]end()\[/pre\] setzt man einen veränderten Elementstack wieder zurück. Wir haben jetzt drei mal \[pre\]end()\[/pre\], für \[pre\]filter()\[/pre\], \[pre\]find()\[/pre\] und \[pre\]closest()\[/pre\]. Also befinden wir uns wieder beim angeklickten Listenelement.


    .siblings('li')



Damit werden alle Nachbarn des Listenelements ausgewählt, also alle Einträge in der Liste. Egal welches, keines darf mehr die Klasse \[pre\]active\[/pre\] besitzen:


    .removeClass('active').end()



Im gleichen Zug wird auch die Veränderung durch \[pre\]siblings(selector)\[/pre\] zurück gesetzt. Fehlt nur noch das hinzufügen der Klasse zum angeklickten Element:


    .addClass('active');



Das war es innerhalb des Callbacks. Beim laden der Seite werden alle Kategorien angezeigt, das ist nicht Ziel des Tab Widgets, aber auch leicht zu lösen. Zur Erinnerung: Es wurden alle Listenelemente ausgewählt und jedem Element ein Clickhandler zugewiesen.


    $('.categories>ul li').live('click', function() { /* lange zeile */ })



Auch die \[pre\]live()\[/pre\] Funktion gibt den Elementstack zurück, deshalb brauchen wir nur noch zwei grandiose Funktionen anzuhängen:


    .filter(':first').click();



In jQuerysprache heißt das: Nimm das erste Element aus deinem Stack und klicke es an. Was dann passiert haben wir gerade ausführlich besprochen. Alle Kategorien werden ausgeblendet, die erste wieder ein und das erste Listenelement mit der Klasse \[pre\]active\[/pre\] gekennzeichnet.

**Fertig!** Das war ein Tab Widget in mehr oder weniger einer Zeile.