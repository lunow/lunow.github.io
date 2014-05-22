---

layout: post
title: "Mein jQuery Plugin: movingLabels"
abstract: 'Ich mag Projekte bei denen**jQuery Plugins** rausspringen. Aktuell haben wir ein super Projekt welches in **Cake** realisiert wird und natürlich jQuery im Frontend benutzt. Wäre nicht unendliche Arbeit damit verbunden, würde noch viel mehr für den Blog rum kommen.
Eins gibt es heute: **movingLabels**! Der Name sagt alles, mit diesem Plugin kann man nach belieben seine Labeltags rumwirbeln lassen, sobald das zugehörige Formularfeld den Focus erhält. Am besten direkt die [Demo](http://www.interaktionsdesigner.de/stuff/movinglabels/ "movingLabels Demo") ansehen, [downloaden](http://downloads.apeunit.com/jquery.movinglabels.js) und den erklärenden Artikel lesen.'
categories: jQuery
redirect_from: "2010/09/17/mein-jquery-plugin-movinglabels/"

---

## Vorweg
Ich weiß es gibt schon genau dieses Plugin Namens [slidingLabels](http://www.csskarma.com/blog/sliding-labels-plugin/), aber das ist mir in der Anwedung und in den Möglichkeiten nicht ausgereift genug. Wir brauchen doch in jedem Projekt etwas neues! Jedenfalls fürs Auge. Deshalb hier meine eigene Umsetzung.

## HTML und CSS
Vor dem Einsatz des Plugins muss man sein Formular entsprechend vorbereiten. Das vom **Cake HtmlHelper** generierte HTML passt schon perfekt und sieht in etwa so aus:

    <div>
        <label>Name</label>
        <input type="text" name="name" />
    </div>

Vor dem Einsatz muss das Label schon über dem Inputfeld liegen. Deshalb ist der umschließende DIV Container notwendig. Am schnellsten geht es mit folgendem CSS:

    form div {
        position:relative;
        margin:5px 0;
    }
    form div label {
        position:absolute;
        top:3px;
        left:8px;
    }

Damit ist die **Grundlage** fertig.

## JavaScript
Das Plugin [herunterladen](http://downloads.apeunit.com/jquery.movinglabels.js), jQuery einbinden und das **Plugin movingLabels**. Das Plugin sucht in dem übergebenen Element standardmäßig nach DIV Containern und in diesen nach **Label-** und **Inputtags** vom Typ Text und Passwort. So sieht der Aufruf aus:

    jQuery(function($) {
        $('form').movingLabels();
    });

**Das wars!** Beim Fokus von einem Formularfeld wird das Label sanft ausgeblendet.

## Anpassungen
Natürlich kann man alle Einstellungen und Animationen ändern. Als Parameter übergibt man dafür ein Objekt mit angepassten Eigenschaften.

    jQuery(function($) {
        $('form').movingLabels({custom: 'settings'});
    });

Folgende Optionen sind implementiert:

    label: 'label'

ein HTML Selector der das Element spezifiziert, welches sich bewegt
 

    input: ':text, :password'

das Eingabefeld für welches die Labels bewegt werden sollen. Ebenfalls ein HTML Selector
 

    div: 'div'

das umfassende Element. Rate mal? Richtig, ein HTML Selector
 

    animation.hide: {opacity: 0, marginLeft: 20}

das Animationsobjekt welches ausgeführt wird, wenn der Focus gesetzt wurde
 

    animation.show: {opacity: 1, marginLeft: 0}

verliert das Feld den Focus, wird das Label in diesen Zustand versetzt
 

    animation.start: {marginLeft: '-20px'}

nachdem die Animation zum verstecken gelaufen ist, wird dieses CSS Objekt zugewiesen. **Achtung:** wenn man das nicht braucht muss es als leeres Objekt übergeben werden, sonst gibts Ärger von jQuery.
 

    animation.speed: 150

die Geschwindigkeit mit der das ganze ablaufen soll. Entweder in Millisekunden oder in Worten ('slow', 'fast')

## Fertig!
Ich muss sagen, ich bin bisher recht Stolz auf dieses kleine Plugin. Jetzt kann man sich eine [Demo](http://www.interaktionsdesigner.de/stuff/movinglabels/ "movingLabels Demo") ansehen oder es [herunterladen](http://downloads.apeunit.com/jquery.movinglabels.js). Kommentare sind geöffnet und ich bin gespannt.
Wer komplizierte oder ausgefallene Projekte umsetzt und Hilfe sucht, kann sich gerne an die coolste Agentur der Welt wenden: [Ape Unit](http://www.apeunit.com/webentwicklung "Ape Unit GmbH Berlin")!!