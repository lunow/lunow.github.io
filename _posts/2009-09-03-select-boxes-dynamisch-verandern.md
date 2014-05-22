---

layout: post
title: "Select Boxes dynamisch verändern"
abstract: 'Die praktische Auswahl von Daten über eine Selectbox ist immer wieder ein Thema. Vorallem bei den ganzen neuen **Beta-Ajax-Web-Applications** kommen sie einem immer wieder unter.
**Das Problem **mit den Dingern, ist die dynamische Veränderung. Ein einfaches _$("select").find("option:first").remove();_ funktioniert zwar zum entfernen, aber das hinzufügen von Options ist schon schwieriger (**-böser Blick zum Internet Explorer-**). Und wenn die Selectbox sich dann an einer weiteren orientieren soll, dann wirds haarig.
**Die Lösung** ist das Klonen und verstecken der "originalen" Box. Aus dem Klon kann man dann die überflüssigen Auswahlmöglichkeiten entfernen.
Und jetzt folgt der Artikel wie man das effizient anstellen könnte. Natürlich Hand in Hand mit **jQuery**.'
categories: jQuery
redirect_from: "2009/09/03/select-boxes-dynamisch-verandern/"

---

## Das Problem
Folgende Anforderung bestand im aktuellen Projekt: In der ersten Selectbox wird die Frequenz gewählt (monatlich, vierteljährlich usw.). Die zweite Box bietet eine Auswahl an Monaten zur Angabe der Dauer.

    <select name="frequency" class="frequency">
        <option value="1">monatlich</option>
        <option value="3">vierteljährlich</option>
        <option value="6">halbjährlich</option>
        <option value="12">jährlich</option>
    </select>

    <select name="months" class="months">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
    </select>

## Theoretisch
Sehr einfach zu erklären: Der Anwender wählt in der ersten Auswahl "_halbjährlich_" - darauf hin stehen in der Monatsauswahl nur noch "_0_" und "_6_" zur Verfügung. Welcher Monat angezeigt wird, kann ganz einfach mit der **Modulo-Operation** berechnet werden. [Darüber hatte ich mich auch schon im Blog ausgelassen.](http://www.interaktionsdesigner.de/2009/01/27/modulo-verstehen-und-benutzen/ "Pauls Blog über die Modulo Operation")
Der Klon wird mit der Klasse _active_ gekennzeichnet und muss vor der nächsten Veränderung entfernt werden.

## Praktisch
Jetzt wirds nett. jQuery ist natürlich im Projekt eingebunden. Sobald das Dokument geladen wurde, muss ein **Eventhandler** auf die Frequenzauswahl gelegt werden.

    jQuery(function($) {
        $("select.frequency").onChange(function() {
        //hier gehts weiter!!
        });
    });

Diese Form ist besser als das überall gesehene _$(document).ready(function() {})_, denn die _$_ Funktion muss nicht mehr zwangsläufig von jQuery besetzt sein, sondern wird dem eigenen Code als Parameter übergeben.
Als nächstes beschreibe ich alle Schritte zum Ändern der Selectbox _$("select.months")_ einzelnd. Anschließend gibts nochmal die komplette Funktion unkommentiert im Ganzen.

    new_frequency = $(this).val();
    $form = $(this).parents("form:first");

Die Auswahl wird in _new\_frequency_ zwischengespeichert und das umfassende Formular in der Variable **$form** abgelegt, um später schneller darauf zugreifen zu können.
Die Variable _$form_ beginnt mit einem Dollarzeichen. Damit kennzeichne ich Variablen, die ein jQuery-Objekt enthalten. So ist es leicher, diese im weiteren Verlauf zu erkennen. Dieses Vorgehensweise kann ich **wärmstens empfehlen**.

    if($("select.months.active", $form).length > 0) {
        $("select.months", $form).filter(".active").remove().end().show();
    }

Mit der Anweisung _$("select.months.active", $form).length_ werden alle Selectboxen mit der Klasse _active_ gesucht. Sind diese vorhanden, werden **beide Selectboxen** (die ggf. versteckte und der Klon) selektiert.
Mit der Funktion _filter(".active")_ wird davon die aktive Selectbox ausgewählt und entfernt. Das _end() _setzt die Auswahl von _filter()_ zurück und_show() _zeigt die übrig gebliebene Selectbox an.
**jQuery Power** in einer einzigen Zeile! Aber es wird noch besser...
Die Selectbox mit der Klasse _.months_ muss geklont werden, verändert, angezeigt und die ursprüngliche Box versteckt werden. Zum Glück braucht man dazu auch nicht mehr als **eine Zeile**.

    $("select.months", $form).clone().hide().insertBefore("select.months").end().addClass("active").find("option").filter(function(i) { return i%new_frequency == 0 ? false : true; }).remove();

Sieht komplizierter aus als es ist. Man kann es praktisch Stück für Stück lesen:

1. **$("select.months", $form)** sucht die Selectbox im aktuellen Formular mit der Klasse _months_.
2. **clone()** kopiert die aktuelle Auswahl und speichert sie _irgendwo_ zwischen. Die Auswahl besteht **nicht** aus dem Klon, sondern der ursprünglichen Auswahl.
3. **hide() -** deshalb kann die Auswahl, also die **erste** Selectbox, auch einfach versteckt werden. Das passiert nach dem klonen, damit der Klon nicht extra wieder eingeblendet werden muss.
4. **insertBefore("select.months")** fügt den Klon vor der Selectbox ein.
5. **end()** setzt die Auswahl zurück. Damit besteht die Auswahl aus dem Klon und nicht mehr aus der ursprünglichen Selectbox.
6. **addClass("active")**__fügt die Klasse hinzu damit der Klon später erkannt werden kann.
7. **find("option")** sucht alle Optiontags innerhalb der geklonten Selectbox.
8. **filter(function(i) { return i%new\_frequency == 0 ? false : true; })**
Ein großartiges Stück jQuery präsentiert hier die ganze Power der _filter()_ Funktion. Dieser kann man nicht nur einen **Tagnamen**, eine **ID** oder eine **Klasse** übergeben, sondern auch eine **anonyme Funktion**! Anhand dieser wird jedes enthaltene Element überprüft. Gibt die Funktion _true_ zurück, bleibt das Element in der Auswahl; ansonsten fliegt es raus.
Diese Funktion besteht nur aus einer simplen Berechnung und schmeißt alle Monate raus, welche zur gespeicherten Frequenz passen.
Schön, oder?
9. **remove()** entfernt dann die übrig gebliebenen Auswahlmöglichkeiten.
**Fertig!** Eine einzige Zeile klont und bearbeitet die Auswahlmöglichkeit. Und das sooft der Benutzer möchte. So sieht die Funktion im ganzen aus:

    $(".frequency").change(function() {
        new_frequency = $(this).val();
        $form = $(this).parents("form:first");
        
        if($("select.months.active", $form).length > 0) {
          $("select.months", $form).filter(".active").remove().end().show();
        }
        
        $("select.months", $form)
            .clone().hide().insertBefore(".plan:visible select.months").end().addClass("active")
            .find("option").filter(function(i) { return i%new_frequency == 0 ? false : true; }).remove();
    });

## Fazit
Ich mag jQuery. Kennst du eine besser Lösung? Mal abgesehen von Plugins die das ganze mit einem unüberschaubaren Overhead erledigen?
Ansonten viel Spaß mit _abhängigen_ Selectboxen.